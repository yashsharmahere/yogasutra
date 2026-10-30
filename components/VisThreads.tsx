"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* Term map: one slack thread per term, knotted at every sūtra that holds it.
   Each gap between knots is a small verlet rope: it hangs under gravity, is pushed by the
   cursor, and settles back. Only rows that are being touched are simulated. */

export type TRow = { id: string; iast: string; en: string; pattern: string; hits: number[] };
export type TGroup = { label: string; rows: TRow[] };
export type TInfo = { id: string; pada: number; deva: string; iast: string; en: string; terms: string[] };

const H = 24, Y = 12;
let infoIds: string[] = [];
let lens: number[] = [];
const infoId = (n: number) => (infoIds[n] || "").replace(".", "-");
const touchRef = { current: false };

function ThreadRow({ row, n, cuts, w, active, setActive }: { row: TRow; n: number; cuts: number[]; w: number; active: { row: string; n: number } | null; setActive: (v: { row: string; n: number; el: Element } | null) => void }) {
  const X = useCallback((i: number) => ((i + 0.5) / n) * w, [n, w]);
  const hitSet = useMemo(() => new Set(row.hits), [row.hits]);
  const router = useRouter();
  const anchors = useRef<Record<number, Element | null>>({});
  const nearest = (e: { clientX: number; clientY: number; currentTarget: Element }, reach: number) => {
    const b = e.currentTarget.getBoundingClientRect(), px = e.clientX - b.left, py = e.clientY - b.top;
    if (Math.abs(py - Y) > 14) return -1;
    let best = -1, bd = reach;
    row.hits.forEach((h) => { const d = Math.abs(X(h) - px); if (d <= bd) { bd = d; best = h; } });
    return best;
  };
  const choose = (h: number) => {
    if (h < 0) { if (active && active.row === row.id) setActive(null); return; }
    if (active && active.row === row.id && active.n === h) return;
    setActive({ row: row.id, n: h, el: anchors.current[h] as Element });
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => { if (e.pointerType !== "touch") choose(nearest(e, 6)); };
  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const touch = touchRef.current, h = nearest(e, touch ? 14 : 6);
    if (h < 0) return;
    const shown = active && active.row === row.id && active.n === h;
    if (touch && !shown) { choose(h); return; }
    const url = `/sutra/${infoId(h)}`;
    if (e.metaKey || e.ctrlKey) window.open(url, "_blank"); else router.push(url);
  };
  const mine = active && active.row === row.id;
  return (
    <svg className={`tr-svg tk${mine ? " has-active" : ""}`} width={w} height={H} viewBox={`0 0 ${w} ${H}`} onPointerMove={onMove} onPointerLeave={() => setActive(null)} onClick={onClick} onPointerDown={(e) => { touchRef.current = e.pointerType === "touch"; }} role="group" aria-label={`${row.iast}: ${row.hits.length} sūtras`}>
      {cuts.map((c) => <line key={c} className="tr-sep" x1={(c / n) * w} x2={(c / n) * w} y1={0} y2={H} />)}
      <line className="tr-base" x1={0} x2={w} y1={Y} y2={Y} />
      {Array.from({ length: n }, (_, i) => {
        if (hitSet.has(i)) return null;
        const h = lens[i], x = X(i);
        return <line key={i} className="tk-g" x1={x} x2={x} y1={Y - h / 2} y2={Y + h / 2} />;
      })}
      {row.hits.map((h) => {
        const on = mine && active!.n === h, echo = !mine && active && active.n === h, x = X(h), hh = lens[h] + 4;
        return (
          <a key={h} href={`/sutra/${infoId(h)}`} ref={(el) => { anchors.current[h] = el; }} className={`tk-h${on ? " on" : ""}${echo ? " echo" : ""}`} data-n={h} aria-label={`${row.iast}, sūtra ${infoIds[h]}`}
            onFocus={(e) => setActive({ row: row.id, n: h, el: e.currentTarget })} onBlur={() => setActive(null)}>
            <line className="tk-halo" x1={x} x2={x} y1={Y - hh / 2} y2={Y + hh / 2} />
            <line className="tk-core" x1={x} x2={x} y1={Y - hh / 2} y2={Y + hh / 2} />
          </a>
        );
      })}
    </svg>
  );
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default function VisThreads({ groups, info, cuts }: { groups: TGroup[]; info: TInfo[]; cuts: number[] }) {
  infoIds = info.map((i) => i.id);
  { const L = info.map((s) => s.deva.length), lo = Math.min(...L), hi = Math.max(...L); lens = L.map((l) => 5 + ((l - lo) / (hi - lo || 1)) * 9); }
  const n = info.length;
  const boxRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [act, setAct0] = useState<{ row: string; n: number; el: Element } | null>(null);
  const hideT = useRef<number>(0);
  const setAct = useCallback((a: { row: string; n: number; el: Element } | null) => { window.clearTimeout(hideT.current); if (a) setAct0(a); else hideT.current = window.setTimeout(() => setAct0(null), 220); }, []);
  useEffect(() => () => window.clearTimeout(hideT.current), []);
  const [pos, setPos] = useState<{ left: number; top: number; below: boolean } | null>(null);
  const rowOf = useMemo(() => Object.fromEntries(groups.flatMap((g) => g.rows).map((r) => [r.id, r])), [groups]);
  useEffect(() => {
    const el = boxRef.current?.querySelector(".tr-axis > div") as HTMLElement | null; if (!el) return;
    const ro = new ResizeObserver(() => setW(Math.floor(el.getBoundingClientRect().width)));
    ro.observe(el); setW(Math.floor(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (!act) { setPos(null); return; }
    const b = act.el.getBoundingClientRect(), cw = 330, margin = 10;
    const left = Math.max(margin, Math.min(window.innerWidth - cw - margin, b.left + b.width / 2 - 44));
    const below = b.top < 240;
    setPos({ left, top: below ? b.bottom + 12 : b.top - 12, below });
  }, [act]);
  const s = act ? info[act.n] : null, term = act ? rowOf[act.row] : null;
  const iastHtml = useMemo(() => {
    if (!s || !term) return null;
    const parts = s.iast.split(new RegExp(`(${esc(term.pattern)}[^\\s,.;]*)`, "i"));
    return parts.map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>));
  }, [s, term]);
  return (
    <div className="tr-wrap" ref={boxRef}>
      <div className="tr tr-axis" aria-hidden="true"><span /><div>{[0, 1, 2, 3].map((p) => <span key={p} style={{ flex: cuts[p + 1] - cuts[p] }}>Pāda {p + 1}</span>)}</div><span className="tr-n-h">Total</span></div>
      {groups.map((g) => (
        <div key={g.label} className="tr-group">
          <p className="tr-k">{g.label}</p>
          {g.rows.map((r) => (
            <div className="tr" key={r.id}>
              <Link className="tr-nm" href={`/concepts/${r.id}`}><span className="iast">{r.iast}</span><em>{r.en}</em></Link>
              <div className="tr-tx">{w > 0 && <ThreadRow row={r} n={n} cuts={cuts.slice(1, 4)} w={w} active={act} setActive={setAct} />}</div>
              <span className="tr-n" title={`${r.iast}: ${r.hits.length} sūtra${r.hits.length === 1 ? "" : "s"}`}>{r.hits.length}</span>
            </div>
          ))}
        </div>
      ))}
      {s && term && pos && (
        <div className={`tcard${pos.below ? " below" : ""}`} style={{ left: pos.left, top: pos.top }} role="status" onPointerEnter={() => window.clearTimeout(hideT.current)} onPointerLeave={() => setAct(null)}>
          <div className="tc-h"><span className="tc-id">{s.id}</span><span className="tc-term">{term.iast}</span><span className="tc-p">Pāda {s.pada}</span></div>
          <div className="tc-d">{s.deva}</div>
          <div className="tc-i">{iastHtml}</div>
          <div className="tc-e">{s.en}<small>Woods</small></div>
          <div className="tc-f"><span>{s.terms.length > 1 ? `Also holds: ${s.terms.filter((t) => t !== term.iast).join(", ")}` : "Only this term is indexed here"}</span><Link href={`/sutra/${s.id.replace(".", "-")}`}>Open {s.id} →</Link></div>
        </div>
      )}
    </div>
  );
}
