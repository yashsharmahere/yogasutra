"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type N = { id: string; iast: string } | null;
const href = (id: string) => `/sutra/${id.replace(".", "-")}`;

// Previous / next sūtra. Also bound to the left and right arrow keys (not while typing, not with modifiers).
export default function SutraNav({ prev, next }: { prev: N; next: N }) {
  const router = useRouter();
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === "ArrowLeft" && prev) router.push(href(prev.id));
      if (e.key === "ArrowRight" && next) router.push(href(next.id));
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [prev, next, router]);
  return (
    <nav className="sutra-nav" aria-label="Previous and next sūtra">
      {prev ? <Link href={href(prev.id)} rel="prev" title={prev.iast}><span aria-hidden="true">←</span> <span className="mono">{prev.id}</span></Link> : <span className="off"><span aria-hidden="true">←</span></span>}
      {next ? <Link href={href(next.id)} rel="next" title={next.iast}><span className="mono">{next.id}</span> <span aria-hidden="true">→</span></Link> : <span className="off"><span aria-hidden="true">→</span></span>}
    </nav>
  );
}
