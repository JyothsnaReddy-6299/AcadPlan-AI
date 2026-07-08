import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4">
        <div className="flex items-center justify-between rounded-2xl border border-ink/5 bg-white/70 backdrop-blur-xl px-4 sm:px-6 py-3 shadow-[0_1px_0_0_rgba(15,23,42,0.04)]">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 via-violet-600 to-teal-500 shadow-sm">
              <GraduationCap className="h-4.5 w-4.5 text-white" strokeWidth={2.25} size={18} />
            </span>
            <span className="font-display font-bold text-[15px] tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-teal-600 bg-clip-text text-transparent">
              AcadPlan AI
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-5 sm:gap-6">
            <a
              href="#about"
              className="hidden sm:inline text-[13.5px] font-medium text-slate-600 hover:text-ink transition-colors"
            >
              About
            </a>
            <Link
              to="/signin"
              className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-[13.5px] font-semibold text-white shadow-sm shadow-indigo-600/20 hover:shadow-md hover:shadow-indigo-600/30 transition-shadow"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}