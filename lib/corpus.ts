import corpus from "@/data/corpus.json";

export type Sutra = { id: string; pada: number; n: number; group: number; iast: string; deva: string; en: string; jn: string; vv?: string; jnote?: string; vvnote?: string; concepts: string[] };
export type Concept = { id: string; iast: string; deva: string; en: string; woods: string; kind: string; pattern: string; gloss: string; sutras: string[] };
export type Group = { id: number; pada: number; range: string; heading: string; summary: string; sutras: string[] };

export const D = corpus as any;
export const S: Sutra[] = D.sutras;
export const C: Concept[] = D.concepts;
export const G: Group[] = D.groups;
export const PADAS: { n: number; name: string; deva: string; woods: string }[] = D.padas;
export const byId: Record<string, Sutra> = Object.fromEntries(S.map((s) => [s.id, s]));
export const cById: Record<string, Concept> = Object.fromEntries(C.map((c) => [c.id, c]));
export const slug = (id: string) => id.replace(".", "-");
export const unslug = (s: string) => s.replace("-", ".");
export const GRADE: Record<string, [string, string]> = {
  source: ["g-source", "Source"], derived: ["g-derived", "Derived"], editorial: ["g-editorial", "Editorial"], model: ["g-model", "Model-assisted"],
};
