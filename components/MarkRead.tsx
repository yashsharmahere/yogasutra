"use client";
import { useEffect } from "react";

// Remembers the last sūtra opened, in this browser only, so the home page can offer "Up next".
export default function MarkRead({ id }: { id: string }) {
  useEffect(() => { try { localStorage.setItem("ek:last", id); } catch {} }, [id]);
  return null;
}
