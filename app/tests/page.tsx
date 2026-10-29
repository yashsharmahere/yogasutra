import Link from "next/link";
import { D, byId, slug } from "@/lib/corpus";
import { Grade } from "@/components/Bits";
import run from "@/data/ask_run.json";

export const metadata = { title: "Ask test set", description: "Thirty questions an answer has to get right, with the latest run." };
const OUT: Record<string, [string, string]> = { ok: ["out-ok", "Acceptable"], refused: ["out-ref", "Correctly declined"], missed: ["out-miss", "Missed"], review: ["out-rev", "Needs review"] };

export default function Tests() {
  const T = D.tests as { id: string; type: string; q: string; gold?: string[] }[];
  const rows: Record<string, any> = Object.fromEntries((run.rows as any[]).map((x) => [x.id, x]));
  const c = (k: string) => (run.rows as any[]).filter((x) => x.outcome === k).length;
  const date = new Date(run.at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return (
    <>
      <div className="sec-h"><p className="eyebrow">Ask · test set</p><h2>Thirty questions Ask has to get right</h2>
        <p>Each question has the sūtras a good answer must cite. Some ask about things the text never mentions, where the right answer is to say so. The set and its expected sūtras are written for this edition, so they are graded Editorial; each run&apos;s answers are Model-assisted.</p></div>
      <div className="layers" style={{ marginTop: 0 }}>
        <div className="layer"><div className="lh"><span>Scoring</span><Grade g="derived" /></div><div>
          <b style={{ fontWeight: 500 }}>Acceptable</b> when an answer cites at least one expected sūtra. <b style={{ fontWeight: 500 }}>Correctly declined</b> when this edition gives no sufficient basis for the question and the answer says so. <b style={{ fontWeight: 500 }}>Missed</b> when it cites none of the expected sūtras or declines a question the edition answers. <b style={{ fontWeight: 500 }}>Needs review</b> when an answer cites a sūtra that does not exist, has an uncited sentence, or cannot be read. Citations are checked for existence, not yet for whether they support the sentence.</div></div>
      </div>
      <p className="note-box" style={{ marginTop: "var(--s-5)", maxWidth: "68ch" }}>
        Latest run, {date}: {c("ok") + c("refused")} of {run.rows.length} acceptable ({c("ok")} answered, {c("refused")} correctly declined), {c("missed")} missed, {c("review")} need review. This run was made in the prototype; the live site does not yet run Ask.
      </p>
      <div className="tbl-wrap" style={{ marginTop: "var(--s-5)" }}><table>
        <thead><tr><th>#</th><th>Question</th><th>Expected</th><th>Latest</th></tr></thead>
        <tbody>{T.map((t, i) => {
          const x = rows[t.id], n = x?.cited?.length ?? 0;
          return (
            <tr key={t.id}>
              <td className="mono">{i + 1}</td>
              <td>{t.q}{x?.why && <span className="flag" style={{ color: "var(--ink-3)" }}>{x.why}</span>}
                {x?.answer && <details style={{ marginTop: ".35rem", fontSize: "var(--s-2)" }}><summary style={{ cursor: "pointer", color: "var(--indigo)", fontFamily: "var(--f-ui)", fontSize: "var(--s-1)" }}>Read the answer</summary>
                  {x.answer.note && <p className="muted" style={{ marginTop: ".4rem" }}>{x.answer.note}</p>}
                  {x.answer.sentences.map((s: any, j: number) => <p key={j} style={{ marginTop: ".4rem" }}>{s.kind === "reading" ? <i>{s.text}</i> : s.text} <span className="mono muted" style={{ fontSize: "var(--s-1)" }}>{s.cites.join(" ")}</span></p>)}</details>}</td>
              <td>{t.type === "absent" ? <span className="muted">Say the edition gives no sufficient basis</span> : (t.gold ?? []).filter((g) => byId[g]).map((g) => <Link key={g} className="mono" href={`/sutra/${slug(g)}`} style={{ marginRight: ".4rem" }}>{g}</Link>)}{t.type === "partial" && <span className="muted"> or say so</span>}</td>
              <td>{x ? <><span className={`out ${OUT[x.outcome][0]}`}>{OUT[x.outcome][1]}</span>{n > 0 && <><br /><span className="mono muted" style={{ fontSize: "var(--s-1)" }}>{n} cited: {x.cited.slice(0, 5).join(" ")}{n > 5 ? " …" : ""}</span></>}</> : <span className="out out-none">Not run</span>}</td>
            </tr>
          );
        })}</tbody></table></div>
    </>
  );
}
