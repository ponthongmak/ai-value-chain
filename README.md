# AI Value Chain Map

A research map of the AI value chain: 7 layers (power → chips → servers → data centers → models → platforms → applications), 133 US-listed companies, multi-year trend scores, layer news and AI analyses. English and Thai.

**Live site:** https://ponthongmak.github.io/ai-value-chain/

Research notes only, not investment advice.

## What's inside
| Tab | What it shows |
|---|---|
| **Value chain** | The 7 layers: sub-sectors, stocks, economics, moats, risks and the latest news. |
| **Companies** | Score cards: **Overall** (the business) and **Price**, plus six pillar bars. |
| **Scores** | The ranking table and how every score is built, with a help article (**?**) for each metric. |
| **News** | Each layer's brief and a combined feed. |

Click a stock for its trends (4 fiscal years + TTM, all in USD), the moat and AI-opportunity breakdown from the AI judging panel, the peer comparison, the AI analysis and TradingView data.

## Scores
- **Overall** = average of Moat, AI opportunity, Growth and Quality.
- **Price** = average of Valuation and Momentum.
- **Growth, Quality and Valuation** use the multi-year trend (slope), with Quality and Valuation also counting the multi-year average. **Momentum** uses the 12-month price trend.
- **Moat and AI opportunity** are scored by an **AI judging panel** (Claude Opus 5.5, Gemini 4 Neon High and GPT-6.2 Sol), averaged.
- Figures come from Yahoo Finance and refresh automatically on weekdays.

## Use your own AI (Windows)
The site is read-only for visitors. To run the AI features (updates, judging, chat) with **your own** AI subscriptions:

1. Install at least one: [Claude Code](https://claude.com/claude-code), Codex (the ChatGPT extension for VS Code), or Antigravity.
2. [Download this repo as a ZIP](https://github.com/ponthongmak/ai-value-chain/archive/refs/heads/main.zip), unzip it and double-click **`start.cmd`**.
3. Click **AI** and sign in to each tool once (it opens the tool's own login). Then open the live site, or `http://localhost:8765`. The page shows **● AI connected** and turns on **Update**, the AI panel and chat.

**Privacy:** no API keys and no passwords are stored by this app. Each AI tool keeps its own sign-in. Your updates and chats stay on your computer and are never sent to this repository. The local bridge only accepts requests from your own computer and from this site.

Browsers: Chrome or Edge. Safari may block a website from talking to `localhost`.

## For the owner: updating and publishing
- **Update locally:** run `start.cmd` → **Update** (all / layer / sector / stock / financial data only; news, AI analysis, AI judgment). Or from a terminal: `tools\update.ps1 -Scope all`.
- **Publish:** run `powershell -NoProfile -ExecutionPolicy Bypass -File publish.ps1` (checks for personal data), then commit and push in GitHub Desktop. `.gitignore` keeps local-only files out: your AI account profiles, logs and job status.
- **Automatic deploys:** GitHub Actions deploys on each push and refreshes the figures on weekdays at 22:30 UTC. That needs Settings → Pages → Source: **GitHub Actions**.

More detail: [AI-ANALYSIS.md](AI-ANALYSIS.md).

## ภาษาไทย (ย่อ)
แผนที่ห่วงโซ่คุณค่า AI 7 ชั้น 133 บริษัทที่จดทะเบียนในสหรัฐฯ พร้อมคะแนนจากแนวโน้มหลายปี ข่าวรายชั้น และบทวิเคราะห์ AI เว็บไซต์เปิดให้อ่านได้ทุกคน

ถ้าต้องการใช้ AI ด้วยบัญชีของคุณเอง:
1. ติดตั้ง Claude Code, Codex หรือ Antigravity
2. ดาวน์โหลด ZIP แล้วดับเบิลคลิก `start.cmd`
3. ลงชื่อเข้าใช้ที่ปุ่ม **AI**

แอปไม่เก็บรหัสผ่านหรือ API key และผลลัพธ์อยู่บนคอมพิวเตอร์ของคุณเท่านั้น

ข้อมูลเพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุน
