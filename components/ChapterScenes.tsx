// Layered chapter scenes, built like the hero: a painted plate, cut-out elements on top, motion in CSS.
// Coordinates in the SVG overlays use the plate's 300×400 frame. The moon itself is the travelling .jr-moon.
const G = "#e2bd62";

export function SceneLake() {
  const W = [34, 22, 40, 16, 28, 12, 22, 10, 16, 8, 12, 6, 8];
  return (
    <div className="scn scn-1">
      <img className="plate" src="/home/s1-bg.webp" alt="" width={900} height={1200} />
      <svg className="ov" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs><radialGradient id="s1-path" cx=".5" cy="0" r="1" gradientTransform="translate(.5 0) scale(.45 1) translate(-.5 0)"><stop offset="0" stopColor={G} stopOpacity=".22" /><stop offset=".75" stopColor={G} stopOpacity="0" /></radialGradient></defs>
        <rect x="126" y="208" width="120" height="140" fill="url(#s1-path)" style={{ filter: "blur(4px)" }} />
        {W.map((w, k) => <rect key={k} className="sh" x={186 - w / 2 + ((k % 3) - 1) * 2.2} y={212 + k * 6 + k * k * 0.4} width={w} height={0.9} rx={0.45} fill={G} opacity={(0.85 - k * 0.06).toFixed(2)} style={{ animationDelay: `${-k * 0.43}s` }} />)}
        <g className="rp" fill="none" stroke={G} strokeWidth="0.6" opacity=".7">{[0, 1, 2].map((k) => <ellipse key={k} cx="186" cy="276" rx="30" ry="4.5" vectorEffect="non-scaling-stroke" />)}</g>
      </svg>
      <img className="lotus" src="/home/s1-lotus.webp" alt="" width={1157} height={664} />
    </div>
  );
}
