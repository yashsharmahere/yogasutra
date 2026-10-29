import { notFound } from "next/navigation";
import Link from "next/link";
import { C, cById, byId, D, slug } from "@/lib/corpus";
import { Woods } from "@/components/Bits";

export const generateStaticParams = () => C.map((c) => ({ id: c.id }));
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const c = cById[(await params).id];
  return c ? { title: `${c.iast} (${c.en})`, description: c.gloss } : {};
}

export default async function ConceptPage({ params }: { params: Promise<{ id: string }> }) {
  const c = cById[(await params).id];
  if (!c) notFound();
  const co = (D.links as any[]).filter((l) => l.a === c.id || l.b === c.id).sort((x, y) => y.n - x.n).slice(0, 8);
  return (
    <>
      <div className="crumbs"><Link href="/concepts">Concepts</Link><span>/</span><span>{c.kind}</span></div>
      <h1 className="deva" style={{ fontSize: "var(--s-7)" }}>{c.deva}</h1>
      <p className="iast" style={{ fontSize: "var(--s-5)" }}>{c.iast} <span className="muted">· {c.en}</span></p>
      <p className="col" style={{ margin: "var(--s-4) 0" }}>{c.gloss}</p>
      <p className="muted" style={{ fontSize: "var(--s-2)" }}>Woods renders it “{c.woods}”. Matched by the stem pattern <span className="pattern">{c.pattern}</span> in the Sanskrit.</p>
      {co.length > 0 && <p style={{ margin: "var(--s-4) 0" }}>Often with: {co.map((l) => { const o = cById[l.a === c.id ? l.b : l.a]; return <Link key={o.id} className="chip" href={`/concepts/${o.id}`}><span className="iast">{o.iast}</span><small>{l.n} sūtras</small></Link>; })}</p>}
      <h2 style={{ fontSize: "var(--s-5)", margin: "var(--s-6) 0 var(--s-3)" }}>{c.sutras.length} sūtras</h2>
      <div className="rows">{c.sutras.map((id) => { const s = byId[id]; return (
        <Link key={id} className="row" href={`/sutra/${slug(id)}`}><span className="num">{id}</span><span><span className="r-iast" style={{ display: "block" }}>{s.iast}</span><span className="r-en" style={{ display: "block" }}><Woods t={s.en} /></span></span></Link>); })}</div>
    </>
  );
}
