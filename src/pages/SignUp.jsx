import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, GraduationCap, User, Lock, Mail, CheckCircle2 } from "lucide-react";

/* ── floating orb ──────────────────────────────────── */
function Orb({ style }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none will-transform animate-float"
      style={style}
    />
  );
}

/* ── glass input field ─────────────────────────────── */
function GlassInput({ id, label, icon: Icon, type = "text", placeholder, value, onChange, autoComplete, required, rightSlot }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
        {label}
      </label>
      <div
        className="relative flex items-center rounded-xl transition-all duration-300"
        style={{
          background: focused ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)",
          border: focused ? "1.5px solid hsl(84 25% 52%)" : "1.5px solid rgba(176,186,153,0.35)",
          boxShadow: focused ? "0 0 0 3px hsl(84 18% 66% / 0.15), inset 0 1px 0 rgba(255,255,255,0.4)" : "inset 0 1px 0 rgba(255,255,255,0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span className="pl-3.5 pr-1.5 shrink-0" style={{ color: focused ? "hsl(84 25% 42%)" : "hsl(84 12% 56%)" }}>
          <Icon size={15} strokeWidth={2} />
        </span>
        <input
          id={id}
          type={type}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          required={required}
          className="flex-1 bg-transparent py-2.5 pr-2.5 text-[13.5px] outline-none placeholder:text-[hsl(84_8%_62%)]"
          style={{ color: "var(--text-primary)" }}
        />
        {rightSlot && <span className="pr-3">{rightSlot}</span>}
      </div>
    </div>
  );
}

/* ── Password strength indicator ── */
function StrengthBar({ password }) {
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  if (!password) return null;
  const strength = getStrength(password);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "hsl(0 65% 52%)", "hsl(38 80% 52%)", "hsl(84 35% 48%)", "hsl(140 50% 42%)"];
  return (
    <div className="mt-1 space-y-0.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-400"
            style={{
              background: i <= strength ? colors[strength] : "hsl(84 15% 82%)",
            }}
          />
        ))}
      </div>
      <p className="text-[11px] font-medium" style={{ color: colors[strength] || "var(--text-faint)" }}>
        {labels[strength]}
      </p>
    </div>
  );
}

