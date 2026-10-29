import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";
import Nav from "@/components/Nav";
import Splash from "@/components/Splash";

const boot = `try{var d=document.documentElement,t=localStorage.getItem("ek:theme");if(t==="light"||t==="dark")d.dataset.theme=t;if(location.pathname==="/"&&!sessionStorage.getItem("ek:splash"))d.dataset.splash="1"}catch(e){}`;

export const metadata: Metadata = {
  title: { default: "Ekatāna: Patañjali's Yoga Sūtra", template: "%s · Ekatāna" },
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
        <Splash />
        <header className="top"><div className="wrap top-in">
          <Link className="mark" href="/"><span className="deva">एकतान</span><span className="en">Ekatāna</span></Link>
          <Nav />
          <ThemeToggle />
        </div></header>
        <main id="main"><div className="wrap" id="view">{children}</div></main>
        <footer><div className="wrap">
          <span>Sanskrit from GRETIL (CC BY-NC-SA 4.0). English by J. H. Woods (1914), Charles Johnston (1912) and Swami Vivekananda (1896), all public domain. Non-commercial. Chapter emblems by Lorc and Delapouite from <a href="https://game-icons.net">game-icons.net</a> (<a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>).</span>
          <span><Link href="/method">How this edition is built</Link></span>
        </div></footer>
      </body>
    </html>
  );
}
