"use client";
import { useEffect, useState } from "react";

// Thin progress line on a chapter card: how far into this chapter the reader's last-read sūtra is.
export default function ReadBar({ ids }: { ids: string[] }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    try { const v = localStorage.getItem("ek:last"); const i = v ? ids.indexOf(v) : -1; if (i >= 0) setN(i + 1); } catch {}
  }, [ids]);
  if (!n) return null;
  const done = n === ids.length;
  return (
    <span className="hs-read" aria-label={done ? "Chapter read" : `Read to ${ids[n - 1]}`}>
      <span className="bar"><i style={{ width: `${(100 * n) / ids.length}%` }} /></span>
      <span className="t">{done ? "Read" : `You are at ${ids[n - 1]}`}</span>
    </span>
  );
}
