import { S, PADAS } from "@/lib/corpus";
import SearchBox from "@/components/SearchBox";
export const metadata = { title: "Search" };
export default function Search() {
  const counts = Object.fromEntries(PADAS.map((p) => [p.n, S.filter((s) => s.pada === p.n).length]));
  return (<><p className="eyebrow">Search</p><h1 style={{ fontSize: "var(--s-7)", marginBottom: "var(--s-5)" }}>Find a sūtra</h1><SearchBox sutras={S} counts={counts} /></>);
}
