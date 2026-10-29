import Link from "next/link";
import { D, byId, slug } from "@/lib/corpus";
import { Grade } from "@/components/Bits";
export const metadata = { title: "Gītā connections" };
export default function Gita() {
  const g = D.gita;
  return (
    <>
      <p className="eyebrow">Bhagavad Gītā</p>
      <h1 style={{ fontSize: "var(--s-7)" }}>{g.links.length} connections</h1>
      <p className="col muted" style={{ margin: "var(--s-3) 0 var(--s-6)" }}><Grade g="editorial" /> A search over {g.verseCount} Gītā verses found {g.candidates} candidate pairs. The top {g.reviewedTop} were read by hand and {g.links.length} kept. Each says whether it is the same teaching, a shared list, or only shared wording.</p>
      <div className="rows">{g.links.map((l: any) => { const s = byId[l.ys], v = g.verses[l.bg]; return (
        <div key={l.ys + l.bg} className="row" style={{ display: "block" }}>
          <p><Link href={`/sutra/${slug(l.ys)}`}>Yoga Sūtra {l.ys}</Link> · Gītā {l.bg} · <span className="muted">{g.kinds[l.kind].split(":")[0]}</span></p>
          <div className="pair" style={{ margin: ".6rem 0" }}><p className="iast">{s.iast}</p><p className="iast">{v?.iast}</p></div>
          <p>{l.note}</p></div>); })}</div>
      <h2 style={{ fontSize: "var(--s-5)", margin: "var(--s-7) 0 var(--s-3)" }}>Rejected on reading</h2>
      <ul className="col">{g.rejected.map((r: any) => <li key={r.ys + r.bg}>YS {r.ys} and Gītā {r.bg}: {r.why}</li>)}</ul>
      <p className="prov" style={{ marginTop: "var(--s-5)" }}>Gītā Sanskrit from github.com/gita/gita (Unlicense). Only the Sanskrit is used.</p>
    </>
  );
}
