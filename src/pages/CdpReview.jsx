import { useEffect, useMemo, useRef, useState } from "react";
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
import { useDarkMode } from "../context/DarkModeContext";
import ThemeToggle from "../components/ThemeToggle";

const COURSE_ID = "23CSE201";
const MERMAID_CDN = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
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
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/50"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/50"
      />
    </label>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="border-t border-slate-200 py-7 first:border-t-0 first:pt-0 dark:border-slate-700">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
          <Icon size={16} />
        </span>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function updateArrayItem(list, index, patch) {
  return list.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

function getMappingKeys(plan) {
  const outcomeKeys = (plan?.programOutcomes ?? []).map((o) => o.id.toLowerCase());
  const rowKeys = (plan?.coPoMappings ?? []).flatMap((row) =>
    Object.keys(row).filter((key) => key !== "co")
  );
  return Array.from(new Set([...outcomeKeys, ...rowKeys])).sort((a, b) => {
    const parse = (key) => {
      const m = key.match(/^([a-z]+)(\d+)$/i);
      return m ? [m[1], Number(m[2])] : [key, 0];
    };
    const [ap, an] = parse(a);
    const [bp, bn] = parse(b);
    return ap !== bp ? ap.localeCompare(bp) : an - bn;
  });
}

function html(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function joinList(value) {
  return Array.isArray(value) ? value.join(", ") : value ?? "";
}

function loadMermaid() {
  if (window.mermaid) return Promise.resolve(window.mermaid);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${MERMAID_CDN}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.mermaid));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = MERMAID_CDN;
    script.async = true;
    script.onload = () => resolve(window.mermaid);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function MermaidConceptMap({ chart }) {
  const containerRef = useRef(null);
  const [error, setError] = useState("");
  const { isDark } = useDarkMode();

  useEffect(() => {
    let active = true;
    if (!chart?.trim()) {
      if (containerRef.current) containerRef.current.innerHTML = "";
      return;
    }
    loadMermaid()
      .then(async (mermaid) => {
        if (!active || !containerRef.current) return;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "base",
          themeVariables: isDark
            ? { primaryColor: "#0f172a", primaryBorderColor: "#94a3b8", primaryTextColor: "#f1f5f9", secondaryColor: "#1e293b", tertiaryColor: "#292524", lineColor: "#94a3b8", clusterBkg: "#0f172a", clusterBorder: "#475569", fontFamily: "Inter, Arial, sans-serif" }
            : { primaryColor: "#f8fafc", primaryBorderColor: "#64748b", primaryTextColor: "#111827", secondaryColor: "#ecfeff", tertiaryColor: "#fff7ed", lineColor: "#334155", clusterBkg: "#ffffff", clusterBorder: "#cbd5e1", fontFamily: "Inter, Arial, sans-serif" },
        });
        const id = `cm-${Date.now()}`;
        const { svg } = await mermaid.render(id, chart);
        if (active && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError("");
        }
      })
      .catch(() => { if (active) setError("Unable to render Mermaid concept map."); });
    return () => { active = false; };
  }, [chart, isDark]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/80">
      <div ref={containerRef} className="mx-auto overflow-x-auto [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full" />
      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
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
  return `<!doctype html><html><head><title>${metadata.code ?? "Course"} CDP</title><style>body{font-family:Arial,sans-serif;color:#111827;margin:28px}h1{font-size:22px;margin:0 0 4px}h2{font-size:15px;margin:24px 0 8px}p{margin:4px 0;line-height:1.5}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:1px solid #cbd5e1;padding:6px;font-size:11px;vertical-align:top}th{background:#eef2ff}pre{white-space:pre-wrap;border:1px solid #cbd5e1;padding:10px;font-size:11px}.muted{color:#64748b}.center{text-align:center}.concept-map{margin-top:10px;overflow-x:auto;text-align:center}.concept-map svg{max-width:100%;height:auto}</style><script src="${MERMAID_CDN}"></script></head><body><h1>Course Delivery Plan</h1><p><strong>${html(metadata.code)}</strong> - ${html(metadata.name)}</p><p class="muted">Academic Year: ${html(metadata.academicYear || "Not set")} | Mentor: ${html(metadata.courseMentor || "Not set")}</p><p>Credits: L-${html(credits.L)}, T-${html(credits.T)}, P-${html(credits.P)}, C-${html(credits.C)}</p><p>Pre-requisites: ${html(metadata.preRequisites)}</p><h2>Program Outcomes / PSOs</h2><table><tbody>${(plan.programOutcomes ?? []).map((o) => `<tr><th>${html(o.id)}</th><td>${html(o.description)}</td></tr>`).join("")}</tbody></table><h2>Course Outcomes</h2><table><tbody>${(plan.courseOutcomes ?? []).map((co) => `<tr><th>${html(co.id)}</th><td>${html(co.description)}</td></tr>`).join("")}</tbody></table><h2>CO-PO/PSO Mapping</h2><table><thead><tr><th>CO</th>${mappingKeys.map((k) => `<th>${html(k.toUpperCase())}</th>`).join("")}</tr></thead><tbody>${(plan.coPoMappings ?? []).map((row) => `<tr><th>${html(row.co)}</th>${mappingKeys.map((k) => `<td class="center">${html(row[k] ?? "-")}</td>`).join("")}</tr>`).join("")}</tbody></table><h2>Lecture Plan</h2><table><thead><tr><th>Unit</th><th>Class Period</th><th>Topic</th><th>Mode of Teaching</th><th>In-class Activity</th><th>Out-class Activity</th><th>CO Mapping</th><th>Reference</th></tr></thead><tbody>${(plan.lecturePlan ?? []).map((row) => `<tr><td>${html(row.unit)}</td><td>${html(row.classPeriod)}</td><td>${html(row.topic)}</td><td>${html(row.modeOfTeaching)}</td><td>${html(row.inClassActivity)}</td><td>${html(row.outClassActivity)}</td><td>${html(joinList(row.coMapping))}</td><td>${html(joinList(row.reference))}</td></tr>`).join("")}</tbody></table><h2>Evaluation And Grading</h2><p>Total Marks: ${html(evaluation.totalMarks)}</p><table><thead><tr><th>Component</th><th>Marks</th><th>Type</th></tr></thead><tbody>${(evaluation.components ?? []).map((c) => `<tr><td>${html(c.name)}</td><td class="center">${html(c.marks)}</td><td>${html(c.type)}</td></tr>`).join("")}</tbody></table><h2>Threshold</h2><table><thead><tr><th>Level</th><th>Target Percentage</th><th>Student Percentage</th></tr></thead><tbody>${(evaluation.threshold ?? []).map((r) => `<tr><td class="center">${html(r.level)}</td><td class="center">${html(r.targetPercentage)}</td><td class="center">${html(r.studentPercentage)}</td></tr>`).join("")}</tbody></table><h2>Concept Map</h2><div class="concept-map"><pre class="mermaid">${html(plan.mermaidChart)}</pre></div><script>window.addEventListener("load",async()=>{if(window.mermaid){window.mermaid.initialize({startOnLoad:false,securityLevel:"loose",theme:"base",themeVariables:{primaryColor:"#eef2ff",primaryBorderColor:"#4f46e5",primaryTextColor:"#111827",secondaryColor:"#ecfeff",tertiaryColor:"#fff7ed",lineColor:"#475569",clusterBkg:"#ffffff",clusterBorder:"#cbd5e1",fontFamily:"Arial,sans-serif"}});await window.mermaid.run({querySelector:".mermaid"})}window.print()});</script></body></html>`;
}

