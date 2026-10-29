import Link from "next/link";
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, forceX, forceY } from "d3-force";
import { C, D, cById } from "@/lib/corpus";
import { Grade } from "@/components/Bits";
import GraphView, { GNode } from "@/components/GraphView";

export const metadata = { title: "Term graph", description: "Which terms of the Yoga Sūtra occur in the same sūtra." };

// The layout is computed once at build time, so the page ships no drawing library.
function layout() {
  const W = 900, H = 620;
  const nodes: any[] = C.map((c) => ({ id: c.id, r: 5 + Math.sqrt(c.sutras.length) * 3.2 }));
  const links: any[] = (D.links as any[]).map((l) => ({ source: l.a, target: l.b, n: l.n }));
  const sim = forceSimulation(nodes)
    .force("link", forceLink(links).id((d: any) => d.id).distance((l: any) => 90 - l.n * 8).strength(0.5))
    .force("charge", forceManyBody().strength(-210)).force("center", forceCenter(W / 2, H / 2))
    .force("collide", forceCollide((d: any) => d.r + 4)).force("x", forceX(W / 2).strength(0.06)).force("y", forceY(H / 2).strength(0.09)).stop();
  for (let i = 0; i < 320; i++) sim.tick();
  return nodes.map((n): GNode => ({ id: n.id, iast: cById[n.id].iast, en: cById[n.id].en, n: cById[n.id].sutras.length, r: n.r,
    x: Math.max(n.r + 40, Math.min(W - n.r - 40, n.x)), y: Math.max(n.r + 16, Math.min(H - n.r - 16, n.y)) }));
}

export default function GraphPage() {
  const l = D.links[0], nodes = layout();
  return (
    <>
      <div className="sec-h"><p className="eyebrow">Graph</p><h2>Which ideas stand in the same sūtra</h2>
        <p>Each circle is a term; its size is the number of sūtras that contain it. A line joins two terms that occur together, and its weight counts how often. Tap a term to light up its neighbours; tap again to open it.</p></div>
      <GraphView nodes={nodes} links={D.links} first={`Strongest link: ${cById[l.a].iast} and ${cById[l.b].iast}, together in ${l.n} sūtras (${l.sutras.join(", ")}).`} />
      <div className="legend"><span><Grade g="derived" /></span><span>{C.length} terms · {D.links.length} links · drawn from the Sanskrit, not from commentary. Every term is also listed on the <Link href="/concepts">Concepts</Link> page.</span></div>
    </>
  );
}
