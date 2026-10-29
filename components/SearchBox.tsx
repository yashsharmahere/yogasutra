"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Sutra, slug } from "@/lib/corpus";

const fold = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function SearchBox({ sutras, counts }: { sutras: Sutra[]; counts: Record<number, number> }) {
  const [q, setQ] = useState("");
  const idx = useMemo(() => sutras.map((s) => ({ s, i: fold(s.iast).replace(/[\s']/g, ""), e: fold(s.en), j: fold(s.jn), v: fold(s.vv || ""), d: s.deva })), [sutras]);
  const ref = /^\s*(\d)\s*[.:\- ]\s*(\d{1,2})\s*$/.exec(q);
  let msg = "", hits: Sutra[] = [];
  if (ref) {
    const id = `${ref[1]}.${Number(ref[2])}`, s = sutras.find((x) => x.id === id);
    if (s) hits = [s]; else msg = `There is no ${id} in this edition. Pāda ${ref[1]} has ${counts[Number(ref[1])] ?? 0} sūtras.`;
  } else if (q.trim().length > 1) {
    const f = fold(q.trim()), fi = f.replace(/[\s']/g, "");
    hits = idx.filter((x) => x.i.includes(fi) || x.e.includes(f) || x.j.includes(f) || x.v.includes(f) || x.d.includes(q.trim())).map((x) => x.s).slice(0, 80);
    if (!hits.length) msg = "Nothing found.";
  }
  return (
    <>
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Sanskrit, English, or a number like 2.46" aria-label="Search" style={{ width: "100%", maxWidth: "36rem", font: "inherit", padding: ".6rem .8rem", border: "1px solid var(--rule)", background: "var(--card)", color: "var(--ink)", borderRadius: "var(--radius)" }} />
      {msg && <p className="muted" style={{ marginTop: "var(--s-4)" }}>{msg}</p>}
      <div className="rows" style={{ marginTop: "var(--s-5)" }}>{hits.map((s) => (
        <Link key={s.id} className="row" href={`/sutra/${slug(s.id)}`}><span className="num">{s.id}</span><span><span className="r-iast" style={{ display: "block" }}>{s.iast}</span><span className="r-en" style={{ display: "block" }}>{s.en}</span></span></Link>))}</div>
    </>
  );
}
