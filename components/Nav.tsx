"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items: [string, string][] = [["/read/1", "Read"], ["/patanjali", "Patañjali"], ["/concepts", "Concepts"], ["/gita", "Gītā"], ["/visuals", "Visualize"], ["/graph", "Graph"], ["/search", "Search"], ["/tests", "Tests"], ["/method", "Method"]];
export default function Nav() {
  const p = usePathname();
  const on = (h: string) => (h.startsWith("/read") ? p.startsWith("/read") || p.startsWith("/sutra") : p.startsWith(h));
  return <nav className="main" aria-label="Main">{items.map(([h, l]) => <Link key={h} href={h} aria-current={on(h) ? "page" : undefined}>{l}</Link>)}</nav>;
}
