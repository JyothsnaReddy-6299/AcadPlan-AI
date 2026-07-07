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
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
    </label>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="border-t border-slate-200 py-7 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon size={16} />
        </span>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
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
  const outcomeKeys = (plan?.programOutcomes ?? []).map((outcome) =>
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

  useEffect(() => {
    let active = true;

    if (!chart?.trim()) {
      if (containerRef.current) containerRef.current.innerHTML = "";
      return undefined;
    }

    loadMermaid()
      .then(async (mermaid) => {
        if (!active || !containerRef.current) return;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "base",
          themeVariables: {
            primaryColor: "#f8fafc",
            primaryBorderColor: "#64748b",
            primaryTextColor: "#111827",
            secondaryColor: "#ecfeff",
            tertiaryColor: "#fff7ed",
            lineColor: "#334155",
            clusterBkg: "#ffffff",
            clusterBorder: "#cbd5e1",
            fontFamily: "Inter, Arial, sans-serif",
          },
        });
        const id = `concept-map-${Date.now()}`;
        const { svg } = await mermaid.render(id, chart);
        if (active && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError("");
        }
      })
      .catch(() => {
        if (active) setError("Unable to render Mermaid concept map.");
      });

    return () => {
      active = false;
    };
  }, [chart]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div
        ref={containerRef}
        className="mx-auto overflow-x-auto [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      />
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function printCdp(plan) {
  const html = buildPrintableCdp(plan);
  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;
  win.document.write(html);
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
          .concept-map { margin-top: 10px; overflow-x: auto; text-align: center; }
          .concept-map svg { max-width: 100%; height: auto; }
        </style>
        <script src="${MERMAID_CDN}"></script>
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
            ${(plan.programOutcomes ?? [])
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

        <h2>Concept Map</h2>
        <div class="concept-map">
          <pre class="mermaid">${html(plan.mermaidChart)}</pre>
        </div>
        <script>
          window.addEventListener("load", async () => {
            if (window.mermaid) {
              window.mermaid.initialize({
                startOnLoad: false,
                securityLevel: "loose",
                theme: "base",
                themeVariables: {
                  primaryColor: "#eef2ff",
                  primaryBorderColor: "#4f46e5",
                  primaryTextColor: "#111827",
                  secondaryColor: "#ecfeff",
                  tertiaryColor: "#fff7ed",
                  lineColor: "#475569",
                  clusterBkg: "#ffffff",
                  clusterBorder: "#cbd5e1",
                  fontFamily: "Arial, sans-serif"
                }
              });
              await window.mermaid.run({ querySelector: ".mermaid" });
            }
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
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Loader2 className="animate-spin" size={18} />
          Loading extracted CDP JSON
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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              CDP Review
            </p>
            <h1 className="mt-1 text-2xl font-bold">
              {metadata.code} - {metadata.name}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "edit" ? "preview" : "edit")}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <FileText size={16} />
              {activeTab === "edit" ? "Preview" : "Edit"}
            </button>
            <button
              type="button"
              onClick={saveDraft}
              disabled={status === "saving"}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {status === "saving" ? (
                <Loader2 className="animate-spin" size={16} />
              ) : status === "saved" ? (
                <Check size={16} />
              ) : (
                <Save size={16} />
              )}
              {status === "saved" ? "Saved" : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={() => {
                generateDocument();
                printCdp(plan);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Download size={16} />
              Generate File
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-max rounded-lg border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xl font-bold">{plan.courseOutcomes?.length ?? 0}</div>
              <div className="text-xs text-slate-500">COs</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xl font-bold">{plan.lecturePlan?.length ?? 0}</div>
              <div className="text-xs text-slate-500">Sessions</div>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-900">
            Review the extracted JSON, correct anything that looks off, save the
            draft, then generate the final CDP.
          </div>
        </aside>

        {activeTab === "preview" ? (
          <div className="space-y-5">
            <article
              className="rounded-lg border border-slate-200 bg-white p-6"
              dangerouslySetInnerHTML={{ __html: buildPrintableCdp(plan) }}
            />
            <section className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-base font-bold text-slate-900">
                Rendered Concept Map
              </h2>
              <MermaidConceptMap chart={plan.mermaidChart} />
            </section>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
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
                {(plan.programOutcomes ?? []).map((outcome, index) => (
                  <div
                    key={`${outcome.id}-${index}`}
                    className="grid gap-3 md:grid-cols-[100px_1fr]"
                  >
                    <TextInput
                      label="ID"
                      value={outcome.id}
                      onChange={(value) =>
                        setCollection(
                          "programOutcomes",
                          updateArrayItem(plan.programOutcomes, index, {
                            id: value,
                          })
                        )
                      }
                    />
                    <TextArea
                      label="Description"
                      value={outcome.description}
                      onChange={(value) =>
                        setCollection(
                          "programOutcomes",
                          updateArrayItem(plan.programOutcomes, index, {
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
                      <th className="border border-slate-200 bg-slate-50 p-2 text-left">
                        CO
                      </th>
                      {mappingKeys.map((key) => (
                        <th
                          key={key}
                          className="border border-slate-200 bg-slate-50 p-2 text-center uppercase"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(plan.coPoMappings ?? []).map((row, rowIndex) => (
                      <tr key={row.co}>
                        <td className="border border-slate-200 p-2 font-semibold">
                          {row.co}
                        </td>
                        {mappingKeys.map((key) => (
                          <td key={key} className="border border-slate-200 p-1">
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
                              className="h-8 w-full rounded border border-slate-200 text-center text-sm outline-none focus:border-indigo-400"
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
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700">
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
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
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
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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

            <Section title="Concept Map" icon={FileText}>
              <MermaidConceptMap chart={plan.mermaidChart} />
              <details className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                  Edit Mermaid Code
                </summary>
                <div className="mt-3">
                  <TextArea
                    label="Mermaid Source"
                    value={plan.mermaidChart}
                    onChange={(value) =>
                      updatePlan((current) => ({
                        ...current,
                        mermaidChart: value,
                      }))
                    }
                    rows={8}
                  />
                </div>
              </details>
            </Section>
          </div>
        )}
      </div>
    </main>
  );
}
