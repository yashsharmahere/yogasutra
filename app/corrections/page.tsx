import Link from "next/link";
import log from "@/data/woods_corrections.json";
import { slug } from "@/lib/corpus";

export const metadata = { title: "Corrections to Woods" };
const KIND: Record<string, string> = { "ocr-error": "OCR error", diacritic: "Diacritic restored", "page-furniture": "Page furniture removed", "group-heading": "Group heading trimmed" };

export default function Corrections() {
  return (
    <div className="prose">
      <p className="eyebrow">Method</p>
      <h1 style={{ fontSize: "var(--s-7)", marginBottom: "var(--s-4)" }}>Corrections to Woods</h1>
      <p>Woods (1914) is available online only as OCR text. This is every change made to it. {log.verified_identical} sūtras matched the OCR exactly and needed none. The other {log.read_by_hand} were read by hand.</p>
      <p className="muted" style={{ fontSize: "var(--s-2)" }}>Source: {log.source}. {log.method}</p>
      <h3>General rules</h3>
      <ul>{log.general_rules.map((r) => <li key={r}>{r}</li>)}</ul>
      <h3>Per sūtra</h3>
      <div className="tbl-wrap"><table>
        <thead><tr><th>Sūtra</th><th>OCR</th><th>Here</th><th>Kind</th></tr></thead>
        <tbody>{log.entries.flatMap((e) => e.changes.map((c, i) => (
          <tr key={e.id + i}><td>{i === 0 ? <Link href={`/sutra/${slug(e.id)}`}>{e.id}</Link> : ""}</td><td>{c.from}</td><td>{c.to}</td><td>{KIND[c.kind]}</td></tr>)))}</tbody>
      </table></div>
      <h3>Limits</h3>
      <ul>{log.limits.map((r) => <li key={r}>{r}</li>)}</ul>
    </div>
  );
}
