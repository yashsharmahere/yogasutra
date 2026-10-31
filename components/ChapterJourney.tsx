"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReadBar from "@/components/ReadBar";

export type Chapter = { n: number; deva: string; name: string; about: string; first: string; last: string; sutras: number; sections: number; ids: string[] };

// Where the one gold moon sits in each painting (percent of the panel), and its size.
const MOON = [{ x: 65.5, y: 20.4 }, { x: 81.5, y: 11.7 }, { x: 51.2, y: 21.7 }, { x: 77.6, y: 15.6 }];
const HDR = 0;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function Fx({ i }: { i: number }) {
  return i === 3 ? <img className="crane" src="/home/crane.webp" alt="" aria-hidden="true" /> : null;
}

export default function ChapterJourney({ chapters }: { chapters: Chapter[] }) {
  const sec = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => { try { setStill(matchMedia("(prefers-reduced-motion: reduce)").matches); } catch {} }, []);

  // One switch drives everything: the painting, the moon, the text and the index all change together.
  useEffect(() => {
    if (still) return;
    let raf = 0, last = -1;
    const run = () => {
      raf = 0;
      const el = sec.current; if (!el) return;
      const r = el.getBoundingClientRect(), travel = el.offsetHeight - (stage.current?.offsetHeight ?? window.innerHeight);
      const t = clamp((HDR - r.top) / Math.max(1, travel)) * (chapters.length - 1);
      const a = Math.min(chapters.length - 1, Math.floor(t + 0.5));
      if (a !== last) { last = a; setActive(a); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    run(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); if (raf) cancelAnimationFrame(raf); };
  }, [still, chapters.length]);

  const go = (i: number) => (e: React.MouseEvent) => {
    if (still || !sec.current) return;
    e.preventDefault();
    const el = sec.current, travel = el.offsetHeight - (stage.current?.offsetHeight ?? window.innerHeight);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HDR + (i / (chapters.length - 1)) * travel, behavior: "smooth" });
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
        <div className="jr-col">
          <div className="jr-top"><h2>Four chapters</h2><span>The text moves from what yoga is, to where it ends.</span></div>
          <div className="jr-text">{chapters.map((c, i) => <div key={c.n} className={`jr-t${i === active ? " on" : ""}`} aria-hidden={i !== active}>{text(c)}</div>)}</div>
          <nav className="jr-idx" aria-label="Chapters">
            <ol>{chapters.map((c, i) => (
              <li key={c.n} className={i === active ? "on" : i < active ? "done" : ""}>
                <a href={`/read/${c.n}`} onClick={go(i)} aria-current={i === active}><span className="bar"><i /></span><span className="n">{c.n}</span><span className="nm">{c.name.replace("-pāda", "")}</span></a>
              </li>
            ))}</ol>
          </nav>
        </div>
        <div className="jr-panel">
          {chapters.map((c, i) => <div key={c.n} className={`jr-layer${i <= active ? " on" : ""}${i === active ? " cur" : ""}`}><img src={`/home/j-${i + 1}.webp`} alt="" width={814} height={1086} loading={i === 0 ? "eager" : "lazy"} /><Fx i={i} /></div>)}
          <span className="jr-moon" style={{ left: `${MOON[active].x}%`, top: `${MOON[active].y}%` }} />
        </div>
      </div>
    </section>
  );
}
