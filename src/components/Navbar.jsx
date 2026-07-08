import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import RealTimeClock from "./RealTimeClock";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ticking = useRef(false);

  // Compositor-thread-safe scroll listener using rAF batching
  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 16);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-5 py-2.5 transition-all duration-300 ${
            scrolled
              ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl shadow-nav border border-white/60 dark:border-gray-800/80"
              : "bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl border border-white/40 dark:border-gray-800/50"
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 focus-ring rounded-lg"
            aria-label="AcadPlan AI home"
          >
            <span className="relative grid h-8 w-8 place-items-center rounded-xl grad-brand shadow-glow-sm transition-all duration-300 group-hover:shadow-glow">
              <GraduationCap className="h-[18px] w-[18px] text-white" strokeWidth={2.25} />
              {/* Subtle pulse ring */}
              <span className="absolute inset-0 rounded-xl grad-brand opacity-0 group-hover:opacity-100 animate-pulse-glow transition-opacity duration-300" />
            </span>
            <span className="font-display font-bold text-[15px] tracking-tight grad-brand-text transition-all duration-300">
              AcadPlan AI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="flex items-center gap-4 sm:gap-5" role="navigation">
            <a
              href="#features"
              className="hidden sm:inline text-[13.5px] font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors duration-200 focus-ring rounded"
            >
              Features
            </a>
            <a
              href="#upload"
              className="hidden sm:inline text-[13.5px] font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors duration-200 focus-ring rounded"
            >
              Upload
            </a>

            <span className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-gray-700" />

            <div className="hidden sm:block">
              <RealTimeClock />
            </div>

            <span className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-gray-700" />

            <ThemeToggle />

            <Link
              to="/signin"
              className="btn-lift inline-flex items-center gap-1.5 rounded-full grad-brand px-4 py-1.5 text-[13.5px] font-semibold text-white shadow-glow-sm hover:shadow-glow focus-ring"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}