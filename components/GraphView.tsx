"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type GNode = { id: string; iast: string; en: string; n: number; r: number; x: number; y: number };
export type GLink = { a: string; b: string; n: number };

export default function GraphView({ nodes, links, first }: { nodes: GNode[]; links: GLink[]; first: string }) {
  const [sel, setSel] = useState<string | null>(null);
  const router = useRouter();
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const set = new Set<string>();
  if (sel) { set.add(sel); links.forEach((l) => { if (l.a === sel) set.add(l.b); if (l.b === sel) set.add(l.a); }); }
  const act = (id: string) => (sel === id ? router.push(`/concepts/${id}`) : setSel(id));
  const co = sel ? links.filter((l) => l.a === sel || l.b === sel).sort((a, b) => b.n - a.n) : [];
  return (
    <>
      <div className="graph-box">
        <svg viewBox="0 0 900 620" role="img" aria-label={`Co-occurrence graph of ${nodes.length} terms`} onClick={(e) => { if ((e.target as Element).tagName === "svg") setSel(null); }}>
          <g>
            {links.map((l) => (
              <line key={l.a + l.b} className={`edge${sel && (l.a === sel || l.b === sel) ? " hot" : ""}`} x1={byId[l.a].x} y1={byId[l.a].y} x2={byId[l.b].x} y2={byId[l.b].y} strokeWidth={0.8 + l.n * 0.9} />
            ))}
            {nodes.map((n) => (
              <circle key={n.id} className={`node${sel === n.id ? " hot" : ""}${sel && !set.has(n.id) ? " dim" : ""}`} r={n.r} cx={n.x} cy={n.y} tabIndex={0} role="button" aria-label={`${n.iast}, ${n.n} sūtras`}
                onClick={() => act(n.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(n.id); } }} />
            ))}
            {nodes.map((n) => <text key={n.id} className={`nlabel${sel && !set.has(n.id) ? " dim" : ""}`} x={n.x + n.r + 4} y={n.y + 4}>{n.iast}</text>)}
          </g>
        </svg>
      </div>
      <p className="graph-side" aria-live="polite" style={{ marginTop: "var(--s-4)" }}>
        {sel ? (
          <>
            <Link href={`/concepts/${sel}`}><span className="iast">{byId[sel].iast}</span></Link> ({byId[sel].en}) appears in {byId[sel].n} sūtras and shares a sūtra with {co.length} other terms
            {co.length ? ": " : ". "}
            {co.slice(0, 6).map((l, i) => { const o = l.a === sel ? l.b : l.a; return <span key={o}>{i ? ", " : ""}<Link href={`/concepts/${o}`}>{byId[o].iast}</Link> {l.n}×</span>; })}
            {co.length ? ". " : ""}Tap it again to open its page.
          </>
        ) : first}
      </p>
    </>
  );
}
