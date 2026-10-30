"use client";
import { useEffect, useState } from "react";
import { glyph } from "@/lib/visGlyphs";

/* Sticky contents list for /visuals. Highlights the section currently in view. */
export default function VisToc({ items }: { items: { id: string; k: string; title: string }[] }) {
  const [on, setOn] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setOn(vis[0].target.id);
    }, { rootMargin: "-20% 0px -65% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav className="vis-toc" aria-label="On this page">
      <p className="eyebrow">On this page</p>
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} className={on === i.id ? "on" : undefined} aria-current={on === i.id ? "true" : undefined}>
          <span className="vis-gl sm" dangerouslySetInnerHTML={{ __html: glyph(i.k) }} />
          <span>{i.title}</span>
        </a>
      ))}
      <a className="vis-toc-graph" href="/graph">Open the term graph →</a>
    </nav>
  );
}
