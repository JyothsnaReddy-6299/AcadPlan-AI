import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire to backend
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Sign in with:", form);
    setLoading(false);
  };

  return (
    <AuthLayout heading="Welcome back" subheading="Sign in to continue to AcadPlan AI">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Email"
          type="email"
          name="email"
          id="signin-email"
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
          id="signin-password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        <div className="flex justify-end">
          <a
            href="#"
            className="text-[12.5px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors focus-ring rounded"
          >
            Forgot password?
          </a>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="btn-lift w-full inline-flex items-center justify-center gap-2 rounded-xl grad-brand py-2.5 text-[14px] font-semibold text-white shadow-glow-sm hover:shadow-glow focus-ring disabled:opacity-60 disabled:cursor-not-allowed will-transform"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-[13px] text-slate-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors focus-ring rounded"
        >
          Create one free
        </Link>
      </p>

      {/* Divider */}
      <div className="mt-6 flex items-center gap-3">
        <span className="flex-1 h-px bg-slate-200 dark:bg-gray-700" />
        <span className="text-[12px] text-slate-400 dark:text-gray-500">or continue with</span>
        <span className="flex-1 h-px bg-slate-200 dark:bg-gray-700" />
      </div>

      {/* Google SSO placeholder */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="mt-4 btn-lift w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 text-[14px] font-medium text-slate-700 dark:text-gray-200 shadow-card hover:shadow-card-hover focus-ring will-transform"
      >
        <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </motion.button>
    </AuthLayout>
  );
}