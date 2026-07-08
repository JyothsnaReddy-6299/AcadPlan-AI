import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GooeyText from "./GooeyText";
import { GraduationCap } from "lucide-react";

const SPLASH_TEXTS = [
  "AcadPlan AI",
  "Plan Smarter",
  "Map Faster",
  "Accredit Confidently",
];

// Orbiting dot for visual flair — CSS-only animation
function OrbitDot({ delay, radius, duration, size = 4, colorClass = "bg-indigo-500" }) {
  return (
    <span
      className={`absolute ${colorClass} rounded-full will-transform`}
      style={{
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        marginLeft: -(size / 2),
        marginTop: -(size / 2),
        "--orbit-r": `${radius}px`,
        animation: `orbit ${duration}s linear ${delay}s infinite`,
      }}
    />
  );
}

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);
  const [hint, setHint]       = useState(false);

  useEffect(() => {
    // Show "click to skip" hint after 1.2s
    const hintTimer = setTimeout(() => setHint(true), 1200);
    // Auto-dismiss after 5s
    const exitTimer = setTimeout(() => setVisible(false), 5000);
    return () => { clearTimeout(hintTimer); clearTimeout(exitTimer); };
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => setVisible(false)}
          aria-label="Loading splash screen — click to skip"
          role="banner"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-ivory dark:bg-gray-950 transition-colors" />
          <div className="absolute inset-0 grad-mesh opacity-70 dark:opacity-50" />
          <div
            className="absolute inset-0 dot-grid opacity-[0.05]"
            style={{ backgroundSize: "28px 28px" }}
          />

          {/* Large ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-5xl will-transform" />

          {/* Logo mark with orbit */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative mb-12 will-transform"
          >
            <div className="relative">
              {/* Orbit dots */}
              <OrbitDot radius={44} duration={4} delay={0} colorClass="bg-indigo-500/80" />
              <OrbitDot radius={44} duration={4} delay={-2} colorClass="bg-violet-500/60" size={3} />
              <OrbitDot radius={60} duration={7} delay={-1} colorClass="bg-teal-500/50" size={3} />

              {/* Logo button */}
              <div className="relative grid h-20 w-20 place-items-center rounded-[22px] grad-brand shadow-glow-lg animate-pulse-glow">
                <GraduationCap className="h-9 w-9 text-white" strokeWidth={2} />
              </div>
            </div>
          </motion.div>

          {/* Gooey morphing text */}
          <GooeyText
            texts={SPLASH_TEXTS}
            morphTime={1.6}
            cooldownTime={0.6}
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.55, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-6 text-[14px] font-medium text-slate-500 dark:text-gray-400"
          >
            AI-Powered Academic Planning
          </motion.p>

          {/* Progress bar */}
          <motion.div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-[2px] rounded-full bg-slate-200 dark:bg-gray-800 overflow-hidden">
            <motion.div
              className="h-full grad-brand rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 5, ease: "linear" }}
              style={{ transformOrigin: "left" }}
            />
          </motion.div>

          {/* Skip hint */}
          <AnimatePresence>
            {hint && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 0.4, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-8 text-[12px] text-slate-400 dark:text-gray-500 tracking-wide"
              >
                Click anywhere to continue
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
