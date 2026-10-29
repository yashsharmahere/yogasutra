import Link from "next/link";
import { PADAS, S, C, D, byId, cById } from "@/lib/corpus";
import { Woods } from "@/components/Bits";
import PullServer from "@/components/PullServer";

const GROUND = [["/sutra/1-1", "Read from 1.1", "Sanskrit, transliteration and three translations, grouped under Woods' own headings."], ["/concepts/samadhi", "Follow samādhi", "Concentration, traced through every sūtra whose Sanskrit names it."], ["/sutra/2-29", "The eight limbs", "2.29 lists them; the following 34 sūtras take them one by one."], ["/concepts/klesa", "The five afflictions", "What troubles the mind, and the order in which the text says they arise."], ["/gita", "Read it beside the Gītā", "Where the Bhagavad Gītā uses the same words or teaches the same thing, each link read and typed."], ["/visuals", "See the structure", "The eight limbs, the afflictions, the ladder of concentration, drawn from the sūtras themselves."], ["/patanjali", "Meet Patañjali", "What the tradition says, and what scholars can say with confidence."], ["/tests", "How Ask is tested", "Thirty questions with the sūtras a good answer must cite."]];

export default function Home() {
  const s12 = byId["1.2"];
  return (
    <>
      <section className="hero2">
        <div className="hero-glyph" aria-hidden="true"><span className="deva">सूत्र</span><small>sūtra · a thread</small></div>
        <p className="eyebrow">Patañjali · Yoga Sūtra</p>
        <h1>One text.<br /><i>One thread.</i></h1>
        <p className="lede2">The word <i>sūtra</i> means thread. Here are all {S.length} of them in Sanskrit with three public-domain translations, joined by the words they share. Every layer says where it came from.</p>
        <p className="hero-cta"><Link className="btn" href="/sutra/1-1">Begin at 1.1</Link><Link className="btn ghost" href="/patanjali">Meet Patañjali</Link></p>
        <div className="facts"><span><b>{S.length}</b>sūtras</span><span><b>4</b>pādas</span><span><b>{C.length}</b>indexed terms</span><span><b>{D.links.length}</b>term links</span><span><b>{D.gita.links.length}</b>Gītā links</span></div>
      </section>

      <section>
        <div className="sec-h"><p className="eyebrow">Pull a thread</p><h2>Choose a word and see where it runs</h2>
          <p>Each knot is a sūtra, taller where it carries more indexed terms. The ones that hold your word light up across all four chapters.</p></div>
        <PullServer />
      </section>

      <section className="def">
        <div>
          <p className="eyebrow" style={{ marginBottom: ".8rem" }}>1.2 · the knot the rest is tied to</p>
          <p className="big-deva">{s12.deva}</p>
          <p className="big-iast">{s12.iast}</p>
        </div>
        <div style={{ display: "grid", gap: "var(--s-4)" }}>
          <p className="woods">“<Woods t={s12.en} />”</p><p className="cite">J. H. Woods, 1914. Square brackets mark words Woods supplied.</p>
          <p className="jn">“{s12.jn}”</p><p className="cite">Charles Johnston, 1912. A freer reading of the same sūtra.</p>
          <div className="chips">{s12.concepts.map((c) => <Link key={c} className="chip" href={`/concepts/${c}`}><span className="iast">{cById[c].iast}</span><small>{cById[c].en}</small></Link>)}</div>
          <p><Link className="btn ghost" href="/sutra/1-2">Open 1.2 and everything behind it</Link></p>
        </div>
      </section>

      <section>
        <div className="sec-h"><p className="eyebrow">Four chapters</p><h2>One continuous journey</h2></div>
        <div className="padas">
          {PADAS.map((p) => (
            <Link key={p.n} className="pada-card" href={`/read/${p.n}`}>
              <span className="mono pada-n">{p.n}</span>
              <span className="r-deva" style={{ display: "block", fontSize: "var(--s-6)" }}>{p.deva}</span>
              <span className="iast" style={{ display: "block", color: "var(--ink-2)" }}>{p.name} · {p.woods}</span>
              <span className="mini-thread" aria-hidden="true">{S.filter((s) => s.pada === p.n).map((s) => <i key={s.id} style={{ height: 6 + Math.min(s.concepts.length, 5) * 4 }} />)}</span>
              <span className="muted" style={{ fontFamily: "var(--f-ui)", fontSize: "var(--s-1)" }}>{S.filter((s) => s.pada === p.n).length} sūtras</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="sec-h"><p className="eyebrow">Ways in</p><h2>Where to start</h2></div>
        <div className="starts">{GROUND.map(([h, a, b]) => <Link key={h} href={h}><span className="t">{a}</span><span className="d">{b}</span></Link>)}</div>
      </section>
    </>
  );
}
