import { motion } from "framer-motion";
import { Network, Map, FileDown, Zap, Shield, Clock } from "lucide-react";

const FEATURES = [
  {
    icon: Network,
    gradient: "linear-gradient(135deg, hsl(84 25% 40%), hsl(84 18% 60%))",
    tag: "Core",
    title: "Automated CO-PO Mapping",
    description:
      "Automatically generate Course Outcomes to Program Outcomes matrices — saving hours of manual work with perfect alignment to accreditation standards.",
  },
  {
    icon: Map,
    gradient: "linear-gradient(135deg, hsl(84 18% 55%), hsl(84 15% 70%))",
    tag: "Visual",
    title: "AI Concept Maps",
    description:
      "Transform syllabi into visual concept maps that clearly illustrate relationships between topics, learning objectives, and assessment criteria.",
  },
  {
    icon: FileDown,
    gradient: "linear-gradient(135deg, hsl(84 20% 50%), hsl(84 18% 66%))",
    tag: "Export",
    title: "Instant PDF Export",
    description:
      "Download your generated maps, reports, and documentation as professional PDFs — submission-ready in seconds.",
  },
  {
    icon: Zap,
    gradient: "linear-gradient(135deg, hsl(38 80% 55%), hsl(38 60% 68%))",
    tag: "Speed",
    title: "Lightning Fast",
    description:
      "Our AI pipeline processes your entire syllabus in under 30 seconds, delivering comprehensive outputs without the wait.",
  },
  {
    icon: Shield,
    gradient: "linear-gradient(135deg, hsl(150 40% 40%), hsl(150 30% 55%))",
    tag: "Compliance",
    title: "Accreditation Ready",
    description:
      "Every output follows NBA/NAAC/ABET formatting guidelines — so your documents pass review without revisions.",
  },
  {
    icon: Clock,
    gradient: "linear-gradient(135deg, hsl(0 45% 52%), hsl(0 35% 65%))",
    tag: "Productivity",
    title: "Saves 10+ Hours/Week",
    description:
      "Faculty reclaim significant prep time each week by automating the most tedious parts of academic documentation.",
  },
];

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
};

export default function FeatureCards() {
  return (
    <section id="features" className="relative px-4 sm:px-6 py-24 sm:py-32 overflow-hidden transition-colors"
      style={{ background: "var(--bg-page)" }}>
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 grad-mesh opacity-70" aria-hidden />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px" aria-hidden
        style={{ background: "linear-gradient(to right, transparent, hsl(84 18% 68% / 0.5), transparent)" }} />

      <div className="relative mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center mb-14 sm:mb-20"
        >
          <span className="inline-block rounded-full px-4 py-1 text-[12px] font-semibold uppercase tracking-widest mb-4"
            style={{ background: "var(--bg-muted)", color: "hsl(84 25% 38%)", border: "1px solid var(--border)" }}>
            Features
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight leading-[1.15]"
            style={{ color: "var(--text-primary)" }}>
            Everything you need{" "}
            <span className="grad-brand-text">in one platform</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
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
          {FEATURES.map(({ icon: Icon, gradient, tag, title, description }) => (
            <motion.article
              key={title}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] } }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-300"
              style={{
                background: "var(--bg-surface)",
                border: "1.5px solid var(--border)",
                boxShadow: "0 4px 20px -6px rgba(60,68,48,0.10)",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 14px 40px -10px rgba(60,68,48,0.18)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 20px -6px rgba(60,68,48,0.10)"}
            >
              {/* Top gradient line on hover */}
              <div className="absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: gradient }} />

              <div className="relative p-6 sm:p-7">
                {/* Tag */}
                <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide mb-5"
                  style={{ background: "var(--bg-muted)", color: "hsl(84 20% 42%)" }}>
                  {tag}
                </span>

                {/* Icon */}
                <div className="inline-grid h-11 w-11 place-items-center rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 will-transform"
                  style={{ background: gradient }}>
                  <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                </div>

                <h3 className="mt-4 font-display font-semibold text-[15.5px] leading-snug transition-colors duration-200"
                  style={{ color: "var(--text-primary)" }}>
                  {title}
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {description}
                </p>

              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}