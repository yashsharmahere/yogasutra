"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// The home page's reading card. First visit: 1.1, "Begin here". Returning reader: the sūtra after the
// one they last opened (saved to localStorage as ek:last by MarkRead on every sūtra page).
export type LeafSutra = { id: string; pada: string; deva: string; iast: string; en: string };

const slug = (id: string) => id.replace(".", "-");
const devaNum = (s: string) => s.replace(/\d/g, (d) => "०१२३४५६७८९"[+d]);
const woods = (t: string) => t.split(/(\[[^\]]+\])/g).map((p, i) => (p.startsWith("[") ? <span key={i} className="sup">{p}</span> : p));

export default function NextLeaf({ list }: { list: LeafSutra[] }) {
  const [last, setLast] = useState<string | null>(null);
  useEffect(() => {
    try { const v = localStorage.getItem("ek:last"); if (v && list.some((s) => s.id === v)) setLast(v); } catch {}
  }, [list]);

  const i = last ? list.findIndex((s) => s.id === last) : -1;
  const done = i === list.length - 1;
  const s = i >= 0 && !done ? list[i + 1] : list[0];
  const href = `/sutra/${slug(s.id)}`;

  let k = "Begin here", side = `The first sūtra of ${list.length}`, go = `Read ${s.id}`;
  let alt: [string, string] = ["#chapters", "Browse the four chapters"];
  if (last && !done) { k = "Up next"; side = `You stopped at ${last} · ${s.pada}`; go = `Continue at ${s.id}`; alt = [`/sutra/${slug(last)}`, `Reread ${last}`]; }
  if (done) { k = "Begin again"; side = `You reached ${last}, the last sūtra`; go = "Start again at 1.1"; alt = [`/sutra/${slug(last!)}`, `Reread ${last}`]; }

  return (
    <>
      <section className="hh-next" aria-labelledby="hh-k">
        <div className="hh-next-h"><span className="k" id="hh-k">{k}</span><span className="s">{side}</span></div>
        <Link className="hh-card" href={href} aria-label={`${k}: sūtra ${s.id}`}>
          <div className="hh-leaf">
            <span className="hh-band a" />
            <span className="hh-num" lang="sa">{devaNum(s.id)}</span>
            <span className="hh-line"><span className="hh-sutra" lang="sa">{s.deva}</span></span>
            <span className="hh-band b" />
          </div>
          <div className="hh-meta">
            <div className="iast" lang="sa-Latn">{s.iast}</div>
            <div className="en">{woods(s.en)}</div>
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
