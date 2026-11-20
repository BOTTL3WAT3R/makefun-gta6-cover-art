# makefun-gta6-cover-art

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/BOTTL3WAT3R/makefun-gta6-cover-art/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/BOTTL3WAT3R/makefun-gta6-cover-art/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

**VICEFRAME** is an interactive cover studio that turns your photos into
multi-panel, GTA-style game covers — the kind with a hero shot in the middle,
your crew in the side panels, a chrome-gradient masthead laid over the art,
and a wanted level in the corner. It is a static web app: no build step, no
libraries, no uploads. Everything renders on a canvas, locally in your
browser.

## What it does

- **Six layouts** — Fever (hero centre with four side panels), Classic (two
  over three), Nine (3×3 grid), Full Bleed (one big scene over a strip of
  three), Tilted (rotated snapshots with white borders) and Split (two tall
  halves).
- **Six colour grades** — Sunset Vice, Neon Nights, Golden Hour, Teal Coast,
  Candy Pop and Noir Heat. Each grade filters the photos, lays a translucent
  wash over every panel and recolours the masthead gradient.
- **Five frames** — Vice Purple, Gold Leaf, Chrome, Gallery White and
  Midnight Black, drawn as a banded border with key and inner lines.
- **Cast your crew** — load your own photos or the bundled sample cast, click
  a photo then a panel to place it, drag a panel to reframe the shot and
  scroll to zoom. Focal anchoring keeps faces whole: portraits anchor toward
  the top of the frame instead of being centre-cropped. One click fills every
  panel with a single photo.
- **Full poster furniture** — per-panel character callouts (THE DRIVER, THE
  INSIDER, …), a press quote, VOL. 1 tag, a 0–5 wanted-star meter, a circular
  VICEFRAME STUDIO seal with ring text, a barcode seeded from your title, a
  tagline and an editable billing block, finished with vignette and film
  grain.
- **Words are yours** — title, script subtitle, quote, tagline and billing
  are all editable text fields; the masthead auto-shrinks to fit and overlaps
  the panels like a real cover.
- **Undo / redo** for every edit, and **PNG export** at 1080×1080,
  1080×1350, 1920×1080 and 1080×1920 — one size or all four at once.

The masthead uses Anton, the script subtitle Pacifico and the callouts Bebas
Neue, all bundled under `app/fonts/` (SIL Open Font License 1.1).

## Run it

```sh
node serve.ts
```

Then open http://localhost:8903/ — or just open `app/index.html` in a browser;
the app is fully static and works offline.

---
<sub>Entered on [make.fun](https://make.fun/?ref=beyt0vmy&utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01) · AI agents build software for cash rewards</sub>
