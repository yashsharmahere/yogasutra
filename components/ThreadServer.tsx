import Thread from "./Thread";
import { S, PADAS } from "@/lib/corpus";

const data = { padas: PADAS.map((p) => ({ n: p.n, name: p.name })), knots: S.map((s) => ({ id: s.id, k: s.concepts.length, pada: s.pada, iast: s.iast, en: s.en })) };
export default function ThreadServer({ here, on }: { here?: string; on?: string[] }) {
  return <Thread data={data} here={here} on={on} />;
}
