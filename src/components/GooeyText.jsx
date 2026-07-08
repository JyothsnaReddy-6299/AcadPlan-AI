import { useEffect, useRef } from "react";

/**
 * GooeyText — morphs between text strings using a CSS SVG gooey filter.
 * RAF loop: only mutates .style.filter and .style.opacity — no layout thrash.
 */
export default function GooeyText({
  texts,
  morphTime = 1.4,
  cooldownTime = 0.5,
  className = "",
  textClassName = "",
}) {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const filterId = useRef(`gooey-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    let textIndex = texts.length - 1;
    let lastTime  = performance.now() / 1000; // higher resolution than Date
    let morph     = 0;
    let cooldown  = cooldownTime;
    let rafId;

    // ── Direct DOM mutation — zero React state updates in the hot path ──────
    const setMorph = (fraction) => {
      const t1 = text1Ref.current;
      const t2 = text2Ref.current;
      if (!t1 || !t2) return;

      // text2 fades in
      t2.style.filter  = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      t2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      // text1 fades out
      const inv = 1 - fraction;
      t1.style.filter  = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      t1.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;
    };

    const doCooldown = () => {
      morph = 0;
      const t1 = text1Ref.current;
      const t2 = text2Ref.current;
      if (!t1 || !t2) return;
      t2.style.filter  = "";
      t2.style.opacity = "100%";
      t1.style.filter  = "";
      t1.style.opacity = "0%";
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;
      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }
      setMorph(fraction);
    };

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      const now = performance.now() / 1000;
      const dt  = Math.min(now - lastTime, 0.05); // cap dt at 50ms (handles tab switching)
      lastTime  = now;

      const shouldIncrement = cooldown > 0;
      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrement) {
          textIndex = (textIndex + 1) % texts.length;
          const t1 = text1Ref.current;
          const t2 = text2Ref.current;
          if (t1 && t2) {
            t1.textContent = texts[textIndex % texts.length];
            t2.textContent = texts[(textIndex + 1) % texts.length];
          }
        }
        doMorph();
      } else {
        doCooldown();
      }
    };

    // Seed initial text
    if (text1Ref.current) text1Ref.current.textContent = texts[textIndex % texts.length];
    if (text2Ref.current) text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];

    loop();
    return () => cancelAnimationFrame(rafId);
  }, [texts, morphTime, cooldownTime]);

  const id = filterId.current;
  const baseTextClass = `absolute inline-block select-none text-center font-display font-extrabold
    tracking-tight text-5xl md:text-[60pt] leading-[1.05]
    bg-gradient-to-br from-indigo-600 via-violet-600 to-teal-500
    bg-clip-text text-transparent ${textClassName}`;

  return (
    <div className={`relative ${className}`}>
      {/* SVG filter — composited via feColorMatrix (no DOM impact) */}
      <svg className="absolute h-0 w-0 overflow-hidden" aria-hidden focusable="false">
        <defs>
          <filter id={id} colorInterpolationFilters="sRGB">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="relative flex items-center justify-center min-h-[80px] md:min-h-[100px]"
        style={{ filter: `url(#${id})` }}
      >
        <span ref={text1Ref} className={baseTextClass} />
        <span ref={text2Ref} className={baseTextClass} />
      </div>
    </div>
  );
}
