"use client";
import Link from "next/link";
import { useState } from "react";
import Thread, { ThreadData } from "./Thread";

export type PullTerm = { id: string; iast: string; en: string; sutras: string[] };

export default function PullThread({ data, terms, initial }: { data: ThreadData; terms: PullTerm[]; initial: string }) {
  const [sel, setSel] = useState(initial);
  const t = terms.find((x) => x.id === sel)!;
  return (
    <div className="pull">
      <div className="pull-chips" role="group" aria-label="Choose a term to follow through the text">
        {terms.map((x) => (
          <button key={x.id} type="button" className={`pull-chip${x.id === sel ? " on" : ""}`} aria-pressed={x.id === sel} onClick={() => setSel(x.id)}>
            <span className="iast">{x.iast}</span><small>{x.sutras.length}</small>
          </button>
        ))}
      </div>
      <Thread data={data} on={t.sutras} />
      <p className="pull-note" aria-live="polite">
        <Link href={`/concepts/${t.id}`}><span className="iast">{t.iast}</span></Link> ({t.en}) appears in {t.sutras.length} sūtras:{" "}
        {t.sutras.slice(0, 12).map((s, i) => <span key={s}>{i ? ", " : ""}<Link className="mono" href={`/sutra/${s.replace(".", "-")}`}>{s}</Link></span>)}{t.sutras.length > 12 ? " …" : ""}
      </p>
    </div>
  );
}
