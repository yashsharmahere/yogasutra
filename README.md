# Ekatāna (एकतान)

A connected, source-graded reader for Patañjali's Yoga Sūtra: Sanskrit, three public-domain English translations, an index of 44 terms, and links to the Bhagavad Gītā. Every layer says where it came from.

- `app/`, `components/`, `lib/`: the Next.js site (one static page per sūtra, per term, per chapter).
- `data/corpus.json`: the built corpus the site reads.
- `pipeline/`: the scripts and source files that build the corpus (`build_data.py` reads `pipeline/data/`; paths inside it assume the original layout, see HANDOVER.md).
- `prototype/`: the single-file prototype, including the Ask feature and the 30-question test set that have not been ported yet.
- `HANDOVER.md`: sources, mapping rules (195 vs 196 sūtras), open items.

## Licences
- Sanskrit text: GRETIL, CC BY-NC-SA 4.0. This project must stay non-commercial and share alike for that data.
- Woods (1914), Johnston (1912), Vivekananda (1896): public domain.
- Gītā Sanskrit: github.com/gita/gita (Unlicense).
- Data in this repo (`data/`, `pipeline/data/`): CC BY-NC-SA 4.0 as a whole, because it is built on the GRETIL Sanskrit. See `DATA-LICENSE.md` for credit and for the public-domain parts.
- Code: not yet licensed; all rights reserved by the author until chosen.

## Run
```
npm install
npm run dev
```
