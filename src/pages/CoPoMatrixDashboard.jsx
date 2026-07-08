import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Info,
  ArrowLeft,
  Save,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";
import { useCoPoMatrix } from "../hooks/useCoPoMatrix";
import { getCellStyles } from "../utils/matrixHelpers";

// ---------------------------------------------------------------------------
// MatrixCell — a single interactive PO x CO intersection
// ---------------------------------------------------------------------------

function MatrixCell({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleBlur = (e) => {
    if (!wrapperRef.current?.contains(e.relatedTarget)) setOpen(false);
  };

  return (
    <div ref={wrapperRef} onBlur={handleBlur} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`grid h-9 w-9 place-items-center rounded-lg border text-[13px] font-semibold transition-transform hover:scale-105 ${getCellStyles(
          value
        )}`}
      >
        {value}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-1/2 z-20 mt-1.5 flex -translate-x-1/2 gap-1 rounded-xl border border-white/70 bg-white/95 p-1.5 shadow-lg backdrop-blur-xl"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`grid h-8 w-8 place-items-center rounded-lg border text-[12px] font-semibold transition-opacity hover:opacity-80 ${getCellStyles(
                  opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MeshBackground — fixed, full-screen blurred pastel mesh
// ---------------------------------------------------------------------------

function MeshBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
      <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-pink-200 opacity-60 blur-3xl" />
      <div className="absolute top-0 right-0 h-[380px] w-[380px] rounded-full bg-violet-200 opacity-60 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-[460px] w-[460px] rounded-full bg-sky-200 opacity-60 blur-3xl" />
      <div className="absolute bottom-10 right-1/4 h-[300px] w-[300px] rounded-full bg-purple-100 opacity-50 blur-3xl" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// MetaCard & LegendCard — glass info strip above the matrix
// ---------------------------------------------------------------------------

function MetaCard({ course }) {
  return (
    <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/70 bg-white/50 px-5 py-3.5 shadow-sm backdrop-blur-xl">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500">
        <BookOpen className="h-4.5 w-4.5 text-white" size={17} />
      </span>
      <div className="text-[13.5px] text-ink">
        <span className="font-semibold">{course.title}</span>{" "}
        <span className="text-slate-500">({course.id})</span>
        <span className="mx-2 text-slate-300">|</span>
        <span className="inline-flex items-center gap-1 text-slate-500">
          <Calendar size={13} /> Academic Year: {course.academicYear}
        </span>
      </div>
    </div>
  );
}

function LegendCard() {
  const items = [
    { value: "3", label: "Substantial" },
    { value: "2", label: "Moderate" },
    { value: "1", label: "Slight" },
    { value: "-", label: "None" },
  ];

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/50 px-4 py-3.5 shadow-sm backdrop-blur-xl">
      <Info size={14} className="shrink-0 text-slate-400" />
      <div className="flex items-center gap-3">
        {items.map(({ value, label }) => (
          <div key={value} className="flex items-center gap-1.5">
            <span
              className={`grid h-5 w-5 place-items-center rounded-md border text-[10px] font-semibold ${getCellStyles(
                value
              )}`}
            >
              {value}
            </span>
            <span className="text-[11.5px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BottomActionBar — sticky footer with the three CTAs
// ---------------------------------------------------------------------------

function BottomActionBar({ onSave, status }) {
  return (
    <div className="sticky bottom-0 inset-x-0 z-30 border-t border-white/60 bg-white/70 px-6 py-4 shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.15)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-[13.5px] font-semibold text-slate-600 transition-colors hover:bg-white"
        >
          <ArrowLeft size={16} />
          Back to Upload
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-[13.5px] font-semibold text-slate-600 transition-colors hover:bg-white disabled:opacity-60"
        >
          {status === "saving" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : status === "saved" ? (
            <Check size={16} className="text-emerald-600" />
          ) : (
            <Save size={16} />
          )}
          {status === "saved" ? "Saved" : "Save Draft"}
        </button>

        <motion.button
          type="button"
          animate={{
            boxShadow: [
              "0 0 0px rgba(79,70,229,0.35)",
              "0 0 24px rgba(79,70,229,0.55)",
              "0 0 0px rgba(79,70,229,0.35)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 px-5 py-2.5 text-[13.5px] font-semibold text-white"
        >
          Next Step: Configure Evaluation
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function CoPoMatrixDashboard() {
  const { course, cos, pos, options, matrix, updateCell, saveDraft, status } =
    useCoPoMatrix("23CSE201");

  return (
    <div className="relative flex min-h-screen flex-col">
      <MeshBackground />

      <div className="flex-1 px-4 pb-10 pt-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-5 font-display text-2xl font-bold text-ink">
            CO-PO Affinity Matrix
          </h1>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <MetaCard course={course} />
            <LegendCard />
          </div>

          <div className="rounded-3xl border border-white bg-white/50 p-6 shadow-xl backdrop-blur-2xl sm:p-8">
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[900px]">
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `110px repeat(${pos.length}, 64px)`,
                  }}
                >
                  <div />
                  {pos.map((po) => (
                    <div
                      key={po}
                      className="py-2 text-center text-[12px] font-semibold text-slate-500"
                    >
                      {po}
                    </div>
                  ))}
                </div>

                {cos.map((co, r) => (
                  <div
                    key={co}
                    className="grid items-center border-t border-slate-100/70 first:border-t-0"
                    style={{
                      gridTemplateColumns: `110px repeat(${pos.length}, 64px)`,
                    }}
                  >
                    <div className="py-2 text-[13.5px] font-semibold text-ink">
                      {co}
                    </div>
                    {pos.map((po, c) => (
                      <div key={po} className="flex justify-center py-2">
                        <MatrixCell
                          value={matrix[r]?.[c] ?? "-"}
                          options={options}
                          onChange={(value) => updateCell(r, c, value)}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomActionBar onSave={saveDraft} status={status} />
    </div>
  );
}
