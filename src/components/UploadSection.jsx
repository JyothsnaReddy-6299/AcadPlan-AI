import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";
import {
  UploadCloud, FileText, ArrowRight, Network,
  CheckCircle2, XCircle, Loader2, File
} from "lucide-react";
import { uploadSyllabus } from "../lib/Api";

// ── Constants ──────────────────────────────────────────────────────────────
const RING_ICONS = [FileText, ArrowRight, Network, FileText, ArrowRight, Network];
const RADIUS = 82;       // px from button center
const DEG_PER_SEC = 42;  // constant angular speed

// ── DragZone background grid ────────────────────────────────────────────────
function GridLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.06]"
      aria-hidden
    >
      <defs>
        <pattern id="upload-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-600" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#upload-grid)" />
    </svg>
  );
}

// ── Status feedback pill ────────────────────────────────────────────────────
function StatusPill({ status, fileName }) {
  const config = {
    uploading: {
      icon: <Loader2 size={15} className="animate-spin text-indigo-500" />,
      text: `Uploading ${fileName}…`,
      bg: "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800/50",
      textClass: "text-indigo-700 dark:text-indigo-300",
    },
    success: {
      icon: <CheckCircle2 size={15} className="text-emerald-500" />,
      text: `${fileName} uploaded!`,
      bg: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50",
      textClass: "text-emerald-700 dark:text-emerald-300",
    },
    error: {
      icon: <XCircle size={15} className="text-red-500" />,
      text: "Server unreachable — check if it's running",
      bg: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800/50",
      textClass: "text-red-600 dark:text-red-400",
    },
  };
  const c = config[status];
  if (!c) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium ${c.bg} ${c.textClass}`}
    >
      {c.icon}
      {c.text}
    </motion.div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function UploadSection() {
  const navigate   = useNavigate();
  const [hovered, setHovered]   = useState(false);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus]     = useState("idle");
  const [fileName, setFileName] = useState("");

  const rotate = useMotionValue(0);
  const activeAnim = useRef(null);
  const fileInputRef = useRef(null);

  // ── Ring animation — constant speed, no snap-back ────────────────────────
  const startSpin = useCallback(() => {
    const current = rotate.get();
    const target  = current + 360 * 400;
    const duration = (360 * 400) / DEG_PER_SEC;
    activeAnim.current = animate(rotate, target, { duration, ease: "linear" });
  }, [rotate]);

  const stopSpin = useCallback(() => {
    activeAnim.current?.stop();
  }, []);

  useEffect(() => () => activeAnim.current?.stop(), []);

  // ── File handling ─────────────────────────────────────────────────────────
  const sendFile = useCallback(async (file) => {
    if (!file) return;
    setFileName(file.name);
    setStatus("uploading");
    try {
      const result = await uploadSyllabus(file);
      setStatus("success");
      setTimeout(() => navigate(result?.nextRoute ?? "/cdp-review"), 800);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, [navigate]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    sendFile(e.dataTransfer.files?.[0]);
  }, [sendFile]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setDragging(true); }, []);
  const handleDragLeave = useCallback(() => setDragging(false), []);
  const handleFileChange = useCallback((e) => sendFile(e.target.files?.[0]), [sendFile]);

  return (
    <section id="upload" className="relative bg-white dark:bg-gray-950 px-4 sm:px-6 py-20 sm:py-28 overflow-hidden transition-colors">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 grad-mesh opacity-40 dark:opacity-20" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        className="mx-auto max-w-4xl"
      >
        {/* ── Card shell ── */}
        <div className="relative rounded-3xl border border-white/80 dark:border-gray-800/80 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl shadow-[0_12px_60px_-16px_rgba(79,70,229,0.18)] dark:shadow-[0_12px_60px_-16px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Subtle inner top highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

          {/* Card header */}
          <div className="px-6 sm:px-10 pt-8 pb-6 border-b border-slate-100/80 dark:border-gray-800/60">
            <div className="flex items-center gap-3">
              <span className="inline-grid h-9 w-9 place-items-center rounded-xl grad-brand shadow-glow-sm">
                <UploadCloud className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
              </span>
              <div>
                <p className="font-display font-bold text-[15px] text-ink dark:text-gray-100">
                  Syllabus Upload
                </p>
                <p className="text-[12.5px] text-slate-400 dark:text-gray-500">
                  PDF or DOCX · Max 20 MB
                </p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1 text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AI Ready
              </span>
            </div>
          </div>

          {/* ── Drop zone ── */}
          <div className="p-6 sm:p-10">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload syllabus file"
            />
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all duration-300 ${
                dragging
                  ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[1.01]"
                  : "border-indigo-200/70 dark:border-gray-700 bg-white/50 dark:bg-gray-900/40 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10"
              }`}
            >
              <GridLines />

              <div className="relative px-6 py-14 sm:py-16 text-center">
                {/* ── Rotating icon ring ── */}
                <div
                  className="relative mx-auto grid h-[160px] w-[160px] place-items-center"
                  onMouseEnter={() => { setHovered(true); startSpin(); }}
                  onMouseLeave={() => { setHovered(false); stopSpin(); }}
                >
                  {/* Outer glow ring — CSS only, no JS */}
                  <div className={`absolute inset-0 rounded-full transition-all duration-500 ${hovered || dragging ? "opacity-100 scale-110" : "opacity-0 scale-100"} bg-indigo-500/5 blur-xl will-transform`} />

                  {/* Rotating icon container */}
                  <motion.div
                    style={{ rotate, transformOrigin: "50% 50%" }}
                    className="absolute inset-0 will-transform"
                  >
                    {RING_ICONS.map((Icon, i) => {
                      const angle = (360 / RING_ICONS.length) * i;
                      return (
                        <span
                          key={i}
                          className="absolute left-1/2 top-1/2 transition-all duration-500"
                          style={{
                            opacity: hovered || dragging ? 0.6 : 0,
                            transform: `translate(-50%,-50%) rotate(${angle}deg) translateY(-${
                              hovered || dragging ? RADIUS : 0
                            }px) rotate(${-angle}deg)`,
                          }}
                        >
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white dark:bg-gray-800 shadow-card border border-slate-100 dark:border-gray-700">
                            <Icon size={15} className="text-indigo-500" strokeWidth={2} />
                          </span>
                        </span>
                      );
                    })}
                  </motion.div>

                  {/* Upload button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl grad-brand shadow-glow animate-pulse-glow will-transform focus-ring"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    aria-label="Browse file"
                  >
                    {status === "uploading" ? (
                      <Loader2 className="h-7 w-7 text-white animate-spin" strokeWidth={2.5} />
                    ) : (
                      <UploadCloud className="h-7 w-7 text-white" strokeWidth={2.25} />
                    )}
                  </motion.button>
                </div>

                {/* Text */}
                <h3 className="mt-6 font-display font-bold text-lg text-ink dark:text-gray-100">
                  {dragging ? "Drop to upload" : "Upload Syllabus"}
                </h3>
                <p className="mt-2 text-[14px] text-slate-500 dark:text-gray-400">
                  Drag & drop your document here, or{" "}
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 underline underline-offset-2">
                    browse
                  </span>
                </p>

                {/* Format badge */}
                <div className="mt-4 inline-flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-gray-800 px-3 py-1 font-mono text-[11px] font-medium text-slate-500 dark:text-gray-400">
                    <File size={11} /> PDF
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-gray-800 px-3 py-1 font-mono text-[11px] font-medium text-slate-500 dark:text-gray-400">
                    <File size={11} /> DOCX
                  </span>
                </div>

                {/* Status feedback */}
                <AnimatePresence mode="wait">
                  <StatusPill key={status} status={status} fileName={fileName} />
                </AnimatePresence>
              </div>
            </div>

            {/* ── How it works row ── */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { step: "01", label: "Upload Syllabus" },
                { step: "02", label: "AI Extraction" },
                { step: "03", label: "Review & Export" },
              ].map(({ step, label }, i) => (
                <div
                  key={step}
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-slate-50/80 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-700/50 p-3 text-center"
                >
                  <span className="font-mono text-[11px] font-bold text-indigo-500 dark:text-indigo-400">{step}</span>
                  <span className="text-[12px] font-medium text-slate-600 dark:text-gray-300">{label}</span>
                  {i < 2 && (
                    <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-gray-600 hidden" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
