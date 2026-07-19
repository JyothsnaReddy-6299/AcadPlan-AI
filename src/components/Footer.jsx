import { GraduationCap, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Upload", href: "#upload" },
    { label: "Matrix Dashboard", to: "/matrix" },
    { label: "CDP Review", to: "/cdp-review" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
  ],
  Account: [
    { label: "Sign In", to: "/signin" },
    { label: "Sign Up", to: "/signup" },
  ],
};

const SOCIALS = [
  {
    label: "GitHub",
    href: "#",
    icon: () => (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    icon: () => (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: () => (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden transition-colors"
      style={{ background: "var(--bg-page)", borderTop: "1px solid var(--border)" }}>
      <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, hsl(84 18% 60% / 0.5), transparent)" }} />
      <div className="pointer-events-none absolute inset-0 grad-mesh opacity-50" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        {/* ── Main grid ── */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="space-y-5">
            <Link to="/" className="group inline-flex items-center gap-2.5 focus-ring rounded-lg">
              <span className="grid h-9 w-9 place-items-center rounded-xl grad-brand shadow-glow-sm transition-all duration-300 group-hover:shadow-glow">
                <GraduationCap className="h-[18px] w-[18px] text-white" strokeWidth={2.25} />
              </span>
              <span className="font-display font-bold text-[16px] grad-brand-text">AcadPlan AI</span>
            </Link>
            <p className="max-w-xs text-[13.5px] leading-relaxed" style={{ color: "hsl(84 10% 50%)" }}>
              Automate your academic documentation — from syllabi to accreditation-ready CO-PO matrices in seconds.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group grid h-8 w-8 place-items-center rounded-lg border text-sm transition-all duration-200 focus-ring"
                  style={{ background: "hsl(84 15% 82%)", borderColor: "hsl(84 18% 70%)", color: "hsl(84 18% 46%)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "hsl(84 25% 45%)"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "hsl(84 15% 82%)"; e.currentTarget.style.color = "hsl(84 18% 46%)"; }}
                >
                  {icon()}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h3 className="mb-4 text-[11.5px] font-bold uppercase tracking-widest" style={{ color: "hsl(84 15% 52%)" }}>
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {items.map(({ label, href, to }) => (
                  <li key={label}>
                    {to ? (
                      <Link
                        to={to}
                        className="text-[13.5px] transition-colors duration-200 focus-ring rounded"
                        style={{ color: "hsl(84 10% 50%)" }}
                        onMouseEnter={e => e.target.style.color = "hsl(84 25% 38%)"}
                        onMouseLeave={e => e.target.style.color = "hsl(84 10% 50%)"}
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        className="text-[13.5px] transition-colors duration-200 focus-ring rounded"
                        style={{ color: "hsl(84 10% 50%)" }}
                        onMouseEnter={e => e.target.style.color = "hsl(84 25% 38%)"}
                        onMouseLeave={e => e.target.style.color = "hsl(84 10% 50%)"}
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="my-8 h-px" style={{ background: "var(--border)" }} />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px]" style={{ color: "var(--text-faint)" }}>
          <span>
            © {new Date().getFullYear()} AcadPlan AI. All rights reserved.
          </span>
          <span className="inline-flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for educators
          </span>
        </div>
      </div>
    </footer>
  );
}