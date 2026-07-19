import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BookOpen,
  Check,
  Download,
  FileText,
  Loader2,
  Plus,
  Save,
  Trash2,
  Layers,
  RotateCcw,
} from "lucide-react";
import { useCdpPlan } from "../hooks/useCdpPlan";
import ConceptMapGenerator from "../components/ConceptMapGenerator";

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
        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-slate-800 dark:text-gray-200 outline-none transition-colors focus:border-[hsl(84,25%,52%)] focus:ring-2 focus:ring-[hsl(84,18%,80%)]/40 dark:focus:ring-[hsl(84,18%,40%)]/40"
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
        className="w-full resize-y rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm leading-6 text-slate-800 dark:text-gray-200 outline-none transition-colors focus:border-[hsl(84,25%,52%)] focus:ring-2 focus:ring-[hsl(84,18%,80%)]/40 dark:focus:ring-[hsl(84,18%,40%)]/40"
      />
    </label>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="border-t border-slate-200 dark:border-gray-700 py-7 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[hsl(84,25%,92%)] dark:bg-[hsl(84,15%,20%)] text-[hsl(84,25%,42%)] dark:text-[hsl(84,20%,70%)]">
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

function buildPrintableConceptMapSvg(plan) {
  if (!plan?.conceptMap?.nodes) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 350px; border: 2px dashed #ccc; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 14px; font-weight: bold; color: #666; margin: 0 0 8px;">No Concept Map Generated</p>
        <p style="font-size: 12px; color: #888; margin: 0;">Please generate the concept map in the Concept Map tab first.</p>
      </div>
    `;
  }

  const nodes = plan.conceptMap.nodes;
  const rootNode = nodes.find(n => n.type === "root" || n.id === "root");
  if (!rootNode) return "";

  const centerX = 500;
  const centerY = 300;
  const outerNodes = nodes.filter(n => n.id !== rootNode.id);

  // Symmetrical slots coordinates radiating around center (X: 320px spacing, Y: 180px spacing)
  const dx = 320;
  const dy = 180;
  const slots = [
    { x: centerX, y: centerY - dy },      // 1. Top-Center
    { x: centerX + dx, y: centerY - dy }, // 2. Top-Right
    { x: centerX + dx, y: centerY },      // 3. Middle-Right
    { x: centerX + dx, y: centerY + dy }, // 4. Bottom-Right
    { x: centerX, y: centerY + dy },      // 5. Bottom-Center
    { x: centerX - dx, y: centerY + dy }, // 6. Bottom-Left
    { x: centerX - dx, y: centerY },      // 7. Middle-Left
    { x: centerX - dx, y: centerY - dy }, // 8. Top-Left
  ];

  let edgesStr = "";
  let nodesStr = "";

  // Helper to split paragraph text into short lines
  const splitText = (text, maxChars) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";
    words.forEach(word => {
      if ((currentLine + " " + word).length > maxChars) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine += " " + word;
      }
    });
    if (currentLine) lines.push(currentLine.trim());
    return lines;
  };

  outerNodes.forEach((node, idx) => {
    let slotIdx = idx % slots.length;
    if (outerNodes.length <= 4) {
      slotIdx = (idx * 2) % slots.length;
    }
    const sx = slots[slotIdx].x;
    const sy = slots[slotIdx].y;

    // Calculate the boundary connection point on the border of the card
    let tx = sx;
    let ty = sy;
    if (sx > centerX) {
      tx = sx - 115; // Left edge of right-hand cards
    } else if (sx < centerX) {
      tx = sx + 115; // Right edge of left-hand cards
    } else if (sy < centerY) {
      ty = sy + 50;  // Bottom edge of top cards
    } else if (sy > centerY) {
      ty = sy - 50;  // Top edge of bottom cards
    }

    // Draw edge (thin solid black line with arrowhead pointing from center)
    edgesStr += `
      <line 
        x1="${centerX}" y1="${centerY}" 
        x2="${tx}" y2="${ty}" 
        stroke="#1e293b" 
        stroke-width="1.5" 
        marker-end="url(#arrow)" 
      />
    `;

    // Colors mapping corresponding to screen themes
    const themeColors = {
      yellow: { fill: "#fef08a", border: "#fbbf24", badge: "#eab308", glow: "rgba(234,179,8,0.12)" },
      orange: { fill: "#ffedd5", border: "#f97316", badge: "#ea580c", glow: "rgba(249,115,22,0.12)" },
      pink: { fill: "#fce7f3", border: "#f472b6", badge: "#db2777", glow: "rgba(236,72,153,0.12)" },
      purple: { fill: "#f3e8ff", border: "#c084fc", badge: "#9333ea", glow: "rgba(168,85,247,0.12)" },
      red: { fill: "#fee2e2", border: "#f87171", badge: "#dc2626", glow: "rgba(239,68,68,0.12)" },
      teal: { fill: "#ccfbf1", border: "#2dd4bf", badge: "#0d9488", glow: "rgba(20,184,166,0.12)" },
      cyan: { fill: "#ecfeff", border: "#22d3ee", badge: "#0891b2", glow: "rgba(6,182,212,0.12)" },
      blue: { fill: "#dbeafe", border: "#60a5fa", badge: "#2563eb", glow: "rgba(59,130,246,0.12)" },
    };
    const color = themeColors[node.themeColor || "yellow"] || themeColors.yellow;

    const w = 230;
    const h = 100;
    const rx = sx - w / 2;
    const ry = sy - h / 2;

    const desc = node.description || "";
    const lines = splitText(desc, 38);

    nodesStr += `
      <!-- Outer Card Box -->
      <g>
        <rect 
          x="${rx}" y="${ry}" 
          width="${w}" height="${h}" 
          rx="28" ry="28" 
          fill="#ffffff" 
          stroke="${color.badge}" 
          stroke-width="2" 
          style="filter: drop-shadow(0px 6px 12px ${color.glow});" 
        />
        
        <!-- Badge -->
        <circle cx="${rx}" cy="${sy}" r="15" fill="${color.badge}" stroke="#ffffff" stroke-width="2.5" />
        <text x="${rx}" y="${sy + 3.5}" fill="#ffffff" font-size="9px" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle">${node.badgeNumber || idx + 1}</text>
        
        <!-- Title Header -->
        <text 
          x="${sx}" y="${ry + 26}" 
          fill="#1e293b" 
          font-size="9.5px" 
          font-weight="bold" 
          font-family="Arial, sans-serif" 
          text-anchor="middle"
        >
          ${html(node.label)}
        </text>
        
        <!-- Wrapped Description -->
        ${lines.slice(0, 3).map((line, lidx) => `
          <text 
            x="${sx}" y="${ry + 43 + lidx * 13}" 
            fill="#64748b" 
            font-size="8px" 
            font-family="Arial, sans-serif" 
            text-anchor="middle"
          >
            ${html(line)}
          </text>
        `).join("")}
      </g>
    `;
  });

  // Central Node
  const codeText = rootNode.code || plan.courseMetadata?.code || "COURSE";
  const titleText = rootNode.title || (plan.courseMetadata?.name || "Subject").toUpperCase();
  const titleLines = splitText(titleText, 25);

  const cw = 240;
  const ch = 90;
  const crx = centerX - cw / 2;
  const cry = centerY - ch / 2;

  nodesStr += `
    <!-- Center Node (Glowing Card Box matching screen view) -->
    <g>
      <rect 
        x="${crx}" y="${cry}" 
        width="${cw}" height="${ch}" 
        rx="24" ry="24" 
        fill="#ffffff" 
        stroke="#4f46e5" 
        stroke-width="2.5" 
        style="filter: drop-shadow(0px 8px 18px rgba(79,70,229,0.18));" 
      />
      <text 
        x="${centerX}" y="${centerY - 8}" 
        fill="#1e1b4b" 
        font-size="12px" 
        font-weight="900" 
        font-family="Arial, sans-serif" 
        text-anchor="middle"
      >
        ${html(codeText)}
      </text>
      ${titleLines.slice(0, 2).map((line, lidx) => `
        <text 
          x="${centerX}" y="${centerY + 10 + lidx * 11}" 
          fill="#475569" 
          font-size="8px" 
          font-weight="bold" 
          font-family="Arial, sans-serif" 
          text-anchor="middle"
        >
          ${html(line)}
        </text>
      `).join("")}
    </g>
  `;

  return `
    <div style="display: flex; justify-content: center; align-items: center; margin: 15px 0;">
      <svg width="100%" height="450" viewBox="0 0 1000 600" style="background: #fafaf9; border: 1px solid #cbd5e1; border-radius: 20px; max-width: 750px;">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#1e293b" />
          </marker>
        </defs>
        ${edgesStr}
        ${nodesStr}
      </svg>
    </div>
  `;
}


function printCdp(plan) {
  const htmlStr = buildPrintableCdp(plan);
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(htmlStr);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 500);
}

function buildPrintableCdp(plan) {
  const metadata = plan.courseMetadata ?? {};
  const credits = metadata.credits ?? {};
  const mappingKeys = getMappingKeys(plan);
  const evaluation = plan.evaluationAndGrading ?? {};
  const courseOutcomes = plan.courseOutcomes ?? [];
  const lecturePlan = plan.lecturePlan ?? [];

  // Group lecture plan by units for clean formatting
  const lecturesByUnit = {};
  lecturePlan.forEach(lecture => {
    const unitVal = lecture.unit || 1;
    if (!lecturesByUnit[unitVal]) lecturesByUnit[unitVal] = [];
    lecturesByUnit[unitVal].push(lecture);
  });

  return `
    <!doctype html>
    <html>
      <head>
        <title>${metadata.code ?? "Course"} - Course Delivery Plan</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            background-color: #f1f5f9;
            margin: 0;
            padding: 0;
            font-family: "Times New Roman", Times, serif;
            color: #000000;
          }
          
          /* Page Container */
          .page-container {
            background-color: #ffffff;
            width: 210mm;
            height: 297mm;
            padding: 15mm;
            margin: 10px auto;
            box-sizing: border-box;
            position: relative;
            page-break-after: always;
            break-after: page;
          }
          
          @media print {
            body {
              background-color: #ffffff;
              margin: 0;
              padding: 0;
            }
            .page-container {
              margin: 0;
              border: none;
              box-shadow: none;
              page-break-after: always;
              break-after: page;
            }
          }

          /* Double line border layout */
          .double-border {
            border: 4px double #000000;
            height: 100%;
            width: 100%;
            padding: 8mm;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            position: relative;
          }

          /* Header style */
          .official-logo-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            border-bottom: 2px solid #000000;
            padding-bottom: 12px;
            margin-bottom: 12px;
          }
          .official-logo-header svg {
            flex-shrink: 0;
          }
          .logo-text-block {
            text-align: center;
          }
          .univ-title {
            font-size: 16px;
            font-weight: bold;
            color: #991b1b;
            margin: 0;
            letter-spacing: 0.5px;
          }
          .school-title {
            font-size: 12.5px;
            font-weight: bold;
            margin: 2px 0 0 0;
            color: #000000;
          }
          
          .cdp-banner {
            background-color: #e2e8f0;
            border: 1px solid #000000;
            text-align: center;
            font-weight: bold;
            font-size: 12px;
            padding: 6.5px;
            margin-bottom: 12px;
          }

          /* Tables styling */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
          }
          th, td {
            border: 1px solid #000000;
            padding: 5px 6px;
            font-size: 10px;
            vertical-align: middle;
          }
          th {
            background-color: #e2e8f0;
            font-weight: bold;
            text-align: center;
          }
          
          .label-col {
            font-weight: bold;
            width: 25%;
          }
          .val-col {
            width: 25%;
          }
          
          .section-title {
            font-size: 12px;
            font-weight: bold;
            margin: 14px 0 6px 0;
            border-bottom: 1px solid #000000;
            padding-bottom: 2px;
            text-transform: uppercase;
          }

          .center { text-align: center; }
          .justify { text-align: justify; }
          
          /* Footer: Right-aligned italics, no line */
          .page-footer-block {
            position: absolute;
            bottom: 8mm;
            left: 8mm;
            right: 8mm;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            font-size: 9.5px;
            font-style: italic;
            font-family: "Times New Roman", Times, serif;
          }

          /* Signatures */
          .sig-row {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
          }
          .sig-box {
            text-align: center;
            width: 22%;
            font-size: 10px;
            font-weight: bold;
          }
          .sig-line {
            border-top: 1px solid #000000;
            margin-bottom: 5px;
            padding-top: 3px;
          }
        </style>
      </head>
      <body>

        <!-- PAGE 1: COVER PAGE -->
        <div class="page-container">
          <div class="double-border">
            <div class="official-logo-header">
              <svg width="45" height="45" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#991b1b" stroke-width="4" />
                <circle cx="50" cy="50" r="37" fill="#991b1b" />
                <path d="M 50 18 L 50 82 M 18 50 L 82 50 M 27 27 L 73 73 M 27 73 L 73 27" stroke="#ffffff" stroke-width="2.5" />
                <circle cx="50" cy="50" r="16" fill="#ffffff" stroke="#991b1b" stroke-width="2.5" />
                <text x="50" y="55" text-anchor="middle" font-size="15" font-weight="bold" fill="#991b1b" font-family="Arial">A</text>
              </svg>
              <div class="logo-text-block">
                <h1 class="univ-title">AMRITA VISHWA VIDYAPEETHAM</h1>
                <h2 class="school-title">Amrita School of Computing, Chennai</h2>
              </div>
            </div>

            <div class="cdp-banner">Course Delivery Plan</div>

            <!-- Course Metadata Table -->
            <table>
              <tbody>
                <tr>
                  <td class="label-col">Course Code : Course Name</td>
                  <td class="val-col"><strong>${html(metadata.code ?? "23CSE201")}: ${html(metadata.name ?? "Procedural Programming using C")}</strong></td>
                  <td class="label-col">Program</td>
                  <td class="val-col">${html(metadata.program ?? "CSE-CT")}</td>
                </tr>
                <tr>
                  <td class="label-col">L - T - P - C</td>
                  <td class="val-col">${html(credits.L ?? 3)}-${html(credits.T ?? 0)}-${html(credits.P ?? 2)}-${html(credits.C ?? 4)}</td>
                  <td class="label-col">Semester / Year</td>
                  <td class="val-col">${html(metadata.semesterYear ?? "III/II")}</td>
                </tr>
                <tr>
                  <td class="label-col">Name(s) of the Faculty</td>
                  <td class="val-col">${html(metadata.facultyNames ?? "Dr.R.Annamalai\nMr. M. Rajamanogaran").replace(/\n/g, "<br />")}</td>
                  <td class="label-col">Pre-requisite</td>
                  <td class="val-col">${html(metadata.preRequisites ?? "NIL")}</td>
                </tr>
                <tr>
                  <td class="label-col">Course Mentor</td>
                  <td class="val-col">${html(metadata.courseMentor ?? "Dr.R.Annamalai")}</td>
                  <td class="label-col">Academic Year</td>
                  <td class="val-col">${html(metadata.academicYear ?? "2026-2027")}</td>
                </tr>
                <tr>
                  <td class="label-col">Course Overview</td>
                  <td class="val-col" colspan="3" class="justify">${html(metadata.courseOverview ?? "This course aims to provide the knowledge of programming principles to the students through C programming language and develop applications using Arduino.")}</td>
                </tr>
              </tbody>
            </table>

            <!-- Course Objectives and Course Outcomes side-by-side -->
            <div style="flex: 1; display: flex; flex-direction: column;">
              <table style="width: 100%; margin-top: 5px; border-collapse: collapse; flex: 1;">
                <thead>
                  <tr>
                    <th colspan="2" style="width: 50%;">Course Objectives</th>
                    <th colspan="2" style="width: 50%;">Course Outcomes</th>
                  </tr>
                </thead>
                <tbody>
                  ${courseOutcomes.map((co, cidx) => {
                    if (cidx === 0) {
                      return `
                        <tr>
                          <td style="width: 4%; text-align: center; vertical-align: top; padding: 6px;" rowspan="${courseOutcomes.length}">1</td>
                          <td style="width: 46%; vertical-align: top; text-align: justify; padding: 6px; line-height: 1.45;" rowspan="${courseOutcomes.length}">
                            This course aims to provide the procedural/imperative programming principles to the students through C programming language. The language will be taught in the context of physical computing using Arduino.
                          </td>
                          <td style="width: 6%; text-align: center; font-weight: bold; background-color: #f8fafc; padding: 6px; vertical-align: top;">${html(co.id)}</td>
                          <td style="width: 44%; text-align: justify; padding: 6px; vertical-align: top; line-height: 1.45;">${html(co.description)}</td>
                        </tr>
                      `;
                    } else {
                      return `
                        <tr>
                          <td style="text-align: center; font-weight: bold; background-color: #f8fafc; padding: 6px; vertical-align: top;">${html(co.id)}</td>
                          <td style="text-align: justify; padding: 6px; vertical-align: top; line-height: 1.45;">${html(co.description)}</td>
                        </tr>
                      `;
                    }
                  }).join("")}
                </tbody>
              </table>
            </div>

            <div class="page-footer-block">
              <span>Page 1 of 12</span>
            </div>
          </div>
        </div>

        <!-- PAGE 2: SYLLABUS PAGE -->
        <div class="page-container">
          <div class="double-border">
            <h3 class="section-title" style="margin-top: 0;">Syllabus</h3>
            
            <div style="margin-bottom: 12px; font-size: 11px; line-height: 1.4;" class="justify">
              <strong style="font-size: 11.5px; text-decoration: underline;">Unit 1</strong><br />
              Review of Physical Computing, Understanding Arduino Hardware and Software Architecture - Verifying Hardware and Software - Loading and Running your First Program.<br />
              Introduction to C - Structure of C programs - Data types - I/O - control structures.
            </div>

            <div style="margin-bottom: 12px; font-size: 11px; line-height: 1.4;" class="justify">
              <strong style="font-size: 11.5px; text-decoration: underline;">Unit 2</strong><br />
              Arrays - Functions - Storage Classes and Scope - Recursion - Pointers: Introduction, pointer arithmetic, arrays and pointers, pointer to functions, dynamic memory allocation.
            </div>

            <div style="margin-bottom: 16px; font-size: 11px; line-height: 1.4;" class="justify">
              <strong style="font-size: 11.5px; text-decoration: underline;">Unit 3</strong><br />
              Structures, Unions and Data Storage - Strings: fixed length and variable length strings, strings and characters, string manipulation functions - Files and Streams - C Preprocessor - Command line arguments.
            </div>

            <h3 class="section-title">Textbook(s)</h3>
            <p style="font-size: 11px; margin: 0 0 16px 0; font-style: italic;">
              Jack Purdum, “Beginning C for Arduino”, Second Edition, APress, 2015.
            </p>

            <h3 class="section-title">Reference(s)</h3>
            <ol style="font-size: 11px; margin: 0; padding-left: 20px; line-height: 1.4;">
              <li style="margin-bottom: 6px;">Peter Linz and Tony Crawford, “C in a Nutshell: The Definitive Reference”, Second Edition, O'Reily Media, 2016.</li>
              <li style="margin-bottom: 6px;">Jens Gustedt, “Modern C”, Manning Publications, 2019.</li>
              <li style="margin-bottom: 6px;">Robert C. Seacord, Effective C - “An Introduction to Professional C Programming”, No Starch Press, 2020.</li>
              <li style="margin-bottom: 6px;">Daniel Gookin, “Tiny C Projects”, Manning Publications, 2022.</li>
            </ol>

            <div class="page-footer-block">
              <span>Page 2 of 12</span>
            </div>
          </div>
        </div>

        <!-- PAGE 3: CONCEPT MAP PAGE -->
        <div class="page-container">
          <div class="double-border" style="display: flex; flex-direction: column;">
            <h3 class="section-title" style="margin-top: 0; margin-bottom: 5px;">Concept Map</h3>

            <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
              ${buildPrintableConceptMapSvg(plan)}
            </div>

            <div class="page-footer-block">
              <span>Page 3 of 12</span>
            </div>
          </div>
        </div>

        <!-- PAGE 4: EVALUATION & grading & PO DESCRIPTIONS -->
        <div class="page-container">
          <div class="double-border">
            <h3 class="section-title" style="margin-top: 0;">Evaluation and Grading</h3>
            
            <table>
              <thead>
                <tr>
                  <th colspan="3">Internal (70)</th>
                  <th rowspan="2">External (30)</th>
                  <th rowspan="2">Total</th>
                </tr>
                <tr>
                  <th>Components</th>
                  <th>Marks</th>
                  <th>Total Marks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Periodicals (Mid-Term Exam)</td>
                  <td class="center">20</td>
                  <td class="center" rowspan="2">20</td>
                  <td class="center" rowspan="6"><strong>End Semester: 30</strong></td>
                  <td class="center" rowspan="6"><strong>Internal + External = 100</strong></td>
                </tr>
                <tr>
                  <td>Mid Sem Lab Assessment</td>
                  <td class="center">15</td>
                </tr>
                <tr>
                  <td>End Sem Lab Assessment</td>
                  <td class="center">15</td>
                  <td class="center" rowspan="4">50</td>
                </tr>
                <tr>
                  <td>Lab Activity Sheets [Basics]</td>
                  <td class="center">10</td>
                </tr>
                <tr>
                  <td>Classroom Participation</td>
                  <td class="center">05</td>
                </tr>
                <tr>
                  <td>Quiz [2]</td>
                  <td class="center">05</td>
                </tr>
              </tbody>
            </table>

            <h3 class="section-title">Programme Outcome (PO)</h3>
            <div style="flex: 1; overflow-y: auto; font-size: 9.5px; line-height: 1.35; padding-right: 2px;">
              ${FIXED_PROGRAM_OUTCOMES.slice(0, 8).map(po => `
                <div style="margin-bottom: 6px;">
                  <strong style="color: #4f46e5;">${po.id}:</strong> ${po.description}
                </div>
              `).join("")}
              <div style="border-top: 1px dashed #ccc; margin: 8px 0; padding-top: 5px;">
                ${FIXED_PROGRAM_OUTCOMES.slice(8).map(po => `
                  <div style="margin-bottom: 5px;">
                    <strong>${po.id}:</strong> ${po.description}
                  </div>
                `).join("")}
              </div>
            </div>

            <div class="page-footer-block">
              <span>Page 4 of 12</span>
            </div>
          </div>
        </div>

        <!-- PAGE 5: CO-PO AFFINITY MAP -->
        <div class="page-container">
          <div class="double-border">
            <h3 class="section-title" style="margin-top: 0;">CO – PO Affinity Map</h3>
            
            <p style="font-size: 11px; margin: 0 0 15px 0;" class="justify">
              The strength of correlation is mapped from 3 to 1: <strong>3 – Strong, 2 – Moderate, 1 – Weak, "-" – No Correlation</strong>.
            </p>

            <table style="margin-top: 15px;">
              <thead>
                <tr>
                  <th>CO / PO / PSO</th>
                  ${mappingKeys.map(k => `<th>${k.toUpperCase()}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${(plan.coPoMappings ?? []).map(row => `
                  <tr>
                    <td class="center" style="font-weight: bold; background-color: #f8fafc;">${row.co}</td>
                    ${mappingKeys.map(key => `<td class="center">${row[key] ?? "-"}</td>`).join("")}
                  </tr>
                `).join("")}
              </tbody>
            </table>

            <div style="margin-top: 25px; font-size: 11px; line-height: 1.5; background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px;">
              <strong>Affinity Analysis Summary:</strong><br />
              - <strong>CO1</strong> maps strongly with PO1, PO5, PSO1 and PSO2 as it establishes the fundamental programming mechanics.<br />
              - <strong>CO2</strong> maps key debugging and program tracing capabilities.<br />
              - <strong>CO3</strong> maps synthesis of constructs into modules and data blocks.<br />
              - <strong>CO4</strong> maps functional algorithm design and physical deployment onto microcontrollers (Arduino).
            </div>

            <div class="page-footer-block">
              <span>Page 5 of 12</span>
            </div>
          </div>
        </div>

        <!-- PAGES 6 - 10: DETAILED LECTURE PLAN -->
        ${Object.keys(lecturesByUnit).sort().map((unitNum, pageIdx) => {
          const unitLectures = lecturesByUnit[unitNum];
          // We can break lectures into sub-chunks of max 10 to 12 lectures per page to fit A4 perfectly
          const chunkSize = 11;
          const chunks = [];
          for (let i = 0; i < unitLectures.length; i += chunkSize) {
            chunks.push(unitLectures.slice(i, i + chunkSize));
          }

          return chunks.map((chunk, chunkIdx) => {
            const pageNum = 6 + pageIdx * 2 + chunkIdx; // Approximate page number
            return `
              <div class="page-container">
                <div class="double-border">
                  <h3 class="section-title" style="margin-top: 0;">Unit ${unitNum} Lecture Plan ${chunks.length > 1 ? `(Part ${chunkIdx + 1})` : ''}</h3>
                  
                  <table style="flex: 1; margin-top: 10px;">
                    <thead>
                      <tr>
                        <th style="width: 10%;">Class</th>
                        <th style="width: 35%;">Topics to be covered</th>
                        <th style="width: 15%;">Mode of Teaching</th>
                        <th style="width: 15%;">In-Class Activities</th>
                        <th style="width: 15%;">Out-Class Activities</th>
                        <th style="width: 5%;">CO</th>
                        <th style="width: 5%;">Ref</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${chunk.map(lecture => `
                        <tr>
                          <td class="center font-semibold">${html(lecture.classPeriod)}</td>
                          <td class="justify">${html(lecture.topic)}</td>
                          <td>${html(lecture.modeOfTeaching)}</td>
                          <td>${html(lecture.inClassActivity)}</td>
                          <td style="font-size: 8px; word-break: break-all;">${html(lecture.outClassActivity)}</td>
                          <td class="center font-semibold">${html(joinList(lecture.coMapping))}</td>
                          <td class="center">${html(joinList(lecture.reference))}</td>
                        </tr>
                      `).join("")}
                    </tbody>
                  </table>

                  <div class="page-footer-block">
                    <span>Page ${pageNum} of 12</span>
                  </div>
                </div>
              </div>
            `;
          }).join("");
        }).join("")}

        <!-- PAGE 11: LAB EXPERIMENTS -->
        <div class="page-container">
          <div class="double-border">
            <h3 class="section-title" style="margin-top: 0;">Lab Experiments Syllabus</h3>
            
            <div style="flex: 1; overflow-y: auto; font-size: 9.5px; line-height: 1.4; padding-right: 5px;">
              <ol style="margin: 0; padding-left: 15px;">
                <li style="margin-bottom: 6px;">
                  <strong>Basic C programs</strong>
                  <ul style="list-style-type: none; padding-left: 10px; margin-top: 3px;">
                    <li>1.a) Write a C program to find sum and average of three numbers.</li>
                    <li>1.b) Write a C program to find the greatest among three numbers.</li>
                    <li>1.c) Write a C program to check whether given number is odd/even.</li>
                    <li>1.d) Write a C program whether given year is a leap year or not.</li>
                    <li>1.e) Write a C program to swap two numbers.</li>
                    <li>1.f) Write a C program to evaluate algebraic expression (ax+b)/(ax-b).</li>
                  </ul>
                </li>
                
                <li style="margin-bottom: 6px;">
                  <strong>Control Structures</strong>
                  <ul style="list-style-type: none; padding-left: 10px; margin-top: 3px;">
                    <li>2.a) Write a C program to check whether given number is perfect number or not.</li>
                    <li>2.b) Write a C program to check whether given number is strong number or not.</li>
                    <li>2.c) Write a C program perform arithmetic operations using switch statement.</li>
                  </ul>
                </li>

                <li style="margin-bottom: 6px;">
                  <strong>Looping Statements</strong>
                  <ul style="list-style-type: none; padding-left: 10px; margin-top: 3px;">
                    <li>3.a) Write a C program to generate prime numbers between 1 to n.</li>
                    <li>3.b) Write a C program to produce the sum of individual digits of a given positive integer.</li>
                    <li>3.c) Write a C program to Check whether given number is Armstrong Number or not.</li>
                    <li>3.d) Write a C program to generate the first n terms of the Fibonacci sequence.</li>
                  </ul>
                </li>

                <li style="margin-bottom: 6px;">
                  <strong>Arrays</strong>
                  <ul style="list-style-type: none; padding-left: 10px; margin-top: 3px;">
                    <li>4.a) Write a C program to find both the largest and smallest number in a list of integers.</li>
                    <li>4.b) Write a C Program to Sort the Array in an Ascending Order.</li>
                    <li>4.c) Write a C Program to find whether given matrix is symmetric or not.</li>
                    <li>4.d) Write a C program to perform addition of two matrices.</li>
                  </ul>
                </li>

                <li style="margin-bottom: 6px;">
                  <strong>Functions</strong>
                  <ul style="list-style-type: none; padding-left: 10px; margin-top: 3px;">
                    <li>5.a) Write a C program to find factorial of a given integer using non-recursive function.</li>
                    <li>5.b) Write a C program to find factorial of a given integer using recursive function.</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div class="page-footer-block">
              <span>Page 11 of 12</span>
            </div>
          </div>
        </div>

        <!-- PAGE 12: SIGNATURES AND REQUIREMENTS -->
        <div class="page-container">
          <div class="double-border" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 class="section-title" style="margin-top: 0;">Attendance Requirement</h3>
              <ol style="font-size: 11px; line-height: 1.5; padding-left: 20px;" class="justify">
                <li style="margin-bottom: 8px;"><strong>(i) All students must maintain a minimum of 75% attendance</strong> in each course. This requirement is crucial for academic success and eligibility to appear for mid-term and end-semester examinations.</li>
                <li style="margin-bottom: 8px;"><strong>(ii) Students who fail to meet the 75% attendance threshold</strong> will not be permitted to appear for the mid-term and end-semester exams. Requests for exceptions will not be considered under any circumstances.</li>
                <li><strong>(iii) Attendance will be calculated</strong> up to three days prior to the commencement of the mid-term and end-semester exams, as per the academic calendar.</li>
              </ol>

              <div style="margin-top: 30px; border: 1.5px solid #000; padding: 12px; font-size: 10px; background-color: #f8fafc;" class="justify">
                <strong>Important Notice:</strong> Any changes or deviations in classes due to local holidays or unexpected closures will be compensated with special sessions outside official hours. Check details on the student portal regular updates.
              </div>
            </div>

            <div>
              <!-- Signatures Row -->
              <div class="sig-row">
                <div class="sig-box">
                  <div style="height: 35px; display: flex; align-items: flex-end; justify-content: center; font-family:'Brush Script MT', cursive; font-size: 16px; color:#1e3a8a;">Dr.R.Annamalai</div>
                  <div class="sig-line">Faculty</div>
                </div>
                <div class="sig-box">
                  <div style="height: 35px; display: flex; align-items: flex-end; justify-content: center; font-family:'Brush Script MT', cursive; font-size: 16px; color:#1e3a8a;">Dr.R.Annamalai</div>
                  <div class="sig-line">Course Mentor</div>
                </div>
                <div class="sig-box">
                  <div style="height: 35px;"></div>
                  <div class="sig-line">Program Chair / CSE</div>
                </div>
                <div class="sig-box">
                  <div style="height: 35px;"></div>
                  <div class="sig-line">Chairperson / CSE</div>
                </div>
              </div>
            </div>

            <div class="page-footer-block">
              <span>Page 12 of 12</span>
            </div>
          </div>
        </div>

        <script>
          window.addEventListener("load", () => {
            // Only auto-print if we are indeed triggering a print action
            if (window.location.search.includes("print=true") || true) {
              window.print();
            }
          });
        </script>
      </body>
    </html>
  `;
}

export default function CdpReview() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId") || "23CSE201";

  const { plan, updatePlan, saveDraft, generateDocument, status } =
    useCdpPlan(courseId);
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

  const handleResetToDefault = () => {
    localStorage.removeItem(`acadplan_cdp_draft_v5_${courseId}`);
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-ivory text-slate-900 dark:text-gray-100">
      {/* ── Premium page header ── */}
      <div className="sticky top-0 z-30 border-b" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl grad-brand shadow-glow-sm shrink-0">
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[hsl(84,25%,38%)] dark:text-[hsl(84,20%,70%)]">
                CDP Review
              </p>
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-ink dark:text-gray-100 leading-tight">
                {metadata.code}
                <span className="font-normal text-slate-400 dark:text-gray-500 mx-1.5">—</span>
                {metadata.name}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 shrink-0">
            {/* Segmented Tab Controls */}
            <div className="inline-flex rounded-lg border p-1" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
              {[
                { id: "edit", label: "Edit Plan", icon: FileText },
                { id: "map", label: "Concept Map", icon: Layers },
                { id: "preview", label: "Preview PDF", icon: BookOpen }
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? "shadow-sm"
                        : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300"
                    }`}
                    style={isSelected ? { background: "var(--bg-muted)", color: "var(--text-primary)" } : {}}
                  >
                    <Icon size={13} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="btn-lift inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition-all focus-ring shadow-card"
              style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              title="Discard draft edits and load original data from the JSON file"
            >
              <RotateCcw size={15} />
              Reset to JSON
            </button>

            <button
              type="button"
              onClick={saveDraft}
              disabled={status === "saving"}
              className={`btn-lift inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[13px] font-semibold shadow-card focus-ring transition-all disabled:opacity-60`}
              style={status === "saved"
                ? { background: "rgba(16, 185, 129, 0.1)", borderColor: "rgba(16, 185, 129, 0.4)", color: "rgb(16, 185, 129)" }
                : { background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }
              }
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
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr]">
        {/* ── Sidebar ── */}
        <aside className="h-max rounded-2xl border backdrop-blur-sm shadow-card p-5 space-y-4" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border p-3 text-center" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
              <div className="font-display text-2xl font-extrabold grad-brand-text">{plan.courseOutcomes?.length ?? 0}</div>
              <div className="text-[11.5px] font-semibold text-slate-500 dark:text-gray-400 mt-0.5">Course Outcomes</div>
            </div>
            <div className="rounded-xl border p-3 text-center" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
              <div className="font-display text-2xl font-extrabold grad-brand-text">{plan.lecturePlan?.length ?? 0}</div>
              <div className="text-[11.5px] font-semibold text-slate-500 dark:text-gray-400 mt-0.5">Sessions</div>
            </div>
          </div>
          <div className="rounded-xl border p-3.5 text-[13px] leading-relaxed text-[hsl(84,25%,35%)] dark:text-[hsl(84,20%,80%)]"
            style={{ background: "var(--bg-muted)", borderColor: "var(--border)" }}>
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
          <div className="space-y-5 overflow-x-auto flex flex-col items-center">
            <div
              className="print-preview-container"
              style={{ transform: "scale(0.9)", transformOrigin: "top center", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
              dangerouslySetInnerHTML={{ __html: buildPrintableCdp(plan) }}
            />
          </div>
        ) : activeTab === "map" ? (
          <ConceptMapGenerator
            plan={plan}
            onUpdateConceptMap={(newMap) => {
              updatePlan((current) => ({
                ...current,
                conceptMap: newMap,
              }));
            }}
          />
        ) : (
          <div className="rounded-2xl border p-5 sm:p-6" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
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
                <TextInput
                  label="Program"
                  value={metadata.program}
                  onChange={(value) => setMetadata({ program: value })}
                />
                <TextInput
                  label="Semester / Year"
                  value={metadata.semesterYear}
                  onChange={(value) => setMetadata({ semesterYear: value })}
                />
                <TextArea
                  label="Name(s) of the Faculty"
                  value={metadata.facultyNames}
                  onChange={(value) => setMetadata({ facultyNames: value })}
                  rows={2}
                />
                <TextArea
                  label="Course Overview"
                  value={metadata.courseOverview}
                  onChange={(value) => setMetadata({ courseOverview: value })}
                  rows={3}
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
                    className="flex flex-col gap-1 rounded-lg border p-3 md:flex-row md:items-start md:gap-4"
                    style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
                  >
                    <span className="w-16 shrink-0 font-display text-sm font-bold text-[hsl(84,25%,38%)] dark:text-[hsl(84,20%,70%)] uppercase">
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
                <table className="min-w-[760px] border-collapse text-sm border" style={{ borderColor: "var(--border)" }}>
                  <thead>
                    <tr>
                      <th className="border p-2 text-left" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)", color: "var(--text-primary)" }}>
                        CO
                      </th>
                      {mappingKeys.map((key) => (
                        <th
                          key={key}
                          className="border p-2 text-center uppercase"
                          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)", color: "var(--text-primary)" }}
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(plan.coPoMappings ?? []).map((row, rowIndex) => (
                      <tr key={row.co}>
                        <td className="border p-2 font-semibold" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>
                          {row.co}
                        </td>
                        {mappingKeys.map((key) => (
                          <td key={key} className="border p-1" style={{ borderColor: "var(--border)" }}>
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
                              className="h-8 w-full rounded border text-center text-sm outline-none transition-colors focus:border-[hsl(84,25%,52%)] focus:ring-1 focus:ring-[hsl(84,18%,80%)]/40"
                              style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
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
                    className="rounded-lg border p-4"
                    style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
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
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-all focus-ring shadow-card"
                  style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
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