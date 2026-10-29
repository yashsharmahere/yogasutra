import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Ekatāna: Patañjali's Yoga Sūtra", template: "%s · Ekatāna" },
  description: "A connected, source-graded reader for Patañjali's Yoga Sūtra: Sanskrit, three public-domain translations, a term index and Gītā connections.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;1,7..72,400&family=Tiro+Devanagari+Sanskrit:ital@0;1&display=swap" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <header className="top"><div className="wrap top-in">
          <Link className="mark" href="/"><span className="deva">एकतान</span><span className="en">Ekatāna</span></Link>
          <nav className="main">
            <Link href="/read/1">Read</Link><Link href="/concepts">Concepts</Link><Link href="/gita">Gītā</Link><Link href="/visuals">Visualize</Link><Link href="/graph">Graph</Link><Link href="/search">Search</Link><Link href="/tests">Tests</Link><Link href="/method">Method</Link>
          </nav>
        </div></header>
        <main id="main"><div className="wrap" id="view">{children}</div></main>
        <footer><div className="wrap">
          <span>Sanskrit from GRETIL (CC BY-NC-SA 4.0). English by J. H. Woods (1914), Charles Johnston (1912) and Swami Vivekananda (1896), all public domain. Non-commercial.</span>
          <span><Link href="/method">How this edition is built</Link></span>
        </div></footer>
      </body>
    </html>
  );
}
