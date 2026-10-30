import Listen from "@/components/Listen";
import { notFound } from "next/navigation";
import Link from "next/link";
import { S, C, G, D, PADAS, byId, cById, slug, unslug } from "@/lib/corpus";
import { Grade, Woods, SLink } from "@/components/Bits";
import { Plate } from "@/components/Plate";
import { platesFor } from "@/lib/plates";
import SutraNav from "@/components/SutraNav";
import ThreadServer from "@/components/ThreadServer";

export const generateStaticParams = () => S.map((s) => ({ id: slug(s.id) }));
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const s = byId[unslug((await params).id)];
  return s ? { title: `Yoga Sūtra ${s.id}`, description: `${s.en} (Woods, 1914). ${s.iast}` } : {};
}

export default async function SutraPage({ params }: { params: Promise<{ id: string }> }) {
  const id = unslug((await params).id), s = byId[id];
  if (!s) notFound();
  const i = S.indexOf(s), prev = S[i - 1], next = S[i + 1];
  const pada = PADAS.find((p) => p.n === s.pada)!, g = G[s.group] ?? G.find((x) => x.id === s.group)!;
  const terms = s.concepts.map((c) => cById[c]).filter(Boolean);
  const gl = (D.gita.links as any[]).filter((l) => l.ys === s.id);
  const related = S.filter((x) => x.id !== s.id && x.concepts.filter((c) => s.concepts.includes(c)).length >= 2)
    .sort((a, b) => b.concepts.filter((c) => s.concepts.includes(c)).length - a.concepts.filter((c) => s.concepts.includes(c)).length).slice(0, 8).map((x) => x.id);
  return (
    <>
      <div className="crumb-bar">
        <div className="crumbs"><Link href={`/read/${s.pada}`}>{pada.name}</Link><span>/</span><span>{g.heading}</span><span>/</span><span className="mono">{s.id}</span></div>
      </div>
      <div className="sutra-top">
      <div className="s-head">
        <div className="num-bar">
          <span className="s-num">{s.id}</span>
          <SutraNav prev={prev ? { id: prev.id, iast: prev.iast } : null} next={next ? { id: next.id, iast: next.iast } : null} />
        </div>
        <p className="big-deva">{s.deva}</p>
        <p className="big-iast">{s.iast}</p>
        <Listen id={s.id} />
        <p className="woods col" style={{ marginTop: "var(--s-3)" }}>“<Woods t={s.en} />” <span className="who">Woods, 1914</span></p>
        <p className="jn col">“{s.jn}” <span className="who">Johnston, 1912</span></p>
        {s.vv ? <p className="jn col">“{s.vv}” <span className="who">Vivekananda, 1896</span></p> : <p className="jn col muted"><i>Vivekananda&apos;s edition has no counterpart for this sūtra.</i></p>}
      </div>
      <aside className="sutra-aside" aria-label="Terms and context">
        <div className="aside-block">
          <div className="aside-h"><span className="eyebrow">Terms</span><Grade g="derived" /></div>
          {terms.length ? <div className="chips">{terms.map((c) => <Link key={c.id} className="chip" href={`/concepts/${c.id}`}><span className="iast">{c.iast}</span><small>{c.en}</small></Link>)}</div> : <span className="muted">No indexed terms.</span>}
        </div>
        <div className="aside-block">
          <div className="aside-h"><span className="eyebrow">Group</span><Grade g="source" /></div>
          <p><b style={{ fontWeight: 500 }}>{g.heading}</b> <span className="mono muted">{g.range}</span></p>
          <p className="muted" style={{ fontSize: "var(--s-2)" }}>{g.summary}</p>
        </div>
        {(related.length > 0 || gl.length > 0) && <div className="aside-block">
          <div className="aside-h"><span className="eyebrow">Further down</span></div>
          <p style={{ fontSize: "var(--s-2)", display: "flex", gap: ".9rem", flexWrap: "wrap" }}>
            {related.length > 0 && <a href="#related">Related sūtras ({related.length})</a>}
            {gl.length > 0 && <a href="#gita">Gītā ({gl.length})</a>}
          </p>
        </div>}
      </aside>
      </div>
      <div className="layers">
        <div className="layer"><div className="lh"><span>Sanskrit</span><Grade g="source" /></div><div><span className="iast">{s.iast}</span>
          <p className="prov">GRETIL e-text, input and proofreading by Philipp A. Maas, from Kāśinātha Śāstrī Āgāśe&apos;s Ānandāśrama edition (Pune, 1904). Reference <span className="mono">ys_{s.id}</span>.</p></div></div>
        <div className="layer"><div className="lh"><span>Devanagari</span><Grade g="derived" /></div><div><span className="deva" style={{ fontSize: "1.2rem" }}>{s.deva}</span>
          <p className="prov">Transliterated from the IAST line by a fixed rule. Words ending in a consonant are closed up with the next word, as printed editions do.</p></div></div>
        <div className="layer"><div className="lh"><span>English · Woods</span><Grade g="source" /></div><div><Woods t={s.en} />
          <p className="prov">James Haughton Woods, <i>The Yoga-System of Patañjali</i>, Harvard Oriental Series 17 (1914), sūtras without the commentary. Square brackets are Woods&apos; own. Taken from OCR and corrected by hand.</p></div></div>
        <div className="layer"><div className="lh"><span>English · Johnston</span><Grade g="source" /></div><div>{s.jn}{s.jnote && <span className="flag">Transcription note: {s.jnote}</span>}
          <p className="prov">Charles Johnston, <i>The Yoga Sutras of Patanjali: The Book of the Spiritual Man</i> (New York, 1912), via Project Gutenberg #2526. Kept as printed; suspected errors are flagged, not changed.</p></div></div>
        <div className="layer"><div className="lh"><span>English · Vivekananda</span><Grade g="source" /></div><div>{s.vv ?? <i>{D.vvExtra.gap.note}</i>}{s.vvnote && <span className="flag">Transcription note: {s.vvnote}</span>}
          {s.id === "3.21" && <span className="flag">{D.vvExtra.extra.note} His 3.22: “{D.vvExtra.extra.text}” From here his third-pāda numbers run one higher.</span>}
          {s.id === "4.15" && <span className="flag">{D.vvExtra.gap.note}</span>}
          <p className="prov">Swami Vivekananda, <i>Raja Yoga</i> (New York, 1896), aphorisms as printed in <i>The Complete Works</i>, vol. 1. His commentary is not reproduced. Matched to this edition by the Sanskrit printed beside each aphorism.</p>
          {s.vvmap && <p className="prov"><span className="grade g-derived">Mapping verified</span> His aphorism {s.vvmap.ref}. {s.vvmap.how}.</p>}</div></div>
        {related.length > 0 && <div className="layer" id="related"><div className="lh"><span>Related sūtras</span><Grade g="derived" /></div><div>{related.map((r) => <span key={r} style={{ marginRight: ".7rem" }}><SLink id={r} /></span>)}
          <p className="prov">Sūtras that share at least two indexed terms with this one.</p></div></div>}
        {gl.length > 0 && <div className="layer" id="gita"><div className="lh"><span>Gītā</span><Grade g="editorial" /></div><div>
          {gl.map((l) => <p key={l.bg} style={{ marginBottom: ".6rem" }}><Link href="/gita">Gītā {l.bg}</Link> <span className="muted">({D.gita.kinds[l.kind].split(":")[0]})</span> {l.note}</p>)}
          <p className="prov">Found by search, kept after being read by hand.</p></div></div>}
      </div>
      {platesFor(s.id).length > 0 && <section style={{ marginTop: "var(--s-7)" }}><p className="eyebrow">In a diagram</p>{platesFor(s.id).map((k: string) => <Plate key={k} k={k} compact />)}</section>}
      <section style={{ marginTop: "var(--s-7)" }}><p className="eyebrow">Where it sits on the thread</p><ThreadServer here={s.id} on={related} /></section>
      <nav className="prefs" style={{ marginTop: "var(--s-7)", justifyContent: "space-between" }}>
        {prev ? <SLink id={prev.id}>← {prev.id}</SLink> : <span />}{next ? <SLink id={next.id}>{next.id} →</SLink> : <span />}
      </nav>
    </>
  );
}