export default function CdpReview() {
  const { plan, updatePlan, saveDraft, generateDocument, status } = useCdpPlan(COURSE_ID);
  const [activeTab, setActiveTab] = useState("edit");
  const mappingKeys = useMemo(() => getMappingKeys(plan), [plan]);

  if (status === "loading" || !plan) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <Loader2 className="animate-spin" size={18} />
          Loading extracted CDP JSON
        </div>
      </main>
    );
  }

  const metadata = plan.courseMetadata ?? {};
  const credits = metadata.credits ?? {};
  const setMetadata = (patch) => updatePlan((cur) => ({ ...cur, courseMetadata: { ...cur.courseMetadata, ...patch } }));
  const setCredits = (patch) => setMetadata({ credits: { ...credits, ...patch } });
  const setCollection = (key, next) => updatePlan((cur) => ({ ...cur, [key]: next }));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">CDP Review</p>
            <h1 className="mt-1 text-2xl font-bold dark:text-white">{metadata.code} - {metadata.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ThemeToggle />
            <button type="button" onClick={() => setActiveTab(activeTab === "edit" ? "preview" : "edit")} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <FileText size={16} />{activeTab === "edit" ? "Preview" : "Edit"}
            </button>
            <button type="button" onClick={saveDraft} disabled={status === "saving"} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              {status === "saving" ? <Loader2 className="animate-spin" size={16} /> : status === "saved" ? <Check size={16} /> : <Save size={16} />}
              {status === "saved" ? "Saved" : "Save Draft"}
            </button>
            <button type="button" onClick={() => { generateDocument(); printCdp(plan); }} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
              <Download size={16} />Generate File
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-max rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <div className="text-xl font-bold dark:text-white">{plan.courseOutcomes?.length ?? 0}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">COs</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <div className="text-xl font-bold dark:text-white">{plan.lecturePlan?.length ?? 0}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Sessions</div>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300">
            Review the extracted JSON, correct anything that looks off, save the draft, then generate the final CDP.
          </div>
        </aside>
        {activeTab === "preview" ? (
          <div className="space-y-5">
            <article className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900" dangerouslySetInnerHTML={{ __html: buildPrintableCdp(plan) }} />
            <section className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Rendered Concept Map</h2>
              <MermaidConceptMap chart={plan.mermaidChart} />
            </section>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-900">
            <Section title="Course Metadata" icon={BookOpen}>
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput label="Course Code" value={metadata.code} onChange={(v) => setMetadata({ code: v })} />
                <TextInput label="Course Name" value={metadata.name} onChange={(v) => setMetadata({ name: v })} />
                <TextInput label="Academic Year" value={metadata.academicYear} onChange={(v) => setMetadata({ academicYear: v })} />
                <TextInput label="Course Mentor" value={metadata.courseMentor} onChange={(v) => setMetadata({ courseMentor: v })} />
                <TextInput label="Pre-requisites" value={metadata.preRequisites} onChange={(v) => setMetadata({ preRequisites: v })} />
                <div className="grid grid-cols-4 gap-2">
                  {["L", "T", "P", "C"].map((k) => (<TextInput key={k} label={k} type="number" value={credits[k]} onChange={(v) => setCredits({ [k]: Number(v) })} />))}
                </div>
              </div>
            </Section>
            <Section title="Program Outcomes / PSOs" icon={FileText}>
              <div className="space-y-3">
                {(plan.programOutcomes ?? []).map((o, i) => (
                  <div key={`${o.id}-${i}`} className="grid gap-3 md:grid-cols-[100px_1fr]">
                    <TextInput label="ID" value={o.id} onChange={(v) => setCollection("programOutcomes", updateArrayItem(plan.programOutcomes, i, { id: v }))} />
                    <TextArea label="Description" value={o.description} onChange={(v) => setCollection("programOutcomes", updateArrayItem(plan.programOutcomes, i, { description: v }))} rows={2} />
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Course Outcomes" icon={FileText}>
              <div className="space-y-3">
                {(plan.courseOutcomes ?? []).map((co, i) => (
                  <div key={co.id} className="grid gap-3 md:grid-cols-[90px_1fr]">
                    <TextInput label="ID" value={co.id} onChange={(v) => setCollection("courseOutcomes", updateArrayItem(plan.courseOutcomes, i, { id: v }))} />
                    <TextArea label="Description" value={co.description} onChange={(v) => setCollection("courseOutcomes", updateArrayItem(plan.courseOutcomes, i, { description: v }))} rows={2} />
                  </div>
                ))}
              </div>
            </Section>
            <Section title="CO-PO/PSO Mapping" icon={Check}>
              <div className="overflow-x-auto">
                <table className="min-w-[760px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border border-slate-200 bg-slate-50 p-2 text-left dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">CO</th>
                      {mappingKeys.map((k) => (<th key={k} className="border border-slate-200 bg-slate-50 p-2 text-center uppercase dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">{k}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {(plan.coPoMappings ?? []).map((row, ri) => (
                      <tr key={row.co}>
                        <td className="border border-slate-200 p-2 font-semibold dark:border-slate-700 dark:text-slate-300">{row.co}</td>
                        {mappingKeys.map((k) => (
                          <td key={k} className="border border-slate-200 p-1 dark:border-slate-700">
                            <input value={row[k] ?? "-"} onChange={(e) => setCollection("coPoMappings", updateArrayItem(plan.coPoMappings, ri, { [k]: e.target.value }))} className="h-8 w-full rounded border border-slate-200 text-center text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-500" />
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
                {(plan.lecturePlan ?? []).map((lec, i) => (
                  <div key={`${lec.classPeriod}-${i}`} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Session {i + 1}</span>
                      <button type="button" onClick={() => setCollection("lecturePlan", plan.lecturePlan.filter((_, idx) => idx !== i))} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400" aria-label="Remove session"><Trash2 size={16} /></button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <TextInput label="Unit" value={lec.unit} onChange={(v) => setCollection("lecturePlan", updateArrayItem(plan.lecturePlan, i, { unit: v }))} />
                      <TextInput label="Class Period" value={lec.classPeriod} onChange={(v) => setCollection("lecturePlan", updateArrayItem(plan.lecturePlan, i, { classPeriod: v }))} />
                      <TextInput label="CO Mapping" value={(lec.coMapping ?? []).join(", ")} onChange={(v) => setCollection("lecturePlan", updateArrayItem(plan.lecturePlan, i, { coMapping: v.split(",").map((s) => s.trim()) }))} />
                      <div className="md:col-span-3"><TextArea label="Topic" value={lec.topic} onChange={(v) => setCollection("lecturePlan", updateArrayItem(plan.lecturePlan, i, { topic: v }))} /></div>
                      <TextInput label="Mode of Teaching" value={lec.modeOfTeaching} onChange={(v) => setCollection("lecturePlan", updateArrayItem(plan.lecturePlan, i, { modeOfTeaching: v }))} />
                      <TextInput label="In-class Activity" value={lec.inClassActivity} onChange={(v) => setCollection("lecturePlan", updateArrayItem(plan.lecturePlan, i, { inClassActivity: v }))} />
                      <TextInput label="Out-class Activity" value={lec.outClassActivity} onChange={(v) => setCollection("lecturePlan", updateArrayItem(plan.lecturePlan, i, { outClassActivity: v }))} />
                      <TextInput label="Reference" value={(lec.reference ?? []).join(", ")} onChange={(v) => setCollection("lecturePlan", updateArrayItem(plan.lecturePlan, i, { reference: v.split(",").map((s) => s.trim()) }))} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => setCollection("lecturePlan", [...(plan.lecturePlan ?? []), EMPTY_LECTURE])} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                  <Plus size={16} />Add Session
                </button>
              </div>
            </Section>
            <Section title="Evaluation And Grading" icon={Check}>
              <div className="space-y-3">
                <TextInput label="Total Marks" type="number" value={plan.evaluationAndGrading?.totalMarks} onChange={(v) => setCollection("evaluationAndGrading", { ...plan.evaluationAndGrading, totalMarks: Number(v) })} />
                {(plan.evaluationAndGrading?.components ?? []).map((comp, i) => (
                  <div key={i} className="grid gap-3 md:grid-cols-[1fr_120px_160px]">
                    <TextInput label="Component" value={comp.name} onChange={(v) => setCollection("evaluationAndGrading", { ...plan.evaluationAndGrading, components: updateArrayItem(plan.evaluationAndGrading.components, i, { name: v }) })} />
                    <TextInput label="Marks" type="number" value={comp.marks} onChange={(v) => setCollection("evaluationAndGrading", { ...plan.evaluationAndGrading, components: updateArrayItem(plan.evaluationAndGrading.components, i, { marks: Number(v) }) })} />
                    <TextInput label="Type" value={comp.type} onChange={(v) => setCollection("evaluationAndGrading", { ...plan.evaluationAndGrading, components: updateArrayItem(plan.evaluationAndGrading.components, i, { type: v }) })} />
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Threshold" icon={Check}>
              <div className="space-y-3">
                {(plan.evaluationAndGrading?.threshold ?? []).map((th, i) => (
                  <div key={i} className="grid gap-3 md:grid-cols-3">
                    <TextInput label="Level" type="number" value={th.level} onChange={(v) => setCollection("evaluationAndGrading", { ...plan.evaluationAndGrading, threshold: updateArrayItem(plan.evaluationAndGrading.threshold, i, { level: Number(v) }) })} />
                    <TextInput label="Target Percentage" type="number" value={th.targetPercentage} onChange={(v) => setCollection("evaluationAndGrading", { ...plan.evaluationAndGrading, threshold: updateArrayItem(plan.evaluationAndGrading.threshold, i, { targetPercentage: Number(v) }) })} />
                    <TextInput label="Student Percentage" type="number" value={th.studentPercentage} onChange={(v) => setCollection("evaluationAndGrading", { ...plan.evaluationAndGrading, threshold: updateArrayItem(plan.evaluationAndGrading.threshold, i, { studentPercentage: Number(v) }) })} />
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Concept Map" icon={FileText}>
              <MermaidConceptMap chart={plan.mermaidChart} />
              <details className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300">Edit Mermaid Code</summary>
                <div className="mt-3">
                  <TextArea label="Mermaid Source" value={plan.mermaidChart} onChange={(v) => updatePlan((cur) => ({ ...cur, mermaidChart: v }))} rows={8} />
                </div>
              </details>
            </Section>
          </div>
        )}
      </div>
    </main>
  );
}
