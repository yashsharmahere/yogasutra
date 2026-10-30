import Link from "next/link";
import { C, D, S } from "@/lib/corpus";
import { Grade } from "@/components/Bits";
import { PLATES } from "@/lib/plates";
import { glyph } from "@/lib/visGlyphs";
import VisToc from "@/components/VisToc";

export const metadata = { title: "Visualize", description: "The structure of the Yoga Sūtra, drawn from the sūtras themselves." };

const ITEMS = [
  { id: "limbs", k: "limbs", plate: "limbs", title: "The eight limbs", range: "2.29, 3.4–3.8", q: "What are the eight aids to yoga, and which three are called saṃyama?" },
  { id: "vrtti", k: "vrtti", plate: "vrtti", title: "The five fluctuations", range: "1.5–1.11", q: "What kinds of mental activity does yoga set out to still?" },
  { id: "klesa", k: "klesa", plate: "klesa", title: "The five afflictions", range: "2.3–2.11", q: "What are the afflictions, and how do they grow out of ignorance?" },
  { id: "pain", k: "pain", plate: "pain", title: "How suffering arises, and ends", range: "2.16–2.26", q: "Where does suffering come from, and where does it stop?" },
  { id: "ladder", k: "ladder", plate: "ladder", title: "The ladder of concentration", range: "1.41–1.51", q: "How does absorption climb from coarse objects to no seed at all?" },
  { id: "terms", k: "terms", plate: "", title: "Where each term lives", range: "44 terms · 195 sūtras", q: "Which ideas belong to which part of the text?" },
];

const N = S.length;
const IDX: Record<string, number> = Object.fromEntries(S.map((s, i) => [s.id, i]));
const CUTS = [0, 51, 106, 161, N];

function Head({ i }: { i: number }) {
  const it = ITEMS[i];
  return (
    <div className="vs-h">
      <span className="vs-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
      <div><h2>{it.title}</h2><p className="vs-q">{it.q}</p></div>
      <span className="vs-meta"><span className="mono">{it.range}</span><Grade g={it.plate ? "editorial" : "derived"} /></span>
    </div>
  );
}

function TermRow({ c }: { c: (typeof C)[number] }) {
  const hits = c.sutras.map((id) => IDX[id]).filter((n) => n !== undefined);
  return (
    <div className="tr">
      <Link className="tr-nm" href={`/concepts/${c.id}`}><span className="iast">{c.iast}</span><em>{c.en}</em></Link>
      <svg className="tr-tx" viewBox={`0 0 ${N} 10`} preserveAspectRatio="none" role="img" aria-label={`${c.iast}: ${hits.length} sūtras`}>
        <line className="tr-base" x1="0" y1="5" x2={N} y2="5" />
        {CUTS.slice(1, 4).map((x) => <line key={x} className="tr-sep" x1={x} y1="0" x2={x} y2="10" />)}
        {hits.map((n) => (
          <a key={n} href={`/sutra/${S[n].id.replace(".", "-")}`}><title>{`${c.iast} · ${S[n].id}`}</title><rect className="tr-hit" x={n + 0.1} y="0.5" width="0.8" height="9" /></a>
        ))}
      </svg>
    </div>
  );
}

export default function Visuals() {
  return (
    <>
      <div className="vis-intro">
        <div className="sec-h" style={{ margin: 0 }}>
          <p className="eyebrow">Visualize</p><h1 className="vis-h1">The structure of the text, drawn</h1>
          <p>Six pictures of how the Yoga Sūtra is put together. Five follow a sequence the text itself gives; the sixth maps where each of the 44 indexed terms appears across all 195 sūtras.</p>
        </div>
        <ul className="vis-key">
          <li><svg viewBox="0 0 26 18" aria-hidden="true"><rect x="1" y="2" width="24" height="14" rx="2" /></svg><span>Every box is a link to the sūtra it comes from.</span></li>
          <li><svg viewBox="0 0 26 18" aria-hidden="true"><rect x="1" y="2" width="24" height="14" rx="2" className="k" /></svg><span>Gold boxes and arrows carry the main line of the argument.</span></li>
          <li><svg viewBox="0 0 26 18" aria-hidden="true"><circle cx="13" cy="9" r="4" className="dot" /></svg><span>Graded Editorial: the words are Patañjali&apos;s, the arrangement is a reading.</span></li>
        </ul>
      </div>

      <nav className="vis-tiles" aria-label="Diagrams">
        {ITEMS.map((it, i) => (
          <a key={it.id} className="vis-tile" href={`#${it.id}`}>
            <span className="vis-gl" dangerouslySetInnerHTML={{ __html: glyph(it.k) }} />
            <b>{it.title}</b><span className="vis-tq">{it.q}</span>
            <span className="vis-tn mono" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          </a>
        ))}
      </nav>

      <div className="vis-lay">
        <div className="vis-main">
          {ITEMS.slice(0, 5).map((it, i) => {
            const P = (PLATES as any)[it.plate];
            return (
              <section key={it.id} id={it.id} className="vs">
                <Head i={i} />
                <div dangerouslySetInnerHTML={{ __html: P.draw() }} />
                <p className="vs-read"><b>How to read it</b><span>{P.claim}</span></p>
              </section>
            );
          })}
          <section id="terms" className="vs">
            <Head i={5} />
            <div className="tr-legend"><span><i />a sūtra whose Sanskrit holds the term</span><span>One row per term, one column per sūtra in order. Each tick opens its sūtra; each name opens the term.</span></div>
            <div className="tr-wrap">
              <div className="tr tr-axis" aria-hidden="true"><span /><div>{[0, 1, 2, 3].map((p) => <span key={p} style={{ flex: CUTS[p + 1] - CUTS[p] }}>Pāda {p + 1}</span>)}</div></div>
              {Object.entries(D.kinds as Record<string, string>).map(([k, label]) => (
                <div key={k} className="tr-group">
                  <p className="tr-k">{label}</p>
                  {C.filter((c) => c.kind === k).map((c) => <TermRow key={c.id} c={c} />)}
                </div>
              ))}
            </div>
            <p className="vs-read"><b>How to read it</b><span>Computed from the term index: a tick means the term&apos;s Sanskrit form occurs in that sūtra. Pādas differ in length (51, 55, 55, 34), so read each row for its shape, not its total.</span></p>
          </section>
        </div>
        <aside className="vis-side"><VisToc items={ITEMS.map(({ id, k, title }) => ({ id, k, title }))} /></aside>
      </div>
    </>
  );
}
