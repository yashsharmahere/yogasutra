"use client";
import { useEffect, useRef } from "react";

// Shown once per visit, on the home page only. The element is always in the HTML; an inline script in <head>
// sets data-splash on <html> before first paint so there is no flash of the page underneath.
export default function Splash() {
  const root = useRef<HTMLDivElement>(null), btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = document.documentElement;
    if (el.dataset.splash !== "1") return;
    try { sessionStorage.setItem("ek:splash", "1"); } catch {}
    btn.current?.focus({ preventScroll: true });
    const close = () => { el.removeAttribute("data-splash"); root.current?.classList.add("gone"); };
    const t = window.setTimeout(close, 6500);
    const key = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") close(); };
    window.addEventListener("keydown", key);
    (root.current as any).__close = close;
    return () => { window.clearTimeout(t); window.removeEventListener("keydown", key); };
  }, []);
  return (
    <div className="splash" ref={root} role="dialog" aria-modal="true" aria-label="Welcome" onClick={() => (root.current as any)?.__close?.()}>
      <svg className="splash-thread" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M-20 570 C 40 330, 90 90, 380 70 S 800 30, 930 190 S 985 470, 1020 580" pathLength={1} />
      </svg>
      <figure className="splash-q">
        <p className="deva sq-deva">तत्र प्रत्ययैकतानता ध्यानम्</p>
        <p className="iast sq-iast">tatra pratyayaikatānatā dhyānam</p>
        <blockquote className="sq-en">“An unbroken flow of knowledge in that object is Dhyāna.”</blockquote>
        <figcaption className="sq-cite">Yoga Sūtra 3.2 · translated by Swami Vivekananda, 1896</figcaption>
        <p className="sq-name"><b>Ekatāna</b> (एकतान): the unbroken flow. This is where the name comes from.</p>
        <button type="button" className="sq-btn" ref={btn} onClick={(e) => { e.stopPropagation(); (root.current as any)?.__close?.(); }}>Enter</button>
      </figure>
    </div>
  );
}
