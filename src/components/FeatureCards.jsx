import { motion } from "framer-motion";
import { Network, Map, FileDown, Zap, Shield, Clock } from "lucide-react";

const FEATURES = [
  {
    icon: Network,
    accentClass: "from-indigo-500 to-violet-600",
    glowClass: "shadow-glow-violet",
    tag: "Core",
    title: "Automated CO-PO Mapping",
    description:
      "Automatically generate Course Outcomes to Program Outcomes matrices — saving hours of manual work with perfect alignment to accreditation standards.",
  },
  {
    icon: Map,
    accentClass: "from-violet-500 to-teal-500",
    glowClass: "shadow-glow-teal",
    tag: "Visual",
    title: "AI Concept Maps",
    description:
      "Transform syllabi into visual concept maps that clearly illustrate relationships between topics, learning objectives, and assessment criteria.",
  },
  {
    icon: FileDown,
    accentClass: "from-teal-500 to-indigo-500",
    glowClass: "shadow-glow-sm",
    tag: "Export",
    title: "Instant PDF Export",
    description:
      "Download your generated maps, reports, and documentation as professional PDFs — submission-ready in seconds.",
  },
  {
    icon: Zap,
    accentClass: "from-amber-500 to-orange-500",
    glowClass: "shadow-[0_0_28px_-6px_rgba(245,158,11,0.35)]",
    tag: "Speed",
    title: "Lightning Fast",
    description:
      "Our AI pipeline processes your entire syllabus in under 30 seconds, delivering comprehensive outputs without the wait.",
  },
  {
    icon: Shield,
    accentClass: "from-emerald-500 to-teal-600",
    glowClass: "shadow-[0_0_28px_-6px_rgba(16,185,129,0.35)]",
    tag: "Compliance",
    title: "Accreditation Ready",
    description:
      "Every output follows NBA/NAAC/ABET formatting guidelines — so your documents pass review without revisions.",
  },
  {
    icon: Clock,
    accentClass: "from-rose-500 to-pink-600",
    glowClass: "shadow-[0_0_28px_-6px_rgba(244,63,94,0.30)]",
    tag: "Productivity",
    title: "Saves 10+ Hours/Week",
    description:
      "Faculty reclaim significant prep time each week by automating the most tedious parts of academic documentation.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
};

export default function FeatureCards() {
  return (
    <section id="features" className="relative bg-ivory dark:bg-gray-950 px-4 sm:px-6 py-24 sm:py-32 overflow-hidden transition-colors">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 grad-mesh opacity-60 dark:opacity-30" aria-hidden />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center mb-14 sm:mb-20"
        >
          <span className="inline-block rounded-full glass-adaptive dark:glass-dark border border-indigo-100/50 dark:border-indigo-900/40 px-4 py-1 text-[12px] font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">
            Features
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-gray-50 tracking-tight leading-[1.15]">
            Everything you need{" "}
            <span className="grad-brand-text">in one platform</span>
          </h2>
          <p className="mt-4 text-[15px] text-slate-500 dark:text-gray-400 leading-relaxed">
            Streamline every step of your academic planning workflow with purpose-built intelligent tools.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map(({ icon: Icon, accentClass, glowClass, tag, title, description }) => (
            <motion.article
              key={title}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] } }}
              className="group relative rounded-2xl border border-white/70 dark:border-gray-800/80 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-card hover:shadow-card-hover overflow-hidden transition-shadow duration-300 cursor-pointer"
            >
              {/* Gradient hover overlay (GPU promoted) */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accentClass} opacity-0 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08] transition-opacity duration-400 will-opacity`}
              />

              {/* Top gradient line */}
              <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r ${accentClass} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />

              <div className="relative p-6 sm:p-7">
                {/* Tag */}
                <span className="inline-block rounded-full bg-slate-100 dark:bg-gray-800 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400 mb-5">
                  {tag}
                </span>

                {/* Icon */}
                <div className={`inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${accentClass} ${glowClass} shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg will-transform`}>
                  <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                </div>

                <h3 className="mt-4 font-display font-semibold text-[15.5px] text-ink dark:text-gray-100 leading-snug group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200">
                  {title}
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-500 dark:text-gray-400">
                  {description}
                </p>

                {/* Bottom arrow — appears on hover */}
                <div className="mt-5 flex items-center gap-1.5 text-[12.5px] font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-250 -translate-x-2 group-hover:translate-x-0 will-transform transition-transform">
                  <span>Learn more</span>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}