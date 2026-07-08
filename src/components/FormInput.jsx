export default function FormInput({ label, type = "text", ...props }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400">{label}</span>
      <input
        type={type}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[14px] text-ink placeholder:text-slate-400 outline-none transition-shadow focus:border-transparent focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/60"
        {...props}
      />
    </label>
  );
}
