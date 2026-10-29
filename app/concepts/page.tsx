import Link from "next/link";
import { C, D } from "@/lib/corpus";
import Icon from "@/components/Icons";
import { Grade } from "@/components/Bits";

export const metadata = { title: "Concepts" };
export default function Concepts() {
  const kinds = Array.from(new Set(C.map((c) => c.kind)));
  return (
    <>
      <p className="eyebrow">Index of terms</p>
      <h1 style={{ fontSize: "var(--s-7)" }}>{C.length} terms</h1>
      <p className="col muted" style={{ margin: "var(--s-3) 0 var(--s-6)" }}><Grade g="derived" /> Each term is found by a stem pattern; the pattern is shown on the term&apos;s page. Glosses are editorial.</p>
      {kinds.map((k) => (
        <section key={k} style={{ marginTop: "var(--s-6)" }}>
          <div className="kind-h"><Icon name={k} size={26} /><span className="eyebrow">{(D.kinds as Record<string, string>)[k] ?? k}</span></div>
          <div>{C.filter((c) => c.kind === k).map((c) => <Link key={c.id} className="chip" href={`/concepts/${c.id}`}><span className="iast">{c.iast}</span><small>{c.en} · {c.sutras.length}</small></Link>)}</div>
        </section>
      ))}
    </>
  );
}
