---
description: Refresh the Latest news for one or more value-chain layers and their stocks (Sonnet 5.5 + web search)
argument-hint: <layer 1-7> [layer ...] | all
model: claude-sonnet-5-5
allowed-tools: PowerShell(powershell -NoProfile -ExecutionPolicy Bypass -File tools/*), WebSearch, WebFetch, Read, Write(news/*)
---

Refresh the layer news for: $ARGUMENTS

Layers are the 7 entries of the `LAYERS` table in `index.html` (1 = power … 7 = applications). If the argument is `all`, do layers 1 to 7, one at a time.

For each layer:

1. Read the layer's `name`, its `subs` (sub-sector names and tickers `t`) and, for each ticker, `name`, `tv` and `does` from the `CO` table.
2. Follow `ai/news-prompt.md` exactly: search the web for the last 14 days (today minus 14 days to today), cover every ticker that had real news, and write the result so it matches `ai/news-schema.json` (brief, themes, items). Tickers in items may only be this layer's tickers.
3. Save `news/L<n>.json` as UTF-8 with this shape:
   ```json
   {
     "layer": 3, "name": "<layer name>", "model": "claude-sonnet-5-5",
     "generatedAt": "<UTC ISO time>", "period": ["<from>", "<to>"],
     "brief": { "en": "...", "th": "..." }, "themes": { "en": [...], "th": [...] },
     "items": [ ... ]
   }
   ```
4. After all layers are saved, rebuild the bundles the page loads:
   `powershell -NoProfile -ExecutionPolicy Bypass -File tools/build-analysis.ps1`

Finish with one line per layer: number of items and the English brief.
