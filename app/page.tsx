import Link from "next/link";
import { PADAS, S, C } from "@/lib/corpus";
import ThreadServer from "@/components/ThreadServer";

export default function Home() {
  return (
    <>
      <p className="eyebrow">Patañjali · Yoga Sūtra</p>
      <h1 style={{ fontSize: "var(--s-8)", margin: "var(--s-3) 0" }}>The text, joined up.</h1>
      <p className="col muted" style={{ fontSize: "var(--s-4)" }}>
        The {S.length} sūtras in Sanskrit, with three public-domain English translations side by side, an index of {C.length} terms, and links to the Bhagavad Gītā. Every layer says where it came from.
      </p>
      <section style={{ marginTop: "var(--s-6)" }}><ThreadServer /></section>
      <section>
        <div className="eyebrow" style={{ marginBottom: "var(--s-4)" }}>Four chapters</div>
        <div className="rows">
          {PADAS.map((p) => (
            <Link key={p.n} className="row" href={`/read/${p.n}`}>
              <span className="num">{p.n}</span>
              <span><span className="r-deva" style={{ display: "block" }}>{p.deva}</span><span className="r-iast" style={{ display: "block" }}>{p.name}</span>
                <span className="r-en muted" style={{ display: "block" }}>{p.woods} · {S.filter((s) => s.pada === p.n).length} sūtras</span></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
