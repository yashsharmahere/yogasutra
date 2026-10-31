import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";
import Nav from "@/components/Nav";
import Logo from "@/components/Logo";

const boot = `try{var d=document.documentElement,t=localStorage.getItem("ek:theme");if(t==="light"||t==="dark")d.dataset.theme=t;}catch(e){}`;

export const metadata: Metadata = {
  title: { default: "Patañjali's Yoga Sūtra", template: "%s · Patañjali's Yoga Sūtra" },
  description: "A connected, source-graded reader for Patañjali's Yoga Sūtra: Sanskrit, three public-domain translations, a term index and Gītā connections.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;1,7..72,400&family=Tiro+Devanagari+Sanskrit:ital@0;1&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <header className="top"><div className="wrap top-in">
          <Link className="mark" href="/" aria-label="Patañjali's Yoga Sutras, home"><Logo className="mark-logo" /></Link>
          <Nav />
          <ThemeToggle />
        </div></header>
        <main id="main"><div className="wrap" id="view">{children}</div></main>
        <footer><div className="wrap">
          <ul className="credits">
            <li>Sanskrit: <a href="https://gretil.sub.uni-goettingen.de/">GRETIL</a>, CC BY-NC-SA 4.0</li>
            <li>English: J. H. Woods (1914), Charles Johnston (1912), Swami Vivekananda (1896), public domain</li>
            <li>Chanted audio: <a href="https://prathosh.in/vagdhenu/">Vāgdhenu</a>, Prof. Prathosh A P, IISc (code Apache-2.0, data CC BY 4.0)</li>
            <li>Illustrations AI-edited. Non-commercial.</li>
          </ul>
          <Link className="method-link" href="/method">How this edition is built</Link>
        </div></footer>
      </body>
    </html>
  );
}
