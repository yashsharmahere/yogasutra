// Flat vector scenes for the chapter stage. Drawn, not generated: navy ground, flat gold, thin line.
// viewBox is 300×400 (the panel's 3:4). The moon is not drawn here; one moon element travels over all four.
const G = "#dcb257";

export function SceneLake() {
  // moon sits at (196, 82); its path on the water is a tapered column of broken gold strokes
  const W = [30, 22, 34, 18, 26, 14, 22, 10, 16, 8, 12, 6];
  const dashes = W.map((w, k) => {
    const y = 241 + k * 6.5 + k * k * 0.42, dx = (k % 3 - 1) * 2.5;
    return <rect key={k} className="sh" x={196 - w / 2 + dx} y={y} width={w} height={1.3} rx={0.65} fill={G} opacity={1 - k * 0.07} style={{ animationDelay: `${-k * 0.41}s` }} />;
  });
  return (
    <svg className="sc sc-lake" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="lk-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a1030" /><stop offset="1" stopColor="#111a44" /></linearGradient>
        <radialGradient id="lk-path" cx=".5" cy="0" r="1" gradientTransform="translate(.5 0) scale(.5 1) translate(-.5 0)"><stop offset="0" stopColor={G} stopOpacity=".2" /><stop offset=".7" stopColor={G} stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="300" height="234" fill="url(#lk-sky)" />
      {[[40, 58], [88, 30], [128, 96], [250, 46], [272, 132], [60, 150], [232, 172], [150, 40]].map(([x, y], k) => <circle key={k} className="st" cx={x} cy={y} r={0.8} fill="#efe8d6" style={{ animationDelay: `${-k * 0.9}s` }} />)}
      <path d="M0 206 C30 194 58 198 84 204 C112 210 138 186 172 190 C206 194 236 180 300 192 V234 H0 Z" fill="#17214d" />
      <path d="M0 206 C30 194 58 198 84 204 C112 210 138 186 172 190 C206 194 236 180 300 192" fill="none" stroke={G} strokeWidth="0.6" opacity="0.65" />
      <path d="M0 222 C40 214 70 222 110 220 C150 218 170 210 210 214 C250 218 276 212 300 216 V234 H0 Z" fill="#0f1739" />
      <rect y="234" width="300" height="166" fill="#08102a" />
      <rect x="146" y="234" width="100" height="130" fill="url(#lk-path)" />
      <line x1="0" y1="234" x2="300" y2="234" stroke={G} strokeWidth="0.7" />
      {[[10, 64, 262], [30, 96, 298], [6, 52, 340], [244, 300, 256], [226, 290, 288], [256, 300, 330]].map(([a, b, y], k) => <line key={k} x1={a} y1={y} x2={b} y2={y} stroke="#efe8d6" strokeWidth="0.4" opacity="0.16" />)}
      {dashes}
      <g className="rp" fill="none" stroke={G} strokeWidth="0.6">{[0, 1, 2].map((k) => <ellipse key={k} cx="196" cy="306" rx="34" ry="5" vectorEffect="non-scaling-stroke" />)}</g>
      <g transform="translate(62 362)">
        <path d="M-40 6 C-30 0 -10 -1 2 4 C-6 9 -28 11 -40 6 Z" fill="#14402f" opacity=".9" />
        <path d="M4 8 C14 3 32 3 40 8 C32 12 14 12 4 8 Z" fill="#14402f" opacity=".75" />
        <line x1="0" y1="4" x2="0" y2="-6" stroke={G} strokeWidth="0.6" />
        <path d="M0 -4 C-5 -9 -5 -17 0 -22 C5 -17 5 -9 0 -4 Z" fill="#c4553a" stroke={G} strokeWidth="0.45" />
        <path d="M0 -4 C-8 -6 -11 -12 -10 -16 C-5 -13 -2 -9 0 -4 Z M0 -4 C8 -6 11 -12 10 -16 C5 -13 2 -9 0 -4 Z" fill="#9c3d29" />
      </g>
    </svg>
  );
}
