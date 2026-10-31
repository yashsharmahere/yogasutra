import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { PADAS, S, G, D } from "@/lib/corpus";
import NextLeaf, { type LeafSutra } from "@/components/NextLeaf";
import ReadBar from "@/components/ReadBar";
import "./home.css";
import PullServer from "@/components/PullServer";


const STARS = [{x:69.3,y:14.6,s:1.5,d:3.8,dl:3.2},{x:71.0,y:10.6,s:3,d:4.3,dl:0.5},{x:73.1,y:18.6,s:3,d:5.0,dl:5.0},{x:61.1,y:17.8,s:3,d:6.8,dl:3.5},{x:72.3,y:51.0,s:1.5,d:5.4,dl:0.8},{x:73.2,y:31.8,s:3,d:4.6,dl:4.9},{x:63.4,y:33.6,s:2,d:4.8,dl:3.3},{x:58.6,y:10.6,s:2,d:5.2,dl:3.2},{x:87.9,y:28.5,s:2.5,d:4.8,dl:1.5},{x:63.4,y:42.3,s:1.5,d:5.5,dl:3.2},{x:91.9,y:40.1,s:2,d:5.6,dl:0.4},{x:77.0,y:15.3,s:2,d:4.0,dl:2.9},{x:57.6,y:37.4,s:3,d:5.5,dl:5.3},{x:68.9,y:38.6,s:3,d:5.2,dl:4.8},{x:58.8,y:12.1,s:2,d:5.2,dl:4.0},{x:58.5,y:38.9,s:3,d:7.0,dl:4.9}];

const PETALS = [{y:45.1,d:12.9,dl:12.9,c:"#b8712e",w:8,s:2.4},{y:53.2,d:10.3,dl:7.2,c:"#e3c37e",w:6,s:1.8},{y:36.2,d:9.6,dl:11.3,c:"#e9a640",w:8,s:3.1},{y:57.2,d:13.3,dl:2.2,c:"#e9a640",w:5,s:1.7},{y:29.4,d:10.7,dl:0.4,c:"#b8712e",w:7,s:2.3},{y:68.5,d:12.6,dl:9.0,c:"#b8712e",w:5,s:2.7},{y:45.4,d:10.9,dl:14.0,c:"#e9a640",w:7,s:2.1},{y:31.8,d:11.0,dl:1.0,c:"#e9a640",w:8,s:1.8},{y:35.5,d:9.5,dl:0.2,c:"#e9a640",w:6,s:1.9},{y:72.6,d:12.3,dl:13.7,c:"#b8712e",w:8,s:1.7},{y:55.8,d:14.4,dl:3.8,c:"#e9a640",w:7,s:2.1}];

const ABOUT: Record<number, string> = {
  1: "What yoga is, the stilling of the mind, and the kinds of absorption (samādhi) that follow from it.",
  2: "The practice: discipline, the five afflictions that cloud the mind, and the first five of the eight limbs.",
  3: "The last three limbs, practised together as saṃyama, and the extraordinary powers the text says they bring.",
  4: "How mind, karma and perception work, ending in kaivalya: the self standing free.",
};
const LIMBS: [string, string, string][] = [["yama", "abstentions", "2.30"], ["niyama", "observances", "2.32"], ["āsana", "posture", "2.46"], ["prāṇāyāma", "breath", "2.49"], ["pratyāhāra", "withdrawing the senses", "2.54"], ["dhāraṇā", "fixed attention", "3.1"], ["dhyāna", "contemplation", "3.2"], ["samādhi", "absorption", "3.3"]];
const ARCH = "M0,1 V0.4 C0,0.25 0.3,0.2 0.41,0.09 C0.46,0.04 0.48,0.01 0.5,0 C0.52,0.01 0.54,0.04 0.59,0.09 C0.7,0.2 1,0.25 1,0.4 V1 Z";
const RISE = [1.1, 1.3, 1.5, 1.7];
const slug = (id: string) => id.replace(".", "-");
const vignette = (n: number) => fs.existsSync(path.join(process.cwd(), "public/home", `arch-${n}.webp`)) ? `/home/arch-${n}.webp` : null;

