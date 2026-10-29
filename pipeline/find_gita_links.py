"""Find candidate connections between Yoga Sutra sutras and Bhagavad Gita verses.

Gita Sanskrit: github.com/gita/gita, data/verse.json (Devanagari). Only the Sanskrit is used.
Rule (DERIVED): a (sutra, verse) pair is a candidate when
  (a) they share at least two of the edition's indexed terms (same stem patterns as the YS index), or
  (b) they share a word-internal string of 8+ letters that occurs in at most 12 Gita verses.
Candidates are written to data/gita_candidates.json for review; nothing is published from here.
"""
import json, re, sys, pathlib, collections
from indic_transliteration import sanscript as s

ROOT = pathlib.Path(__file__).parent
corpus = json.loads((ROOT / "data/corpus.json").read_text())
verses = json.load(open(sys.argv[1], encoding="utf-8"))

def clean_deva(deva):
    lines = [l.strip() for l in deva.split("\n") if l.strip()]
    lines = [l for l in lines if not re.search(r"वाच\s*$", l)]          # drop speaker lines
    txt = " ".join(lines)
    txt = re.sub(r"।।\s*[\d\.]+\s*।।|[।॥]+|[\d०-९\.]+", " ", txt)          # verse numbers, dandas
    return re.sub(r"\s+", " ", txt).strip()

def to_iast(deva):
    return s.transliterate(clean_deva(deva), s.DEVANAGARI, s.IAST)

gita = []
for v in verses:
    gita.append({"ref": f"{v['chapter_number']}.{v['verse_number']}", "iast": to_iast(v["text"]), "deva": clean_deva(v["text"])})

pats = {c["id"]: re.compile(c["pattern"]) for c in corpus["concepts"]}
for g in gita:
    g["concepts"] = sorted(cid for cid, rx in pats.items() if rx.search(g["iast"]))

LET = "a-zāīūṛṝḷṃḥṅñṭḍṇśṣ"
def grams(text, n=8):
    out = set()
    for w in re.findall(f"[{LET}]+", text):
        for i in range(len(w) - n + 1):
            out.add(w[i:i+n])
    return out
gdf = collections.Counter()
ggrams = []
for g in gita:
    gs = grams(g["iast"]); ggrams.append(gs); gdf.update(gs)

cands = []
for st in corpus["sutras"]:
    sg = grams(st["iast"]); sc = set(st["concepts"])
    for g, gs in zip(gita, ggrams):
        shared_c = sorted(sc & set(g["concepts"]))
        shared_g = sorted(x for x in sg & gs if gdf[x] <= 12)
        if len(shared_c) >= 2 or shared_g:
            # merge overlapping 8-grams into longest strings for display
            cands.append({"ys": st["id"], "bg": g["ref"], "terms": shared_c, "grams": shared_g,
                          "score": len(shared_c) * 2 + len(shared_g)})
cands.sort(key=lambda c: -c["score"])
(ROOT / "data/gita_verses.json").write_text(json.dumps([{k: g[k] for k in ("ref", "iast", "deva", "concepts")} for g in gita], ensure_ascii=False))
(ROOT / "data/gita_candidates.json").write_text(json.dumps(cands, ensure_ascii=False, indent=0))
print(len(gita), "verses;", len(cands), "candidates")
for c in cands[:0]:
    print(c["score"], c["ys"], "BG", c["bg"], c["terms"], c["grams"][:6])
