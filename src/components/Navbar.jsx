import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import RealTimeClock from "./RealTimeClock";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ticking = useRef(false);

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
            scrolled ? "navbar-scrolled" : "navbar-top"
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 focus-ring rounded-lg"
            aria-label="AcadPlan AI home"
          >
            <span className="relative grid h-8 w-8 place-items-center rounded-xl grad-brand shadow-sm transition-all duration-300 group-hover:shadow-md">
              <GraduationCap className="h-[18px] w-[18px] text-white" strokeWidth={2.25} />
            </span>
            <span className="font-display font-bold text-[15px] tracking-tight grad-brand-text transition-all duration-300">
              AcadPlan AI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="flex items-center gap-4 sm:gap-5" role="navigation">
            <a
              href="#features"
              className="hidden sm:inline text-[13.5px] font-medium transition-colors duration-200 focus-ring rounded"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
              onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
            >
              Features
            </a>

            <span className="hidden sm:block h-4 w-px" style={{ background: "var(--border)" }} />

            <div className="hidden sm:block">
              <RealTimeClock />
            </div>

            <span className="hidden sm:block h-4 w-px" style={{ background: "var(--border)" }} />

            <ThemeToggle />

            {localStorage.getItem("currentUser") ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    localStorage.removeItem("currentUser");
                    window.location.reload();
                  }}
                  title="Sign Out"
                  className="btn-lift flex h-8 w-8 items-center justify-center rounded-full font-bold text-white text-[14px] grad-brand shadow-sm hover:shadow-md focus-ring cursor-pointer uppercase"
                >
                  {(() => {
                    try {
                      const u = JSON.parse(localStorage.getItem("currentUser"));
                      return u?.name?.charAt(0) || "U";
                    } catch (e) {
                      return "U";
                    }
                  })()}
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="btn-lift inline-flex items-center gap-1.5 rounded-full grad-brand px-4 py-1.5 text-[13.5px] font-semibold text-white shadow-sm hover:shadow-md focus-ring"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}