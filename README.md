# AcadPlan AI

Automate the generation of Course Delivery Plans (CDP) and CO-PO affinity matrices from syllabus files using generative AI.

## Features

- Upload syllabus (PDF/DOCX) and extract structured data
- Interactive CO-PO/PSO affinity matrix editor
- Full Course Delivery Plan (CDP) builder with lecture scheduling, evaluation grading, and threshold setting
- Printable CDP preview with one-click export
- Local-first: works entirely in the browser with mock API, ready to connect to a FastAPI backend

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Lucide, React Router  
**Backend (planned):** Python FastAPI, LangChain, LLM APIs  
**Deployment:** GitHub Pages (frontend) + Render/Vercel (backend)

## Quick Start

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

```bash
npm run deploy
```

Then enable GitHub Pages in your repo Settings → Pages → source: `gh-pages` branch.
