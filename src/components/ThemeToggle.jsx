import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { motion } from "framer-motion";

export function ThemeToggle({ className = "" }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDarkMode}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleDarkMode}
      className={`relative flex w-[52px] h-7 items-center rounded-full border cursor-pointer select-none transition-all duration-300 focus-ring ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-slate-100 border-slate-200"
      } ${className}`}
    >
      {/* Track */}
      <span className="sr-only">{isDarkMode ? "Dark mode" : "Light mode"}</span>

      {/* Thumb */}
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute grid h-5 w-5 place-items-center rounded-full shadow-sm transition-colors duration-300 ${
          isDarkMode
            ? "left-[26px] bg-indigo-500"
            : "left-[2px] bg-white"
        }`}
      >
        <motion.span
          key={isDarkMode ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {isDarkMode ? (
            <Moon className="h-3 w-3 text-white" strokeWidth={2} />
          ) : (
            <Sun className="h-3 w-3 text-amber-500" strokeWidth={2} />
          )}
        </motion.span>
      </motion.span>

      {/* Background icons */}
      <Sun  className={`absolute left-1.5 h-3 w-3 transition-opacity duration-200 ${isDarkMode ? "opacity-0" : "opacity-0"} text-amber-400`} strokeWidth={2} />
      <Moon className={`absolute right-1.5 h-3 w-3 transition-opacity duration-200 ${isDarkMode ? "opacity-100" : "opacity-0"} text-gray-400`} strokeWidth={2} />
    </button>
  );
}
