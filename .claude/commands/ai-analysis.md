---
description: Write or refresh the AI Analysis tab for one or more stocks (Opus 5.5 evaluation + technicals)
argument-hint: <TICKER> [TICKER ...] | all
model: claude-opus-5-5
allowed-tools: PowerShell(powershell -NoProfile -ExecutionPolicy Bypass -File tools/*), WebSearch, WebFetch, Read, Write(analysis/*)
---

Refresh the AI Analysis for: $ARGUMENTS

The tickers are keys of the `CO` table in `index.html` (e.g. NVDA, TSM, SKH, SU). If the argument is `all`, do every key in that table, one at a time.

For each ticker:

1. Look up its `name`, `tv` symbol, `does` and `moat` in the `CO` table, and its AI-opportunity sub-scores in the `OPP` table.
2. Get the technicals (treat these numbers as fact):
   `powershell -NoProfile -ExecutionPolicy Bypass -File tools/indicators.ps1 -Symbol <tv symbol>`
3. Follow `ai/analysis-prompt.md` exactly: research the last ~30 days of news with WebSearch, then write the evaluation. The answer must match `ai/analysis-schema.json` (stance, thesis, en, th, sources; each language has summary, pros, cons and opportunityCheck first).
4. Save `analysis/<TICKER>.json` as UTF-8 with this shape:
   ```json
   {
     "ticker": "NVDA", "name": "...", "symbol": "NASDAQ:NVDA",
     "model": "claude-opus-5-5", "effort": "interactive",
     "generatedAt": "<UTC ISO time>",
     "stance": "...", "thesis": "...",
     "indicators": { <the full JSON from step 2, unchanged> },
     "en": { ... }, "th": { ... }, "sources": [ ... ]
   }
   ```
5. After all tickers are saved, rebuild the bundle the page loads:
   `powershell -NoProfile -ExecutionPolicy Bypass -File tools/build-analysis.ps1`

Finish with one line per ticker: stance, thesis, and the headline.
