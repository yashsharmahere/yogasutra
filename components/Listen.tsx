"use client";
import { useEffect, useRef, useState } from "react";
import peaks from "@/lib/peaks.json";

/* Chanted recitation of one sūtra, shown as a waveform you can click to seek.
   Audio is synthesised with Vāgdhenu (Prof. Prathosh A P, IISc); the whole block hides itself if the file is missing. */
const P = peaks as Record<string, { p: number[]; d: number }>;
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
export default function Listen({ id }: { id: string }) {
  const key = id.replace(".", "-"), info = P[key], bars = info?.p;
  const a = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);
  const [gone, setGone] = useState(false);
  const [t, setT] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    const el = a.current; if (!el) return;
    const loop = () => { if (el.duration) setT(el.currentTime / el.duration); raf.current = requestAnimationFrame(loop); };
    if (on) raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [on]);
  if (gone || !bars) return null;
  const total = info.d, cur = Math.min(total, t * total);
  const toggle = () => { const el = a.current; if (!el) return; if (el.paused) { if (el.ended || t >= 0.99) el.currentTime = 0; el.play().catch(() => setGone(true)); } else el.pause(); };
  const seek = (e: React.PointerEvent<HTMLDivElement>) => { const el = a.current; if (!el || !el.duration) return; const b = e.currentTarget.getBoundingClientRect(), f = Math.min(1, Math.max(0, (e.clientX - b.left) / b.width)); el.currentTime = f * el.duration; setT(f); if (el.paused) el.play().catch(() => setGone(true)); };
  const n = bars.length, W = 4, G = 2, H = 34;
  return (
    <div className="listen">
      <div className="listen-h"><span>Chanted recitation</span><span className="listen-t" aria-hidden="true">{fmt(on || t > 0 ? cur : 0)} / {fmt(total)}</span></div>
      <div className="listen-row">
        <button type="button" className={`listen-btn${on ? " on" : ""}`} onClick={toggle} aria-pressed={on} aria-label={on ? `Pause the chant of sūtra ${id}` : `Hear sūtra ${id} chanted`}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">{on ? <path d="M4 3h3v10H4zM9 3h3v10H9z" fill="currentColor" /> : <path d="M4 2.5v11l9-5.5z" fill="currentColor" />}</svg>
        </button>
        <div className="listen-wave" onPointerDown={seek} role="slider" aria-label="Seek the chant" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(t * 100)} tabIndex={0}
          onKeyDown={(e) => { const el = a.current; if (!el || !el.duration) return; if (e.key === "ArrowRight") el.currentTime = Math.min(el.duration, el.currentTime + 1); if (e.key === "ArrowLeft") el.currentTime = Math.max(0, el.currentTime - 1); }}>
          <svg viewBox={`0 0 ${n * (W + G) - G} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            {bars.map((v, i) => { const h = Math.max(3, v * H); return <rect key={i} className={i / n < t ? "lw-on" : "lw-off"} x={i * (W + G)} y={(H - h) / 2} width={W} height={h} rx={2} />; })}
          </svg>
        </div>
      </div>
      <p className="listen-src">Machine-synthesised with <a href="https://prathosh.in/vagdhenu/" target="_blank" rel="noopener noreferrer">Vāgdhenu</a> · IISc Bengaluru</p>
      <audio ref={a} src={`/audio/${key}.mp3`} preload="none" onPlay={() => setOn(true)} onPause={() => setOn(false)} onEnded={() => { setOn(false); setT(0); }} onError={() => setGone(true)} />
    </div>
  );
}
