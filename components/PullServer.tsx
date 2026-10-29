import PullThread from "./PullThread";
import { S, PADAS, C, cById } from "@/lib/corpus";

const data = { padas: PADAS.map((p) => ({ n: p.n, name: p.name })), knots: S.map((s) => ({ id: s.id, k: s.concepts.length, pada: s.pada, iast: s.iast, en: s.en })) };
const IDS = ["samadhi", "citta", "klesa", "isvara", "prajna", "kaivalya", "duhkha", "viveka"];
const terms = IDS.map((id) => cById[id]).map((c) => ({ id: c.id, iast: c.iast, en: c.en, sutras: c.sutras }));
export default function PullServer() { return <PullThread data={data} terms={terms} initial="samadhi" />; }
