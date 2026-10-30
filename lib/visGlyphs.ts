/* Mini sketches of each diagram, drawn on a 120×44 grid. Used in the index tiles and the contents list. */
const r = (x: number, y: number, w: number, h: number, cls = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5"${cls ? ` class="${cls}"` : ""}/>`;
export const GLYPHS: Record<string, string> = {
  limbs: Array.from({ length: 8 }, (_, i) => r(3 + i * 14.5, 6, 11, 13, i >= 5 ? "k" : "")).join("") + `<path d="M3 24h70M76 24h40" class="br"/><path d="M98 26v8"/>` + r(84, 34, 28, 8),
  vrtti: r(38, 3, 44, 12) + `<path d="M60 15v8M12 23h96M12 23v6M36 23v6M60 23v6M84 23v6M108 23v6"/>` + Array.from({ length: 5 }, (_, i) => r(2 + i * 24, 29, 20, 12)).join(""),
  klesa: `<rect x="2" y="3" width="116" height="38" rx="3"/><path d="M10 10h40"/>` + Array.from({ length: 4 }, (_, i) => r(10 + i * 27, 17, 22, 18)).join(""),
  pain: r(2, 15, 22, 14) + r(49, 15, 22, 14, "k") + r(96, 15, 22, 14) + `<path d="M24 22h25M71 22h25"/><path d="M60 29v8M60 37h36" class="br"/>`,
  ladder: `<path d="M4 41h18V33h18V25h18V17h18V9h18V3h20"/><circle cx="114" cy="3" r="2.5" class="kd"/>`,
  terms: [0, 1, 2, 3, 4].map((y) => `<path d="M4 ${6 + y * 8}h112"/>`).join("") +
    [[10, 22, 58, 90], [18, 26, 70], [44, 52, 56, 60, 64], [30, 96, 104], [14, 74, 100, 110]].flatMap((xs, y) => xs.map((x) => `<rect x="${x}" y="${3 + y * 8}" width="2.5" height="6" class="kd"/>`)).join(""),
};
export const glyph = (k: string) => `<svg viewBox="0 0 120 44" aria-hidden="true" focusable="false">${GLYPHS[k]}</svg>`;
