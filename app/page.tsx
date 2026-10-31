import Link from "next/link";
import { PADAS, S, C, D, byId, cById } from "@/lib/corpus";
import { Woods } from "@/components/Bits";
import Icon, { Ornament } from "@/components/Icons";
import NextLeaf, { type LeafSutra } from "@/components/NextLeaf";
import "./home.css";
import PadaArt from "@/components/PadaArt";
import PullServer from "@/components/PullServer";

const GROUND = [["/sutra/1-1", "Read from 1.1", "Sanskrit, transliteration and three translations, grouped under Woods' own headings.", "read"], ["/concepts/samadhi", "Follow samādhi", "Concentration, traced through every sūtra whose Sanskrit names it.", "samadhi"], ["/sutra/2-29", "The eight limbs", "2.29 lists them; the following 34 sūtras take them one by one.", "limb"], ["/concepts/klesa", "The five afflictions", "What troubles the mind, and the order in which the text says they arise.", "affliction"], ["/gita", "Read it beside the Gītā", "Where the Bhagavad Gītā uses the same words or teaches the same thing, each link read and typed.", "gita"], ["/visuals", "See the structure", "The eight limbs, the afflictions, the ladder of concentration, drawn from the sūtras themselves.", "structure"], ["/patanjali", "Meet Patañjali", "What the tradition says, and what scholars can say with confidence.", "serpent"], ["/tests", "How Ask is tested", "Thirty questions with the sūtras a good answer must cite.", "test"]];

const STARS = [{x:69.3,y:14.6,s:1.5,d:3.8,dl:3.2},{x:71.0,y:10.6,s:3,d:4.3,dl:0.5},{x:73.1,y:18.6,s:3,d:5.0,dl:5.0},{x:61.1,y:17.8,s:3,d:6.8,dl:3.5},{x:72.3,y:51.0,s:1.5,d:5.4,dl:0.8},{x:73.2,y:31.8,s:3,d:4.6,dl:4.9},{x:63.4,y:33.6,s:2,d:4.8,dl:3.3},{x:58.6,y:10.6,s:2,d:5.2,dl:3.2},{x:87.9,y:28.5,s:2.5,d:4.8,dl:1.5},{x:63.4,y:42.3,s:1.5,d:5.5,dl:3.2},{x:91.9,y:40.1,s:2,d:5.6,dl:0.4},{x:77.0,y:15.3,s:2,d:4.0,dl:2.9},{x:57.6,y:37.4,s:3,d:5.5,dl:5.3},{x:68.9,y:38.6,s:3,d:5.2,dl:4.8},{x:58.8,y:12.1,s:2,d:5.2,dl:4.0},{x:58.5,y:38.9,s:3,d:7.0,dl:4.9}];

const PETALS = [{y:45.1,d:12.9,dl:12.9,c:"#b8712e",w:8,s:2.4},{y:53.2,d:10.3,dl:7.2,c:"#e3c37e",w:6,s:1.8},{y:36.2,d:9.6,dl:11.3,c:"#e9a640",w:8,s:3.1},{y:57.2,d:13.3,dl:2.2,c:"#e9a640",w:5,s:1.7},{y:29.4,d:10.7,dl:0.4,c:"#b8712e",w:7,s:2.3},{y:68.5,d:12.6,dl:9.0,c:"#b8712e",w:5,s:2.7},{y:45.4,d:10.9,dl:14.0,c:"#e9a640",w:7,s:2.1},{y:31.8,d:11.0,dl:1.0,c:"#e9a640",w:8,s:1.8},{y:35.5,d:9.5,dl:0.2,c:"#e9a640",w:6,s:1.9},{y:72.6,d:12.3,dl:13.7,c:"#b8712e",w:8,s:1.7},{y:55.8,d:14.4,dl:3.8,c:"#e9a640",w:7,s:2.1}];

const LEAF: LeafSutra[] = S.map((s) => ({ id: s.id, pada: PADAS.find((p) => p.n === s.pada)!.name, deva: s.deva, iast: s.iast, en: s.en }));

export default function Home() {
  const s12 = byId["1.2"];
  return (
    <>
      <section className="hh" aria-label="Introduction">
        <div className="hh-sky" aria-hidden="true" />
        <div className="hh-stars" aria-hidden="true">{STARS.map((t, k) => <i key={k} style={{ left: `${t.x}%`, top: `${t.y}%`, width: t.s, height: t.s, animationDuration: `${t.d}s`, animationDelay: `${t.dl}s` } as React.CSSProperties} />)}</div>
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
          <div className="hh-yogi">
            <svg className="hh-halo" viewBox="0 0 100 100" aria-hidden="true"><circle className="draw" cx="50" cy="50" r="48" pathLength="1" /><circle className="breath" cx="50" cy="50" r="48" /></svg>
            <img src="/home/yogi.webp" width={1009} height={673} alt="A seated yogi in profile with a thin gold halo, painted in the manner of a Jodhpur miniature" />
          </div>
          <div className="hh-wind" aria-hidden="true">
            <span className="mist m1" /><span className="mist m2" /><span className="mist m3" />
            {PETALS.map((t, k) => <span key={k} className="petal" style={{ top: `${t.y}%`, animationDuration: `${t.d}s`, animationDelay: `-${t.dl}s` } as React.CSSProperties}><i style={{ background: t.c, width: t.w * 1.6, height: t.w * .8, animationDuration: `${t.s}s` } as React.CSSProperties} /></span>)}
          </div>
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