/* ── Perk pill ── */
function Perk({ text }) {
  return (
    <li className="flex items-center gap-2 text-[13px]" style={{ color: "var(--text-muted)" }}>
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
        style={{ background: "hsl(140 35% 88%)", border: "1px solid hsl(140 25% 72%)" }}>
        <CheckCircle2 size={12} style={{ color: "hsl(140 45% 40%)" }} strokeWidth={2.5} />
      </span>
      {text}
    </li>
  );
}

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", id: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire to backend
    await new Promise((r) => setTimeout(r, 1400));
    console.log("Create account:", form);
    setLoading(false);
    setDone(true);
  };

  return (
    <div
      className="relative h-screen w-screen flex items-center justify-center overflow-hidden p-4"
      style={{ background: "var(--bg-page)" }}
    >
      {/* ── Background orbs ── */}
      <Orb style={{ top: "-8%",   left: "-10%", width: 460, height: 460, background: "radial-gradient(circle, hsl(43 55% 72% / 0.32), transparent 70%)", animationDuration: "8s" }} />
      <Orb style={{ bottom: "-10%", right: "-8%", width: 400, height: 400, background: "radial-gradient(circle, hsl(84 25% 62% / 0.30), transparent 70%)", animationDuration: "10s", animationDelay: "2s" }} />
      <Orb style={{ top: "30%",   left: "60%",  width: 240, height: 240, background: "radial-gradient(circle, hsl(84 18% 68% / 0.20), transparent 70%)", animationDuration: "7s", animationDelay: "1s" }} />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none dot-grid opacity-[0.05]"
        style={{ backgroundSize: "28px 28px" }}
        aria-hidden
      />

      {/* ── Glass card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Gradient glow border */}
        <div
          className="absolute -inset-[1.5px] rounded-[24px] pointer-events-none"
          style={{
            background: "linear-gradient(135deg, hsl(43 55% 72% / 0.55), hsl(84 25% 58% / 0.45), hsl(43 55% 72% / 0.55))",
            borderRadius: 24,
          }}
        />

        {/* Glass panel */}
        <div
          className="relative rounded-[22px] p-6 sm:p-8 overflow-hidden animate-scale-in"
          style={{
            background: "rgba(247,241,222,0.55)",
            backdropFilter: "blur(32px) saturate(1.8)",
            WebkitBackdropFilter: "blur(32px) saturate(1.8)",
          }}
        >
          {/* Inner shimmer */}
          <div
            className="absolute inset-x-0 top-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.75), transparent)" }}
          />

          {/* ── Header ── */}
          <div className="text-center mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="mx-auto mb-3 inline-grid h-11 w-11 place-items-center rounded-xl grad-brand shadow-md"
            >
              <GraduationCap className="h-6 w-6 text-white" strokeWidth={2} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.4 }}
              className="font-display font-bold text-xl tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Create your account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.35 }}
              className="mt-1 text-[12.5px]"
              style={{ color: "var(--text-muted)" }}
            >
              Start mapping syllabi in minutes — free forever
            </motion.p>
          </div>

          {/* ── Success state ── */}
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-6 text-center space-y-3"
              >
                <div className="mx-auto inline-grid h-14 w-14 place-items-center rounded-full"
                  style={{ background: "hsl(140 35% 88%)", border: "2px solid hsl(140 25% 68%)" }}>
                  <CheckCircle2 size={26} style={{ color: "hsl(140 45% 38%)" }} strokeWidth={2} />
                </div>
                <p className="font-display font-bold text-lg" style={{ color: "var(--text-primary)" }}>Account created!</p>
                <p className="text-[12.5px]" style={{ color: "var(--text-muted)" }}>Welcome to AcadPlan AI. Please sign in.</p>
                <Link
                  to="/signin"
                  className="inline-flex items-center gap-2 rounded-xl grad-brand px-5 py-2 text-[13.5px] font-semibold text-white shadow-md"
                >
                  Sign In <ArrowRight size={14} />
                </Link>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.45 }}
                onSubmit={handleSubmit}
                className="space-y-3"
              >
                <GlassInput
                  id="fullName"
                  label="Full Name"
                  icon={User}
                  type="text"
                  placeholder="Jyothsna Reddy"
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />

                <GlassInput
                  id="id"
                  label="User ID / Email"
                  icon={Mail}
                  type="text"
                  placeholder="your-id or you@college.edu"
                  value={form.id}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />

                <div>
                  <GlassInput
                    id="password"
                    label="Password"
                    icon={Lock}
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowPass((p) => !p)}
                        className="focus-ring rounded-lg p-0.5"
                        aria-label={showPass ? "Hide password" : "Show password"}
                        style={{ color: "hsl(84 12% 56%)" }}
                      >
                        {showPass ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                      </button>
                    }
                  />
                  <StrengthBar password={form.password} />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.018 }}
                  whileTap={{ scale: 0.982 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  className="btn-lift w-full inline-flex items-center justify-center gap-2 rounded-xl grad-brand py-2.5 text-[14px] font-bold text-white shadow-md hover:shadow-lg focus-ring disabled:opacity-60 disabled:cursor-not-allowed will-transform mt-1"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
                  ) : (
                    <>Create Free Account <ArrowRight className="h-4 w-4" /></>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer link */}
          {!done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              <p className="mt-4 text-center text-[12.5px]" style={{ color: "var(--text-muted)" }}>
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-bold transition-colors focus-ring rounded"
                  style={{ color: "hsl(84 25% 38%)" }}
                  onMouseEnter={e => e.target.style.color = "hsl(84 25% 26%)"}
                  onMouseLeave={e => e.target.style.color = "hsl(84 25% 38%)"}
                >
                  Sign in →
                </Link>
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── Back to home ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute top-6 left-6"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 focus-ring"
          style={{
            background: "rgba(247,241,222,0.50)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(176,186,153,0.35)",
            color: "var(--text-muted)",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(247,241,222,0.75)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(247,241,222,0.50)"}
        >
          <GraduationCap size={14} />
          AcadPlan AI
        </Link>
      </motion.div>
    </div>
  );
}