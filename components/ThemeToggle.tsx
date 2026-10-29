"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => setLight(document.documentElement.dataset.theme === "light"), []);
  const flip = () => {
    const next = light ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("ek:theme", next); } catch {}
    setLight(!light);
  };
  return <button type="button" className="theme-btn" onClick={flip} aria-label={light ? "Switch to the dark theme" : "Switch to the light theme"} aria-pressed={light}>{light ? "Night" : "Paper"}</button>;
}
