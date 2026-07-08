import { motion } from "framer-motion";
import { Network, Map, FileDown } from "lucide-react";

const FEATURES = [
  {
    icon: Network,
    title: "Automated Mapping",
    description:
      "Automatically generate Course Outcomes to Program Outcomes mapping matrices, saving hours of manual work and ensuring accurate alignment with accreditation standards.",
  },
  {
    icon: Map,
    title: "AI Concept Maps",
    description:
      "Transform your syllabi into visual concept maps that clearly illustrate relationships between topics, learning objectives, and assessment criteria.",
  },
  {
    icon: FileDown,
    title: "Instant Export",
    description:
      "Download your generated maps, reports, and documentation as professional PDF files ready for submission to accreditation bodies.",
  },
];

export default function FeatureCards() {
  return (
    <section className="bg-ivory px-4 sm:px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink">
          Powerful Features
        </h2>
        <p className="mt-2 text-[14px] sm:text-[15px] text-slate-500">
          Streamline your academic planning workflow with our intelligent tools
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
              className="group rounded-2xl bg-slate-200/60 p-[1.5px] transition-all duration-300 hover:-translate-y-1.5 hover:bg-gradient-to-br hover:from-indigo-600 hover:via-violet-600 hover:to-teal-500 hover:shadow-xl hover:shadow-indigo-600/[0.10]"
            >
              <div className="h-full rounded-2xl bg-white p-7 text-left">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-teal-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                </span>
                <h3 className="mt-4 font-display font-semibold text-[15px] text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-500">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}