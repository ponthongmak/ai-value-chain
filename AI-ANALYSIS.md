# AI Value Chain Map: how it works and how to update it

A private research app for the AI value chain. Open `index.html` to read it, or start `start.cmd` for the live features (AI accounts, updates, chat). Every AI runs on **your own sign-in** for that tool. There are no API keys and no stored passwords, and the app is only reachable from this computer.

## Tabs
| Tab | What it shows |
|---|---|
| **Value chain** | The 7 layers. Click a layer for its sub-sectors, stocks, economics, moats, risks and **Latest news**. |
| **Companies** | All 133 stocks as score cards. Filter by layer or moat tier, search, and sort by any score. |
| **Scores** | The ranking table (6 pillars + Overall and Price), then **How the scores work**. |
| **News** | Each layer's brief and one combined feed. |

Click a stock to open its drawer:
- **Overview:**
  - scores;
  - **Growth & profitability** charts (revenue and net-income bars, net-margin line; Annual / Quarterly);
  - one block per pillar: every sub-metric with its points, a sparkline of its 4 fiscal years + TTM, the latest value and the trend slope;
  - **Data** (table + **Copy CSV**) under each pillar;
  - moat, AI opportunity, role in the chain, peer comparison and news.
- **AI Analysis:** summary, pros and cons first, then the technicals, business, news and sources.
- **TradingView:** profile, financials and links, always in English.

**?** next to any metric opens the **Help center**: what it measures, the formula with a "Where:" list, how to read it, how this page uses it, and the key takeaway. It has search and categories, and you can also open it from the **?** in the header. The articles live in `glossary.js`.

## Scores (0–100)
The number-based pillars use **trends**: a least-squares line through 4 fiscal years + the trailing 12 months. **All money is in USD at today's exchange rate**, the same rate for every year, so currency moves don't distort the trend. Each sub-metric earns points = weight × percentile ÷ 100, and the pillar is the sum of its points.

| Pillar | Sub-metrics (points) | Scored on | Theory |
|---|---|---|---|
| Growth (all stocks) | Revenue 35 · Gross profit 25 · Operating income 20 · FCF 20 | slope (%/yr, or pp of revenue/yr) | Chan-Karceski-Lakonishok 2003, Novy-Marx 2013, Sloan 1996 |
| Quality (within sector) | GP/assets 20 · Operating margin 15 · FCF margin 15 · ROA 10 · Debt/equity 15 · Net cash/market cap 10 · Earnings stability 15 | ½ slope + ½ multi-year average (stability: level) | Novy-Marx, Fama-French RMW, QMJ, Piotroski, Mohanram |
| Valuation (within sector) | Earnings yield 30 · FCF yield 30 · EBITDA/EV 25 · Sales/EV 15 | ½ slope + ½ average | Basu 1977, Fama-French HML, Loughran-Wellman 2011 |
| Momentum (all stocks) | 12-1 month trend slope 60 · Trend consistency (R²) 40 | 12-month price fit | Jegadeesh-Titman 1993, Carhart 1997, Da-Gurun-Warachka 2014 |
| Moat, AI opportunity | 5 judged parts × 20 | `m:[…]` in `CO`, the `OPP` table | Morningstar moat, Porter; BCG matrix, Theory of Constraints |

- **Overall** = the business: the average of Moat, AI opportunity, Growth and Quality.
- **Price** = the average of Valuation and Momentum, shown next to Overall rather than mixed into it.
- **◐** marks a score with missing data, for example new listings with fewer than 3 years of history.

## AI accounts (header button **AI**)
| Provider | Used through | Sign-in |
|---|---|---|
| Claude | Claude Code CLI | browser login (`claude auth login`) |
| Codex | `codex` from the VS Code ChatGPT extension | ChatGPT login (`codex login`) |
| Antigravity | `agy` (Gemini models) | the Google account signed in to Antigravity |

- **Choosing:** pick which account and model runs **Stock analysis**, **Layer news** and **Chat**.
- **Adding accounts:** **Add another account** creates an extra Claude or Codex profile with its own sign-in folder, so several accounts stay signed in.
- **Sign in / Sign out:** opens the provider's own login window. The choices are saved in `ai-accounts.json`, which holds no secrets.

## Updating (manual only)
Click **Update** in the header and pick:
- what to update: **All · By layer · By sector · By stock · Financial data only**;
- the parts: figures / news / AI analysis;
- the AI account and model.

The panel previews the jobs before you run them.

Shortcuts:
- **Update** in a stock's AI Analysis tab;
- **Update news** on a layer;
- **Refresh figures** on the Scores tab.

The same from a terminal:
```
powershell -NoProfile -ExecutionPolicy Bypass -File tools\update.ps1 -Scope layer -Target 2 -Account codex
powershell -NoProfile -ExecutionPolicy Bypass -File tools\update.ps1 -Scope figures
powershell -NoProfile -ExecutionPolicy Bypass -File tools\update.ps1 -Scope stock -Target NVDA,ANT -DryRun
```
- Figures come from Yahoo Finance and use no AI.
- AI jobs run 3 at a time. A usage-limit error stops a job; nothing retries into paid extra usage.
- Logs are written to `logs\`.

In Claude Code you can also use the `/ai-analysis NVDA` and `/layer-news 3` slash commands.

## Start and stop
- **Start:** double-click `start.cmd`. It opens `http://localhost:8765`.
- **Stop:** close the server window, or press Ctrl+C in it.
- Opening the HTML file directly is read-only.

## Files
- `index.html`: the app. Its data block holds `CO`, `LAYERS`, `OPP`, `SECTOR`, `SUB` (sub-metrics and weights) and `PILLARS`.
- `glossary.js`: the help-center articles (EN/TH).
- `serve.ps1`: the local server (`/api/chat`, `/api/update`, `/api/accounts`), localhost only.
- `tools/common.ps1`: `Invoke-AI` (one adapter for Claude, Codex and Antigravity), account and status helpers, limit detection.
- `tools/update.ps1`: manual updates. `fundamentals.ps1` (figures), `news.ps1`, `analyze.ps1` and `indicators.ps1` are the steps it runs.
- `tools/build-analysis.ps1`: rebuilds `ai-analysis.js`, `ai-news.js` and `fundamentals.js` from `analysis/`, `news/` and `data/`.
- `ai/`: the prompts and JSON schemas the AI writes to.
- `.claude/commands/`: the slash commands.
