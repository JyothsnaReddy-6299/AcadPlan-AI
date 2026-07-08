/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A", // headings / primary text
        paper: "#FAF7F1", // warm ivory background (evokes a page/syllabus)
        ivory: "#FAF7F1", // alias used for alternating section backgrounds
      },
      fontFamily: {
        display: ["Sora", "sans-serif"], // headings & logo
        sans: ["Inter", "sans-serif"], // body copy & nav
        mono: ["JetBrains Mono", "monospace"], // data chips, file-type tags
      },
    },
  },
  plugins: [],
};