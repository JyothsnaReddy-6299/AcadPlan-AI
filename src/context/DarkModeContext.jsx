import { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      // Check if the inline script already added the dark class
      if (document.documentElement.classList.contains("dark")) {
        return true;
      }
      const stored = localStorage.getItem("acadplan-theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    // Add no-transition class to prevent flash on mount
    if (!root.classList.contains("theme-transitioning")) {
      root.classList.add("no-theme-transition");
    }

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("acadplan-theme", isDark ? "dark" : "light");

    // Remove no-transition class after a brief delay
    const timer = setTimeout(() => {
      root.classList.remove("no-theme-transition");
    }, 50);
    return () => clearTimeout(timer);
  }, [isDark]);

  const toggleDark = () => {
    // Enable smooth transitions only during toggle (not on initial load)
    document.documentElement.classList.add("theme-transitioning");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 350);
    setIsDark((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error("useDarkMode must be used within DarkModeProvider");
  return ctx;
}
