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

const H = 34, Y = 10, SPRING = 0.045, DAMP = 0.955, ITER = 5, R = 36;

type Rope = { x: Float32Array; y: Float32Array; ox: Float32Array; oy: Float32Array; rx: Float32Array; ry: Float32Array; seg: number; k: number };
type Sim = { ropes: Rope[]; els: SVGPathElement[][]; ptr: { x: number; y: number } | null; quiet: number };

function makeRope(x0: number, x1: number): Rope {
  const dist = Math.max(8, x1 - x0);
  const sag = Math.min(11, dist * 0.2 + 2);
  const len = dist + (8 * sag * sag) / (3 * dist);
  const k = Math.max(6, Math.min(26, Math.round(dist / 14)));
  const r: Rope = { x: new Float32Array(k), y: new Float32Array(k), ox: new Float32Array(k), oy: new Float32Array(k), rx: new Float32Array(k), ry: new Float32Array(k), seg: len / (k - 1), k };
  for (let i = 0; i < k; i++) { const t = i / (k - 1); r.x[i] = r.ox[i] = r.rx[i] = x0 + t * (x1 - x0); r.y[i] = r.oy[i] = r.ry[i] = Y + 4 * sag * t * (1 - t); }
  return r;
}
function solve(r: Rope, x0: number, x1: number) {
  const { x, y, k, seg } = r;
  for (let it = 0; it < ITER; it++) {
    x[0] = x0; y[0] = Y; x[k - 1] = x1; y[k - 1] = Y;
    for (let i = 0; i < k - 1; i++) {
      const dx = x[i + 1] - x[i], dy = y[i + 1] - y[i], d = Math.hypot(dx, dy) || 1e-6, diff = (d - seg) / d / 2;
      const a = i === 0 ? 0 : 1, b = i === k - 2 ? 0 : 1, tot = a + b || 1;
      x[i] += dx * diff * 2 * (a / tot); y[i] += dy * diff * 2 * (a / tot);
      x[i + 1] -= dx * diff * 2 * (b / tot); y[i + 1] -= dy * diff * 2 * (b / tot);
    }
  }
  x[0] = x0; y[0] = Y; x[k - 1] = x1; y[k - 1] = Y;
}
function stepRope(r: Rope, x0: number, x1: number, ptr: Sim["ptr"]): number {
  const { x, y, ox, oy, k } = r; let e = 0;
  for (let i = 1; i < k - 1; i++) {
    const vx = (x[i] - ox[i]) * DAMP, vy = (y[i] - oy[i]) * DAMP;
    ox[i] = x[i]; oy[i] = y[i]; x[i] += vx + (r.rx[i] - x[i]) * SPRING; y[i] += vy + (r.ry[i] - y[i]) * SPRING;
    if (ptr) {
      const dx = x[i] - ptr.x, dy = y[i] - ptr.y, d = Math.hypot(dx, dy);
      if (d < R) { const f = (1 - d / R) ** 2 * 3.2, n = d || 1; x[i] += (dx / n) * f * 0.3; y[i] += (dy / n) * f + 0.5 * f; }
    }
  }
  solve(r, x0, x1);
  for (let i = 1; i < k - 1; i++) e += Math.abs(x[i] - ox[i]) + Math.abs(y[i] - oy[i]);
  return e;
}
const pathD = (r: Rope) => {
  let d = `M${r.x[0].toFixed(1)},${r.y[0].toFixed(1)}`;
  for (let i = 1; i < r.k - 1; i++) d += ` Q${r.x[i].toFixed(1)},${r.y[i].toFixed(1)} ${((r.x[i] + r.x[i + 1]) / 2).toFixed(1)},${((r.y[i] + r.y[i + 1]) / 2).toFixed(1)}`;
  return d + ` L${r.x[r.k - 1].toFixed(1)},${r.y[r.k - 1].toFixed(1)}`;
};

