import Link from "next/link";
import { PADAS, S, C, D, byId, cById } from "@/lib/corpus";
import { Woods } from "@/components/Bits";
import Icon, { Ornament } from "@/components/Icons";
import NextLeaf, { type LeafSutra } from "@/components/NextLeaf";
import "./home.css";
import PadaArt from "@/components/PadaArt";
import PullServer from "@/components/PullServer";

const GROUND = [["/sutra/1-1", "Read from 1.1", "Sanskrit, transliteration and three translations, grouped under Woods' own headings.", "read"], ["/concepts/samadhi", "Follow samādhi", "Concentration, traced through every sūtra whose Sanskrit names it.", "samadhi"], ["/sutra/2-29", "The eight limbs", "2.29 lists them; the following 34 sūtras take them one by one.", "limb"], ["/concepts/klesa", "The five afflictions", "What troubles the mind, and the order in which the text says they arise.", "affliction"], ["/gita", "Read it beside the Gītā", "Where the Bhagavad Gītā uses the same words or teaches the same thing, each link read and typed.", "gita"], ["/visuals", "See the structure", "The eight limbs, the afflictions, the ladder of concentration, drawn from the sūtras themselves.", "structure"], ["/patanjali", "Meet Patañjali", "What the tradition says, and what scholars can say with confidence.", "serpent"], ["/tests", "How Ask is tested", "Thirty questions with the sūtras a good answer must cite.", "test"]];

const LEAF: LeafSutra[] = S.map((s) => ({ id: s.id, pada: PADAS.find((p) => p.n === s.pada)!.name, deva: s.deva, iast: s.iast, en: s.en }));

export default function Home() {
  const s12 = byId["1.2"];
  return (
    <>
      <section className="hh" aria-label="Ekatāna">
        <div className="hh-in">
          <div className="hh-lead">
            <div className="hh-intro">
              <h1>A connected reader for Patañjali’s Yoga&nbsp;Sūtra.</h1>
              <p>All {S.length} sūtras in Sanskrit, with three public-domain translations, linked by the words they share.</p>
            </div>
            <NextLeaf list={LEAF} />
          </div>
        </div>
        <figure className="hh-art">
          <img src="/home/yogi.webp" width={1009} height={673} alt="A seated yogi in profile with a thin gold halo, painted in the manner of a Jodhpur miniature" />
          <figcaption>Illustration AI-edited</figcaption>
        </figure>
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
      <section id="chapters">
        <div className="sec-h"><p className="eyebrow">Four chapters</p><h2>One continuous journey</h2></div>
        <div className="padas">
          {PADAS.map((p) => (
            <Link key={p.n} className="pada-card" href={`/read/${p.n}`}>
              <PadaArt n={p.n} />
              <span className="r-deva" style={{ display: "block", fontSize: "var(--s-6)" }}>{p.deva}</span>
              <span className="iast pada-sub" style={{ display: "block", color: "var(--ink-2)" }}>{p.name} · {p.woods}</span>
              {(() => { const ss = S.filter((s) => s.pada === p.n); return (
                <span className="pada-range"><span className="range">{ss[0].id.replace("-", ".")}<i>–</i>{ss[ss.length - 1].id.replace("-", ".")}</span><span className="cnt">{ss.length} sūtras</span></span>
              ); })()}
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
