import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

// ── Floating badge component ───────────────────────────────────────────────
function Badge({ delay, className, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className={`absolute hidden lg:flex items-center gap-2 rounded-2xl glass-adaptive dark:glass-dark px-3.5 py-2.5 shadow-card text-[12.5px] font-medium ${className}`}
    >
      {children}
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
      <span className="text-[11.5px] text-slate-500 dark:text-gray-400 font-medium mt-0.5">{label}</span>
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });

  // Compositor-only transforms: only transform + opacity (never top/left)
  const bgY  = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const yContent = useTransform(scrollYProgress, [0, 0.6], ["0%", "8%"]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ivory dark:bg-gray-950 pt-20"
    >
      {/* ── Background layers (compositor-only parallax) ── */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 will-transform gpu"
        aria-hidden
      >
        {/* Animated mesh gradients */}
        <div className="absolute inset-0 grad-mesh opacity-80 dark:opacity-50" />

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 dot-grid opacity-[0.055] dark:opacity-[0.035]"
          style={{ backgroundSize: "28px 28px" }}
        />

        {/* Large glowing orbs — GPU promoted via will-change: transform */}
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-5xl will-transform animate-float-slow" />
        <div className="absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-teal-400/10 dark:bg-teal-500/10 blur-5xl will-transform animate-float" style={{ animationDelay: "1.8s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[320px] w-[320px] rounded-full bg-violet-500/8 dark:bg-violet-600/8 blur-4xl will-transform animate-float-slow" style={{ animationDelay: "0.9s" }} />
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
          className="inline-flex items-center gap-2 rounded-full glass-adaptive dark:glass-dark px-4 py-1.5 mb-8 shadow-card border border-indigo-100/60 dark:border-indigo-900/40"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
          <span className="text-[12.5px] font-semibold text-indigo-700 dark:text-indigo-300 tracking-wide">
            AI-Powered Academic Planning
          </span>
        </motion.div>

        {/* H1 — no layout-triggering animation on text itself */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          className="font-display font-extrabold tracking-tight leading-[1.07]"
        >
          {/* Animated shimmer text — compositor-only via background-position */}
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl animate-text-shimmer">
            AcadPlan AI
          </span>
          <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-600 dark:text-gray-300">
            Plan Smarter, Map Faster
          </span>
        </motion.h1>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-[16px] sm:text-[17px] leading-relaxed text-slate-500 dark:text-gray-400"
        >
          Upload your syllabus and instantly generate CO-PO mapping matrices,
          visual concept maps, and accreditation-ready documentation — powered by AI.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.34, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#upload"
            className="btn-lift group inline-flex items-center gap-2.5 rounded-full grad-brand px-7 py-3.5 text-[15px] font-semibold text-white shadow-glow hover:shadow-glow-lg focus-ring"
          >
            Upload Syllabus
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <Link
            to="/signin"
            className="btn-lift inline-flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 px-7 py-3.5 text-[15px] font-semibold text-slate-700 dark:text-gray-200 shadow-card hover:shadow-card-hover focus-ring"
          >
            Sign In Free
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-14 inline-flex items-center gap-8 rounded-2xl glass-adaptive dark:glass-dark px-8 py-5 shadow-card"
        >
          <StatPill value="12 POs" label="Auto-mapped" delay={0.55} />
          <span className="h-8 w-px bg-slate-200 dark:bg-gray-700" />
          <StatPill value="< 30s" label="Generation time" delay={0.62} />
          <span className="h-8 w-px bg-slate-200 dark:bg-gray-700" />
          <StatPill value="PDF" label="Export ready" delay={0.69} />
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-10 flex items-center justify-center gap-2"
        >
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-indigo-400/60" />
          <span className="h-2 w-2 rounded-full grad-brand opacity-70" />
          <span className="h-px w-4 bg-gradient-to-l from-transparent to-violet-400/60" />
          <span className="h-2.5 w-2.5 rounded-full grad-brand" />
          <span className="h-px w-4 bg-gradient-to-r from-transparent to-violet-400/60" />
          <span className="h-2 w-2 rounded-full grad-brand opacity-70" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-teal-400/60" />
        </motion.div>
      </motion.div>

      {/* ── Floating context badges ── */}
      <Badge delay={0.8} className="top-[28%] left-[8%] text-slate-700 dark:text-gray-200 animate-float">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        CO-PO Matrix
      </Badge>
      <Badge delay={0.9} className="top-[38%] right-[7%] text-slate-700 dark:text-gray-200 animate-float" style={{ animationDelay: "1.2s" }}>
        <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
        Concept Maps
      </Badge>
      <Badge delay={1.0} className="bottom-[25%] left-[10%] text-slate-700 dark:text-gray-200 animate-float" style={{ animationDelay: "2.4s" }}>
        <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
        PDF Export
      </Badge>

      {/* Bottom fade-out gradient for smooth section transition */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
    </section>
  );
}
