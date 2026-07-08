import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  Download,
  FileText,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useCdpPlan } from "../hooks/useCdpPlan";

const COURSE_ID = "23CSE201";

// 1. Permanent Institutional POs Constant
const FIXED_PROGRAM_OUTCOMES = [
{ "id": "PO1", "description": "Engineering knowledge: Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems." },
    { "id": "PO2", "description": "Problem analysis: Identify, formulate, research literature, and analyze complex engineering problems reaching substantiated conclusions using the first principles of mathematics, natural sciences, and engineering sciences." },
    { "id": "PO3", "description": "Design/development of solutions: Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for public health and safety, and cultural, societal, and environmental considerations." },
    { "id": "PO4", "description": "Conduct investigations of complex problems: Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions." },
    { "id": "PO5", "description": "Modern tool usage: Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations." },
    { "id": "PO6", "description": "The engineer and society: Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice." },
    { "id": "PO7", "description": "Environment and sustainability: Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development." },
    { "id": "PO8", "description": "Ethics: Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice." },
    { "id": "PO9", "description": "Individual and teamwork: Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings." },
    { "id": "PO10", "description": "Communication: Communicate effectively on complex engineering activities with the engineering community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions." },
    { "id": "PO11", "description": "Project management and finance: Demonstrate knowledge and understanding of the engineering and management principles and apply these to one's own work, as a member and leader in a team, to manage projects and in multidisciplinary environments." },
    { "id": "PO12", "description": "Life-long learning: Recognize the need for and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change." },
    { "id": "PSO1", "description": "Ability to design and engineer, innovative, optimal and elegant computing solutions to interdisciplinary problems using standard practices, tools and technologies." },
    { "id": "PSO2", "description": "Ability to learn emerging computing paradigms for research and innovation." }
];

const EMPTY_LECTURE = {
  unit: "",
  classPeriod: "",
  topic: "",
  modeOfTeaching: "",
  inClassActivity: "",
  outClassActivity: "",
  coMapping: [],
  reference: [],
};

