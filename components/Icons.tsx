// A small family of line icons drawn for this site: one stroke weight, one grid, one idea each.
const rays = (r1: number, r2: number) => Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4, c = Math.cos(a), s = Math.sin(a); return `M${(16 + r1 * c).toFixed(2)} ${(16 + r1 * s).toFixed(2)} L${(16 + r2 * c).toFixed(2)} ${(16 + r2 * s).toFixed(2)}`; }).join(" ");

const P: Record<string, React.ReactNode> = {
  // the four pādas
  samadhi: <><circle cx="16" cy="16" r="11" /><circle cx="16" cy="16" r="6" /><circle cx="16" cy="16" r="1.4" fill="currentColor" /></>,
  sadhana: <><path d="M4 26 H11 V20 H18 V14 H25 V8" /><circle cx="25" cy="5" r="1.4" fill="currentColor" /></>,
  vibhuti: <><circle cx="16" cy="16" r="3.4" /><path d={rays(7.5, 13)} /></>,
  kaivalya: <><circle cx="16" cy="12" r="5" /><path d="M4 25 H28" /><path d="M16 17 V21" strokeDasharray="1.5 2.5" /></>,
  // kinds of terms
  mind: <><circle cx="16" cy="16" r="12" /><path d="M7 16 C10 9, 13 9, 16 16 S22 23, 25 16" /></>,
  practice: <><path d="M25 16 A9 9 0 1 1 20 8" /><path d="M20 3 V8 H25" /></>,
  being: <><path d="M3 16 C8 8 24 8 29 16 C24 24 8 24 3 16 Z" /><circle cx="16" cy="16" r="4" /><circle cx="16" cy="16" r="1" fill="currentColor" /></>,
  affliction: <path d="M6 21 C5 7 27 5 26 16 C25 26 9 26 14 14 C17 8 25 14 18 21" />,
  cause: <><path d="M16 4 C21 8 21 15 16 19 C11 15 11 8 16 4 Z" /><path d="M9 24 Q16 20 23 24 M5 28 Q16 22 27 28" /></>,
  matter: <><circle cx="12" cy="12" r="7" /><circle cx="20" cy="12" r="7" /><circle cx="16" cy="19" r="7" /></>,
  attainment: <path d="M16 4 L26 12 L16 28 L6 12 Z M6 12 H26 M12 12 L16 28 L20 12 M16 4 L12 12 M16 4 L20 12" />,
  limb: <><circle cx="16" cy="16" r="11" /><circle cx="16" cy="16" r="2.4" /><path d={rays(2.4, 11)} /></>,
  // ways in
  read: <path d="M4 7 H13 C15 7 16 8 16 10 V26 C16 24 15 23 13 23 H4 Z M28 7 H19 C17 7 16 8 16 10 V26 C16 24 17 23 19 23 H28 Z" />,
  gita: <><circle cx="12" cy="16" r="7" /><circle cx="20" cy="16" r="7" /></>,
  structure: <><circle cx="8" cy="9" r="3" /><circle cx="24" cy="9" r="3" /><circle cx="16" cy="24" r="3" /><path d="M11 9 H21 M9.5 11.7 L14.5 21.3 M22.5 11.7 L17.5 21.3" /></>,
  serpent: <><path d="M10 5 C23 5 23 14 16 15.5 C9 17 9 25 22 27" /><circle cx="10" cy="5" r="1.6" fill="currentColor" /></>,
  test: <><rect x="5" y="5" width="22" height="22" rx="2" /><path d="M10 16.5 L14.5 21 L22 12" /></>,
  search: <><circle cx="14" cy="14" r="8" /><path d="M20 20 L27 27" /></>,
  thread: <path d="M3 22 C9 8 14 8 16 16 S23 24 29 10" />,
};

export default function Icon({ name, size = 28, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <svg className={`ico ${className}`} width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {P[name] ?? P.thread}
    </svg>
  );
}

// A quiet divider: a hairline with a small knot at its centre.
export function Ornament() {
  return (
    <svg className="ornament" viewBox="0 0 400 24" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <path d="M0 12 H176 M224 12 H400" />
      <path d="M200 4 L208 12 L200 20 L192 12 Z" />
      <circle cx="200" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <path d="M176 12 C184 12 186 6 192 6 M176 12 C184 12 186 18 192 18 M224 12 C216 12 214 6 208 6 M224 12 C216 12 214 18 208 18" />
    </svg>
  );
}
