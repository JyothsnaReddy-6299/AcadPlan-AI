import { useState, useEffect, useRef } from "react";
import NumberFlow from "@number-flow/react";

/**
 * RealTimeClock — tabular-nums, animated digit transitions via NumberFlow.
 * setInterval is kept in a ref to avoid stale closures.
 * No layout thrash — only text content changes.
 */
export default function RealTimeClock() {
  const [time, setTime] = useState(() => new Date());
  const intervalRef = useRef(null);

  useEffect(() => {
    // Align tick to the start of the next second to minimize drift
    const now = Date.now();
    const msUntilNextSec = 1000 - (now % 1000);

    const start = setTimeout(() => {
      setTime(new Date());
      intervalRef.current = setInterval(() => setTime(new Date()), 1000);
    }, msUntilNextSec);

    return () => {
      clearTimeout(start);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const h    = time.getHours();
  const m    = time.getMinutes();
  const s    = time.getSeconds();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 || 12;

  return (
    <span
      className="inline-flex items-center gap-[2px] font-mono text-[13px] font-medium tabular-nums tracking-tight text-slate-600 dark:text-gray-300"
      aria-label={`Current time: ${h12}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")} ${ampm}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <NumberFlow value={h12} format={{ minimumIntegerDigits: 2 }} />
      <span className="animate-blink-colon opacity-80 mx-px">:</span>
      <NumberFlow value={m} format={{ minimumIntegerDigits: 2 }} />
      <span className="animate-blink-colon opacity-80 mx-px" style={{ animationDelay: "0.5s" }}>:</span>
      <NumberFlow value={s} format={{ minimumIntegerDigits: 2 }} />
      <span className="ml-1 text-[10.5px] font-semibold uppercase tracking-wider opacity-50">{ampm}</span>
    </span>
  );
}
