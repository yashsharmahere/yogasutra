import { notFound } from "next/navigation";
import Link from "next/link";
import { PADAS, S, G } from "@/lib/corpus";
import ReaderList from "@/components/ReaderList";

export const generateStaticParams = () => PADAS.map((p) => ({ pada: String(p.n) }));
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ pada: string }> }) {
  const pada = (await params).pada;
  const p = PADAS.find((x) => String(x.n) === pada);
  return { title: p ? `${p.name} (${p.woods})` : "Read" };
}

export default async function Read({ params }: { params: Promise<{ pada: string }> }) {
  const n = Number((await params).pada), p = PADAS.find((x) => x.n === n);
  if (!p) notFound();
  const sutras = S.filter((s) => s.pada === n);
  return (
    <>
      <p className="eyebrow">Chapter {n} of 4</p>
      <h1 className="deva" style={{ fontSize: "var(--s-7)" }}>{p.deva}</h1>
      <p className="iast muted" style={{ fontSize: "var(--s-5)" }}>{p.name} · {p.woods}</p>
      <nav className="prefs" style={{ marginTop: "var(--s-5)" }}>{PADAS.map((x) => <Link key={x.n} href={`/read/${x.n}`} aria-current={x.n === n ? "page" : undefined}>{x.n}. {x.name}</Link>)}</nav>
      <div className="muted" style={{ fontSize: "var(--s-2)", marginBottom: "var(--s-5)" }}>{G.filter((g) => g.pada === n).length} groups, under Woods&apos; own headings.</div>
      <ReaderList sutras={sutras} />
    </>
  );
}
