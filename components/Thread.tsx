"use client";
import Link from "next/link";
import { useState } from "react";

type K = { id: string; k: number; pada: number };
type P = { n: number; name: string };
export type ThreadData = { padas: P[]; knots: (K & { iast: string; en: string })[] };

export default function Thread({ data, here, on = [] }: { data: ThreadData; here?: string; on?: string[] }) {
  const [sel, setSel] = useState<ThreadData["knots"][number] | null>(null);
  const onSet = new Set(on);
  const show = (k: ThreadData["knots"][number]) => () => setSel(k);
  return (
    <>
      <div className="thread">
        {data.padas.map((p) => {
          const ks = data.knots.filter((k) => k.pada === p.n);
          return (
            <div className="strand" key={p.n}>
              <div className="strand-label"><b>{p.name}</b>{p.n} · {ks.length} sūtras</div>
              <div className="knots">
                {ks.map((k) => (
                  <Link key={k.id} href={`/sutra/${k.id.replace(".", "-")}`} aria-label={`Sūtra ${k.id}`}
                    className={`knot${k.id === here ? " here" : ""}${onSet.has(k.id) ? " on" : ""}`}
                    style={{ "--k": Math.min(k.k, 5) } as any} onPointerOver={show(k)} onFocus={show(k)}><i /></Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="thread-cap" aria-live="polite">
        {sel ? <><span className="mono">{sel.id}</span> <span className="iast">{sel.iast}</span><br />{sel.en.replace(/[\[\]]/g, "")}</> : "Hover or tap a knot to read it. Taller knots carry more of the indexed terms."}
      </p>
    </>
  );
}
