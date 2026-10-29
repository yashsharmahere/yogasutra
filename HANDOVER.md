# Ekatāna (एकतान) — handover

> **Repo layout (as of the move to Next.js).** The prototype files named below (`template.html`, `ekatana.html`) are in `prototype/`; the pipeline scripts and source data are in `pipeline/` (their internal paths still assume the old layout and need a one-line `ROOT` fix to run from there); the site reads `data/corpus.json`. Not yet ported to the Next.js site: Ask, the 30-question test set, the term graph, the visuals page. Per-sūtra URLs now exist: `/sutra/2-46`.


A connected, source-graded, citation-grounded reader for Patañjali's Yoga Sūtra, modelled on VedAnvaya (vedanvaya.vercel.app). Owner: Yash. Goal: a real product and a portfolio case study. Current state: a clickable prototype, one self-contained HTML file published as a private Claude Artifact.

## Layout
- `template.html` — the whole site (HTML/CSS/JS). Corpus is injected at `/*__CORPUS__*/null`.
- `build_data.py` — builds `data/corpus.json` from the source files below.
- `ekatana.html` — template + corpus; this is what is published. Rebuild: replace the placeholder with corpus JSON (escape `</` as `<\/`), `node --check` the largest `<script>`, publish.
- `find_gita_links.py` — candidate search for Gītā links (inputs: gita/gita `verse.json`).
- `extract_johnston.py` — extracts Johnston from PG #2526.

## Data (`data/`)
| File | What | Licence |
|---|---|---|
| `gretil_sanskrit.txt` | Sanskrit (IAST), Āgāśe/Ānandāśrama 1904, GRETIL (proofing: P. A. Maas) | CC BY-NC-SA 4.0 — site must stay non-commercial |
| `woods_1914.tsv` | Woods, sūtras only, OCR hand-corrected | Public domain |
| `johnston_1912.tsv`, `johnston_source.json` | Johnston, PG #2526 (SHA-256 starts 6ee8015ff5cd) | Public domain |
| `vivekananda_1896.tsv`, `vivekananda_extra.json` | Vivekananda's aphorisms (not commentary), read from Complete Works vol. 1 | Public domain |
| `gita_verses.json`, `gita_candidates.json`, `gita_links.json` | Gītā Sanskrit (gita/gita, Unlicense), 295 candidates, 19 reviewed links | — |
| `ask_tests.json` | 30-question Ask test set | — |
All files: `id<TAB>text`, ids like `2.46`. Edition = 195 sūtras (51/55/55/34).

## Rules that matter
- **Provenance grades** on every layer: Source / Derived / Editorial / Model-assisted.
- **195 vs 196:** many editions add a sūtra after 3.21 ("etena śabdādy antardhānam uktam"). Ours does not. Vivekananda's does: his 3.1–3.21 = ours; his 3.22 has no counterpart (kept in `vivekananda_extra.json`); his 3.23–3.56 = our 3.22–3.55. His Book 4 has no counterpart for our 4.16 and has 33 aphorisms; his 4.n = our 4.(n+1) for n ≥ 16. Mapping was done by the Sanskrit he prints, not by position.
- **Do not reproduce** modern translations (Bryant, Satchidananda, Iyengar, etc.): cited only, in Further reading.
- **Misprints kept as printed, flagged:** Johnston 2.30, 3.3, 4.4; Vivekananda 1.41 ("arid"), 2.30 ("nor-receiving"), 3.22 ("Samyana").
- Devanagari is derived from IAST by `indic_transliteration` plus a consonant-closing rule (words ending in a consonant join the next word).
- Concept index: 44 terms by regex stem patterns, 139 co-occurrence links, Woods' 34 groups.

## Ask
Claude is given the full edition (195 sūtras, three translations) in the prompt. Every sentence must cite a sūtra; citations are validated against the edition; out-of-text questions must be refused. Test runner scores each answer ok / refused / missed / review; a forbidden term inside a correct refusal is not flagged. A reply that isn't valid JSON is retried once and, if it still fails, an excerpt is stored. Results are stored in the Artifact `db` (collection `runs`); only the owner can run it.

## Known open items
1. Johnston 4.4 ("the Boston of the feeling of selfhood") unverified; the IA scan was unreadable there.
2. Vivekananda mapping for 3.23–3.56 and 4.17–4.33 follows the offset logic above and has not been checked pair by pair. A PDF edition (Samadhi Yoga Ashram repack, 56 sūtras in Book 3) shows ~40% wording differences from the Complete Works text, so it is a revised printing, not the 1896 text.
3. Ask answers from the first test run were not saved; re-run all 30 to store text.
4. Audio: deferred. VedAnvaya uses a permissioned recording; draft (never send) a permission email to the recording's owner first.
5. Not built: word-by-word glosses, Vyāsa commentary, per-sūtra URLs (hash routing now).

## Next build
Move to Next.js with a static page per sūtra (shareable URLs, search-indexable), keep this data pipeline as-is, keep the non-commercial licence notice, and carry over the provenance and test-set features.
