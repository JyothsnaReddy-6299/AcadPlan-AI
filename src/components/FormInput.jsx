import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * FormInput — premium input with floating label animation, password reveal,
 * and GPU-promoted focus ring.
 */
export default function FormInput({ label, type = "text", error, ...props }) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="group">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-slate-600 dark:text-gray-300">
        {label}
        {props.required && <span className="ml-0.5 text-indigo-500">*</span>}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          className={`input-premium w-full rounded-xl border px-3.5 py-2.5 text-[14px] text-ink dark:text-gray-100
            placeholder:text-slate-400 dark:placeholder-gray-600
            bg-white dark:bg-gray-800/80
            outline-none pr-${isPassword ? "10" : "3.5"}
            transition-all duration-200
            ${
              error
                ? "border-red-400 dark:border-red-500 focus:ring-red-400/20"
                : "border-slate-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-500"
            }
          `}
          {...props}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 transition-colors focus-ring"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-[12px] font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}