function TextInput({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
        {label}
      </span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-slate-800 dark:text-gray-200 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm leading-6 text-slate-800 dark:text-gray-200 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-800"
      />
    </label>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="border-t border-slate-200 dark:border-gray-700 py-7 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
          <Icon size={16} />
        </span>
        <h2 className="text-base font-bold text-slate-900 dark:text-gray-100">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function updateArrayItem(list, index, patch) {
  return list.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item
  );
}

function getMappingKeys(plan) {
  // Use the fixed array for the outcome keys
  const outcomeKeys = FIXED_PROGRAM_OUTCOMES.map((outcome) =>
    outcome.id.toLowerCase()
  );
  const rowKeys = (plan?.coPoMappings ?? []).flatMap((row) =>
    Object.keys(row).filter((key) => key !== "co")
  );

  return Array.from(new Set([...outcomeKeys, ...rowKeys])).sort((a, b) => {
    const parse = (key) => {
      const match = key.match(/^([a-z]+)(\d+)$/i);
      return match ? [match[1], Number(match[2])] : [key, 0];
    };
    const [aPrefix, aNumber] = parse(a);
    const [bPrefix, bNumber] = parse(b);
    if (aPrefix !== bPrefix) return aPrefix.localeCompare(bPrefix);
    return aNumber - bNumber;
  });
}

function html(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function joinList(value) {
  return Array.isArray(value) ? value.join(", ") : value ?? "";
}

function printCdp(plan) {
  const htmlStr = buildPrintableCdp(plan);
  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;
  win.document.write(htmlStr);
  win.document.close();
  win.focus();
}

function buildPrintableCdp(plan) {
  const metadata = plan.courseMetadata ?? {};
  const credits = metadata.credits ?? {};
  const mappingKeys = getMappingKeys(plan);
  const evaluation = plan.evaluationAndGrading ?? {};

  return `
    <!doctype html>
    <html>
      <head>
        <title>${metadata.code ?? "Course"} CDP</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; margin: 28px; }
          h1 { font-size: 22px; margin: 0 0 4px; }
          h2 { font-size: 15px; margin: 24px 0 8px; }
          p { margin: 4px 0; line-height: 1.5; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px; font-size: 11px; vertical-align: top; }
          th { background: #eef2ff; }
          pre { white-space: pre-wrap; border: 1px solid #cbd5e1; padding: 10px; font-size: 11px; }
          .muted { color: #64748b; }
          .center { text-align: center; }
        </style>
      </head>
      <body>
        <h1>Course Delivery Plan</h1>
        <p><strong>${html(metadata.code)}</strong> - ${html(metadata.name)}</p>
        <p class="muted">Academic Year: ${html(metadata.academicYear || "Not set")} | Mentor: ${html(metadata.courseMentor || "Not set")}</p>
        <p>Credits: L-${html(credits.L)}, T-${html(credits.T)}, P-${html(credits.P)}, C-${html(credits.C)}</p>
        <p>Pre-requisites: ${html(metadata.preRequisites)}</p>

        <h2>Program Outcomes / PSOs</h2>
        <table>
          <tbody>
            ${FIXED_PROGRAM_OUTCOMES
              .map(
                (outcome) =>
                  `<tr><th>${html(outcome.id)}</th><td>${html(outcome.description)}</td></tr>`
              )
              .join("")}
          </tbody>
        </table>

        <h2>Course Outcomes</h2>
        <table>
          <tbody>
            ${(plan.courseOutcomes ?? [])
              .map((co) => `<tr><th>${html(co.id)}</th><td>${html(co.description)}</td></tr>`)
              .join("")}
          </tbody>
        </table>

        <h2>CO-PO/PSO Mapping</h2>
        <table>
          <thead><tr><th>CO</th>${mappingKeys
            .map((key) => `<th>${html(key.toUpperCase())}</th>`)
            .join("")}</tr></thead>
          <tbody>
            ${(plan.coPoMappings ?? [])
              .map(
                (row) =>
                  `<tr><th>${html(row.co)}</th>${mappingKeys
                    .map((key) => `<td class="center">${html(row[key] ?? "-")}</td>`)
                    .join("")}</tr>`
              )
              .join("")}
          </tbody>
        </table>

        <h2>Lecture Plan</h2>
        <table>
          <thead>
            <tr><th>Unit</th><th>Class Period</th><th>Topic</th><th>Mode of Teaching</th><th>In-class Activity</th><th>Out-class Activity</th><th>CO Mapping</th><th>Reference</th></tr>
          </thead>
          <tbody>
            ${(plan.lecturePlan ?? [])
              .map(
                (row) =>
                  `<tr><td>${html(row.unit)}</td><td>${html(row.classPeriod)}</td><td>${html(row.topic)}</td><td>${html(row.modeOfTeaching)}</td><td>${html(row.inClassActivity)}</td><td>${html(row.outClassActivity)}</td><td>${html(joinList(row.coMapping))}</td><td>${html(joinList(row.reference))}</td></tr>`
              )
              .join("")}
          </tbody>
        </table>

        <h2>Evaluation And Grading</h2>
        <p>Total Marks: ${html(evaluation.totalMarks)}</p>
        <table>
          <thead><tr><th>Component</th><th>Marks</th><th>Type</th></tr></thead>
          <tbody>
            ${(evaluation.components ?? [])
              .map(
                (component) =>
                  `<tr><td>${html(component.name)}</td><td class="center">${html(component.marks)}</td><td>${html(component.type)}</td></tr>`
              )
              .join("")}
          </tbody>
        </table>

        <h2>Threshold</h2>
        <table>
          <thead><tr><th>Level</th><th>Target Percentage</th><th>Student Percentage</th></tr></thead>
          <tbody>
            ${(evaluation.threshold ?? [])
              .map(
                (row) =>
                  `<tr><td class="center">${html(row.level)}</td><td class="center">${html(row.targetPercentage)}</td><td class="center">${html(row.studentPercentage)}</td></tr>`
              )
              .join("")}
          </tbody>
        </table>

        <script>
          window.addEventListener("load", () => {
            window.print();
          });
        </script>
      </body>
    </html>
  `;
}

export default function CdpReview() {
  const { plan, updatePlan, saveDraft, generateDocument, status } =
    useCdpPlan(COURSE_ID);
  const [activeTab, setActiveTab] = useState("edit");

  const mappingKeys = useMemo(() => getMappingKeys(plan), [plan]);

  if (status === "loading" || !plan) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          {status === "error" ? (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 px-5 py-3 text-sm font-semibold text-red-600 dark:text-red-400">
              Failed to load CDP data — check the console
            </div>
          ) : (
            <>
              <div className="grid h-14 w-14 place-items-center rounded-2xl grad-brand shadow-glow animate-pulse-glow">
                <Loader2 className="animate-spin h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-gray-400">Loading CDP data…</p>
              <div className="w-48 h-1 rounded-full bg-slate-200 dark:bg-gray-800 overflow-hidden">
                <div className="h-full w-full grad-brand animate-shimmer" />
              </div>
            </>
          )}
        </div>
      </main>
    );
  }

  const metadata = plan.courseMetadata ?? {};
  const credits = metadata.credits ?? {};

  const setMetadata = (patch) =>
    updatePlan((current) => ({
      ...current,
      courseMetadata: { ...current.courseMetadata, ...patch },
    }));

  const setCredits = (patch) =>
    setMetadata({ credits: { ...credits, ...patch } });

  const setCollection = (key, nextValue) =>
    updatePlan((current) => ({ ...current, [key]: nextValue }));

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-100">
      {/* ── Premium page header ── */}
      <div className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-gray-800/80 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl grad-brand shadow-glow-sm shrink-0">
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                CDP Review
              </p>
              <h1 className="text-lg font-bold text-ink dark:text-gray-100 leading-tight">
                {metadata.code}
                <span className="font-normal text-slate-400 dark:text-gray-500 mx-1.5">—</span>
                {metadata.name}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "edit" ? "preview" : "edit")}
              className="btn-lift inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-[13px] font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 shadow-card focus-ring transition-all"
            >
              <FileText size={15} />
              {activeTab === "edit" ? "Preview" : "Edit"}
            </button>
            <button
              type="button"
              onClick={saveDraft}
              disabled={status === "saving"}
              className={`btn-lift inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[13px] font-semibold shadow-card focus-ring transition-all disabled:opacity-60 ${
                status === "saved"
                  ? "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                  : "border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700"
              }`}
            >
              {status === "saving" ? (
                <Loader2 className="animate-spin" size={15} />
              ) : status === "saved" ? (
                <Check size={15} className="text-emerald-600" />
              ) : (
                <Save size={15} />
              )}
              {status === "saved" ? "Saved" : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={() => { generateDocument(); printCdp(plan); }}
              className="btn-lift inline-flex items-center gap-2 rounded-lg grad-brand px-3.5 py-2 text-[13px] font-semibold text-white shadow-glow-sm hover:shadow-glow focus-ring transition-all"
            >
              <Download size={15} />
              Generate File
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr]">
        {/* ── Sidebar ── */}
        <aside className="h-max rounded-2xl border border-slate-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-card p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 dark:bg-gray-800/80 border border-slate-100 dark:border-gray-700/50 p-3 text-center">
              <div className="font-display text-2xl font-extrabold grad-brand-text">{plan.courseOutcomes?.length ?? 0}</div>
              <div className="text-[11.5px] font-semibold text-slate-500 dark:text-gray-400 mt-0.5">Course Outcomes</div>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-gray-800/80 border border-slate-100 dark:border-gray-700/50 p-3 text-center">
              <div className="font-display text-2xl font-extrabold grad-brand-text">{plan.lecturePlan?.length ?? 0}</div>
              <div className="text-[11.5px] font-semibold text-slate-500 dark:text-gray-400 mt-0.5">Sessions</div>
            </div>
          </div>
          <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/80 dark:bg-indigo-900/20 p-3.5 text-[13px] leading-relaxed text-indigo-800 dark:text-indigo-300">
            Review the extracted data, correct anything that looks off, save the draft, then generate the final CDP document.
          </div>
          {/* Quick stats */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500">Plan Details</div>
            <div className="text-[13px] text-slate-600 dark:text-gray-300 flex justify-between">
              <span>POs/PSOs</span>
              <span className="font-semibold">{plan.coPoMappings?.length ? `${plan.coPoMappings.length} rows` : "—"}</span>
            </div>
            <div className="text-[13px] text-slate-600 dark:text-gray-300 flex justify-between">
              <span>Credit Hours</span>
              <span className="font-semibold">{metadata.credits ? `L${metadata.credits.L ?? 0}T${metadata.credits.T ?? 0}P${metadata.credits.P ?? 0}` : "—"}</span>
            </div>
          </div>
        </aside>

        {activeTab === "preview" ? (
          <div className="space-y-5">
            <article
              className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
              dangerouslySetInnerHTML={{ __html: buildPrintableCdp(plan) }}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6">
            <Section title="Course Metadata" icon={BookOpen}>
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="Course Code"
                  value={metadata.code}
                  onChange={(value) => setMetadata({ code: value })}
                />
                <TextInput
                  label="Course Name"
                  value={metadata.name}
                  onChange={(value) => setMetadata({ name: value })}
                />
                <TextInput
                  label="Academic Year"
                  value={metadata.academicYear}
                  onChange={(value) => setMetadata({ academicYear: value })}
                />
                <TextInput
                  label="Course Mentor"
                  value={metadata.courseMentor}
                  onChange={(value) => setMetadata({ courseMentor: value })}
                />
                <TextInput
                  label="Pre-requisites"
                  value={metadata.preRequisites}
                  onChange={(value) => setMetadata({ preRequisites: value })}
                />
                <div className="grid grid-cols-4 gap-2">
                  {["L", "T", "P", "C"].map((key) => (
                    <TextInput
                      key={key}
                      label={key}
                      type="number"
                      value={credits[key]}
                      onChange={(value) => setCredits({ [key]: Number(value) })}
                    />
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Program Outcomes / PSOs" icon={FileText}>
              <div className="space-y-3">
                {FIXED_PROGRAM_OUTCOMES.map((outcome, index) => (
                  <div
                    key={`${outcome.id}-${index}`}
                    className="flex flex-col gap-1 rounded-lg border border-slate-100 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50 p-3 md:flex-row md:items-start md:gap-4"
                  >
                    <span className="w-16 shrink-0 font-display text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      {outcome.id}
                    </span>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                      {outcome.description}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Course Outcomes" icon={FileText}>
              <div className="space-y-3">
                {(plan.courseOutcomes ?? []).map((co, index) => (
                  <div key={co.id} className="grid gap-3 md:grid-cols-[90px_1fr]">
                    <TextInput
                      label="ID"
                      value={co.id}
                      onChange={(value) =>
                        setCollection(
                          "courseOutcomes",
                          updateArrayItem(plan.courseOutcomes, index, { id: value })
                        )
                      }
                    />
                    <TextArea
                      label="Description"
                      value={co.description}
                      onChange={(value) =>
                        setCollection(
                          "courseOutcomes",
                          updateArrayItem(plan.courseOutcomes, index, {
                            description: value,
                          })
                        )
                      }
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="CO-PO/PSO Mapping" icon={Check}>
              <div className="overflow-x-auto">
                <table className="min-w-[760px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 p-2 text-left dark:text-gray-300">
                        CO
                      </th>
                      {mappingKeys.map((key) => (
                        <th
                          key={key}
                          className="border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 p-2 text-center uppercase dark:text-gray-300"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(plan.coPoMappings ?? []).map((row, rowIndex) => (
                      <tr key={row.co}>
                        <td className="border border-slate-200 dark:border-gray-700 p-2 font-semibold dark:text-gray-300">
                          {row.co}
                        </td>
                        {mappingKeys.map((key) => (
                          <td key={key} className="border border-slate-200 dark:border-gray-700 p-1">
                            <input
                              value={row[key] ?? "-"}
                              onChange={(event) =>
                                setCollection(
                                  "coPoMappings",
                                  updateArrayItem(plan.coPoMappings, rowIndex, {
                                    [key]: event.target.value,
                                  })
                                )
                              }
                              className="h-8 w-full rounded border border-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 text-center text-sm outline-none focus:border-indigo-400"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="Lecture Plan" icon={FileText}>
              <div className="space-y-4">
                {(plan.lecturePlan ?? []).map((lecture, index) => (
                  <div
                    key={`${lecture.classPeriod}-${index}`}
                    className="rounded-lg border border-slate-200 dark:border-gray-700 dark:bg-gray-800/50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700 dark:text-gray-300">
                        Session {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCollection(
                            "lecturePlan",
                            plan.lecturePlan.filter((_, itemIndex) => itemIndex !== index)
                          )
                        }
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600"
                        aria-label="Remove session"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <TextInput
                        label="Unit"
                        value={lecture.unit}
                        onChange={(value) =>
                          setCollection(
                            "lecturePlan",
                            updateArrayItem(plan.lecturePlan, index, {
                              unit: value,
                            })
                          )
                        }
                      />
                      <TextInput
                        label="Class Period"
                        value={lecture.classPeriod}
                        onChange={(value) =>
                          setCollection(
                            "lecturePlan",
                            updateArrayItem(plan.lecturePlan, index, {
                              classPeriod: value,
                            })
                          )
                        }
                      />
                      <TextInput
                        label="CO Mapping"
                        value={(lecture.coMapping ?? []).join(", ")}
                        onChange={(value) =>
                          setCollection(
                            "lecturePlan",
                            updateArrayItem(plan.lecturePlan, index, {
                              coMapping: value.split(",").map((item) => item.trim()),
                            })
                          )
                        }
                      />
                      <div className="md:col-span-3">
                        <TextArea
                          label="Topic"
                          value={lecture.topic}
                          onChange={(value) =>
                            setCollection(
                              "lecturePlan",
                              updateArrayItem(plan.lecturePlan, index, {
                                topic: value,
                              })
                            )
                          }
                        />
                      </div>
                      <TextInput
                        label="Mode of Teaching"
                        value={lecture.modeOfTeaching}
                        onChange={(value) =>
                          setCollection(
                            "lecturePlan",
                            updateArrayItem(plan.lecturePlan, index, {
                              modeOfTeaching: value,
                            })
                          )
                        }
                      />
                      <TextInput
                        label="In-class Activity"
                        value={lecture.inClassActivity}
                        onChange={(value) =>
                          setCollection(
                            "lecturePlan",
                            updateArrayItem(plan.lecturePlan, index, {
                              inClassActivity: value,
                            })
                          )
                        }
                      />
                      <TextInput
                        label="Out-class Activity"
                        value={lecture.outClassActivity}
                        onChange={(value) =>
                          setCollection(
                            "lecturePlan",
                            updateArrayItem(plan.lecturePlan, index, {
                              outClassActivity: value,
                            })
                          )
                        }
                      />
                      <TextInput
                        label="Reference"
                        value={(lecture.reference ?? []).join(", ")}
                        onChange={(value) =>
                          setCollection(
                            "lecturePlan",
                            updateArrayItem(plan.lecturePlan, index, {
                              reference: value.split(",").map((item) => item.trim()),
                            })
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setCollection("lecturePlan", [
                      ...(plan.lecturePlan ?? []),
                      EMPTY_LECTURE,
                    ])
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700"
                >
                  <Plus size={16} />
                  Add Session
                </button>
              </div>
            </Section>

            <Section title="Evaluation And Grading" icon={Check}>
              <div className="space-y-3">
                <TextInput
                  label="Total Marks"
                  type="number"
                  value={plan.evaluationAndGrading?.totalMarks}
                  onChange={(value) =>
                    setCollection("evaluationAndGrading", {
                      ...plan.evaluationAndGrading,
                      totalMarks: Number(value),
                    })
                  }
                />
                {(plan.evaluationAndGrading?.components ?? []).map(
                  (component, index) => (
                    <div key={index} className="grid gap-3 md:grid-cols-[1fr_120px_160px]">
                      <TextInput
                        label="Component"
                        value={component.name}
                        onChange={(value) =>
                          setCollection("evaluationAndGrading", {
                            ...plan.evaluationAndGrading,
                            components: updateArrayItem(
                              plan.evaluationAndGrading.components,
                              index,
                              { name: value }
                            ),
                          })
                        }
                      />
                      <TextInput
                        label="Marks"
                        type="number"
                        value={component.marks}
                        onChange={(value) =>
                          setCollection("evaluationAndGrading", {
                            ...plan.evaluationAndGrading,
                            components: updateArrayItem(
                              plan.evaluationAndGrading.components,
                              index,
                              { marks: Number(value) }
                            ),
                          })
                        }
                      />
                      <TextInput
                        label="Type"
                        value={component.type}
                        onChange={(value) =>
                          setCollection("evaluationAndGrading", {
                            ...plan.evaluationAndGrading,
                            components: updateArrayItem(
                              plan.evaluationAndGrading.components,
                              index,
                              { type: value }
                            ),
                          })
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </Section>

            <Section title="Threshold" icon={Check}>
              <div className="space-y-3">
                {(plan.evaluationAndGrading?.threshold ?? []).map(
                  (threshold, index) => (
                    <div key={index} className="grid gap-3 md:grid-cols-3">
                      <TextInput
                        label="Level"
                        type="number"
                        value={threshold.level}
                        onChange={(value) =>
                          setCollection("evaluationAndGrading", {
                            ...plan.evaluationAndGrading,
                            threshold: updateArrayItem(
                              plan.evaluationAndGrading.threshold,
                              index,
                              { level: Number(value) }
                            ),
                          })
                        }
                      />
                      <TextInput
                        label="Target Percentage"
                        type="number"
                        value={threshold.targetPercentage}
                        onChange={(value) =>
                          setCollection("evaluationAndGrading", {
                            ...plan.evaluationAndGrading,
                            threshold: updateArrayItem(
                              plan.evaluationAndGrading.threshold,
                              index,
                              { targetPercentage: Number(value) }
                            ),
                          })
                        }
                      />
                      <TextInput
                        label="Student Percentage"
                        type="number"
                        value={threshold.studentPercentage}
                        onChange={(value) =>
                          setCollection("evaluationAndGrading", {
                            ...plan.evaluationAndGrading,
                            threshold: updateArrayItem(
                              plan.evaluationAndGrading.threshold,
                              index,
                              { studentPercentage: Number(value) }
                            ),
                          })
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </Section>
          </div>
        )}
      </div>
    </main>
  );
}