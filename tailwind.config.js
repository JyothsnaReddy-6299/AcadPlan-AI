/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink:   "#0F172A",
        paper: "#FAF7F1",
        ivory: "#F8F7FC", // subtly cool-toned ivory — feels more digital
        "indigo-950": "#1e1b4b",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        sans:    ["Inter", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "grad-brand":
          "linear-gradient(135deg, hsl(220 90% 56%), hsl(262 83% 58%), hsl(174 72% 45%))",
        "grad-brand-r":
          "linear-gradient(to right, hsl(220 90% 56%), hsl(262 83% 58%), hsl(174 72% 45%))",
        "grad-dark":
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f2a26 100%)",
        "dot-grid":
          "radial-gradient(circle, #312E81 1.2px, transparent 1.2px)",
        "dot-grid-white":
          "radial-gradient(circle, rgba(255,255,255,0.5) 1.2px, transparent 1.2px)",
      },
      boxShadow: {
        "glow-sm":  "0 0 12px -4px hsl(220 90% 56% / 0.35)",
        "glow":     "0 0 28px -6px hsl(220 90% 56% / 0.35)",
        "glow-lg":  "0 0 48px -10px hsl(220 90% 56% / 0.35)",
        "glow-violet": "0 0 28px -6px hsl(262 83% 58% / 0.30)",
        "glow-teal":   "0 0 28px -6px hsl(174 72% 45% / 0.30)",
        "card":  "0 4px 24px -6px rgba(15,23,42,0.10)",
        "card-hover": "0 16px 48px -12px rgba(15,23,42,0.18)",
        "glass": "0 8px 32px -8px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.6)",
        "nav":   "0 1px 0 0 rgba(15,23,42,0.04), 0 4px 16px -4px rgba(15,23,42,0.06)",
      },
      animation: {
        "float":        "float-y 3.6s ease-in-out infinite",
        "float-slow":   "float-y-slow 6s ease-in-out infinite",
        "fade-up":      "fade-up 0.6s cubic-bezier(0.4,0,0.2,1) both",
        "scale-in":     "scale-in 0.4s cubic-bezier(0.4,0,0.2,1) both",
        "spin-slow":    "spin-slow 20s linear infinite",
        "pulse-glow":   "pulse-glow 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        "shimmer":      "shimmer 2.2s linear infinite",
        "gradient":     "gradient-shift 6s ease infinite",
        "text-shimmer": "text-shimmer 4s linear infinite",
        "orbit":        "orbit 8s linear infinite",
      },
      keyframes: {
        "float-y":      { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
        "float-y-slow": { "0%,100%": { transform: "translateY(0px) rotate(0deg)" }, "33%": { transform: "translateY(-14px) rotate(1.5deg)" }, "66%": { transform: "translateY(-6px) rotate(-1deg)" } },
        "fade-up":      { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "scale-in":     { from: { opacity: "0", transform: "scale(0.92)" }, to: { opacity: "1", transform: "scale(1)" } },
        "spin-slow":    { to: { transform: "rotate(360deg)" } },
        "pulse-glow":   { "0%,100%": { boxShadow: "0 0 0 0 hsl(220 90% 56% / 0.4)" }, "50%": { boxShadow: "0 0 0 12px hsl(220 90% 56% / 0)" } },
        "shimmer":      { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(100%)" } },
        "gradient-shift": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        "text-shimmer": { "0%": { backgroundPosition: "-200% center" }, "100%": { backgroundPosition: "200% center" } },
        "orbit":        {
          from: { transform: "rotate(0deg) translateX(var(--orbit-r,52px)) rotate(0deg)" },
          to:   { transform: "rotate(360deg) translateX(var(--orbit-r,52px)) rotate(-360deg)" },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      blur: {
        "4xl": "80px",
        "5xl": "120px",
      },
    },
  },
  plugins: [],
};