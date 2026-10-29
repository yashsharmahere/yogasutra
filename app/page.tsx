import Link from "next/link";
import { PADAS, S, C, D, byId, cById } from "@/lib/corpus";
import { Woods } from "@/components/Bits";
import Icon, { Ornament } from "@/components/Icons";
import HeroThread from "@/components/HeroThread";
import PadaArt from "@/components/PadaArt";
import PullServer from "@/components/PullServer";

const GROUND = [["/sutra/1-1", "Read from 1.1", "Sanskrit, transliteration and three translations, grouped under Woods' own headings.", "read"], ["/concepts/samadhi", "Follow samādhi", "Concentration, traced through every sūtra whose Sanskrit names it.", "samadhi"], ["/sutra/2-29", "The eight limbs", "2.29 lists them; the following 34 sūtras take them one by one.", "limb"], ["/concepts/klesa", "The five afflictions", "What troubles the mind, and the order in which the text says they arise.", "affliction"], ["/gita", "Read it beside the Gītā", "Where the Bhagavad Gītā uses the same words or teaches the same thing, each link read and typed.", "gita"], ["/visuals", "See the structure", "The eight limbs, the afflictions, the ladder of concentration, drawn from the sūtras themselves.", "structure"], ["/patanjali", "Meet Patañjali", "What the tradition says, and what scholars can say with confidence.", "serpent"], ["/tests", "How Ask is tested", "Thirty questions with the sūtras a good answer must cite.", "test"]];

export default function Home() {
  const s12 = byId["1.2"];
  return (
    <>
      <section className="hero2 weave-bg">
        <HeroThread />
        <p className="eyebrow">Patañjali · Yoga Sūtra</p>
        <h1>One text.<br /><i>One thread.</i></h1>
        <p className="lede2">The word <i>sūtra</i> means thread. Here are all {S.length} of them in Sanskrit with three public-domain translations, joined by the words they share. Every layer says where it came from.</p>
        <p className="hero-cta"><Link className="btn" href="/sutra/1-1">Begin at 1.1</Link><Link className="btn ghost" href="/patanjali">Meet Patañjali</Link></p>
        <div className="statbar"><div><b>{S.length}</b><span>sūtras</span></div><div><b>4</b><span>pādas</span></div><div><b>{C.length}</b><span>indexed terms</span></div><div><b>{D.links.length}</b><span>term links</span></div><div><b>{D.gita.links.length}</b><span>Gītā links</span></div></div>
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

      <Ornament />
      <section>
        <div className="sec-h"><p className="eyebrow">Four chapters</p><h2>One continuous journey</h2></div>
        <div className="padas">
          {PADAS.map((p) => (
            <Link key={p.n} className="pada-card" href={`/read/${p.n}`}>
              <PadaArt n={p.n} />
              <span className="mono pada-n">{p.n}</span>
              <span className="r-deva" style={{ display: "block", fontSize: "var(--s-6)" }}>{p.deva}</span>
              <span className="iast" style={{ display: "block", color: "var(--ink-2)" }}>{p.name} · {p.woods}</span>
              <span className="mini-thread" aria-hidden="true">{S.filter((s) => s.pada === p.n).map((s) => <i key={s.id} style={{ height: 6 + Math.min(s.concepts.length, 5) * 4 }} />)}</span>
              <span className="muted" style={{ fontFamily: "var(--f-ui)", fontSize: "var(--s-1)" }}>{S.filter((s) => s.pada === p.n).length} sūtras</span>
            </Link>
          ))}
        </div>
      </section>

      <Ornament />
      <section>
        <div className="sec-h"><p className="eyebrow">Ways in</p><h2>Where to start</h2></div>
        <div className="starts">{GROUND.map(([h, a, b, ic]) => <Link key={h} href={h}><Icon name={ic} size={26} /><span className="t">{a}</span><span className="d">{b}</span></Link>)}</div>
      </section>
    </>
  );
}
