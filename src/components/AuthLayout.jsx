import { Link } from "react-router-dom";
import { GraduationCap, Network, Map, FileText, ArrowRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";

const FEATURE_BADGES = [
  { icon: Network, label: "CO-PO Matrix" },
  { icon: Map,     label: "Concept Maps" },
  { icon: FileText, label: "PDF Export" },
];

/**
 * AuthLayout — shared left panel + right form shell for SignIn / SignUp.
 * Left panel has a premium gradient background with animated decorations.
 */
export default function AuthLayout({ heading, subheading, children }) {
  return (
    <div className="flex min-h-screen bg-ivory dark:bg-gray-900 transition-colors">
      {/* ── Left brand panel ── */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden sm:flex"
        style={{
          background: "linear-gradient(145deg, hsl(220 90% 48%) 0%, hsl(262 83% 52%) 55%, hsl(174 72% 38%) 100%)",
        }}
      >
        {/* Noise overlay */}
        <div className="noise absolute inset-0" />

        {/* Dot grid texture */}
        <div
          className="pointer-events-none absolute inset-0 dot-grid-white opacity-[0.12]"
          style={{ backgroundSize: "26px 26px" }}
        />

        {/* Large orb decorations — GPU promoted */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl will-transform animate-float-slow" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl will-transform animate-float" style={{ animationDelay: "2s" }} />

        {/* Dark mode toggle */}
        <div className="absolute top-5 right-5 z-20">
          <ThemeToggle />
        </div>

        {/* ── Top: Logo ── */}
        <Link to="/" className="relative z-10 m-8 inline-flex items-center gap-2.5 focus-ring rounded-lg w-fit">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 backdrop-blur border border-white/30">
            <GraduationCap className="h-[18px] w-[18px] text-white" strokeWidth={2.25} />
          </span>
          <span className="font-display font-bold text-[15px] text-white tracking-tight">
            AcadPlan AI
          </span>
        </Link>

        {/* ── Middle: Value prop ── */}
        <div className="relative z-10 px-8 pb-10">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-display font-bold text-4xl leading-[1.15] text-white tracking-tight"
          >
            Plan smarter.
            <br />
            <span className="text-white/75">Map faster.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.55, ease: "easeOut" }}
            className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/70"
          >
            Turn your syllabus into accreditation-ready CO-PO mappings and
            concept maps — in a few clicks.
          </motion.p>

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-2.5"
          >
            {FEATURE_BADGES.map(({ icon: Icon, label }, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur border border-white/20 px-3.5 py-2 text-[13px] font-medium text-white"
              >
                <Icon className="h-4 w-4 text-white/80" strokeWidth={2} />
                {label}
              </motion.span>
            ))}
          </motion.div>

          {/* Testimonial-style quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-10 rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-4"
          >
            <p className="text-[13px] text-white/80 leading-relaxed italic">
              "AcadPlan AI saved our department over 40 hours of documentation work this semester."
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-[11px] font-bold text-white">Dr</span>
              <span className="text-[12.5px] text-white/70">Dr. Priya S., Head of CSE Dept.</span>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom: copyright ── */}
        <p className="relative z-10 px-8 pb-6 text-[12px] text-white/50">
          © {new Date().getFullYear()} AcadPlan AI
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex w-full flex-1 items-center justify-center bg-white dark:bg-gray-950 px-6 py-12 sm:w-[54%] transition-colors">
        <div className="w-full max-w-sm">
          {/* Mobile logo + theme toggle */}
          <div className="mb-8 flex items-center justify-between sm:hidden">
            <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-[15px] grad-brand-text focus-ring rounded">
              <span className="grid h-8 w-8 place-items-center rounded-xl grad-brand shadow-glow-sm">
                <GraduationCap className="h-4 w-4 text-white" strokeWidth={2.25} />
              </span>
              AcadPlan AI
            </Link>
            <ThemeToggle />
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="font-display font-bold text-2xl text-ink dark:text-gray-100">
              {heading}
            </h1>
            {subheading && (
              <p className="mt-1.5 text-[13.5px] text-slate-500 dark:text-gray-400">
                {subheading}
              </p>
            )}
          </motion.div>

          {/* Form content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="mt-8"
          >
            {children}
          </motion.div>

          {/* Back to home */}
          <div className="mt-8 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[12.5px] text-slate-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-ring rounded"
            >
              <ArrowRight className="h-3 w-3 rotate-180" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}