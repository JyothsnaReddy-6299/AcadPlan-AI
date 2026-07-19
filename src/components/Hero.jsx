import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { ArrowRight, Sparkles, X, UploadCloud, File, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadSyllabus } from "../lib/Api";

// ── Upload Modal ───────────────────────────────────────────────────────────
function UploadModal({ onClose }) {
  const navigate = useNavigate();
  const [dragging, setDragging]   = useState(false);
  const [status, setStatus]       = useState("idle");
  const [fileName, setFileName]   = useState("");
  const fileInputRef              = useRef(null);

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

  const handleDrop      = useCallback((e) => { e.preventDefault(); setDragging(false); sendFile(e.dataTransfer.files?.[0]); }, [sendFile]);
  const handleDragOver  = useCallback((e) => { e.preventDefault(); setDragging(true); }, []);
  const handleDragLeave = useCallback(() => setDragging(false), []);
  const handleFileChange = useCallback((e) => sendFile(e.target.files?.[0]), [sendFile]);

  const statusConfig = {
    uploading: { icon: <Loader2 size={15} className="animate-spin" style={{color:"hsl(84 25% 45%)"}} />, text: `Uploading ${fileName}…`, bg: "bg-sage-light border-sage text-sage-dk" },
    success:   { icon: <CheckCircle2 size={15} className="text-emerald-600" />, text: `${fileName} uploaded!`, bg: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    error:     { icon: <XCircle size={15} className="text-red-500" />, text: "Upload failed — please try again", bg: "bg-red-50 border-red-200 text-red-600" },
  };
  const pill = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(60,68,48,0.45)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "var(--bg-surface)", border: "1.5px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <span className="inline-grid h-9 w-9 place-items-center rounded-xl grad-brand shadow-sm">
              <UploadCloud className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
            </span>
            <div>
              <p className="font-display font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>Syllabus Upload</p>
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>PDF, DOCX or JSON · Max 20 MB</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold"
            style={{ background: "hsl(84 18% 88%)", color: "hsl(84 25% 38%)", border: "1px solid hsl(84 18% 72%)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Ready
          </span>
          <button onClick={onClose} className="ml-3 grid h-8 w-8 place-items-center rounded-full hover:bg-black/8 transition-colors focus-ring" aria-label="Close">
            <X size={16} style={{ color: "hsl(90 12% 38%)" }} />
          </button>
        </div>

        {/* Drop zone */}
        <div className="px-6 py-6">
          <input ref={fileInputRef} type="file" accept=".pdf,.docx,.json" onChange={handleFileChange} className="hidden" aria-label="Upload syllabus file" />
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className="relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden"
            style={{
              borderColor: dragging ? "hsl(84 25% 45%)" : "var(--border)",
              background: dragging ? "var(--bg-muted)" : "var(--bg-page)",
            }}
          >
            <div className="px-6 py-12 text-center">
              <div className="mx-auto mb-5 inline-grid h-16 w-16 place-items-center rounded-2xl grad-brand shadow-md animate-pulse-glow">
                {status === "uploading"
                  ? <Loader2 className="h-7 w-7 text-white animate-spin" strokeWidth={2.5} />
                  : <UploadCloud className="h-7 w-7 text-white" strokeWidth={2.25} />
                }
              </div>
              <h3 className="font-display font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                {dragging ? "Drop to upload" : "Upload Syllabus"}
              </h3>
              <p className="mt-2 text-[14px]" style={{ color: "var(--text-muted)" }}>
                Drag & drop your document here, or{" "}
                <span className="font-semibold underline underline-offset-2" style={{ color: "hsl(84 25% 42%)" }}>browse</span>
              </p>
              <div className="mt-4 inline-flex items-center gap-2">
                {["PDF","DOCX","JSON"].map(fmt => (
                  <span key={fmt} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-medium"
                    style={{ background: "var(--bg-muted)", color: "hsl(84 18% 40%)" }}>
                    <File size={11} /> {fmt}
                  </span>
                ))}
              </div>
              {pill && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium ${pill.bg}`}
                >
                  {pill.icon} {pill.text}
                </motion.div>
              )}
            </div>
          </div>

          {/* Steps row */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[{ step: "01", label: "Upload Syllabus" }, { step: "02", label: "AI Extraction" }, { step: "03", label: "Review & Export" }].map(({ step, label }) => (
              <div key={step} className="flex flex-col items-center gap-1.5 rounded-xl p-3 text-center"
                style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
                <span className="font-mono text-[11px] font-bold" style={{ color: "hsl(84 25% 42%)" }}>{step}</span>
                <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Animated stat pill ──────────────────────────────────────────────────────
function StatPill({ value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      <span className="font-display font-extrabold text-2xl grad-brand-text">{value}</span>
      <span className="text-[11.5px] font-medium mt-0.5" style={{ color: "var(--text-faint)" }}>{label}</span>
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });

  const bgY      = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade     = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const yContent = useTransform(scrollYProgress, [0, 0.6], ["0%", "8%"]);

  return (
    <>
      {/* Upload Modal */}
      <AnimatePresence>
        {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      </AnimatePresence>

      <section
        ref={containerRef}
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        style={{ background: "var(--bg-page)" }}
      >
        {/* ── Background layers ── */}
        <motion.div
          style={{ y: bgY }}
          className="pointer-events-none absolute inset-0 will-transform gpu"
          aria-hidden
        >
          <div className="absolute inset-0 grad-mesh opacity-90" />
          <div className="absolute inset-0 dot-grid opacity-[0.06]" style={{ backgroundSize: "28px 28px" }} />
          <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full blur-[80px] will-transform animate-float-slow"
            style={{ background: "hsl(84 18% 66% / 0.22)" }} />
          <div className="absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full blur-[80px] will-transform animate-float"
            style={{ background: "hsl(43 55% 80% / 0.35)", animationDelay: "1.8s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[320px] w-[320px] rounded-full blur-[60px] will-transform animate-float-slow"
            style={{ background: "hsl(84 18% 74% / 0.20)", animationDelay: "0.9s" }} />
        </motion.div>

        {/* ── Content ── */}
        <motion.div
          style={{ opacity: fade, y: yContent }}
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 text-center will-transform"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 shadow-sm"
            style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: "hsl(84 25% 40%)" }} strokeWidth={2} />
            <span className="text-[12.5px] font-semibold tracking-wide" style={{ color: "hsl(84 25% 38%)" }}>
              AI-Powered Academic Planning
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="font-display font-extrabold tracking-tight leading-[1.07]"
          >
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
              AcadPlan AI
            </span>
            <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: "var(--text-muted)" }}>
              Plan Smarter, Map Faster
            </span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-[16px] sm:text-[17px] leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Upload your syllabus and instantly generate CO-PO mapping matrices,
            visual concept maps, and accreditation-ready documentation — powered by AI.
          </motion.p>

          {/* CTA — only Upload Syllabus button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34, ease: "easeOut" }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => setUploadOpen(true)}
              className="btn-lift group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[15px] font-semibold text-white shadow-md hover:shadow-lg focus-ring grad-brand"
            >
              Upload Syllabus
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-14 inline-flex items-center gap-8 rounded-2xl px-8 py-5 shadow-sm"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <StatPill value="12 POs"  label="Auto-mapped"    delay={0.55} />
            <span className="h-8 w-px" style={{ background: "var(--border)" }} />
            <StatPill value="< 30s"   label="Generation time" delay={0.62} />
            <span className="h-8 w-px" style={{ background: "var(--border)" }} />
            <StatPill value="PDF"     label="Export ready"    delay={0.69} />
          </motion.div>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-10 flex items-center justify-center gap-2"
          >
            <span className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, hsl(84 18% 60% / 0.5))" }} />
            <span className="h-2 w-2 rounded-full grad-brand opacity-70" />
            <span className="h-px w-4" style={{ background: "linear-gradient(to left, transparent, hsl(84 18% 65% / 0.5))" }} />
            <span className="h-2.5 w-2.5 rounded-full grad-brand" />
            <span className="h-px w-4" style={{ background: "linear-gradient(to right, transparent, hsl(84 18% 65% / 0.5))" }} />
            <span className="h-2 w-2 rounded-full grad-brand opacity-70" />
            <span className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, hsl(84 18% 60% / 0.5))" }} />
          </motion.div>
        </motion.div>

        {/* Bottom fade-out gradient */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-40"
          style={{ background: "linear-gradient(to top, var(--bg-page), transparent)" }} />
      </section>
    </>
  );
}