/* one shared animation loop, running only while some row is awake */
const awake = new Set<{ sim: Sim; xs: number[]; run: () => number }>();
let raf = 0;
function tick() {
  awake.forEach((a) => { const e = a.run(); a.sim.quiet = e < 0.012 * Math.max(1, a.sim.ropes.length) && !a.sim.ptr ? a.sim.quiet + 1 : 0; if (a.sim.quiet > 24) awake.delete(a); });
  raf = awake.size ? requestAnimationFrame(tick) : 0;
}
const wake = (a: { sim: Sim; xs: number[]; run: () => number }) => { a.sim.quiet = 0; awake.add(a); if (!raf) raf = requestAnimationFrame(tick); };

function ThreadRow({ row, n, cuts, w, active, setActive, reduce }: { row: TRow; n: number; cuts: number[]; w: number; active: { row: string; n: number } | null; setActive: (v: { row: string; n: number; el: Element } | null) => void; reduce: boolean }) {
  const X = useCallback((i: number) => ((i + 0.5) / n) * w, [n, w]);
  const xs = useMemo(() => row.hits.map(X), [row.hits, X]);
  const handle = useRef<{ sim: Sim; xs: number[]; run: () => number } | null>(null);
  const ropes = useMemo(() => {
    const rs: Rope[] = [];
    for (let i = 0; i < xs.length - 1; i++) rs.push(makeRope(xs[i], xs[i + 1]));
    return rs;
  }, [xs]);
  const els = useRef<SVGPathElement[][]>([]);
  useEffect(() => {
    const sim: Sim = { ropes, els: els.current, ptr: null, quiet: 0 };
    const run = () => { let e = 0; ropes.forEach((r, i) => { e += stepRope(r, xs[i], xs[i + 1], sim.ptr); const d = pathD(r); els.current[i]?.forEach((p) => p?.setAttribute("d", d)); }); return e; };
    handle.current = { sim, xs, run };
    return () => { if (handle.current) awake.delete(handle.current); };
  }, [ropes, xs]);
  const pluck = (idx: number) => {
    [idx - 1, idx].forEach((ri) => { const r = ropes[ri]; if (!r) return; for (let j = 1; j < r.k - 1; j++) r.oy[j] -= 4.2 * Math.sin((Math.PI * j) / (r.k - 1)); });
    if (handle.current && !reduce) wake(handle.current);
  };
  const router = useRouter();
  const anchors = useRef<(Element | null)[]>([]);
  const nearest = (e: { clientX: number; clientY: number; currentTarget: Element }, reach: number) => {
    const b = e.currentTarget.getBoundingClientRect(), px = e.clientX - b.left, py = e.clientY - b.top;
    if (Math.abs(py - Y) > reach + 8) return -1;
    let best = -1, bd = reach;
    xs.forEach((x, j) => { const d = Math.abs(x - px); if (d <= bd) { bd = d; best = j; } });
    return best;
  };
  const choose = (j: number) => {
    if (j < 0) { if (active && active.row === row.id) setActive(null); return; }
    if (active && active.row === row.id && active.n === row.hits[j]) return;
    setActive({ row: row.id, n: row.hits[j], el: anchors.current[j] as Element }); pluck(j);
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "touch") return;
    choose(nearest(e, 6));
    if (reduce || !handle.current) return;
    const b = e.currentTarget.getBoundingClientRect();
    handle.current.sim.ptr = { x: e.clientX - b.left, y: e.clientY - b.top };
    wake(handle.current);
  };
  const onLeave = () => { setActive(null); if (handle.current) { handle.current.sim.ptr = null; if (!reduce) wake(handle.current); } };
  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const touch = touchRef.current, j = nearest(e, touch ? 14 : 6);
    if (j < 0) return;
    const shown = active && active.row === row.id && active.n === row.hits[j];
    if (touch && !shown) { choose(j); return; }
    const url = `/sutra/${infoId(row.hits[j])}`;
    if (e.metaKey || e.ctrlKey) window.open(url, "_blank"); else router.push(url);
  };
  const mine = active && active.row === row.id;
  return (
    <svg className={`tr-svg${mine ? " has-active" : ""}`} width={w} height={H} viewBox={`0 0 ${w} ${H}`} onPointerMove={onMove} onPointerLeave={onLeave} onClick={onClick} onPointerDown={(e) => { touchRef.current = e.pointerType === "touch"; }} role="group" aria-label={`${row.iast}: ${row.hits.length} sūtras`}>
      {cuts.map((c) => <line key={c} className="tr-sep" x1={(c / n) * w} x2={(c / n) * w} y1={0} y2={H} />)}
      <line className="tr-base" x1={0} x2={w} y1={Y} y2={Y} />
      {ropes.map((r, i) => (
        <g key={i}>
          <path ref={(el) => { (els.current[i] ||= [])[0] = el as SVGPathElement; }} className="rp-halo" d={pathD(r)} />
          <path ref={(el) => { (els.current[i] ||= [])[1] = el as SVGPathElement; }} className="rp" d={pathD(r)} />
        </g>
      ))}
      {row.hits.map((h, i) => {
        const on = mine && active!.n === h, echo = !mine && active && active.n === h;
        return (
          <a key={h} href={`/sutra/${infoId(h)}`} ref={(el) => { anchors.current[i] = el; }} className={`tb${on ? " on" : ""}${echo ? " echo" : ""}`} data-n={h} aria-label={`${row.iast}, sūtra ${infoIds[h]}`}
            onFocus={(e) => { setActive({ row: row.id, n: h, el: e.currentTarget }); pluck(i); }} onBlur={() => setActive(null)}>
            <circle className="tb-ring" cx={xs[i]} cy={Y} r={8} />
            <circle className="tb-halo" cx={xs[i]} cy={Y} r={6.5} />
            <circle className="tb-core" cx={xs[i]} cy={Y} r={3.2} />
          </a>
        );
      })}
    </svg>
  );
}
const touchRef = { current: false };
let infoIds: string[] = [];
const infoId = (n: number) => (infoIds[n] || "").replace(".", "-");

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default function VisThreads({ groups, info, cuts }: { groups: TGroup[]; info: TInfo[]; cuts: number[] }) {
  infoIds = info.map((i) => i.id);
  const n = info.length;
  const boxRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [act, setAct] = useState<{ row: string; n: number; el: Element } | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number; below: boolean } | null>(null);
  const rowOf = useMemo(() => Object.fromEntries(groups.flatMap((g) => g.rows).map((r) => [r.id, r])), [groups]);
  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
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
              <div className="tr-tx">{w > 0 && <ThreadRow row={r} n={n} cuts={cuts.slice(1, 4)} w={w} active={act} setActive={setAct} reduce={reduce} />}</div>
              <span className="tr-n" title={`${r.iast}: ${r.hits.length} sūtra${r.hits.length === 1 ? "" : "s"}`}>{r.hits.length}</span>
            </div>
          ))}
        </div>
      ))}
      {s && term && pos && (
        <div className={`tcard${pos.below ? " below" : ""}`} style={{ left: pos.left, top: pos.top }} role="status">
          <div className="tc-h"><span className="tc-id">{s.id}</span><span className="tc-term">{term.iast}</span><span className="tc-p">Pāda {s.pada}</span></div>
          <div className="tc-d">{s.deva}</div>
          <div className="tc-i">{iastHtml}</div>
          <div className="tc-e">{s.en}<small>Woods</small></div>
          <div className="tc-f"><span>{s.terms.length > 1 ? `Also holds: ${s.terms.filter((t) => t !== term.iast).join(", ")}` : "Only this term is indexed here"}</span><b>Open {s.id} →</b></div>
        </div>
      )}
    </div>
  );
}
