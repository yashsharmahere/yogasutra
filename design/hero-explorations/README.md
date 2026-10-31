# Home hero explorations (31 Oct 2026)

Standalone HTML mocks made while designing the home page hero. Open any file in a browser (serve this folder, e.g. `python3 -m http.server`, so fonts load).

| File | What it tried |
|---|---|
| `v1-full-bleed.html` | First coded version: generated sky, cut-out yogi, wooden leaf stack with real text, gold thread drawn in SVG from the leaf's hole to the yogi. |
| `v2-grid-flat-leaf.html` | After a design critique: thread rises from the yogi, one shared left column, leaf redrawn flat in CSS, IAST added, "Ask a question" as second action. |
| `v3-continue-reading.html` | The leaf becomes a reading card under the intro: "Begin here" (1.1) on a first visit, "Up next" for a returning reader (`?last=2.46`). |
| `v4-manuscript-leaf.html` | Thread removed; leaf redrawn after real palm-leaf manuscripts (narrow, red bounding rules, folio number in the margin); hole removed; outline CTA; fixed height, width follows the śloka and long ones wrap. Try `?last=2.33&next=2.34`. |

`screens/` holds screenshots of each step. Art in `img/` is AI-generated (sky, yogi, leaf texture) and is captioned "AI-edited" on the site.
