// Automatically builds a Mermaid "concept map" from an extracted CDP plan.
//
// The map mirrors the hand-drawn style used across the CDP: a central course
// node fans out into one branch per unit, every branch edge is labelled with
// the Course Outcomes (CO1, CO2 ...) taught in that unit, and each branch lists
// the key topics as leaf nodes. When no unit information exists it falls back to
// a Course Outcome based map so something meaningful is always generated.

const MAX_TOPICS_PER_UNIT = 8;

function escapeLabel(value) {
  return String(value ?? "")
    .replace(/["\n\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Shortens a long lecture topic down to a concept-sized label.
function shortenTopic(topic) {
  const clean = escapeLabel(topic);
  if (!clean) return "";
  // Split only on genuine separators (a colon, a spaced dash, or a bracket) so
  // mid-word hyphens like "Pre-processor" stay intact.
  const head = clean.split(/:|\s[-–—]\s|\s*\(/)[0].trim() || clean;
  return head.length > 42 ? `${head.slice(0, 39).trim()}...` : head;
}

function coNumber(co) {
  const match = String(co).match(/(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function sortCos(cos) {
  return Array.from(cos).sort((a, b) => coNumber(a) - coNumber(b));
}

const STYLE_BLOCK = `  classDef center fill:#b7e1a1,stroke:#3b82f6,stroke-width:4px,color:#000,font-weight:bold;
  classDef main fill:#c8dc8d,stroke:#a3b565,stroke-width:2px,color:#000,font-weight:bold;
  classDef oval fill:#bdefff,stroke:#7fd4f0,stroke-width:2px,color:#000;`;

// Groups the lecture plan by unit, collecting unique topics and the set of COs
// taught within each unit.
function groupByUnit(lecturePlan) {
  const units = new Map();

  lecturePlan.forEach((lecture) => {
    const rawUnit = lecture?.unit;
    const key =
      rawUnit === null || rawUnit === undefined || rawUnit === ""
        ? "General"
        : `Unit ${rawUnit}`;

    if (!units.has(key)) {
      units.set(key, { topics: [], cos: new Set() });
    }

    const entry = units.get(key);
    const topic = shortenTopic(lecture?.topic);
    if (topic && !entry.topics.includes(topic)) {
      entry.topics.push(topic);
    }
    (lecture?.coMapping ?? []).forEach((co) => {
      const label = escapeLabel(co);
      if (label) entry.cos.add(label);
    });
  });

  return units;
}

function buildFromUnits(centerLabel, units) {
  const lines = ["flowchart TB", `  CENTER["${centerLabel}"]`, ""];
  const mainIds = [];
  const ovalIds = [];

  let unitIndex = 0;
  units.forEach((entry, unitLabel) => {
    unitIndex += 1;
    const unitId = `U${unitIndex}`;
    mainIds.push(unitId);

    lines.push(`  ${unitId}["${unitLabel}"]`);

    const coLabel = sortCos(entry.cos).join(", ");
    const edge = coLabel ? `CENTER -->|${coLabel}| ${unitId}` : `CENTER --> ${unitId}`;
    lines.push(`  ${edge}`);

    const visibleTopics = entry.topics.slice(0, MAX_TOPICS_PER_UNIT);
    visibleTopics.forEach((topic, topicIndex) => {
      const topicId = `${unitId}T${topicIndex + 1}`;
      ovalIds.push(topicId);
      lines.push(`  ${topicId}(["${topic}"])`);
      lines.push(`  ${unitId} --- ${topicId}`);
    });

    const hidden = entry.topics.length - visibleTopics.length;
    if (hidden > 0) {
      const moreId = `${unitId}More`;
      ovalIds.push(moreId);
      lines.push(`  ${moreId}(["+${hidden} more topics"])`);
      lines.push(`  ${unitId} --- ${moreId}`);
    }

    lines.push("");
  });

  lines.push(STYLE_BLOCK);
  lines.push("  class CENTER center;");
  if (mainIds.length) lines.push(`  class ${mainIds.join(",")} main;`);
  if (ovalIds.length) lines.push(`  class ${ovalIds.join(",")} oval;`);

  return lines.join("\n");
}

// Fallback map used when there is no lecture plan to group by unit: branch on the
// Course Outcomes directly.
function buildFromCourseOutcomes(centerLabel, courseOutcomes) {
  const lines = ["flowchart TB", `  CENTER["${centerLabel}"]`, ""];
  const mainIds = [];

  courseOutcomes.forEach((co, index) => {
    const coId = `CO${index + 1}`;
    mainIds.push(coId);
    const label = escapeLabel(co?.id) || `CO${index + 1}`;
    const desc = shortenTopic(co?.description);
    const nodeLabel = desc ? `${label}: ${desc}` : label;
    lines.push(`  ${coId}["${nodeLabel}"]`);
    lines.push(`  CENTER -->|${label}| ${coId}`);
  });

  lines.push("");
  lines.push(STYLE_BLOCK);
  lines.push("  class CENTER center;");
  if (mainIds.length) lines.push(`  class ${mainIds.join(",")} main;`);

  return lines.join("\n");
}

export function buildConceptMap(plan) {
  if (!plan) return "";

  const centerLabel = escapeLabel(plan?.courseMetadata?.name) || "Course";
  const lecturePlan = Array.isArray(plan?.lecturePlan) ? plan.lecturePlan : [];
  const units = groupByUnit(lecturePlan);

  if (units.size > 0) {
    return buildFromUnits(centerLabel, units);
  }

  const courseOutcomes = Array.isArray(plan?.courseOutcomes)
    ? plan.courseOutcomes
    : [];
  if (courseOutcomes.length > 0) {
    return buildFromCourseOutcomes(centerLabel, courseOutcomes);
  }

  return `flowchart TB\n  CENTER["${centerLabel}"]\n${STYLE_BLOCK}\n  class CENTER center;`;
}
