import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, GraduationCap, User, Lock } from "lucide-react";

/* ── tiny floating orb ─────────────────────────────── */
function Orb({ style }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none will-transform animate-float-slow"
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
          background: focused ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.13)",
          border: focused ? "1.5px solid hsl(84 25% 52%)" : "1.5px solid rgba(176,186,153,0.35)",
          boxShadow: focused ? "0 0 0 3px hsl(84 18% 66% / 0.15), inset 0 1px 0 rgba(255,255,255,0.4)" : "inset 0 1px 0 rgba(255,255,255,0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* left icon */}
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

        {/* optional right slot (show/hide password) */}
        {rightSlot && <span className="pr-3">{rightSlot}</span>}
      </div>
    </div>
  );
}

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // TODO: wire to backend
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    localStorage.setItem("currentUser", JSON.stringify({ name: form.id }));
    navigate("/");
  };

  return (
    <div
      className="relative h-screen w-screen flex items-center justify-center overflow-hidden p-4"
      style={{ background: "var(--bg-page)" }}
    >
      {/* ── Animated background orbs ── */}
      <Orb style={{ top: "-10%", left: "-8%",  width: 420, height: 420, background: "radial-gradient(circle, hsl(84 25% 60% / 0.32), transparent 70%)", animationDuration: "7s" }} />
      <Orb style={{ bottom: "-12%", right: "-6%", width: 380, height: 380, background: "radial-gradient(circle, hsl(43 55% 72% / 0.35), transparent 70%)", animationDuration: "9s", animationDelay: "1.5s" }} />
      <Orb style={{ top: "40%", right: "18%", width: 220, height: 220, background: "radial-gradient(circle, hsl(84 18% 70% / 0.22), transparent 70%)", animationDuration: "6s", animationDelay: "0.8s" }} />

      {/* ── Dot grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none dot-grid opacity-[0.055]"
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
        {/* Card glow ring */}
        <div
          className="absolute -inset-[1.5px] rounded-[24px] pointer-events-none"
          style={{
            background: "linear-gradient(135deg, hsl(84 25% 60% / 0.55), hsl(43 55% 78% / 0.45), hsl(84 18% 55% / 0.55))",
            borderRadius: 24,
          }}
        />

        {/* Main glass panel */}
        <div
          className="relative rounded-[22px] p-6 sm:p-8 overflow-hidden animate-scale-in"
          style={{
            background: "rgba(247,241,222,0.55)",
            backdropFilter: "blur(32px) saturate(1.8)",
            WebkitBackdropFilter: "blur(32px) saturate(1.8)",
          }}
        >
          {/* Inner top shimmer line */}
          <div
            className="absolute inset-x-0 top-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.75), transparent)" }}
          />

          {/* ── Header ── */}
          <div className="text-center mb-5">
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
              Welcome back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.35 }}
              className="mt-1 text-[12.5px]"
              style={{ color: "var(--text-muted)" }}
            >
              Sign in to continue to AcadPlan AI
            </motion.p>
          </div>

          {/* ── Form ── */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <GlassInput
              id="id"
              label="User ID / Email"
              icon={User}
              type="text"
              placeholder="your-id or you@college.edu"
              value={form.id}
              onChange={handleChange}
              autoComplete="username"
              required
            />

            <GlassInput
              id="password"
              label="Password"
              icon={Lock}
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
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

            {/* Forgot password */}
            <div className="flex justify-end">
              <a
                href="#"
                className="text-[12px] font-medium transition-colors focus-ring rounded"
                style={{ color: "hsl(84 25% 42%)" }}
                onMouseEnter={e => e.target.style.color = "hsl(84 25% 30%)"}
                onMouseLeave={e => e.target.style.color = "hsl(84 25% 42%)"}
              >
                Forgot password?
              </a>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[12.5px] text-center font-medium"
                  style={{ color: "hsl(0 55% 48%)" }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.018 }}
              whileTap={{ scale: 0.982 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              className="btn-lift w-full inline-flex items-center justify-center gap-2 rounded-xl grad-brand py-2 text-[14px] font-bold text-white shadow-md hover:shadow-lg focus-ring disabled:opacity-60 disabled:cursor-not-allowed will-transform mt-1"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
              ) : (
                <>Sign In <ArrowRight className="h-4 w-4" /></>
              )}
            </motion.button>
          </motion.form>

          {/* Footer link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="mt-4 text-center text-[12.5px]"
            style={{ color: "var(--text-muted)" }}
          >
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-bold transition-colors focus-ring rounded"
              style={{ color: "hsl(84 25% 38%)" }}
              onMouseEnter={e => e.target.style.color = "hsl(84 25% 26%)"}
              onMouseLeave={e => e.target.style.color = "hsl(84 25% 38%)"}
            >
              Create one free →
            </Link>
          </motion.p>
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