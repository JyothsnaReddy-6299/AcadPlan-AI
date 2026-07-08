import { Link } from "react-router-dom";
import { GraduationCap, Network, FileText, Map } from "lucide-react";

// Shared left-hand brand panel + right-hand form shell used by both
// SignIn and SignUp so the two pages stay visually identical.
export default function AuthLayout({ heading, subheading, children }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left brand panel — hidden on small screens */}
      <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-teal-500 p-10 text-white sm:flex">
        {/* dot-grid texture, same motif as the landing page */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle, #FFFFFF 1.2px, transparent 1.2px)",
            backgroundSize: "26px 26px",
          }}
        />

        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 backdrop-blur">
            <GraduationCap className="h-4.5 w-4.5 text-white" strokeWidth={2.25} size={18} />
          </span>
          <span className="font-display font-bold text-[15px] tracking-tight">
            AcadPlan AI
          </span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-display font-bold text-3xl leading-tight">
            Plan smarter.
            <br />
            Map faster.
          </h2>
          <p className="mt-3 max-w-sm text-[14px] text-white/75">
            Turn syllabi into accreditation-ready CO-PO mappings and concept
            maps in a few clicks.
          </p>

          {/* floating icon badges — echoes the upload-ring motif elsewhere */}
          <div className="mt-8 flex gap-3">
            {[Network, Map, FileText].map((Icon, i) => (
              <span
                key={i}
                className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur"
              >
                <Icon className="h-5 w-5 text-white" strokeWidth={2} />
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[12px] text-white/60">
          &copy; {new Date().getFullYear()} AcadPlan AI
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-1 items-center justify-center bg-ivory px-6 py-12 sm:w-[56%]">
        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 sm:hidden font-display font-bold text-[15px] bg-gradient-to-r from-indigo-600 via-violet-600 to-teal-600 bg-clip-text text-transparent"
          >
            AcadPlan AI
          </Link>

          <h1 className="font-display font-bold text-2xl text-ink">{heading}</h1>
          {subheading && (
            <p className="mt-1.5 text-[13.5px] text-slate-500">{subheading}</p>
          )}

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}