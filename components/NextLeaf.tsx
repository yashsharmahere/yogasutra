"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// The home page's reading card. First visit: 1.1, "Begin here". Returning reader: the sūtra after the
// one they last opened (saved to localStorage as ek:last by MarkRead on every sūtra page). For a returning
// reader the leaf first shows the sūtra they stopped at, then turns over to reveal the next one.
export type LeafSutra = { id: string; pada: string; deva: string; iast: string; en: string };

const slug = (id: string) => id.replace(".", "-");
const devaNum = (s: string) => s.replace(/\d/g, (d) => "०१२३४५६७८९"[+d]);
const woods = (t: string) => t.split(/(\[[^\]]+\])/g).map((p, i) => (p.startsWith("[") ? <span key={i} className="sup">{p}</span> : p));
const still = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return true; } };

export default function NextLeaf({ list }: { list: LeafSutra[] }) {
  const [last, setLast] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [face, setFace] = useState<string | null>(null);   // sūtra id shown on the leaf while it turns
  const [turning, setTurning] = useState(false);

  useEffect(() => {
    let v: string | null = null;
    try { v = localStorage.getItem("ek:last"); } catch {}
    const i = v ? list.findIndex((s) => s.id === v) : -1;
    if (i >= 0) {
      setLast(v);
      if (i < list.length - 1 && !still()) {
        setFace(v);                                            // show where they stopped…
        const t1 = window.setTimeout(() => setTurning(true), 1300);
        const t2 = window.setTimeout(() => setFace(null), 1300 + 430);   // …swap at the edge-on moment
        setReady(true);
        return () => { clearTimeout(t1); clearTimeout(t2); };
      }
    }
    setReady(true);
  }, [list]);

  const i = last ? list.findIndex((s) => s.id === last) : -1;
  const done = i === list.length - 1;
  const s = i >= 0 && !done ? list[i + 1] : list[0];
  const shown = face ? list.find((x) => x.id === face)! : s;
  const href = `/sutra/${slug(s.id)}`;

  let k = "Begin here", side = `The first sūtra of ${list.length}`, go = `Read ${s.id}`;
  let alt: [string, string] = ["#chapters", "Browse the four chapters"];
  if (last && !done) { k = "Up next"; side = `You stopped at ${last} · ${s.pada}`; go = `Continue at ${s.id}`; alt = [`/sutra/${slug(last)}`, `Reread ${last}`]; }
  if (done) { k = "Begin again"; side = `You reached ${last}, the last sūtra`; go = "Start again at 1.1"; alt = [`/sutra/${slug(last!)}`, `Reread ${last}`]; }

  return (
    <>
      <section className={`hh-next${ready ? " ready" : ""}`} aria-labelledby="hh-k">
        <div className="hh-next-h"><span className="k" id="hh-k">{k}</span><span className="s">{side}</span></div>
        <Link className="hh-card" href={href} aria-label={`${k}: sūtra ${s.id}`}>
          <div className={`hh-leaf${turning ? " turn" : ""}`}>
            <span className="hh-band a" />
            <span className="hh-num" lang="sa">{devaNum(shown.id)}</span>
            <span className="hh-line"><span className="hh-sutra" lang="sa">{shown.deva}</span></span>
            <span className="hh-band b" />
          </div>
          <div className={`hh-meta${turning ? " swap" : ""}`} key={shown.id}>
            <div className="iast" lang="sa-Latn">{shown.iast}</div>
            <div className="en">{woods(shown.en)}</div>
            <div className="src">J. H. Woods, 1914</div>
          </div>
        </Link>
      </section>
      <div className="hh-act">
        <Link className="hh-btn" href={href}>{go}</Link>
        <Link className="hh-lnk" href={alt[0]}>{alt[1]}</Link>
        <Link className="hh-lnk" href="/search">Search the sūtras</Link>
      </div>
    </>
  );
}
