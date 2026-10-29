"use client";
import { useEffect, useState } from "react";

// Home-page illustration: one thread enters, ties two knots, loops, gathers, then fans out into strands.
// Drawn once on load; afterwards a single bead of light travels the thread. Still under reduced motion.
const MAIN = "M740 -90 C600 80, 470 150, 360 165 C290 175, 240 175, 215 200 C260 175, 330 190, 335 230 C340 270, 280 285, 215 300 C160 315, 120 350, 130 390 C140 420, 190 425, 240 400 C280 380, 320 360, 345 375";
const ECHO = "M215 200 C250 190, 300 205, 305 232 C310 262, 262 280, 215 300";
const FAN = [
  "M345 375 C420 330, 520 320, 740 255",
  "M345 375 C430 360, 540 380, 740 350",
  "M345 375 C420 400, 520 440, 740 495",
  "M345 375 C440 410, 560 500, 740 620",
  "M345 375 C400 440, 470 520, 560 560 C600 578, 650 610, 700 700",
  "M345 375 C380 460, 400 540, 430 720",
];
const KNOTS: [number, number, number][] = [[215, 200, 6], [215, 300, 5], [345, 375, 4]];
const NODES: [number, number][] = [[360, 165], [480, 128], [470, 335], [560, 335], [520, 372], [600, 362], [500, 425], [590, 455], [530, 468], [470, 505], [395, 520], [130, 390], [240, 400]];
const DOTS: [number, number][] = [[215, 140], [215, 360], [300, 90], [430, 250], [480, 300], [345, 300], [345, 470], [480, 560], [120, 300], [275, 155]];

export default function HeroThread() {
  const [motion, setMotion] = useState(false);
  useEffect(() => { setMotion(!window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return (
    <svg className="hero-art" viewBox="0 0 640 640" preserveAspectRatio="xMaxYMin meet" aria-hidden="true" focusable="false">
      <defs>
        <filter id="ht-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" /></filter>
        <radialGradient id="ht-knot"><stop offset="0" style={{ stopColor: "var(--indigo)", stopOpacity: 0.55 }} /><stop offset="1" style={{ stopColor: "var(--indigo)", stopOpacity: 0 }} /></radialGradient>
        <linearGradient id="ht-fade" gradientUnits="userSpaceOnUse" x1="345" y1="375" x2="720" y2="560"><stop offset="0" style={{ stopColor: "var(--indigo)", stopOpacity: 0.95 }} /><stop offset="1" style={{ stopColor: "var(--indigo)", stopOpacity: 0 }} /></linearGradient>
      </defs>

      {/* construction: faint guides, as on a drafting sheet */}
      <g className="ht-guide">
        <path d="M215 110 V450 M345 210 V560 M480 90 V610 M345 375 H640" />
        <circle cx="275" cy="250" r="95" /><circle cx="275" cy="250" r="160" />
        {DOTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" className="ht-dot" />)}
      </g>

      {/* glow underlay */}
      <g className="ht-glowlayer" filter="url(#ht-glow)">
        <path d={MAIN} pathLength={1} className="ht-draw" />
        {FAN.map((d, i) => <path key={i} d={d} pathLength={1} className="ht-draw ht-fan" style={{ animationDelay: `${1.7 + i * 0.12}s` }} />)}
      </g>

      {/* crisp thread */}
      <g className="ht-line">
        <path d={MAIN} pathLength={1} className="ht-draw ht-main" />
        <path d={ECHO} pathLength={1} className="ht-draw ht-echo" />
        {FAN.map((d, i) => <path key={i} d={d} pathLength={1} className="ht-draw ht-fan" stroke="url(#ht-fade)" style={{ animationDelay: `${1.7 + i * 0.12}s` }} />)}
      </g>

      <g className="ht-nodes">
        {NODES.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" style={{ animationDelay: `${2 + i * 0.08}s` }} />)}
        {KNOTS.map(([x, y, r], i) => (
          <g key={i} style={{ animationDelay: `${0.8 + i * 0.4}s` }} className="ht-knot">
            <circle cx={x} cy={y} r={r * 3.2} className="ht-halo" />
            <circle cx={x} cy={y} r={r} className="ht-knot-core" />
          </g>
        ))}
      </g>

      <g className="ht-label">
        <text x="398" y="236" className="ht-deva">सूत्र</text>
        <text x="448" y="235" className="ht-cap">· SŪTRA / THREAD</text>
        <path d="M455 252 H600" className="ht-rule" /><circle cx="603" cy="252" r="2.2" className="ht-rule-dot" />
      </g>

      {motion && (
        <circle r="3.4" className="ht-bead">
          <animateMotion dur="9s" begin="3s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear" path={MAIN + " C420 330, 520 320, 740 255"} />
        </circle>
      )}
    </svg>
  );
}
