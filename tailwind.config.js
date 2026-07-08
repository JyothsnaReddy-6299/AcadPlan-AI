/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink, #0F172A)",
        paper: "#FAF7F1",
        ivory: "var(--color-ivory, #FAF7F1)",
        surface: {
          DEFAULT: "var(--color-surface)",
          elevated: "var(--color-surface-elevated)",
        },
      },
      backgroundColor: {
        page: "var(--color-bg)",
        "page-secondary": "var(--color-bg-secondary)",
        "page-tertiary": "var(--color-bg-tertiary)",
      },
      textColor: {
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        tertiary: "var(--color-text-tertiary)",
      },
      borderColor: {
        DEFAULT: "var(--color-border)",
        strong: "var(--color-border-strong)",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
