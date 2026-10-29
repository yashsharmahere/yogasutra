"use client";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

// One thread runs behind every page. It is drawn as you scroll, and a small light marks where you are.
// x is a percentage of page width, t is 0..1 down the page.
const edge = (t: number) => 96.4 + 1.5 * Math.sin(t * Math.PI * 2 * 11);
const home = (t: number) => {
  const env = Math.max(0, 1 - t / 0.3) ** 1.6;
  return 96.4 + 1.5 * Math.sin(t * Math.PI * 2 * 11) * (1 - env) + env * (-44 * Math.sin(t * Math.PI * 2 * 3.2 + 0.6) - 8 * Math.sin(t * Math.PI * 2 * 9));
};

export default function ThreadSpine() {
  const path = usePathname();
  const fn = path === "/" ? home : edge;
  const d = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 400; i++) { const t = i / 400; pts.push(`${i ? "L" : "M"}${(fn(t) < 1 ? 1 : fn(t)).toFixed(2)} ${(t * 1000).toFixed(1)}`); }
    return pts.join("");
  }, [fn]);
  const layer = useRef<HTMLDivElement>(null), fill = useRef<SVGPathElement>(null), dot = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const draw = () => {
      raf = 0;
      const L = layer.current, F = fill.current, D = dot.current; if (!L || !F || !D) return;
      const H = L.offsetHeight, max = Math.max(1, H - window.innerHeight);
      const p = reduce ? 1 : Math.min(1, Math.max(0, window.scrollY / max));
      F.style.strokeDasharray = `${p} 1`;
      const x = Math.max(1, fn(p));
      D.style.transform = `translate(${(x / 100) * L.offsetWidth - 5}px, ${p * H - 5}px)`;
      D.style.opacity = reduce ? "0" : "1";
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(draw); };
    draw();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    const ro = new ResizeObserver(req); ro.observe(document.body);
    return () => { window.removeEventListener("scroll", req); window.removeEventListener("resize", req); ro.disconnect(); cancelAnimationFrame(raf); };
  }, [fn]);

  return (
    <div className="spine-layer" ref={layer} aria-hidden="true">
      <svg viewBox="0 0 100 1000" preserveAspectRatio="none">
        <path className="spine-base" d={d} pathLength={1} />
        <path className="spine-fill" d={d} pathLength={1} ref={fill} />
      </svg>
      <span className="spine-dot" ref={dot} />
    </div>
  );
}
