"""Extract Charles Johnston's sutra translations (1912) from Project Gutenberg eBook #2526.

Input: the PG plain text (copy found in github.com/brylie/yoga-sutras-of-patanjali-llm-rag,
file YogaSutrasOfPatanjali-pg2526.txt, "Most recently updated: May 14, 2022").
Output: data/johnston_1912.tsv (id<TAB>text) and data/johnston_source.json (hash, counts).

Rule: in each BOOK section (not the INTRODUCTION sections), a paragraph that starts with
a number (with or without a following full stop) is a sutra; the paragraphs after it are
Johnston's commentary and are not kept. Text is kept as printed, whitespace normalised.
"""
import re, sys, json, hashlib, pathlib

src = pathlib.Path(sys.argv[1])
raw = src.read_bytes()
t = raw.decode("utf-8").replace("\r", "")
t = t.split("*** START OF THE PROJECT GUTENBERG EBOOK")[1].split("*** END OF THE PROJECT GUTENBERG EBOOK")[0]

parts = re.split(r"\n(?:INTRODUCTION TO BOOK [IV]+|BOOK ([IV]+))\n", t)
books, cur = {}, None
for p in parts:
    if p in ("I", "II", "III", "IV"):
        cur = p; continue
    if cur and cur not in books and p is not None:
        books[cur] = p; cur = None

ROMAN = {"I": 1, "II": 2, "III": 3, "IV": 4}
out = []
for b, txt in books.items():
    paras = [re.sub(r"\s+", " ", x).strip() for x in re.split(r"\n\s*\n", txt)]
    for x in paras:
        m = re.match(r"^(\d+)\.? (.*)$", x)
        if m:
            out.append((f"{ROMAN[b]}.{int(m.group(1))}", m.group(2).strip()))

ids = [k for k, _ in out]
assert len(ids) == len(set(ids)), "duplicate sutra numbers"
root = pathlib.Path(__file__).parent
(root / "data/johnston_1912.tsv").write_text("".join(f"{k}\t{v}\n" for k, v in out), encoding="utf-8")
meta = {"file": src.name, "sha256": hashlib.sha256(raw).hexdigest(), "count": len(out),
        "per_book": {b: sum(1 for k in ids if k.startswith(f"{ROMAN[b]}.")) for b in books}}
(root / "data/johnston_source.json").write_text(json.dumps(meta, indent=1), encoding="utf-8")
print(meta)
