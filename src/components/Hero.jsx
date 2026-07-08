import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative bg-ivory pt-48 sm:pt-56 pb-32 sm:pb-40 px-4 text-center">
      {/* dot-grid, contained to this section only */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, #312E81 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto max-w-7xl"
      >
        <h1 className="font-display font-extrabold tracking-tight text-[15vw] sm:text-6xl md:text-7xl leading-[1.05] bg-gradient-to-r from-indigo-600 via-violet-600 to-teal-500 bg-clip-text text-transparent">
          AcadPlan AI
        </h1>

        <p className="mt-4 text-[15px] sm:text-base text-slate-500 font-medium">
          plan your academics in few steps
        </p>

        {/* divider: dash - dot - dash, matches the mapping/sequence motif */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-indigo-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-teal-400" />
        </div>
      </motion.div>
    </section>
  );
}