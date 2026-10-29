import Link from "next/link";
import { PLATES } from "@/lib/plates";
import { Grade } from "@/components/Bits";

export function Plate({ k, compact }: { k: string; compact?: boolean }) {
  const P = (PLATES as any)[k];
  return (
    <figure className="plate" id={`plate-${k}`} style={{ marginInline: 0 }}>
      <div className="plate-h"><h3>{P.title}</h3><span className="mono muted" style={{ fontSize: "var(--s-2)" }}>{P.cites}</span><Grade g="editorial" /></div>
      <div dangerouslySetInnerHTML={{ __html: P.draw() }} />
      <figcaption className="dg-cap">{P.claim} {compact ? <Link href="/visuals">All diagrams</Link> : "Every box opens its sūtra. The words come from the text; the arrangement is a reading of it."}</figcaption>
    </figure>
  );
}
