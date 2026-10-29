"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sutra, Group, slug } from "@/lib/corpus";
import { Woods } from "./Bits";

const get = (k: string, d: string) => { try { return localStorage.getItem("ek:" + k) ?? d; } catch { return d; } };
const set = (k: string, v: string) => { try { localStorage.setItem("ek:" + k, v); } catch {} };

export default function ReaderList({ sutras, groups }: { sutras: Sutra[]; groups: Group[] }) {
  const [sc, setSc] = useState("both"), [tr, setTr] = useState("woods");
  useEffect(() => { setSc(get("script", "both")); setTr(get("tr", "woods")); }, []);
  const B = ({ k, v, cur, on, l }: any) => <button type="button" aria-pressed={cur === v} onClick={() => { on(v); set(k, v); }}>{l}</button>;
  const w = tr === "woods" || tr === "both", j = tr === "johnston" || tr === "both", v = tr === "vivekananda" || tr === "both";
  return (
    <>
      <div className="prefs">
        <span className="pref"><span>Script</span>
        <span className="seg"><B k="script" v="both" cur={sc} on={setSc} l="Both" /><B k="script" v="deva" cur={sc} on={setSc} l="देवनागरी" /><B k="script" v="iast" cur={sc} on={setSc} l="IAST" /></span></span>
        <span className="pref"><span>English</span>
        <span className="seg"><B k="tr" v="woods" cur={tr} on={setTr} l="Woods 1914" /><B k="tr" v="johnston" cur={tr} on={setTr} l="Johnston 1912" /><B k="tr" v="vivekananda" cur={tr} on={setTr} l="Vivekananda 1896" /><B k="tr" v="both" cur={tr} on={setTr} l="All three" /><B k="tr" v="none" cur={tr} on={setTr} l="Hide" /></span></span>
      </div>
      {groups.map((g) => (
        <section key={g.id} id={`g-${g.id}`} className="group">
          <div className="group-h"><h3>{g.heading}</h3><p><span className="mono">{g.range}</span> · {g.summary}</p></div>
          <div className="rows">
            {sutras.filter((s) => s.group === g.id).map((s) => (
          <Link key={s.id} className="row" href={`/sutra/${slug(s.id)}`}>
              <span className="num">{s.id}</span>
              <span>
                {sc !== "iast" && <span className="r-deva" style={{ display: "block" }}>{s.deva}</span>}
                {sc !== "deva" && <span className="r-iast" style={{ display: "block" }}>{s.iast}</span>}
                {w && <span className="r-en" style={{ display: "block" }}>{tr === "both" && <span className="who">Woods</span>}<Woods t={s.en} /></span>}
                {j && <span className="r-en jn" style={{ display: "block" }}>{tr === "both" && <span className="who">Johnston</span>}{s.jn}</span>}
                {v && s.vv && <span className="r-en jn" style={{ display: "block" }}>{tr === "both" && <span className="who">Vivekananda</span>}{s.vv}</span>}
                {tr === "vivekananda" && !s.vv && <span className="r-en muted" style={{ display: "block" }}><i>No counterpart in Vivekananda&apos;s edition.</i></span>}
              </span>
            </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