const LEAF: LeafSutra[] = S.map((s) => ({ id: s.id, pada: PADAS.find((p) => p.n === s.pada)!.name, deva: s.deva, iast: s.iast, en: s.en }));

export default function Home() {
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

      <section className="hs-about">
        <p className="lede">The Yoga Sūtra is a short Sanskrit text of {S.length} sūtras: terse lines made to be memorised and explained. It is attributed to Patañjali and most often dated to the second to fourth centuries CE. It defines yoga as the stilling of the mind, and sets out a path from that stillness to freedom.</p>
        <ul className="hs-facts">
          <li><b>Every layer says where it came from.</b> The Sanskrit is from GRETIL; each term, link and summary is marked as source, derived or editorial. <Link href="/method">How this edition is built</Link></li>
          <li><b>Three translations side by side.</b> J. H. Woods (1914), Charles Johnston (1912) and Swami Vivekananda (1896), all in the public domain.</li>
          <li><b>Read beside the Gītā.</b> {D.gita.links.length} places where the Bhagavad Gītā uses the same words or teaches the same thing, each one read and typed. <Link href="/gita">See the links</Link></li>
        </ul>
      </section>

      <section id="chapters" className="hs-chapters">
        <div className="hs-h"><h2>Four chapters</h2><p>The text moves from what yoga is, to how it is practised, to what it opens, to where it ends.</p></div>
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}><defs><clipPath id="arch" clipPathUnits="objectBoundingBox"><path d={ARCH} /></clipPath></defs></svg>
        <div className="hs-padas">
          {PADAS.map((p) => {
            const ss = S.filter((s) => s.pada === p.n), groups = G.filter((g) => g.pada === p.n), img = vignette(p.n);
            return (
              <article key={p.n} className="hs-pada" style={{ "--r": RISE[p.n - 1] } as React.CSSProperties}>
                <Link className="hs-pada-top" href={`/read/${p.n}`}>
                  <span className="hs-box">
                    <span className="hs-arch">
                      {img ? <img src={img} alt="" width={543} height={724} loading="lazy" /> : <span className="ph" lang="sa">{p.deva}</span>}
                      <svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true"><path d={ARCH} vectorEffect="non-scaling-stroke" /></svg>
                    </span>
                  </span>
                  <span className="hs-num">Chapter {p.n}</span>
                  <h3><span lang="sa" className="deva">{p.deva}</span><span className="iast">{p.name}</span></h3>
                  <p className="about">{ABOUT[p.n]}</p>
                  <span className="hs-range"><span className="mono">{ss[0].id}–{ss[ss.length - 1].id}</span><span>{ss.length} sūtras · {groups.length} sections</span></span>
                  <ReadBar ids={ss.map((s) => s.id)} />
                </Link>
                <details className="hs-toc">
                  <summary>Contents</summary>
                  <ol>{groups.map((g) => <li key={g.id}><Link href={`/sutra/${slug(g.sutras[0])}`}><span>{g.heading}</span><span className="mono">{g.range}</span></Link></li>)}</ol>
                </details>
              </article>
            );
          })}
        </div>
        {PADAS.some((p) => vignette(p.n)) && <p className="hs-credit">Chapter illustrations AI-edited</p>}
      </section>

      <section className="hs-limbs">
        <div className="hs-h"><h2>The eight limbs</h2><p>Sūtra 2.29 names them; the text then takes them one by one. The first five turn outward, the last three inward.</p></div>
        <ol className="hs-limb-row">
          {LIMBS.map(([n, en, id], k) => (
            <li key={n} className={k > 4 ? "inner" : ""}><Link href={`/sutra/${slug(id)}`}><span className="k">{k + 1}</span><span className="iast">{n}</span><span className="en">{en}</span><span className="mono">{id}</span></Link></li>
          ))}
        </ol>
        <p className="hs-more"><Link href="/sutra/2-29">Start at 2.29</Link><Link href="/visuals">See the limbs drawn out</Link></p>
      </section>

      <section className="hs-thread">
        <div className="hs-h"><h2>Pull a thread</h2><p>Pick a word. Every sūtra that uses it lights up, across all four chapters.</p></div>
        <PullServer />
      </section>
    </>
  );
}
