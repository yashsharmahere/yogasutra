import Link from "next/link";
import { PADAS, S, C, D, byId, cById } from "@/lib/corpus";
import { Woods } from "@/components/Bits";
import ThreadServer from "@/components/ThreadServer";

export default function Home() {
  return (
    <>
      <p className="eyebrow">Patañjali · Yoga Sūtra</p>
      <h1 style={{ fontSize: "var(--s-8)", margin: "var(--s-3) 0" }}>The text, joined up.</h1>
      <p className="col muted" style={{ fontSize: "var(--s-4)" }}>
        The {S.length} sūtras in Sanskrit, with three public-domain English translations side by side, an index of {C.length} terms, and links to the Bhagavad Gītā. Every layer says where it came from.
      </p>
      <div className="facts"><span><b>{S.length}</b>sūtras</span><span><b>4</b>pādas</span><span><b>{C.length}</b>indexed terms</span><span><b>{D.links.length}</b>term links</span><span><b>{D.groups.length}</b>thematic groups</span><span><b>{D.gita.links.length}</b>Gītā links</span></div>
      <section style={{ marginTop: "var(--s-6)" }}><ThreadServer /></section>
      <section className="def">
        <div><p className="eyebrow" style={{ marginBottom: ".8rem" }}>1.2 · the definition the whole text rests on</p><p className="big-deva">{byId["1.2"].deva}</p><p className="big-iast">{byId["1.2"].iast}</p></div>
        <div style={{ display: "grid", gap: "var(--s-4)" }}>
          <p className="woods">“<Woods t={byId["1.2"].en} />”</p><p className="cite">J. H. Woods, 1914. Square brackets mark words Woods supplied.</p>
          <p className="jn">“{byId["1.2"].jn}”</p><p className="cite">Charles Johnston, 1912. A freer, plain-English reading of the same sūtra.</p>
          <div className="chips">{byId["1.2"].concepts.map((c) => <Link key={c} className="chip" href={`/concepts/${c}`}><span className="iast">{cById[c].iast}</span><small>{cById[c].en}</small></Link>)}</div>
          <p><Link className="btn ghost" href="/sutra/1-2">Open 1.2 and everything behind it</Link></p></div>
      </section>
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
      <section>
        <div className="sec-h"><p className="eyebrow">Ways in</p><h2>Where to start</h2></div>
        <div className="starts">
          {[["/sutra/1-1", "Read from 1.1", "Sanskrit, transliteration and three translations, grouped under Woods' own headings."], ["/concepts/samadhi", "Follow samādhi", "Concentration, traced through every sūtra whose Sanskrit names it."], ["/sutra/2-29", "The eight limbs", "2.29 lists them; the following 34 sūtras take them one by one."], ["/concepts/klesa", "The five afflictions", "What troubles the mind, and the order in which the text says they arise."], ["/gita", "Read it beside the Gītā", "Where the Bhagavad Gītā uses the same words or teaches the same thing, each link read and typed."], ["/visuals", "See the structure", "The eight limbs, the afflictions, the ladder of concentration, drawn from the sūtras themselves."], ["/tests", "How Ask is tested", "Thirty questions with the sūtras a good answer must cite."]].map(([h, a, b]) => <Link key={h} href={h}><span className="t">{a}</span><span className="d">{b}</span></Link>)}
        </div>
      </section>
    </>
  );
}
