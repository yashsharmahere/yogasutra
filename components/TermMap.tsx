"use client";
import { useEffect, useState, type ReactNode } from "react";

/* Section 06 view switch: threads (default) or the counts-in-boxes grid. The choice is remembered. */
export default function TermMap({ threads, counts }: { threads: ReactNode; counts: ReactNode }) {
  const [view, setView] = useState<"threads" | "counts">("threads");
  useEffect(() => { try { const v = localStorage.getItem("ek:termview"); if (v === "counts" || v === "threads") setView(v); } catch {} }, []);
  const pick = (v: "threads" | "counts") => { setView(v); try { localStorage.setItem("ek:termview", v); } catch {} };
  return (
    <>
      <div className="tm-bar">
        <div className="seg" role="group" aria-label="View">
          <button type="button" aria-pressed={view === "threads"} onClick={() => pick("threads")}>Threads</button>
          <button type="button" aria-pressed={view === "counts"} onClick={() => pick("counts")}>Counts</button>
        </div>
        <p className="tm-hint">{view === "threads"
          ? "One thread per term, knotted at each sūtra that holds it. Hover a knot to read the sūtra, click to open, brush a thread to move it. The number at the end is the total."
          : "How many sūtras in each pāda hold the term. Darker means more; click a number to open the term."}</p>
      </div>
      <div hidden={view !== "threads"}>{threads}</div>
      <div hidden={view !== "counts"}>{counts}</div>
      <p className="vs-read"><b>How to read it</b><span>{view === "threads"
        ? "Computed from the term index: a knot means the term's Sanskrit form occurs in that sūtra. Pādas differ in length (51, 55, 55, 34), so read each row for its shape, and the total for its weight."
        : "Number of sūtras in each pāda whose Sanskrit contains the term. Pādas differ in length (51, 55, 55, 34), so compare within a row, not down a column."}</span></p>
    </>
  );
}
