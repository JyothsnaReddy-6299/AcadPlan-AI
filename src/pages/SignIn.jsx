import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire this up to your backend's sign-in endpoint
    console.log("Sign in with:", form);
  };

  return (
    <AuthLayout heading="Welcome back" subheading="Sign in to continue to AcadPlan AI">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="you@college.edu"
          value={form.email}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div className="flex justify-end">
          <a href="#" className="text-[12.5px] font-medium text-indigo-600 hover:text-indigo-700">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-teal-500 py-2.5 text-[14px] font-semibold text-white shadow-md shadow-indigo-600/25 transition-shadow hover:shadow-lg hover:shadow-indigo-600/30"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-slate-500">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}