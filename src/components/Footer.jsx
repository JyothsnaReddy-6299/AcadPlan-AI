export default function Footer() {
  return (
    <footer className="bg-white border-t border-ink/5 px-4 sm:px-6 py-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-slate-400">
        <span className="font-display font-semibold text-slate-500">
          AcadPlan AI
        </span>

        <div className="flex items-center gap-4">
          <a href="#privacy" className="hover:text-slate-600 transition-colors">
            Privacy Policy
          </a>
          <span className="text-slate-300">·</span>
          <a href="#terms" className="hover:text-slate-600 transition-colors">
            Terms of Service
          </a>
        </div>

        <span>&copy; {new Date().getFullYear()} AcadPlan AI. All rights reserved.</span>
      </div>
    </footer>
  );
}