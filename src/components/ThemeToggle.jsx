import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../context/DarkModeContext";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleDark } = useDarkMode();

  return (
    <button
      type="button"
      onClick={toggleDark}
      className={`grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:text-ink hover:bg-slate-100 transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
