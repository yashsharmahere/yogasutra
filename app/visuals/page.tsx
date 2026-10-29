import Link from "next/link";
import { C, D, PADAS } from "@/lib/corpus";
import { Grade } from "@/components/Bits";
import { Plate } from "@/components/Plate";
import { PLATE_ORDER } from "@/lib/plates";

export const metadata = { title: "Visualize", description: "The structure of the Yoga Sūtra, drawn from the sūtras themselves." };

function Heatmap() {
  const per = (c: any) => [1, 2, 3, 4].map((p) => c.sutras.filter((id: string) => id.startsWith(p + ".")).length);
  const max = Math.max(...C.flatMap(per));
  return (
    <figure className="plate" style={{ marginInline: 0 }}>
      <div className="plate-h"><h3>Where each term lives</h3><Grade g="derived" /></div>
      <div className="tbl-wrap"><table className="heat"><thead><tr><th />{PADAS.map((p) => <th key={p.n} style={{ textAlign: "center" }}>{p.n}<br /><span className="muted" style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>{p.name.replace("-pāda", "")}</span></th>)}</tr></thead>
        <tbody>{Object.entries(D.kinds as Record<string, string>).map(([k, label]) => (
          <>
            <tr key={k}><th className="k" colSpan={5}>{label}</th></tr>
            {C.filter((c) => c.kind === k).map((c) => (
              <tr key={c.id}>
                <td className="term"><Link href={`/concepts/${c.id}`} className="iast">{c.iast}</Link> <span className="muted" style={{ fontFamily: "var(--f-ui)", fontSize: "var(--s-1)" }}>{c.en}</span></td>
                {per(c).map((n, i) => {
                  const pct = n ? Math.round(12 + (78 * n) / max) : 0, strong = n / max > 0.55;
                  return <td key={i} className="c" style={{ background: n ? `color-mix(in oklab, var(--indigo) ${pct}%, var(--card))` : "transparent", color: strong ? "var(--paper)" : "var(--ink)" }} title={`${c.iast} in pāda ${i + 1}: ${n} sūtra${n === 1 ? "" : "s"}`}>
                    {n ? <Link href={`/concepts/${c.id}`}>{n}</Link> : <span style={{ color: "var(--ink-3)" }}>·</span>}</td>;
                })}
              </tr>
            ))}
          </>
        ))}</tbody></table></div>
      <figcaption className="dg-cap">Number of sūtras in each pāda whose Sanskrit contains the term; darker means more. Pādas differ in length (51, 55, 55, 34), so compare within a row.</figcaption>
    </figure>
  );
}

export default function Visuals() {
  return (
    <>
      <div className="sec-h"><p className="eyebrow">Visualize</p><h2>The structure of the text, drawn</h2>
        <p>Each diagram is built from sūtras the text gives in sequence, and every box opens the sūtra it rests on. They are graded Editorial: the words are Patañjali&apos;s, the arrangement is a reading. The grid at the end is computed from the term index.</p>
        <p style={{ marginTop: ".4rem" }}><Link href="/graph">Open the term graph</Link>, which shows which ideas share a sūtra.</p></div>
      {PLATE_ORDER.map((k) => <Plate key={k} k={k} />)}
      <Heatmap />
    </>
  );
}
