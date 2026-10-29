// Original line drawing made for this site, after the traditional iconography: a human figure with joined hands,
// a serpent body in coils, and a hood of five cobra heads. No portrait of Patañjali survives; this is an image, not a likeness.
export default function PatanjaliFigure() {
  const hoods = [-66, -33, 0, 33, 66];
  return (
    <svg className="pat-fig" viewBox="-60 40 520 520" role="img" aria-label="Line drawing of Patañjali in the traditional form: a seated human figure with hands joined, a hood of five cobras above the head, and a serpent's coils below, the tail trailing off as a thread.">
      <defs><radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="var(--indigo)" stopOpacity=".28" /><stop offset="1" stopColor="var(--indigo)" stopOpacity="0" /></radialGradient></defs>
      <circle cx="200" cy="222" r="150" fill="url(#halo)" />
      <g className="pf-line">
        {/* hood: five cobra heads */}
        {hoods.map((a) => (
          <path key={a} transform={`rotate(${a} 200 222)`} d="M200 98 C 219 110, 224 136, 200 156 C 176 136, 181 110, 200 98 Z" className="pf-hood" />
        ))}
        <circle cx="200" cy="222" r="44" className="pf-halo" />
        {/* body */}
        <path className="pf-fill" d="M138 408 C 146 346 150 300 166 268 Q 200 252 234 268 C 250 300 254 346 262 408 Z" />
        <path d="M166 270 C 138 302 150 338 196 342 M234 270 C 262 302 250 338 204 342" />
        <path className="pf-fill" d="M194 350 L200 316 L206 350 Z" />
        <path d="M200 316 L200 350" />
        {/* neck and head */}
        <path d="M190 250 L190 262 M210 250 L210 262" />
        <circle cx="200" cy="222" r="28" className="pf-fill" />
        <path d="M188 222 q5 4 10 0 M202 222 q5 4 10 0 M196 236 q4 2 8 0" />
        <circle cx="200" cy="186" r="7" className="pf-fill" />
        {/* coils: drawn back to front */}
        <path className="pf-fill" d="M52 478 C 52 446 348 446 348 478 C 348 514 52 514 52 478 Z" />
        <path className="pf-fill" d="M80 446 C 80 418 320 418 320 446 C 320 474 80 474 80 446 Z" />
        <path className="pf-fill" d="M110 416 C 110 392 290 392 290 416 C 290 438 110 438 110 416 Z" />
        <path d="M116 400 C 140 388 260 388 284 400" />
        {/* tail trails away as the thread */}
        <path className="pf-tail" d="M54 486 C 8 500 -6 524 -58 534" />
      </g>
    </svg>
  );
}
