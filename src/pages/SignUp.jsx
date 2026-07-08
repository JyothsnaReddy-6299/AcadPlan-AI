import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Check } from "lucide-react";

const PERKS = [
  "Free forever for individual educators",
  "No credit card required",
  "Instant accreditation-ready output",
];

export default function SignUp() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire to backend
    await new Promise((r) => setTimeout(r, 1400));
    console.log("Create account with:", form);
    setLoading(false);
    setDone(true);
  };

  return (
    <AuthLayout heading="Create your account" subheading="Start mapping your syllabi in minutes — free forever">
      {/* Perks list */}
      <ul className="mb-6 space-y-1.5">
        {PERKS.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-gray-400">
            <span className="grid h-4.5 w-4.5 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
              <Check className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
            </span>
            {perk}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Full Name"
          name="fullName"
          id="signup-name"
          placeholder="Jyothsna Reddy"
          value={form.fullName}
          onChange={handleChange}
          autoComplete="name"
          required
        />
        <FormInput
          label="Email"
          type="email"
          name="email"
          id="signup-email"
          placeholder="you@college.edu"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          id="signup-password"
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        <motion.button
          type="submit"
          disabled={loading || done}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="btn-lift w-full inline-flex items-center justify-center gap-2 rounded-xl grad-brand py-2.5 text-[14px] font-semibold text-white shadow-glow-sm hover:shadow-glow focus-ring disabled:opacity-60 disabled:cursor-not-allowed will-transform"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
          ) : done ? (
            <><Check className="h-4 w-4" /> Account created!</>
          ) : (
            <>Create Free Account <ArrowRight className="h-4 w-4" /></>
          )}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-[13px] text-slate-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          to="/signin"
          className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors focus-ring rounded"
        >
          Sign in
        </Link>
      </p>

      <p className="mt-4 text-center text-[11.5px] text-slate-400 dark:text-gray-600 leading-relaxed">
        By creating an account, you agree to our{" "}
        <a href="#terms" className="underline hover:text-slate-600 dark:hover:text-gray-400 transition-colors">Terms</a>
        {" "}and{" "}
        <a href="#privacy" className="underline hover:text-slate-600 dark:hover:text-gray-400 transition-colors">Privacy Policy</a>.
      </p>
    </AuthLayout>
  );
}