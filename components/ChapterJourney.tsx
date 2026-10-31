"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReadBar from "@/components/ReadBar";

export type Chapter = { n: number; deva: string; name: string; about: string; first: string; last: string; sutras: number; sections: number; ids: string[] };

// Where the one gold moon sits in each painting (percent of the panel), and its size.
const MOON = [{ x: 65.5, y: 20.4 }, { x: 81.5, y: 11.7 }, { x: 51.2, y: 21.7 }, { x: 77.6, y: 15.6 }];
const MOON_R = 6.8;
const ease = (s: number) => s * s * (3 - 2 * s);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function moonAt(t: number) {
  const i = Math.min(2, Math.max(0, Math.floor(t))), s = ease(clamp(t - i)), a = MOON[i], b = MOON[i + 1];
  return { x: a.x + (b.x - a.x) * s, y: a.y + (b.y - a.y) * s - Math.sin(Math.PI * s) * 6 };
}

function Fx({ i }: { i: number }) {
  if (i === 0) return <div className="fx fx-rip" aria-hidden="true"><i /><i /><i /></div>;
  if (i === 1) return <div className="fx fx-sp" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6].map((k) => <i key={k} style={{ left: `${30 + k * 6.5}%`, animationDelay: `${-k * 1.3}s`, animationDuration: `${7 + (k % 3)}s` }} />)}</div>;
  if (i === 2) return <div className="fx fx-fl" aria-hidden="true"><i className="glow" />{[0, 1, 2, 3, 4].map((k) => <i key={k} className="sp" style={{ left: `${47 + k * 2}%`, animationDelay: `${-k * 1.1}s` }} />)}</div>;
  return <img className="crane" src="/home/crane.webp" alt="" aria-hidden="true" />;
}

export default function ChapterJourney({ chapters }: { chapters: Chapter[] }) {
  const sec = useRef<HTMLElement>(null), moon = useRef<HTMLSpanElement>(null), stage = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => { try { setStill(matchMedia("(prefers-reduced-motion: reduce)").matches); } catch {} }, []);

  useEffect(() => {
    if (still) return;
    let raf = 0, last = -1;
    const run = () => {
      raf = 0;
      const el = sec.current; if (!el) return;
      const r = el.getBoundingClientRect(), travel = el.offsetHeight - window.innerHeight;
      const p = clamp(-r.top / Math.max(1, travel)), t = p * (chapters.length - 1);
      layers.current.forEach((l, i) => {
        if (!l) return;
        const d = t - i, o = i === 0 ? 1 : ease(clamp((t - (i - 1) - 0.2) / 0.65));
        l.style.opacity = String(o);
        l.style.transform = `translate3d(0,${(-clamp(d, -1, 1) * 2.4).toFixed(2)}%,0) scale(1.045)`;
        l.style.visibility = o > 0 || i === 0 ? "visible" : "hidden";
      });
      const m = moonAt(t);
      if (moon.current) { moon.current.style.left = `${m.x}%`; moon.current.style.top = `${m.y}%`; }
      stage.current?.style.setProperty("--p", p.toFixed(4));
      const a = Math.min(chapters.length - 1, Math.floor(t + 0.45)); if (a !== last) { last = a; setActive(a); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    run(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); if (raf) cancelAnimationFrame(raf); };
  }, [still, chapters.length]);

  const go = (i: number) => (e: React.MouseEvent) => {
    if (still || !sec.current) return;
    e.preventDefault();
    const el = sec.current, travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (i / (chapters.length - 1)) * travel, behavior: "smooth" });
  };

  const text = (c: Chapter) => (
    <>
      <span className="jr-num">Chapter {c.n}</span>
      <h3><span lang="sa" className="deva">{c.deva}</span><span className="iast">{c.name}</span></h3>
      <p className="about">{c.about}</p>
      <p className="meta"><span className="mono">{c.first}–{c.last}</span><span>{c.sutras} sūtras · {c.sections} sections</span></p>
      <ReadBar ids={c.ids} />
      <span className="jr-go"><Link className="hh-btn" href={`/read/${c.n}`}>Read chapter {c.n}</Link></span>
    </>
  );

  if (still) {
    return (
      <section id="chapters" className="jr-still" aria-label="The four chapters">
        <div className="hs-h"><h2>Four chapters</h2><p>The text moves from what yoga is, to how it is practised, to what it opens, to where it ends.</p></div>
        {chapters.map((c, i) => (
          <article key={c.n} className="jr-row">
            <div className="jr-panel"><div className="jr-layer" style={{ opacity: 1 }}><img src={`/home/j-${i + 1}.webp`} alt="" width={814} height={1086} loading="lazy" />{i === 3 && <img className="crane" src="/home/crane.webp" alt="" aria-hidden="true" />}</div><span className="jr-moon" style={{ left: `${MOON[i].x}%`, top: `${MOON[i].y}%` }} /></div>
            <div className="jr-t on">{text(c)}</div>
          </article>
        ))}
      </section>
    );
  }

  return (
    <section id="chapters" className="jr" ref={sec} aria-label="The four chapters">
      <div className="jr-stage" ref={stage}>
        <div className="hs-h"><h2>Four chapters</h2><p>The text moves from what yoga is, to how it is practised, to what it opens, to where it ends.</p></div>
        <div className="jr-grid">
          <nav className="jr-rail" aria-label="Chapters">
            <span className="line"><i /></span>
            <ol>{chapters.map((c, i) => (
              <li key={c.n} className={i === active ? "on" : i < active ? "done" : ""}><a href={`/read/${c.n}`} onClick={go(i)} aria-current={i === active}><span className="dot" /><span className="n">Chapter {c.n}</span><span lang="sa" className="d">{c.deva}</span></a></li>
            ))}</ol>
          </nav>
          <div className="jr-text">{chapters.map((c, i) => <div key={c.n} className={`jr-t${i === active ? " on" : ""}`} aria-hidden={i !== active}>{text(c)}</div>)}</div>
          <div className="jr-panel">
            {chapters.map((c, i) => <div key={c.n} className="jr-layer" ref={(el) => { layers.current[i] = el; }} style={{ opacity: i === 0 ? 1 : 0 }}><img src={`/home/j-${i + 1}.webp`} alt="" width={814} height={1086} loading={i === 0 ? "eager" : "lazy"} /><Fx i={i} /></div>)}
            <span className="jr-moon" ref={moon} style={{ left: `${MOON[0].x}%`, top: `${MOON[0].y}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
