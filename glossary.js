/* glossary.js — help-centre content for the "?" pop-ups on ai-infrastructure-research.html
 *
 * window.GLOSSARY[key] = {
 *   cat:     category key (see GLOSSARY_CATS)
 *   related: [other GLOSSARY keys]
 *   formula: one plain-text line
 *   where:   [[symbol, English explanation, Thai explanation], ...]
 *   en / th: { title, intro, interp:[low, high, warning], use, takeaway }
 * }
 * Own wording throughout. "takeaway" is shown under a "Key takeaway" label added by the page.
 */
window.GLOSSARY_CATS = [
  { k: "scores", en: "Scores",               th: "คะแนน" },
  { k: "growth", en: "Growth",               th: "การเติบโต" },
  { k: "quality",en: "Quality",              th: "คุณภาพ" },
  { k: "value",  en: "Valuation",            th: "มูลค่า" },
  { k: "mom",    en: "Momentum",             th: "โมเมนตัม" },
  { k: "moat",   en: "Moat",                 th: "คูเมืองทางธุรกิจ" },
  { k: "opp",    en: "AI opportunity",       th: "โอกาสด้าน AI" },
  { k: "tech",   en: "Technical indicators", th: "อินดิเคเตอร์ทางเทคนิค" },
  { k: "data",   en: "Data & methods",       th: "ข้อมูลและวิธีคำนวณ" }
];

window.GLOSSARY = {

  /* ───────────────────────────── SCORES ───────────────────────────── */

  overall: {
    cat: "scores",
    related: ["price", "moat", "opp", "growth", "quality"],
    formula: "Overall = (Moat + AI opportunity + Growth + Quality) ÷ 4",
    where: [
      ["Moat, AI opportunity", "The two judged pillars, 0–100 each (scored by the AI judging panel)", "สองเสาที่ประเมินด้วยวิจารณญาณ เสาละ 0–100 (ให้คะแนนโดยคณะกรรมการ AI)"],
      ["Growth, Quality", "The two pillars from the financial statements, 0–100 each", "สองเสาที่คำนวณจากงบการเงิน เสาละ 0–100"]
    ],
    en: {
      title: "Overall score (the business)",
      intro: "Answers “is this a good company?” while leaving the share price out. It averages the competitive position (moat), the size of the AI prize (opportunity) and what the financial statements show (growth and quality). Valuation and momentum are kept apart in the Price score, because mixing them in would let a cheap or fast-rising share price hide a weak business.",
      interp: [
        "Low (below about 40): the company itself is the issue — weak position, little AI exposure or fading financials.",
        "High (above about 70): a strong franchise with real AI demand and numbers that back the story.",
        "Warning: a great business can still be a poor buy if the price already assumes perfection — always read it next to the Price score."
      ],
      use: "Shown first on every stock card and used for the main ranking. It is the equal-weight mean of moat, AI opportunity, growth and quality; Price is shown beside it, not mixed in.",
      takeaway: "Overall tells you what you would own; Price tells you what you would pay for it and how the market is treating it."
    },
    th: {
      title: "คะแนนรวม (ตัวธุรกิจ)",
      intro: "ตอบคำถามว่า “บริษัทนี้ดีไหม” โดยไม่นำราคาหุ้นมาปน คำนวณจากค่าเฉลี่ยของสถานะการแข่งขัน (คูเมือง) ขนาดของโอกาสด้าน AI และสิ่งที่งบการเงินบอก (การเติบโตและคุณภาพ) ส่วนความคุ้มค่าของราคาและโมเมนตัมแยกไว้ในคะแนนราคา เพราะถ้ารวมกันราคาหุ้นที่ถูกหรือกำลังขึ้นแรงอาจบดบังธุรกิจที่อ่อนแอ",
      interp: [
        "ต่ำ (ราวต่ำกว่า 40): ปัญหาอยู่ที่ตัวบริษัท เช่น สถานะการแข่งขันอ่อน รายได้จาก AI น้อย หรือตัวเลขทางการเงินกำลังถดถอย",
        "สูง (ราวเกิน 70): ธุรกิจแข็งแกร่ง มีความต้องการด้าน AI จริง และตัวเลขสนับสนุนเรื่องเล่า",
        "ข้อควรระวัง: ธุรกิจดีอาจเป็นการลงทุนที่ไม่ดีได้ ถ้าราคาสะท้อนความคาดหวังสูงสุดไปแล้ว ควรดูคู่กับคะแนนราคาเสมอ"
      ],
      use: "แสดงเป็นอันดับแรกบนการ์ดหุ้นทุกตัวและใช้จัดอันดับหลัก เป็นค่าเฉลี่ยน้ำหนักเท่ากันของคูเมือง โอกาสด้าน AI การเติบโต และคุณภาพ ส่วนคะแนนราคาแสดงคู่กัน ไม่ได้นำมารวม",
      takeaway: "คะแนนรวมบอกว่าคุณจะได้เป็นเจ้าของอะไร ส่วนคะแนนราคาบอกว่าต้องจ่ายแพงแค่ไหนและตลาดกำลังมองหุ้นอย่างไร"
    }
  },

  price: {
    cat: "scores",
    related: ["overall", "value", "mom"],
    formula: "Price = (Valuation + Momentum) ÷ 2",
    where: [
      ["Valuation", "How cheap the stock is against its sector peers, 0–100", "ความถูกของหุ้นเมื่อเทียบกับหุ้นในกลุ่มเดียวกัน 0–100"],
      ["Momentum", "How strong and steady the 12-month price trend is, 0–100", "ความแรงและความสม่ำเสมอของแนวโน้มราคา 12 เดือน 0–100"]
    ],
    en: {
      title: "Price score",
      intro: "Looks only at the share price: whether it is cheap relative to what the company earns, and whether the market is currently pushing it up. Value and momentum are the two best-documented return patterns in equity research and tend to work well together because they rarely fail at the same time.",
      interp: [
        "Low Price: expensive, falling, or both — the market may be ahead of the fundamentals, or souring on them.",
        "High Price: reasonably priced and already trending up — the market is starting to agree.",
        "Warning: cheap and rising can also describe a short-lived bounce in a declining business; check the Overall score."
      ],
      use: "Shown next to the Overall score (which covers the business only). It is the equal-weight mean of the valuation and momentum pillars.",
      takeaway: "A high Price score means the entry point and the trend are on your side; it says nothing about business quality on its own."
    },
    th: {
      title: "คะแนนราคา",
      intro: "พิจารณาเฉพาะราคาหุ้น ว่าถูกหรือแพงเมื่อเทียบกับกำไรของบริษัท และตลาดกำลังดันราคาขึ้นหรือไม่ มูลค่าและโมเมนตัมเป็นสองรูปแบบผลตอบแทนที่มีงานวิจัยรองรับมากที่สุด และมักเสริมกันได้ดีเพราะไม่ค่อยล้มเหลวพร้อมกัน",
      interp: [
        "ต่ำ: ราคาแพง กำลังลง หรือทั้งสองอย่าง ตลาดอาจคาดหวังเกินพื้นฐาน หรือเริ่มหมดความเชื่อมั่น",
        "สูง: ราคาสมเหตุสมผลและเริ่มมีแนวโน้มขึ้นแล้ว ตลาดเริ่มเห็นด้วย",
        "ข้อควรระวัง: ถูกและกำลังขึ้น อาจเป็นแค่การเด้งระยะสั้นของธุรกิจที่กำลังถดถอยก็ได้ ควรดูคะแนนรวมประกอบ"
      ],
      use: "แสดงคู่กับคะแนนรวม (ซึ่งวัดเฉพาะตัวธุรกิจ) เป็นค่าเฉลี่ยน้ำหนักเท่ากันของเสามูลค่าและเสาโมเมนตัม",
      takeaway: "คะแนนราคาสูงแปลว่าจังหวะเข้าและแนวโน้มเป็นใจ แต่ไม่ได้บอกอะไรเกี่ยวกับคุณภาพธุรกิจเลย"
    }
  },

  moat: {
    cat: "scores",
    related: ["moat_tech", "moat_sw", "moat_net", "moat_scale", "moat_dur"],
    formula: "Moat = Technology & IP + Switching costs + Network & ecosystem + Scale & cost + Durability",
    where: [
      ["Each term", "A judged sub-score from 0 to 20", "คะแนนย่อยที่ประเมินด้วยวิจารณญาณ 0–20"],
      ["Total", "0–100; five sub-scores × 20 points", "0–100 มาจากห้าคะแนนย่อย × 20 คะแนน"]
    ],
    en: {
      title: "Moat",
      intro: "How well the company can defend its profits from competitors over many years. The idea comes from Warren Buffett's “economic moat”, was turned into a rating framework by Morningstar, and draws on Michael Porter's work on competitive advantage. It is a judgment, not a formula, so this page breaks it into five named sources of advantage.",
      interp: [
        "Low moat (below 40): rivals can copy, undercut or replace the product; profits are likely to be competed away.",
        "High moat (above 75): several reinforcing advantages that would take competitors years and billions to overcome.",
        "Warning: moats erode — technology shifts can drain a moat faster in AI hardware and software than in older industries."
      ],
      use: "One of the four business pillars (one-quarter of Overall). It is the sum of five sub-scores, 0–20 each, from the AI judging panel (or the hand-set notes until the panel has scored the stock).",
      takeaway: "Moat estimates how long today's profits can last, which matters more than how large they are this year."
    },
    th: {
      title: "คูเมืองทางธุรกิจ",
      intro: "วัดว่าบริษัทปกป้องกำไรจากคู่แข่งได้ดีเพียงใดในระยะยาว แนวคิดมาจาก “economic moat” ของ Warren Buffett ซึ่ง Morningstar นำมาพัฒนาเป็นระบบจัดอันดับ และอิงงานของ Michael Porter เรื่องความได้เปรียบในการแข่งขัน เป็นการประเมินด้วยวิจารณญาณ ไม่ใช่สูตร หน้านี้จึงแยกออกเป็นห้าแหล่งของความได้เปรียบ",
      interp: [
        "ต่ำ (ต่ำกว่า 40): คู่แข่งลอกเลียน ตัดราคา หรือทดแทนสินค้าได้ง่าย กำไรมีแนวโน้มถูกแข่งขันจนหายไป",
        "สูง (เกิน 75): มีหลายความได้เปรียบที่เสริมกัน คู่แข่งต้องใช้เวลาหลายปีและเงินมหาศาลจึงจะตามทัน",
        "ข้อควรระวัง: คูเมืองถูกกัดกร่อนได้ ในโลกฮาร์ดแวร์และซอฟต์แวร์ AI การเปลี่ยนเทคโนโลยีอาจทำให้คูเมืองตื้นเขินเร็วกว่าอุตสาหกรรมดั้งเดิม"
      ],
      use: "เป็นหนึ่งในสี่เสาของธุรกิจ (หนึ่งในสี่ของคะแนนรวม) คำนวณจากผลรวมห้าคะแนนย่อย ข้อละ 0–20 จากคณะกรรมการ AI (หรือค่าที่ตั้งด้วยมือจนกว่าคณะกรรมการจะให้คะแนนหุ้นตัวนั้น)",
      takeaway: "คูเมืองประเมินว่ากำไรวันนี้จะอยู่ได้นานแค่ไหน ซึ่งสำคัญกว่าขนาดของกำไรในปีนี้"
    }
  },

  opp: {
    cat: "scores",
    related: ["opp_exp", "opp_mkt", "opp_pos", "opp_bot", "opp_opt"],
    formula: "AI opportunity = Exposure + Market growth + Position + Bottleneck + Optionality",
    where: [
      ["Each term", "A judged sub-score from 0 to 20", "คะแนนย่อยที่ประเมินด้วยวิจารณญาณ 0–20"],
      ["Total", "0–100; five sub-scores × 20 points", "0–100 มาจากห้าคะแนนย่อย × 20 คะแนน"]
    ],
    en: {
      title: "AI opportunity",
      intro: "How much the AI build-out can add to this company's future revenue and profit. It combines how much of the business is tied to AI, how fast that market grows, how strong the company's place in it is, whether it controls a bottleneck, and what upside is not yet in the numbers.",
      interp: [
        "Low opportunity (below 40): AI is a side story; the company's results will be driven mainly by other markets.",
        "High opportunity (above 75): AI is central, the market is expanding quickly and the company holds a strong, hard-to-replace spot.",
        "Warning: opportunity is about the future and is often already priced in — compare with valuation before acting."
      ],
      use: "One of the four business pillars (one-quarter of Overall). It is the sum of five sub-scores, 0–20 each, from the AI judging panel (or the hand-set notes until the panel has scored the stock).",
      takeaway: "Opportunity measures the size and quality of the AI prize available to this particular company."
    },
    th: {
      title: "โอกาสด้าน AI",
      intro: "วัดว่าการลงทุนสร้างโครงสร้างพื้นฐาน AI จะเพิ่มรายได้และกำไรในอนาคตให้บริษัทนี้ได้มากเพียงใด โดยรวมสัดส่วนธุรกิจที่ผูกกับ AI อัตราการเติบโตของตลาด ความแข็งแกร่งของบริษัทในตลาดนั้น การควบคุมคอขวด และโอกาสที่ยังไม่สะท้อนในตัวเลข",
      interp: [
        "ต่ำ (ต่ำกว่า 40): AI เป็นเพียงเรื่องรอง ผลประกอบการยังขึ้นกับตลาดอื่นเป็นหลัก",
        "สูง (เกิน 75): AI เป็นแกนหลัก ตลาดขยายตัวเร็ว และบริษัทครองตำแหน่งที่แข็งแรงและทดแทนยาก",
        "ข้อควรระวัง: โอกาสเป็นเรื่องของอนาคตและมักสะท้อนในราคาไปแล้ว ควรเทียบกับคะแนนมูลค่าก่อนตัดสินใจ"
      ],
      use: "เป็นหนึ่งในสี่เสาของธุรกิจ (หนึ่งในสี่ของคะแนนรวม) คำนวณจากผลรวมห้าคะแนนย่อย ข้อละ 0–20 จากคณะกรรมการ AI (หรือค่าที่ตั้งด้วยมือจนกว่าคณะกรรมการจะให้คะแนนหุ้นตัวนั้น)",
      takeaway: "โอกาสด้าน AI วัดขนาดและคุณภาพของรางวัลจาก AI ที่บริษัทนี้มีโอกาสคว้าได้"
    }
  },

  growth: {
    cat: "scores",
    related: ["g_rev", "g_gp", "g_oi", "g_fcf", "d_slope", "d_pct"],
    formula: "Growth = Σ (weight × percentile ÷ 100) over Revenue 35, Gross profit 25, Operating income 20, FCF 20",
    where: [
      ["weight", "Points available to each sub-metric; they add to 100", "คะแนนเต็มของแต่ละตัวชี้วัดย่อย รวมกันได้ 100"],
      ["percentile", "The stock's rank among all 55 stocks on that sub-metric, 0–100", "อันดับเปอร์เซ็นไทล์ของหุ้นเทียบกับหุ้นทั้ง 55 ตัวในตัวชี้วัดนั้น 0–100"],
      ["Σ", "Sum of the points earned", "ผลรวมคะแนนที่ได้"]
    ],
    en: {
      title: "Growth",
      intro: "How fast the business has been expanding over the last several years, measured as a fitted trend rather than a single year's jump. Research such as Chan, Karceski and Lakonishok (2003) shows one-year growth rates are noisy and rarely persist, so a multi-year slope is a more honest picture.",
      interp: [
        "Low growth (below 30): revenue and profits are flat or shrinking compared with the rest of the AI value chain.",
        "High growth (above 70): sales and profits have been compounding faster than most peers, with margins keeping up.",
        "Warning: past growth is not guaranteed to continue, and growth bought with falling margins or cash burn scores lower on the profit sub-metrics."
      ],
      use: "One of the four business pillars (one-quarter of Overall). Ranked across all 55 stocks (not within sector), using slope only over 4 fiscal years plus TTM. Each sub-metric earns weight × percentile ÷ 100; if a sub-metric is missing, the others are rescaled to 100, and at least half the weight must be present.",
      takeaway: "Growth rewards companies whose revenue and profit have climbed steadily for years, not just in the latest quarter."
    },
    th: {
      title: "การเติบโต",
      intro: "วัดว่าธุรกิจขยายตัวเร็วเพียงใดในช่วงหลายปีที่ผ่านมา โดยใช้แนวโน้มที่ฟิตจากข้อมูลหลายปีแทนการดูการกระโดดของปีเดียว งานวิจัยอย่าง Chan, Karceski และ Lakonishok (2003) พบว่าอัตราเติบโตปีเดียวมีความผันผวนสูงและแทบไม่ต่อเนื่อง ความชันหลายปีจึงสะท้อนภาพจริงได้ดีกว่า",
      interp: [
        "ต่ำ (ต่ำกว่า 30): รายได้และกำไรทรงตัวหรือหดตัว เมื่อเทียบกับหุ้นอื่นในห่วงโซ่คุณค่า AI",
        "สูง (เกิน 70): ยอดขายและกำไรเติบโตทบต้นเร็วกว่าคู่แข่งส่วนใหญ่ และอัตรากำไรตามทัน",
        "ข้อควรระวัง: การเติบโตในอดีตไม่รับประกันอนาคต และการโตที่แลกด้วยอัตรากำไรลดลงหรือเผาเงินสดจะได้คะแนนต่ำในตัวชี้วัดด้านกำไร"
      ],
      use: "เป็นหนึ่งในสี่เสาของธุรกิจ (หนึ่งในสี่ของคะแนนรวม) จัดอันดับเทียบหุ้นทั้ง 55 ตัว (ไม่แยกกลุ่มอุตสาหกรรม) ใช้เฉพาะความชันจาก 4 ปีบัญชีบวก TTM แต่ละตัวชี้วัดย่อยได้คะแนน = น้ำหนัก × เปอร์เซ็นไทล์ ÷ 100 ถ้าขาดตัวชี้วัดใด ตัวที่เหลือจะถูกปรับสัดส่วนให้เต็ม 100 และต้องมีข้อมูลอย่างน้อยครึ่งหนึ่งของน้ำหนักรวม",
      takeaway: "เสาการเติบโตให้รางวัลบริษัทที่รายได้และกำไรไต่ขึ้นอย่างสม่ำเสมอมาหลายปี ไม่ใช่แค่ไตรมาสล่าสุด"
    }
  },

  quality: {
    cat: "scores",
    related: ["q_gpa", "q_om", "q_fcfm", "q_roa", "q_de", "q_netcash", "q_stab"],
    formula: "Quality = Σ (weight × percentile ÷ 100) over GP/A 20, Op. margin 15, FCF margin 15, ROA 10, D/E 15, Net cash 10, Stability 15",
    where: [
      ["weight", "Points available to each sub-metric; they add to 100", "คะแนนเต็มของแต่ละตัวชี้วัดย่อย รวมกันได้ 100"],
      ["percentile", "Rank within the stock's sector: ½ slope percentile + ½ multi-year average percentile (stability uses the level only)", "อันดับภายในกลุ่มอุตสาหกรรม: ½ เปอร์เซ็นไทล์ของความชัน + ½ เปอร์เซ็นไทล์ของค่าเฉลี่ยหลายปี (ความเสถียรใช้เฉพาะระดับ)"]
    ],
    en: {
      title: "Quality",
      intro: "How profitable, cash-generative and financially safe the company is, and whether those traits are improving. The mix follows the “quality minus junk” research of Asness, Frazzini and Pedersen (2019): profitable, safe, well-run firms have historically earned better risk-adjusted returns.",
      interp: [
        "Low quality (below 30): thin or negative margins, weak cash flow, heavy debt or erratic earnings compared with sector peers.",
        "High quality (above 70): high and improving profitability, strong cash conversion and a conservative balance sheet.",
        "Warning: quality is ranked within sector, so a 70 for a hardware maker and a 70 for a software firm do not mean the same absolute margins."
      ],
      use: "One of the four business pillars (one-quarter of Overall). Ranked within the stock's sector. Mode both: each sub-metric's percentile is half its trend slope and half its 4-year + TTM average; earnings stability uses the level only. Points = weight × percentile ÷ 100; missing sub-metrics rescale, with at least half the weight required.",
      takeaway: "Quality asks whether the company turns sales into real, durable profit without leaning on debt — and whether that is getting better."
    },
    th: {
      title: "คุณภาพ",
      intro: "วัดว่าบริษัททำกำไรได้ดี สร้างเงินสดได้จริง และมีฐานะการเงินมั่นคงเพียงใด รวมถึงคุณสมบัติเหล่านี้กำลังดีขึ้นหรือไม่ องค์ประกอบอิงงานวิจัย “quality minus junk” ของ Asness, Frazzini และ Pedersen (2019) ซึ่งพบว่าบริษัทที่ทำกำไรดี ปลอดภัย และบริหารดี ให้ผลตอบแทนปรับความเสี่ยงที่ดีกว่าในอดีต",
      interp: [
        "ต่ำ (ต่ำกว่า 30): อัตรากำไรบางหรือติดลบ กระแสเงินสดอ่อน หนี้สูง หรือกำไรผันผวน เมื่อเทียบกับบริษัทในกลุ่มเดียวกัน",
        "สูง (เกิน 70): ความสามารถทำกำไรสูงและดีขึ้น แปลงกำไรเป็นเงินสดได้ดี และงบดุลระมัดระวัง",
        "ข้อควรระวัง: คุณภาพจัดอันดับภายในกลุ่มอุตสาหกรรม คะแนน 70 ของผู้ผลิตฮาร์ดแวร์กับบริษัทซอฟต์แวร์จึงไม่ได้หมายถึงอัตรากำไรเท่ากัน"
      ],
      use: "เป็นหนึ่งในสี่เสาของธุรกิจ (หนึ่งในสี่ของคะแนนรวม) จัดอันดับภายในกลุ่มอุตสาหกรรมของหุ้น ใช้โหมดผสม: เปอร์เซ็นไทล์ของแต่ละตัวชี้วัดมาจากความชันครึ่งหนึ่ง และค่าเฉลี่ย 4 ปีบวก TTM อีกครึ่งหนึ่ง ส่วนความเสถียรของกำไรใช้เฉพาะระดับ คะแนน = น้ำหนัก × เปอร์เซ็นไทล์ ÷ 100 ถ้าขาดข้อมูลบางตัวจะปรับสัดส่วน โดยต้องมีอย่างน้อยครึ่งหนึ่งของน้ำหนักรวม",
      takeaway: "เสาคุณภาพถามว่าบริษัทเปลี่ยนยอดขายเป็นกำไรจริงที่ยั่งยืนได้โดยไม่พึ่งหนี้หรือไม่ และกำลังดีขึ้นหรือเปล่า"
    }
  },

  value: {
    cat: "scores",
    related: ["v_ey", "v_fcfy", "v_eby", "v_sy", "d_fpe", "d_eve"],
    formula: "Valuation = Σ (weight × percentile ÷ 100) over Earnings yield 30, FCF yield 30, EBITDA/EV 25, Sales/EV 15",
    where: [
      ["weight", "Points available to each sub-metric; they add to 100", "คะแนนเต็มของแต่ละตัวชี้วัดย่อย รวมกันได้ 100"],
      ["percentile", "Rank within the stock's sector: ½ slope percentile + ½ multi-year average percentile", "อันดับภายในกลุ่มอุตสาหกรรม: ½ เปอร์เซ็นไทล์ของความชัน + ½ เปอร์เซ็นไทล์ของค่าเฉลี่ยหลายปี"]
    ],
    en: {
      title: "Valuation",
      intro: "How much profit, cash flow and sales you get for each dollar of share price, compared with the stock's sector peers. Every measure is written as a yield (profit ÷ price) rather than a multiple (price ÷ profit), so loss-makers drop naturally to the bottom instead of producing meaningless negative ratios.",
      interp: [
        "Low valuation score (below 30): expensive against sector peers — the market expects a lot of future growth.",
        "High valuation score (above 70): cheap against peers on several measures, and getting cheaper relative to its own results.",
        "Warning: cheap stocks are often cheap for a reason (a “value trap”); read it together with Quality and Growth."
      ],
      use: "Half of the Price score (not part of Overall). Ranked within the stock's sector. Mode both: half the percentile comes from the 4-year + TTM average yield, half from its trend (a rising yield means the price has lagged the fundamentals). Points = weight × percentile ÷ 100; missing sub-metrics rescale, with at least half the weight required.",
      takeaway: "Valuation shows how much business you buy per dollar today, judged against companies that do similar work."
    },
    th: {
      title: "มูลค่า",
      intro: "วัดว่าเงินทุกดอลลาร์ที่จ่ายซื้อหุ้นได้กำไร กระแสเงินสด และยอดขายกลับมาเท่าไร เมื่อเทียบกับหุ้นในกลุ่มเดียวกัน ทุกตัวชี้วัดเขียนเป็นอัตราผลตอบแทน (กำไร ÷ ราคา) แทนตัวคูณ (ราคา ÷ กำไร) บริษัทที่ขาดทุนจึงตกไปอยู่ท้ายตารางเองโดยไม่เกิดอัตราส่วนติดลบที่อ่านไม่ได้",
      interp: [
        "ต่ำ (ต่ำกว่า 30): แพงเมื่อเทียบกับกลุ่มเดียวกัน ตลาดคาดหวังการเติบโตในอนาคตไว้สูง",
        "สูง (เกิน 70): ถูกกว่ากลุ่มเดียวกันในหลายมิติ และถูกลงเมื่อเทียบกับผลประกอบการของตัวเอง",
        "ข้อควรระวัง: หุ้นถูกมักมีเหตุผลที่ถูก (กับดักมูลค่า) ควรดูคู่กับคะแนนคุณภาพและการเติบโต"
      ],
      use: "เป็นครึ่งหนึ่งของคะแนนราคา (ไม่รวมในคะแนนรวม) จัดอันดับภายในกลุ่มอุตสาหกรรม ใช้โหมดผสม: เปอร์เซ็นไทล์ครึ่งหนึ่งมาจากค่าเฉลี่ย 4 ปีบวก TTM อีกครึ่งมาจากแนวโน้ม (อัตราผลตอบแทนที่สูงขึ้นแปลว่าราคาวิ่งตามพื้นฐานไม่ทัน) คะแนน = น้ำหนัก × เปอร์เซ็นไทล์ ÷ 100 ถ้าขาดข้อมูลบางตัวจะปรับสัดส่วน โดยต้องมีอย่างน้อยครึ่งหนึ่งของน้ำหนักรวม",
      takeaway: "เสามูลค่าบอกว่าวันนี้เงินหนึ่งดอลลาร์ซื้อธุรกิจได้มากแค่ไหน เมื่อเทียบกับบริษัทที่ทำธุรกิจคล้ายกัน"
    }
  },

  mom: {
    cat: "scores",
    related: ["m_slope", "m_r2", "i_ema", "i_52w"],
    formula: "Momentum = 60 × slope percentile ÷ 100 + 40 × consistency percentile ÷ 100",
    where: [
      ["slope percentile", "Rank of the annualised 12-1 month price trend among all 55 stocks", "อันดับของแนวโน้มราคา 12-1 เดือน (ปรับเป็นรายปี) เทียบหุ้นทั้ง 55 ตัว"],
      ["consistency percentile", "Rank of the signed R² (how smooth the trend is) among all 55 stocks", "อันดับของค่า R² แบบมีเครื่องหมาย (ความเรียบของแนวโน้ม) เทียบหุ้นทั้ง 55 ตัว"]
    ],
    en: {
      title: "Momentum",
      intro: "How strongly and how steadily the share price has risen over the past year, leaving out the latest month. Momentum — stocks that have gone up tending to keep going up for a while — is one of the most widely replicated findings in finance (Jegadeesh and Titman, 1993).",
      interp: [
        "Low momentum (below 30): the price has been falling or going nowhere over the last year.",
        "High momentum (above 70): a strong, orderly uptrend that the market has been building month after month.",
        "Warning: momentum can reverse sharply, especially after crowded rallies or at market turning points."
      ],
      use: "Half of the Price score (not part of Overall). Ranked across all 55 stocks. Trend slope earns 60 points and trend consistency 40 points.",
      takeaway: "Momentum tells you whether the market is currently agreeing with the story, and how calmly."
    },
    th: {
      title: "โมเมนตัม",
      intro: "วัดว่าราคาหุ้นขึ้นแรงและสม่ำเสมอเพียงใดในรอบหนึ่งปีที่ผ่านมา โดยไม่นับเดือนล่าสุด ปรากฏการณ์โมเมนตัม คือหุ้นที่ขึ้นมาแล้วมักขึ้นต่อไปอีกระยะ เป็นหนึ่งในข้อค้นพบทางการเงินที่ถูกทดสอบซ้ำมากที่สุด (Jegadeesh และ Titman, 1993)",
      interp: [
        "ต่ำ (ต่ำกว่า 30): ราคาลดลงหรือไม่ไปไหนเลยในรอบปี",
        "สูง (เกิน 70): แนวโน้มขาขึ้นที่แข็งแรงและเป็นระเบียบ ตลาดค่อย ๆ สะสมมาเดือนแล้วเดือนเล่า",
        "ข้อควรระวัง: โมเมนตัมกลับตัวได้รุนแรง โดยเฉพาะหลังการขึ้นที่คนแห่เข้าพร้อมกัน หรือช่วงตลาดเปลี่ยนทิศ"
      ],
      use: "เป็นครึ่งหนึ่งของคะแนนราคา (ไม่รวมในคะแนนรวม) จัดอันดับเทียบหุ้นทั้ง 55 ตัว ความชันของแนวโน้มให้ 60 คะแนน และความสม่ำเสมอของแนวโน้มให้ 40 คะแนน",
      takeaway: "โมเมนตัมบอกว่าตอนนี้ตลาดเห็นด้วยกับเรื่องราวของหุ้นหรือไม่ และเห็นด้วยอย่างมั่นคงแค่ไหน"
    }
  },

  /* ───────────────────────────── GROWTH ───────────────────────────── */

  g_rev: {
    cat: "growth",
    related: ["growth", "g_gp", "d_slope", "d_ttm", "d_usd"],
    formula: "Revenue trend = (e^b − 1) × 100, where b is the least-squares slope of ln(Revenue) against time in years",
    where: [
      ["ln(Revenue)", "Natural log of revenue for each of 4 fiscal years plus TTM", "ลอการิทึมธรรมชาติของรายได้ในแต่ละปีจาก 4 ปีบัญชีบวก TTM"],
      ["b", "Slope of the best-fit straight line through those log values", "ความชันของเส้นตรงที่ฟิตได้ดีที่สุดผ่านค่าลอการิทึมเหล่านั้น"],
      ["e^b − 1", "Converts the log slope into a compound growth rate per year", "แปลงความชันของลอการิทึมเป็นอัตราเติบโตทบต้นต่อปี"]
    ],
    en: {
      title: "Revenue trend",
      intro: "The average yearly growth rate of sales, read from a straight line fitted through the log of revenue rather than from the first and last year alone. Chan, Karceski and Lakonishok (2003) found that sales growth is the most persistent of the growth measures, but still noisy year to year — fitting a line uses every year and dampens one-off spikes.",
      interp: [
        "Low (below 5%/yr): sales are barely growing or shrinking; the company is not capturing much new demand.",
        "High (above 25%/yr): sales are compounding fast, typical of firms sitting directly in the AI spending path.",
        "Warning: acquisitions can inflate revenue growth without any organic demand; check the news for large deals."
      ],
      use: "Growth pillar, 35 of 100 points — the largest weight. Ranked across all 55 stocks; slope only, over 4 fiscal years plus TTM.",
      takeaway: "Revenue trend is the purest read on whether customers are buying more from this company year after year."
    },
    th: {
      title: "แนวโน้มรายได้",
      intro: "อัตราเติบโตเฉลี่ยต่อปีของยอดขาย อ่านจากเส้นตรงที่ฟิตผ่านลอการิทึมของรายได้ ไม่ใช่เทียบแค่ปีแรกกับปีสุดท้าย Chan, Karceski และ Lakonishok (2003) พบว่าการเติบโตของยอดขายต่อเนื่องที่สุดในบรรดาตัวชี้วัดการเติบโต แต่ยังผันผวนปีต่อปี การฟิตเส้นใช้ข้อมูลทุกปีและลดผลของปีที่พุ่งผิดปกติ",
      interp: [
        "ต่ำ (ต่ำกว่า 5% ต่อปี): ยอดขายแทบไม่โตหรือหดตัว บริษัทยังจับความต้องการใหม่ได้ไม่มาก",
        "สูง (เกิน 25% ต่อปี): ยอดขายเติบโตทบต้นเร็ว ซึ่งพบบ่อยในบริษัทที่อยู่บนเส้นทางการใช้จ่ายด้าน AI โดยตรง",
        "ข้อควรระวัง: การควบรวมกิจการทำให้รายได้โตได้โดยไม่มีความต้องการที่แท้จริง ควรเช็กข่าวการซื้อกิจการขนาดใหญ่"
      ],
      use: "เสาการเติบโต 35 จาก 100 คะแนน ซึ่งเป็นน้ำหนักมากที่สุด จัดอันดับเทียบหุ้นทั้ง 55 ตัว ใช้เฉพาะความชันจาก 4 ปีบัญชีบวก TTM",
      takeaway: "แนวโน้มรายได้เป็นตัวชี้วัดที่ตรงที่สุดว่าลูกค้าซื้อจากบริษัทนี้มากขึ้นทุกปีหรือไม่"
    }
  },

  g_gp: {
    cat: "growth",
    related: ["growth", "g_rev", "q_gpa", "d_slope"],
    formula: "Gross-profit trend = (e^b − 1) × 100, where b is the least-squares slope of ln(Gross profit) against time in years",
    where: [
      ["Gross profit", "Revenue − Cost of goods sold", "รายได้ − ต้นทุนขาย"],
      ["b", "Slope of the best-fit line through ln(Gross profit) over 4 fiscal years plus TTM", "ความชันของเส้นที่ฟิตผ่าน ln(กำไรขั้นต้น) จาก 4 ปีบัญชีบวก TTM"],
      ["e^b − 1", "Converts the log slope into a compound growth rate per year", "แปลงความชันของลอการิทึมเป็นอัตราเติบโตทบต้นต่อปี"]
    ],
    en: {
      title: "Gross-profit trend",
      intro: "The yearly growth rate of gross profit — what is left after paying for the products sold. Novy-Marx (2013) argued gross profit is the cleanest measure of a firm's economic profitability because it sits above accounting choices further down the income statement.",
      interp: [
        "Low (below revenue growth): margins are being squeezed — the company is selling more but keeping less of each sale.",
        "High (at or above revenue growth): pricing power or a richer product mix; growth is profitable, not bought.",
        "Warning: a sudden jump can come from a one-off price spike in a cyclical product such as memory chips."
      ],
      use: "Growth pillar, 25 of 100 points. Ranked across all 55 stocks; slope only, over 4 fiscal years plus TTM.",
      takeaway: "Gross-profit trend checks that sales growth is translating into more money to fund the rest of the business."
    },
    th: {
      title: "แนวโน้มกำไรขั้นต้น",
      intro: "อัตราเติบโตต่อปีของกำไรขั้นต้น คือส่วนที่เหลือหลังหักต้นทุนของสินค้าที่ขาย Novy-Marx (2013) เสนอว่ากำไรขั้นต้นเป็นตัววัดความสามารถทำกำไรเชิงเศรษฐกิจที่สะอาดที่สุด เพราะอยู่เหนือการเลือกวิธีทางบัญชีที่อยู่ลึกลงไปในงบกำไรขาดทุน",
      interp: [
        "ต่ำ (โตช้ากว่ารายได้): อัตรากำไรถูกบีบ บริษัทขายได้มากขึ้นแต่เก็บกำไรต่อหน่วยได้น้อยลง",
        "สูง (โตเท่าหรือเร็วกว่ารายได้): มีอำนาจตั้งราคา หรือสัดส่วนสินค้ามาร์จินสูงเพิ่มขึ้น การเติบโตจึงมีกำไรจริง",
        "ข้อควรระวัง: การพุ่งขึ้นฉับพลันอาจมาจากราคาสินค้าวัฏจักร เช่น ชิปหน่วยความจำ ที่ขึ้นชั่วคราว"
      ],
      use: "เสาการเติบโต 25 จาก 100 คะแนน จัดอันดับเทียบหุ้นทั้ง 55 ตัว ใช้เฉพาะความชันจาก 4 ปีบัญชีบวก TTM",
      takeaway: "แนวโน้มกำไรขั้นต้นตรวจว่าการโตของยอดขายกลายเป็นเงินที่ใช้หล่อเลี้ยงธุรกิจได้มากขึ้นจริง"
    }
  },

  g_oi: {
    cat: "growth",
    related: ["growth", "q_om", "g_fcf", "d_slope"],
    formula: "Operating-income trend = Slope of Operating income (USD per year) ÷ Average revenue × 100",
    where: [
      ["Slope", "Least-squares slope of operating income over 4 fiscal years plus TTM", "ความชันกำลังสองน้อยที่สุดของกำไรจากการดำเนินงานจาก 4 ปีบัญชีบวก TTM"],
      ["Average revenue", "Mean revenue over the same years, used to scale the slope", "รายได้เฉลี่ยในช่วงปีเดียวกัน ใช้ปรับขนาดความชัน"],
      ["Result", "Percentage points of revenue added per year", "จำนวนจุดเปอร์เซ็นต์ของรายได้ที่เพิ่มขึ้นต่อปี"]
    ],
    en: {
      title: "Operating-income trend",
      intro: "How fast operating profit is growing, expressed as extra profit per year as a share of the company's revenue. A percentage growth rate would explode or flip sign when profit starts near zero or below it, so scaling by revenue keeps loss-makers and turnarounds comparable.",
      interp: [
        "Low (negative): operating profit is shrinking — costs are rising faster than gross profit.",
        "High (above +3 pp per year): profit is climbing quickly relative to the size of the business; operating leverage is kicking in.",
        "Warning: restructuring charges or one-off gains can bend a 5-point trend; look at the yearly figures behind it."
      ],
      use: "Growth pillar, 20 of 100 points. Ranked across all 55 stocks; slope only, over 4 fiscal years plus TTM.",
      takeaway: "Operating-income trend shows whether the company is getting more profitable as it grows, not just bigger."
    },
    th: {
      title: "แนวโน้มกำไรจากการดำเนินงาน",
      intro: "วัดว่ากำไรจากการดำเนินงานเพิ่มขึ้นเร็วแค่ไหน โดยแสดงเป็นกำไรที่เพิ่มขึ้นต่อปีเทียบกับขนาดรายได้ของบริษัท ถ้าใช้อัตราเติบโตเป็นเปอร์เซ็นต์ ตัวเลขจะพุ่งสูงผิดปกติหรือกลับเครื่องหมายเมื่อกำไรเริ่มจากใกล้ศูนย์หรือติดลบ การหารด้วยรายได้จึงทำให้เปรียบเทียบบริษัทที่ขาดทุนหรือกำลังฟื้นตัวได้",
      interp: [
        "ต่ำ (ติดลบ): กำไรจากการดำเนินงานลดลง ต้นทุนโตเร็วกว่ากำไรขั้นต้น",
        "สูง (เกิน +3 จุดเปอร์เซ็นต์ต่อปี): กำไรไต่ขึ้นเร็วเมื่อเทียบกับขนาดธุรกิจ เริ่มเห็นผลของ operating leverage",
        "ข้อควรระวัง: ค่าใช้จ่ายปรับโครงสร้างหรือกำไรพิเศษครั้งเดียวทำให้แนวโน้มจาก 5 จุดข้อมูลบิดเบือนได้ ควรดูตัวเลขรายปีประกอบ"
      ],
      use: "เสาการเติบโต 20 จาก 100 คะแนน จัดอันดับเทียบหุ้นทั้ง 55 ตัว ใช้เฉพาะความชันจาก 4 ปีบัญชีบวก TTM",
      takeaway: "แนวโน้มกำไรจากการดำเนินงานบอกว่าบริษัททำกำไรได้ดีขึ้นขณะเติบโต ไม่ใช่แค่ตัวใหญ่ขึ้น"
    }
  },

  g_fcf: {
    cat: "growth",
    related: ["growth", "q_fcfm", "v_fcfy", "d_slope"],
    formula: "FCF trend = Slope of Free cash flow (USD per year) ÷ Average revenue × 100",
    where: [
      ["Free cash flow", "Operating cash flow − Capital expenditure", "กระแสเงินสดจากการดำเนินงาน − รายจ่ายลงทุน"],
      ["Slope", "Least-squares slope of FCF over 4 fiscal years plus TTM", "ความชันกำลังสองน้อยที่สุดของ FCF จาก 4 ปีบัญชีบวก TTM"],
      ["Average revenue", "Mean revenue over the same years; the result is in percentage points of revenue per year", "รายได้เฉลี่ยในช่วงปีเดียวกัน ผลลัพธ์มีหน่วยเป็นจุดเปอร์เซ็นต์ของรายได้ต่อปี"]
    ],
    en: {
      title: "Free-cash-flow trend",
      intro: "How fast the cash left over after investment is growing, scaled by revenue so negative or near-zero FCF still compares fairly. Sloan (1996) showed that profits backed by cash are more persistent than profits built on accruals, so cash growth is a useful cross-check on earnings growth.",
      interp: [
        "Low (negative): the business is producing less spare cash each year — often heavy capex or working-capital build-up.",
        "High (above +3 pp per year): cash generation is rising quickly, giving room for buybacks, dividends or reinvestment.",
        "Warning: in an AI build-out, falling FCF can reflect deliberate investment in capacity; judge it together with revenue growth."
      ],
      use: "Growth pillar, 20 of 100 points. Ranked across all 55 stocks; slope only, over 4 fiscal years plus TTM.",
      takeaway: "FCF trend confirms whether rising profits are arriving as real cash."
    },
    th: {
      title: "แนวโน้มกระแสเงินสดอิสระ",
      intro: "วัดว่าเงินสดที่เหลือหลังการลงทุนเติบโตเร็วแค่ไหน โดยหารด้วยรายได้เพื่อให้ FCF ที่ติดลบหรือใกล้ศูนย์ยังเปรียบเทียบได้อย่างเป็นธรรม Sloan (1996) แสดงว่ากำไรที่มีเงินสดหนุนหลังต่อเนื่องกว่ากำไรที่มาจากรายการค้างรับค้างจ่าย การเติบโตของเงินสดจึงเป็นตัวตรวจสอบการเติบโตของกำไรได้ดี",
      interp: [
        "ต่ำ (ติดลบ): ธุรกิจสร้างเงินสดส่วนเกินได้น้อยลงทุกปี มักมาจากรายจ่ายลงทุนสูงหรือเงินทุนหมุนเวียนพอกพูน",
        "สูง (เกิน +3 จุดเปอร์เซ็นต์ต่อปี): การสร้างเงินสดเพิ่มเร็ว เปิดทางให้ซื้อหุ้นคืน จ่ายปันผล หรือลงทุนต่อ",
        "ข้อควรระวัง: ในช่วงสร้างโครงสร้างพื้นฐาน AI การที่ FCF ลดลงอาจมาจากการตั้งใจลงทุนขยายกำลังการผลิต ควรพิจารณาคู่กับการเติบโตของรายได้"
      ],
      use: "เสาการเติบโต 20 จาก 100 คะแนน จัดอันดับเทียบหุ้นทั้ง 55 ตัว ใช้เฉพาะความชันจาก 4 ปีบัญชีบวก TTM",
      takeaway: "แนวโน้ม FCF ยืนยันว่ากำไรที่เพิ่มขึ้นเข้ามาเป็นเงินสดจริงหรือไม่"
    }
  },

  /* ───────────────────────────── QUALITY ───────────────────────────── */

  q_gpa: {
    cat: "quality",
    related: ["quality", "g_gp", "q_roa", "q_om"],
    formula: "GP/A = Gross profit ÷ Total assets × 100",
    where: [
      ["Gross profit", "Revenue − Cost of goods sold", "รายได้ − ต้นทุนขาย"],
      ["Total assets", "Everything the company owns, from the balance sheet", "สินทรัพย์ทั้งหมดของบริษัทจากงบดุล"]
    ],
    en: {
      title: "Gross profitability (GP/A)",
      intro: "How much gross profit the company earns on each dollar of assets it uses. Novy-Marx (2013) found this simple ratio predicts stock returns about as well as classic value measures, and that profitable and cheap stocks complement each other.",
      interp: [
        "Low (below 15%): the asset base produces little gross profit — capital-heavy or low-margin operations.",
        "High (above 40%): a lean business that earns a lot from what it owns, typical of software and design-led chip firms.",
        "Warning: large recent acquisitions add goodwill to assets and can pull the ratio down temporarily."
      ],
      use: "Quality pillar, 20 of 100 points — the largest quality weight. Ranked within sector; mode both (½ trend slope, ½ multi-year average).",
      takeaway: "GP/A shows how productive the company's assets are before overheads and accounting choices."
    },
    th: {
      title: "ความสามารถทำกำไรขั้นต้นต่อสินทรัพย์ (GP/A)",
      intro: "วัดว่าสินทรัพย์ทุกดอลลาร์ที่บริษัทใช้สร้างกำไรขั้นต้นได้เท่าไร Novy-Marx (2013) พบว่าอัตราส่วนง่าย ๆ นี้ทำนายผลตอบแทนหุ้นได้ใกล้เคียงกับตัวชี้วัดมูลค่าแบบดั้งเดิม และหุ้นที่ทำกำไรดีกับหุ้นถูกมักเสริมกัน",
      interp: [
        "ต่ำ (ต่ำกว่า 15%): สินทรัพย์สร้างกำไรขั้นต้นได้น้อย มักเป็นธุรกิจใช้ทุนสูงหรือมาร์จินต่ำ",
        "สูง (เกิน 40%): ธุรกิจคล่องตัวที่ทำเงินได้มากจากสิ่งที่มี พบบ่อยในบริษัทซอฟต์แวร์และบริษัทออกแบบชิป",
        "ข้อควรระวัง: การซื้อกิจการขนาดใหญ่เพิ่มค่าความนิยมในสินทรัพย์ อาจทำให้อัตราส่วนลดลงชั่วคราว"
      ],
      use: "เสาคุณภาพ 20 จาก 100 คะแนน ซึ่งเป็นน้ำหนักมากที่สุดในเสานี้ จัดอันดับภายในกลุ่มอุตสาหกรรม โหมดผสม (ความชันครึ่งหนึ่ง ค่าเฉลี่ยหลายปีครึ่งหนึ่ง)",
      takeaway: "GP/A แสดงว่าสินทรัพย์ของบริษัทมีผลิตภาพแค่ไหน ก่อนหักค่าใช้จ่ายส่วนกลางและผลจากการเลือกวิธีทางบัญชี"
    }
  },

  q_om: {
    cat: "quality",
    related: ["quality", "g_oi", "q_stab", "q_fcfm"],
    formula: "Operating margin = Operating income ÷ Revenue × 100",
    where: [
      ["Operating income", "Gross profit − Operating expenses (R&D, sales, admin)", "กำไรขั้นต้น − ค่าใช้จ่ายในการดำเนินงาน (วิจัยและพัฒนา การขาย การบริหาร)"],
      ["Revenue", "Total sales for the period", "ยอดขายรวมของงวด"]
    ],
    en: {
      title: "Operating margin",
      intro: "The share of each sales dollar left as profit after running the business, before interest and tax. Fama and French added operating profitability as a core factor (RMW, “robust minus weak”) in their 2015 five-factor model after finding that more profitable firms earn higher returns.",
      interp: [
        "Low (below 5%): little room for error; a small cost increase or price cut can push the company into losses.",
        "High (above 30%): strong pricing power or a scalable cost base.",
        "Warning: margins are naturally different across sectors, which is why this page ranks them only against sector peers."
      ],
      use: "Quality pillar, 15 of 100 points. Ranked within sector; mode both (½ trend slope, ½ multi-year average).",
      takeaway: "Operating margin shows how much of each sale the core business actually keeps."
    },
    th: {
      title: "อัตรากำไรจากการดำเนินงาน",
      intro: "สัดส่วนของยอดขายแต่ละดอลลาร์ที่เหลือเป็นกำไรหลังหักค่าใช้จ่ายในการดำเนินธุรกิจ ก่อนดอกเบี้ยและภาษี Fama และ French เพิ่มความสามารถทำกำไรจากการดำเนินงานเป็นปัจจัยหลัก (RMW: robust minus weak) ในแบบจำลองห้าปัจจัยปี 2015 หลังพบว่าบริษัทที่ทำกำไรดีกว่าให้ผลตอบแทนสูงกว่า",
      interp: [
        "ต่ำ (ต่ำกว่า 5%): แทบไม่มีพื้นที่ให้ผิดพลาด ต้นทุนเพิ่มหรือลดราคานิดเดียวก็อาจขาดทุน",
        "สูง (เกิน 30%): มีอำนาจตั้งราคาสูง หรือโครงสร้างต้นทุนขยายตามขนาดได้ดี",
        "ข้อควรระวัง: อัตรากำไรแต่ละอุตสาหกรรมต่างกันโดยธรรมชาติ หน้านี้จึงจัดอันดับเทียบเฉพาะบริษัทในกลุ่มเดียวกัน"
      ],
      use: "เสาคุณภาพ 15 จาก 100 คะแนน จัดอันดับภายในกลุ่มอุตสาหกรรม โหมดผสม (ความชันครึ่งหนึ่ง ค่าเฉลี่ยหลายปีครึ่งหนึ่ง)",
      takeaway: "อัตรากำไรจากการดำเนินงานบอกว่าธุรกิจหลักเก็บเงินจากยอดขายแต่ละครั้งไว้ได้จริงเท่าไร"
    }
  },

  q_fcfm: {
    cat: "quality",
    related: ["quality", "g_fcf", "v_fcfy", "q_om"],
    formula: "FCF margin = Free cash flow ÷ Revenue × 100",
    where: [
      ["Free cash flow", "Operating cash flow − Capital expenditure", "กระแสเงินสดจากการดำเนินงาน − รายจ่ายลงทุน"],
      ["Revenue", "Total sales for the period", "ยอดขายรวมของงวด"]
    ],
    en: {
      title: "Free-cash-flow margin",
      intro: "The share of sales that ends up as spare cash after the company has paid its costs and funded its investments. It complements operating margin because cash is harder to shape with accounting estimates than reported profit.",
      interp: [
        "Low (below 0%): the business consumes cash and may need debt or new shares to keep investing.",
        "High (above 20%): a cash machine that can fund growth, buybacks and dividends on its own.",
        "Warning: FCF margin can look excellent while capex is being postponed; a sudden catch-up in spending will reverse it."
      ],
      use: "Quality pillar, 15 of 100 points. Ranked within sector; mode both (½ trend slope, ½ multi-year average).",
      takeaway: "FCF margin measures how much of each sale becomes cash the owners could actually take out."
    },
    th: {
      title: "อัตรากระแสเงินสดอิสระต่อยอดขาย",
      intro: "สัดส่วนของยอดขายที่กลายเป็นเงินสดส่วนเกินหลังบริษัทจ่ายค่าใช้จ่ายและลงทุนแล้ว ใช้เสริมอัตรากำไรจากการดำเนินงาน เพราะเงินสดปรับแต่งด้วยการประมาณการทางบัญชีได้ยากกว่ากำไรที่รายงาน",
      interp: [
        "ต่ำ (ต่ำกว่า 0%): ธุรกิจใช้เงินสดมากกว่าที่หาได้ อาจต้องกู้หรือออกหุ้นใหม่เพื่อลงทุนต่อ",
        "สูง (เกิน 20%): เครื่องผลิตเงินสดที่ใช้เงินตัวเองขยายกิจการ ซื้อหุ้นคืน และจ่ายปันผลได้",
        "ข้อควรระวัง: อัตรา FCF อาจดูดีมากในช่วงที่เลื่อนการลงทุนออกไป เมื่อกลับมาลงทุนชดเชย ตัวเลขจะกลับทิศ"
      ],
      use: "เสาคุณภาพ 15 จาก 100 คะแนน จัดอันดับภายในกลุ่มอุตสาหกรรม โหมดผสม (ความชันครึ่งหนึ่ง ค่าเฉลี่ยหลายปีครึ่งหนึ่ง)",
      takeaway: "อัตรา FCF วัดว่ายอดขายแต่ละครั้งกลายเป็นเงินสดที่เจ้าของดึงออกมาใช้ได้จริงเท่าไร"
    }
  },

  q_roa: {
    cat: "quality",
    related: ["quality", "q_gpa", "d_roe", "v_ey"],
    formula: "ROA = Net income ÷ Total assets × 100",
    where: [
      ["Net income", "Profit after all expenses, interest and tax", "กำไรสุทธิหลังหักค่าใช้จ่าย ดอกเบี้ย และภาษีทั้งหมด"],
      ["Total assets", "Everything the company owns, from the balance sheet", "สินทรัพย์ทั้งหมดของบริษัทจากงบดุล"]
    ],
    en: {
      title: "Return on assets (ROA)",
      intro: "The bottom-line profit the company makes on everything it owns. Piotroski (2000) used positive and rising ROA as the first signals in his F-score, which separated strong from weak companies among cheap stocks.",
      interp: [
        "Low (below 3%): assets earn little after all costs; returns may be below the company's cost of capital.",
        "High (above 15%): an efficient, profitable use of the asset base.",
        "Warning: one-off gains or write-downs hit net income directly and can swing ROA for a single year."
      ],
      use: "Quality pillar, 10 of 100 points. Ranked within sector; mode both (½ trend slope, ½ multi-year average). Preferred over ROE because it is not inflated by debt.",
      takeaway: "ROA shows final profit per dollar of assets, a measure that debt cannot flatter."
    },
    th: {
      title: "อัตราผลตอบแทนต่อสินทรัพย์ (ROA)",
      intro: "กำไรสุทธิที่บริษัททำได้จากสินทรัพย์ทั้งหมดที่มี Piotroski (2000) ใช้ ROA ที่เป็นบวกและเพิ่มขึ้นเป็นสัญญาณแรกใน F-score ซึ่งช่วยแยกบริษัทแข็งแรงออกจากบริษัทอ่อนแอในกลุ่มหุ้นราคาถูก",
      interp: [
        "ต่ำ (ต่ำกว่า 3%): สินทรัพย์ทำกำไรได้น้อยหลังหักทุกอย่าง ผลตอบแทนอาจต่ำกว่าต้นทุนเงินทุน",
        "สูง (เกิน 15%): ใช้สินทรัพย์ได้อย่างมีประสิทธิภาพและทำกำไรดี",
        "ข้อควรระวัง: กำไรพิเศษหรือการตัดจำหน่ายครั้งเดียวกระทบกำไรสุทธิโดยตรง ทำให้ ROA แกว่งในบางปี"
      ],
      use: "เสาคุณภาพ 10 จาก 100 คะแนน จัดอันดับภายในกลุ่มอุตสาหกรรม โหมดผสม (ความชันครึ่งหนึ่ง ค่าเฉลี่ยหลายปีครึ่งหนึ่ง) เลือกใช้แทน ROE เพราะไม่ถูกหนี้ทำให้ดูสูงเกินจริง",
      takeaway: "ROA แสดงกำไรสุดท้ายต่อสินทรัพย์หนึ่งดอลลาร์ เป็นตัวชี้วัดที่หนี้ไม่สามารถแต่งให้ดูดีได้"
    }
  },

  q_de: {
    cat: "quality",
    related: ["quality", "q_netcash", "d_roe"],
    formula: "D/E = Total debt ÷ Shareholders' equity",
    where: [
      ["Total debt", "Short-term plus long-term borrowings", "เงินกู้ระยะสั้นรวมระยะยาว"],
      ["Shareholders' equity", "Assets − Liabilities; the owners' book stake", "สินทรัพย์ − หนี้สิน คือส่วนของเจ้าของตามบัญชี"]
    ],
    en: {
      title: "Debt to equity (D/E)",
      intro: "How much the company borrows compared with the money owners have in the business. Low leverage is one of the “safety” traits in the quality-minus-junk research of Asness, Frazzini and Pedersen (2019): safer balance sheets have historically been under-priced.",
      interp: [
        "Low (below 0.3): little borrowing; the company can ride out a downturn without lenders dictating terms.",
        "High (above 1.5): heavy reliance on debt; rising rates or a weak year can quickly become a problem.",
        "Warning: negative equity (often from large buybacks) makes the ratio meaningless — treat it as a flag to read the balance sheet, not as a low number."
      ],
      use: "Quality pillar, 15 of 100 points. Lower is better. Ranked within sector; mode both (½ trend slope, where a falling ratio scores well, ½ multi-year average).",
      takeaway: "D/E tells you how much of the business is funded by lenders rather than owners, and so how fragile it is in bad times."
    },
    th: {
      title: "หนี้สินต่อส่วนของผู้ถือหุ้น (D/E)",
      intro: "วัดว่าบริษัทกู้ยืมมากเพียงใดเมื่อเทียบกับเงินที่เจ้าของลงไว้ในธุรกิจ หนี้ต่ำเป็นหนึ่งในคุณสมบัติด้าน “ความปลอดภัย” ในงานวิจัย quality minus junk ของ Asness, Frazzini และ Pedersen (2019) ซึ่งพบว่าบริษัทที่งบดุลปลอดภัยมักถูกตลาดประเมินราคาต่ำเกินไป",
      interp: [
        "ต่ำ (ต่ำกว่า 0.3): กู้น้อย ผ่านช่วงเศรษฐกิจชะลอได้โดยไม่ต้องให้เจ้าหนี้กำหนดเงื่อนไข",
        "สูง (เกิน 1.5): พึ่งพาหนี้มาก ดอกเบี้ยขาขึ้นหรือปีที่ผลประกอบการแย่อาจกลายเป็นปัญหาได้เร็ว",
        "ข้อควรระวัง: ส่วนของผู้ถือหุ้นติดลบ (มักมาจากการซื้อหุ้นคืนจำนวนมาก) ทำให้อัตราส่วนไม่มีความหมาย ควรถือเป็นสัญญาณให้อ่านงบดุล ไม่ใช่ตัวเลขที่ต่ำ"
      ],
      use: "เสาคุณภาพ 15 จาก 100 คะแนน ยิ่งต่ำยิ่งดี จัดอันดับภายในกลุ่มอุตสาหกรรม โหมดผสม (ความชันครึ่งหนึ่ง โดยอัตราส่วนที่ลดลงได้คะแนนดี และค่าเฉลี่ยหลายปีอีกครึ่งหนึ่ง)",
      takeaway: "D/E บอกว่าธุรกิจใช้เงินเจ้าหนี้มากกว่าเงินเจ้าของแค่ไหน และจึงเปราะบางเพียงใดในยามวิกฤต"
    }
  },

  q_netcash: {
    cat: "quality",
    related: ["quality", "q_de", "v_eby", "d_usd"],
    formula: "Net cash ratio = (Cash − Total debt) ÷ Market cap × 100",
    where: [
      ["Cash", "Cash, equivalents and short-term investments", "เงินสด รายการเทียบเท่าเงินสด และเงินลงทุนระยะสั้น"],
      ["Total debt", "Short-term plus long-term borrowings", "เงินกู้ระยะสั้นรวมระยะยาว"],
      ["Market cap", "Share price × shares outstanding", "ราคาหุ้น × จำนวนหุ้นที่ออกจำหน่าย"]
    ],
    en: {
      title: "Net cash to market cap",
      intro: "How much spare cash (or net debt, if negative) the company holds compared with its stock-market value. A big net-cash cushion means the company can keep investing through a downturn and part of the share price is backed by money in the bank.",
      interp: [
        "Low (below −20%): net debt is large relative to the company's value; equity holders stand behind lenders.",
        "High (above +10%): a meaningful cash pile — flexibility for R&D, acquisitions or buybacks.",
        "Warning: cash may sit overseas or be earmarked for committed capex, so not all of it is truly free."
      ],
      use: "Quality pillar, 10 of 100 points. Higher is better. Ranked within sector; mode both (½ trend slope, ½ multi-year average).",
      takeaway: "Net cash shows how much financial cushion stands behind each dollar of market value."
    },
    th: {
      title: "เงินสดสุทธิต่อมูลค่าตลาด",
      intro: "วัดว่าบริษัทมีเงินสดส่วนเกิน (หรือหนี้สุทธิ ถ้าติดลบ) มากเพียงใดเทียบกับมูลค่าในตลาดหุ้น เงินสดสุทธิก้อนใหญ่หมายความว่าบริษัทลงทุนต่อได้แม้ในช่วงเศรษฐกิจถดถอย และราคาหุ้นบางส่วนมีเงินในธนาคารหนุนหลังอยู่",
      interp: [
        "ต่ำ (ต่ำกว่า −20%): หนี้สุทธิสูงเมื่อเทียบกับมูลค่าบริษัท ผู้ถือหุ้นต้องรอหลังเจ้าหนี้",
        "สูง (เกิน +10%): มีเงินสดสะสมพอสมควร คล่องตัวในการวิจัยพัฒนา ซื้อกิจการ หรือซื้อหุ้นคืน",
        "ข้อควรระวัง: เงินสดอาจอยู่ต่างประเทศหรือถูกกันไว้สำหรับรายจ่ายลงทุนที่ผูกพันแล้ว จึงไม่ได้ว่างทั้งหมด"
      ],
      use: "เสาคุณภาพ 10 จาก 100 คะแนน ยิ่งสูงยิ่งดี จัดอันดับภายในกลุ่มอุตสาหกรรม โหมดผสม (ความชันครึ่งหนึ่ง ค่าเฉลี่ยหลายปีครึ่งหนึ่ง)",
      takeaway: "เงินสดสุทธิแสดงว่ามูลค่าตลาดแต่ละดอลลาร์มีเบาะรองรับทางการเงินมากแค่ไหน"
    }
  },

  q_stab: {
    cat: "quality",
    related: ["quality", "q_om", "g_oi"],
    formula: "Earnings stability = Standard deviation of Operating margin across 4 fiscal years plus TTM",
    where: [
      ["Operating margin", "Operating income ÷ Revenue × 100, for each year", "กำไรจากการดำเนินงาน ÷ รายได้ × 100 ของแต่ละปี"],
      ["Standard deviation", "How far the yearly margins spread around their average, in percentage points", "การกระจายของอัตรากำไรรายปีรอบค่าเฉลี่ย หน่วยเป็นจุดเปอร์เซ็นต์"]
    ],
    en: {
      title: "Earnings stability",
      intro: "How much the operating margin has jumped around over the years. Low earnings volatility is part of the “safety” leg of quality-minus-junk (Asness, Frazzini and Pedersen, 2019): steady profits are easier to forecast and less likely to disappoint.",
      interp: [
        "Low spread (below 3 pp): margins are steady — a predictable business.",
        "High spread (above 10 pp): margins swing widely, as in cyclical chips or project-based businesses.",
        "Warning: a margin that rises steadily also has a spread; check the operating-income trend to tell improvement from instability."
      ],
      use: "Quality pillar, 15 of 100 points. Lower is better. Ranked within sector on the level only (no slope).",
      takeaway: "Stability rewards companies whose profitability you could have predicted last year."
    },
    th: {
      title: "ความเสถียรของกำไร",
      intro: "วัดว่าอัตรากำไรจากการดำเนินงานแกว่งขึ้นลงมากเพียงใดในช่วงหลายปี ความผันผวนของกำไรต่ำเป็นส่วนหนึ่งของด้าน “ความปลอดภัย” ใน quality minus junk (Asness, Frazzini และ Pedersen, 2019) กำไรที่สม่ำเสมอพยากรณ์ง่ายกว่าและมีโอกาสทำให้ผิดหวังน้อยกว่า",
      interp: [
        "ต่ำ (ต่ำกว่า 3 จุดเปอร์เซ็นต์): อัตรากำไรนิ่ง ธุรกิจคาดการณ์ได้",
        "สูง (เกิน 10 จุดเปอร์เซ็นต์): อัตรากำไรแกว่งแรง เช่น ธุรกิจชิปที่เป็นวัฏจักร หรือธุรกิจที่รายได้มาเป็นโครงการ",
        "ข้อควรระวัง: อัตรากำไรที่เพิ่มขึ้นอย่างสม่ำเสมอก็มีการกระจายเช่นกัน ควรดูแนวโน้มกำไรจากการดำเนินงานเพื่อแยกการพัฒนาออกจากความไม่เสถียร"
      ],
      use: "เสาคุณภาพ 15 จาก 100 คะแนน ยิ่งต่ำยิ่งดี จัดอันดับภายในกลุ่มอุตสาหกรรมโดยใช้เฉพาะระดับ (ไม่ใช้ความชัน)",
      takeaway: "ความเสถียรให้รางวัลบริษัทที่ความสามารถทำกำไรคาดเดาได้ตั้งแต่ปีก่อน"
    }
  },

  /* ───────────────────────────── VALUATION ───────────────────────────── */

  v_ey: {
    cat: "value",
    related: ["value", "v_fcfy", "d_fpe", "q_roa"],
    formula: "Earnings yield = Net income ÷ Market cap × 100",
    where: [
      ["Net income", "Profit after all expenses, interest and tax (TTM or fiscal year)", "กำไรสุทธิหลังหักค่าใช้จ่าย ดอกเบี้ย และภาษีทั้งหมด (TTM หรือปีบัญชี)"],
      ["Market cap", "Share price × shares outstanding", "ราคาหุ้น × จำนวนหุ้นที่ออกจำหน่าย"]
    ],
    en: {
      title: "Earnings yield",
      intro: "The company's annual profit as a percentage of what the whole company costs on the stock market — the inverse of the P/E ratio. Basu (1977) showed that stocks with low P/E (high earnings yield) earned better returns than their risk alone would suggest.",
      interp: [
        "Low (below 2%): you pay more than 50× earnings; the price assumes strong future growth.",
        "High (above 6%): you pay under about 17× earnings — cheap unless profits are about to fall.",
        "Warning: losses give a negative yield and rank last; a cyclical peak in profit can make a stock look cheaper than it is."
      ],
      use: "Valuation pillar, 30 of 100 points. Ranked within sector; mode both (½ multi-year average, ½ trend slope). Written as a yield so loss-makers rank last.",
      takeaway: "Earnings yield is the profit return you would get if the company paid out everything it earned."
    },
    th: {
      title: "อัตราผลตอบแทนจากกำไร (Earnings yield)",
      intro: "กำไรรายปีของบริษัทคิดเป็นเปอร์เซ็นต์ของมูลค่าทั้งบริษัทในตลาดหุ้น เป็นส่วนกลับของ P/E Basu (1977) แสดงว่าหุ้น P/E ต่ำ (Earnings yield สูง) ให้ผลตอบแทนดีกว่าที่ระดับความเสี่ยงอธิบายได้",
      interp: [
        "ต่ำ (ต่ำกว่า 2%): จ่ายแพงกว่า 50 เท่าของกำไร ราคาคาดหวังการเติบโตไว้สูง",
        "สูง (เกิน 6%): จ่ายต่ำกว่าราว 17 เท่าของกำไร ถือว่าถูก เว้นแต่กำไรกำลังจะลดลง",
        "ข้อควรระวัง: บริษัทที่ขาดทุนได้ค่าติดลบและอยู่อันดับท้าย ส่วนกำไรที่อยู่จุดสูงสุดของวัฏจักรอาจทำให้หุ้นดูถูกกว่าความจริง"
      ],
      use: "เสามูลค่า 30 จาก 100 คะแนน จัดอันดับภายในกลุ่มอุตสาหกรรม โหมดผสม (ค่าเฉลี่ยหลายปีครึ่งหนึ่ง ความชันครึ่งหนึ่ง) เขียนเป็นอัตราผลตอบแทนเพื่อให้บริษัทขาดทุนอยู่ท้ายตาราง",
      takeaway: "Earnings yield คือผลตอบแทนจากกำไรที่คุณจะได้ ถ้าบริษัทจ่ายกำไรทั้งหมดออกมา"
    }
  },

  v_fcfy: {
    cat: "value",
    related: ["value", "v_ey", "q_fcfm", "g_fcf"],
    formula: "FCF yield = Free cash flow ÷ Market cap × 100",
    where: [
      ["Free cash flow", "Operating cash flow − Capital expenditure", "กระแสเงินสดจากการดำเนินงาน − รายจ่ายลงทุน"],
      ["Market cap", "Share price × shares outstanding", "ราคาหุ้น × จำนวนหุ้นที่ออกจำหน่าย"]
    ],
    en: {
      title: "Free-cash-flow yield",
      intro: "The spare cash the company generates in a year as a percentage of its market value. It is the cash-based twin of earnings yield and is harder to inflate with accounting choices, which makes it a favourite of long-term value investors.",
      interp: [
        "Low (below 1%): very little cash return for the price, or heavy investment absorbing the cash.",
        "High (above 5%): strong cash return — the company could fund buybacks or dividends at that rate.",
        "Warning: a heavy capex cycle can push FCF yield negative even for an excellent business; compare with EBITDA/EV."
      ],
      use: "Valuation pillar, 30 of 100 points. Ranked within sector; mode both (½ multi-year average, ½ trend slope). Negative FCF ranks last.",
      takeaway: "FCF yield is the cash return the business produces for each dollar of share price."
    },
    th: {
      title: "อัตราผลตอบแทนจากกระแสเงินสดอิสระ (FCF yield)",
      intro: "เงินสดส่วนเกินที่บริษัทสร้างได้ในหนึ่งปี คิดเป็นเปอร์เซ็นต์ของมูลค่าตลาด เป็นฝาแฝดฝั่งเงินสดของ Earnings yield และแต่งตัวเลขด้วยวิธีทางบัญชีได้ยากกว่า นักลงทุนเน้นคุณค่าระยะยาวจึงนิยมใช้",
      interp: [
        "ต่ำ (ต่ำกว่า 1%): ได้เงินสดกลับมาน้อยเมื่อเทียบกับราคา หรือการลงทุนหนักดูดเงินสดไปหมด",
        "สูง (เกิน 5%): ผลตอบแทนเงินสดสูง บริษัทสามารถซื้อหุ้นคืนหรือจ่ายปันผลได้ในอัตรานั้น",
        "ข้อควรระวัง: ช่วงลงทุนหนักอาจทำให้ FCF yield ติดลบได้แม้เป็นธุรกิจที่ดีมาก ควรเทียบกับ EBITDA/EV"
      ],
      use: "เสามูลค่า 30 จาก 100 คะแนน จัดอันดับภายในกลุ่มอุตสาหกรรม โหมดผสม (ค่าเฉลี่ยหลายปีครึ่งหนึ่ง ความชันครึ่งหนึ่ง) FCF ติดลบอยู่อันดับท้าย",
      takeaway: "FCF yield คือผลตอบแทนเป็นเงินสดที่ธุรกิจสร้างให้ต่อราคาหุ้นหนึ่งดอลลาร์"
    }
  },

  v_eby: {
    cat: "value",
    related: ["value", "d_eve", "q_netcash", "v_sy"],
    formula: "EBITDA yield = EBITDA ÷ Enterprise value × 100",
    where: [
      ["EBITDA", "Earnings before interest, tax, depreciation and amortisation", "กำไรก่อนดอกเบี้ย ภาษี ค่าเสื่อมราคา และค่าตัดจำหน่าย"],
      ["Enterprise value (EV)", "Market cap + Total debt − Cash", "มูลค่าตลาด + หนี้สินรวม − เงินสด"]
    ],
    en: {
      title: "EBITDA to EV",
      intro: "Operating earnings before non-cash charges, compared with the value of the whole firm including its debt and net of its cash. Loughran and Wellman (2011) found this “enterprise multiple” to be a strong value signal, and because it uses EV it compares firms with different debt levels fairly.",
      interp: [
        "Low (below 3%): you pay more than about 33× EBITDA for the whole firm.",
        "High (above 10%): under 10× EBITDA — inexpensive for the cash earnings the operations produce.",
        "Warning: EBITDA ignores the cost of replacing equipment, which flatters capital-heavy firms such as fabs and data centres."
      ],
      use: "Valuation pillar, 25 of 100 points. Ranked within sector; mode both (½ multi-year average, ½ trend slope).",
      takeaway: "EBITDA/EV prices the whole business, debt included, against its operating cash earnings."
    },
    th: {
      title: "EBITDA ต่อมูลค่ากิจการ",
      intro: "กำไรจากการดำเนินงานก่อนหักรายการที่ไม่ใช่เงินสด เทียบกับมูลค่าทั้งกิจการซึ่งรวมหนี้และหักเงินสดแล้ว Loughran และ Wellman (2011) พบว่า “enterprise multiple” นี้เป็นสัญญาณมูลค่าที่แข็งแรง และเพราะใช้ EV จึงเปรียบเทียบบริษัทที่มีระดับหนี้ต่างกันได้อย่างเป็นธรรม",
      interp: [
        "ต่ำ (ต่ำกว่า 3%): จ่ายแพงกว่าราว 33 เท่าของ EBITDA สำหรับทั้งกิจการ",
        "สูง (เกิน 10%): ต่ำกว่า 10 เท่าของ EBITDA ถือว่าไม่แพงเมื่อเทียบกับกำไรเงินสดที่ธุรกิจสร้างได้",
        "ข้อควรระวัง: EBITDA ไม่นับต้นทุนการเปลี่ยนเครื่องจักร จึงทำให้ธุรกิจใช้ทุนสูง เช่น โรงงานผลิตชิปและศูนย์ข้อมูล ดูดีเกินจริง"
      ],
      use: "เสามูลค่า 25 จาก 100 คะแนน จัดอันดับภายในกลุ่มอุตสาหกรรม โหมดผสม (ค่าเฉลี่ยหลายปีครึ่งหนึ่ง ความชันครึ่งหนึ่ง)",
      takeaway: "EBITDA/EV ตีราคาธุรกิจทั้งก้อนรวมหนี้ เทียบกับกำไรเงินสดจากการดำเนินงาน"
    }
  },

  v_sy: {
    cat: "value",
    related: ["value", "d_evs", "v_eby", "g_rev"],
    formula: "Sales yield = Revenue ÷ Enterprise value × 100",
    where: [
      ["Revenue", "Total sales (TTM or fiscal year)", "ยอดขายรวม (TTM หรือปีบัญชี)"],
      ["Enterprise value (EV)", "Market cap + Total debt − Cash", "มูลค่าตลาด + หนี้สินรวม − เงินสด"]
    ],
    en: {
      title: "Sales to EV",
      intro: "How much revenue you get for each dollar of enterprise value — the inverse of EV/sales. Barbee, Mukherji and Raines (1996) found the sales-to-price ratio explained returns better than book-to-market, and sales stay positive even when a company is losing money.",
      interp: [
        "Low (below 5%): you pay more than 20× sales — typical of very high-margin or very high-growth firms.",
        "High (above 30%): under about 3× sales — cheap if margins can hold or improve.",
        "Warning: sales say nothing about profit; a low-margin business always looks cheap on this measure, which is why it carries the smallest weight."
      ],
      use: "Valuation pillar, 15 of 100 points — the smallest valuation weight. Ranked within sector; mode both (½ multi-year average, ½ trend slope).",
      takeaway: "Sales/EV is a rough but robust price check that still works when profits are temporarily low or negative."
    },
    th: {
      title: "ยอดขายต่อมูลค่ากิจการ",
      intro: "วัดว่ามูลค่ากิจการแต่ละดอลลาร์ซื้อรายได้ได้เท่าไร เป็นส่วนกลับของ EV/Sales Barbee, Mukherji และ Raines (1996) พบว่าอัตราส่วนยอดขายต่อราคาอธิบายผลตอบแทนได้ดีกว่าอัตราส่วนมูลค่าตามบัญชีต่อราคา และยอดขายยังเป็นบวกแม้บริษัทขาดทุน",
      interp: [
        "ต่ำ (ต่ำกว่า 5%): จ่ายแพงกว่า 20 เท่าของยอดขาย พบบ่อยในบริษัทมาร์จินสูงมากหรือโตเร็วมาก",
        "สูง (เกิน 30%): ต่ำกว่าราว 3 เท่าของยอดขาย ถือว่าถูก หากรักษาหรือเพิ่มอัตรากำไรได้",
        "ข้อควรระวัง: ยอดขายไม่บอกอะไรเรื่องกำไร ธุรกิจมาร์จินต่ำจะดูถูกเสมอในมาตรวัดนี้ จึงได้น้ำหนักน้อยที่สุด"
      ],
      use: "เสามูลค่า 15 จาก 100 คะแนน ซึ่งเป็นน้ำหนักน้อยที่สุดในเสานี้ จัดอันดับภายในกลุ่มอุตสาหกรรม โหมดผสม (ค่าเฉลี่ยหลายปีครึ่งหนึ่ง ความชันครึ่งหนึ่ง)",
      takeaway: "Sales/EV เป็นการเช็กราคาแบบหยาบแต่ทนทาน ใช้ได้แม้ในช่วงที่กำไรต่ำหรือติดลบชั่วคราว"
    }
  },

  /* ───────────────────────────── MOMENTUM ───────────────────────────── */

  m_slope: {
    cat: "mom",
    related: ["mom", "m_r2", "d_slope", "i_52w"],
    formula: "Momentum slope = (e^(b × 252) − 1) × 100, where b is the daily least-squares slope of ln(Price) from 12 months ago to 1 month ago",
    where: [
      ["ln(Price)", "Natural log of each daily closing price in the window", "ลอการิทึมธรรมชาติของราคาปิดรายวันในช่วงเวลาที่ใช้"],
      ["b", "Slope of the best-fit line through those log prices, per trading day", "ความชันของเส้นที่ฟิตผ่านลอการิทึมราคา ต่อวันทำการ"],
      ["252", "Approximate trading days in a year, used to annualise", "จำนวนวันทำการโดยประมาณในหนึ่งปี ใช้ปรับเป็นรายปี"]
    ],
    en: {
      title: "Momentum slope (12-1 month)",
      intro: "The annualised rate at which the share price has been rising, from a trend line fitted through the past year of prices while skipping the most recent month. The 12-1 window comes from Jegadeesh and Titman (1993) and Carhart (1997); the last month is left out because very short-term moves tend to reverse.",
      interp: [
        "Low (negative): the price has been trending down over the year.",
        "High (above +50%/yr): a powerful uptrend among the strongest in the market.",
        "Warning: a single huge gap can dominate the fit; the consistency measure (R²) helps reveal that."
      ],
      use: "Momentum pillar, 60 of 100 points. Ranked across all 55 stocks.",
      takeaway: "Momentum slope measures how fast the market has been re-rating the stock over the past year."
    },
    th: {
      title: "ความชันโมเมนตัม (12-1 เดือน)",
      intro: "อัตราการขึ้นของราคาหุ้นที่ปรับเป็นรายปี คำนวณจากเส้นแนวโน้มที่ฟิตผ่านราคาย้อนหลังหนึ่งปีโดยข้ามเดือนล่าสุด ช่วง 12-1 มาจากงานของ Jegadeesh และ Titman (1993) และ Carhart (1997) ที่ข้ามเดือนล่าสุดเพราะการเคลื่อนไหวระยะสั้นมากมักกลับตัว",
      interp: [
        "ต่ำ (ติดลบ): ราคามีแนวโน้มลงตลอดปี",
        "สูง (เกิน +50% ต่อปี): ขาขึ้นแรง อยู่ในกลุ่มแข็งแกร่งที่สุดของตลาด",
        "ข้อควรระวัง: การกระโดดของราคาครั้งใหญ่ครั้งเดียวอาจครอบงำเส้นที่ฟิตได้ ค่าความสม่ำเสมอ (R²) ช่วยเปิดเผยกรณีนี้"
      ],
      use: "เสาโมเมนตัม 60 จาก 100 คะแนน จัดอันดับเทียบหุ้นทั้ง 55 ตัว",
      takeaway: "ความชันโมเมนตัมวัดว่าตลาดปรับมุมมองต่อหุ้นขึ้นเร็วแค่ไหนในรอบปีที่ผ่านมา"
    }
  },

  m_r2: {
    cat: "mom",
    related: ["mom", "m_slope", "d_slope"],
    formula: "Trend consistency = R² × sign(b), from the same 12-1 month fit of ln(Price) against time",
    where: [
      ["R²", "Share of the log-price movement explained by the straight trend line, 0 to 1", "สัดส่วนการเคลื่อนไหวของลอการิทึมราคาที่เส้นแนวโน้มตรงอธิบายได้ 0 ถึง 1"],
      ["sign(b)", "+1 if the trend is up, −1 if it is down", "+1 ถ้าแนวโน้มขึ้น −1 ถ้าแนวโน้มลง"]
    ],
    en: {
      title: "Trend consistency (signed R²)",
      intro: "How smoothly the price has followed its trend line, with a minus sign when the trend is down. Da, Gurun and Warachka (2014), in their “frog in the pan” study, found that momentum built from many small steady gains lasts longer than momentum built from a few big jumps, because investors under-react to gradual news.",
      interp: [
        "Low (near −1): a steady, persistent decline.",
        "High (near +1): a smooth, step-by-step climb — the most durable kind of momentum.",
        "Warning: values near 0 mean the price is choppy or flat; even a large slope with low R² is less reliable."
      ],
      use: "Momentum pillar, 40 of 100 points. Ranked across all 55 stocks.",
      takeaway: "Consistency separates quiet, durable uptrends from noisy spikes that are more likely to fade."
    },
    th: {
      title: "ความสม่ำเสมอของแนวโน้ม (R² แบบมีเครื่องหมาย)",
      intro: "วัดว่าราคาเดินตามเส้นแนวโน้มได้เรียบเพียงใด โดยใส่เครื่องหมายลบเมื่อแนวโน้มเป็นขาลง Da, Gurun และ Warachka (2014) ในงานวิจัย “frog in the pan” พบว่าโมเมนตัมที่สะสมจากการขึ้นทีละน้อยอย่างสม่ำเสมออยู่ได้นานกว่าโมเมนตัมที่มาจากการกระโดดไม่กี่ครั้ง เพราะนักลงทุนตอบสนองต่อข่าวที่ค่อย ๆ มาช้าเกินไป",
      interp: [
        "ต่ำ (ใกล้ −1): ขาลงที่ต่อเนื่องและสม่ำเสมอ",
        "สูง (ใกล้ +1): ไต่ขึ้นอย่างเรียบทีละขั้น เป็นโมเมนตัมแบบที่ยั่งยืนที่สุด",
        "ข้อควรระวัง: ค่าใกล้ 0 แปลว่าราคาแกว่งไร้ทิศหรือทรงตัว แม้ความชันจะสูง ถ้า R² ต่ำก็เชื่อถือได้น้อยกว่า"
      ],
      use: "เสาโมเมนตัม 40 จาก 100 คะแนน จัดอันดับเทียบหุ้นทั้ง 55 ตัว",
      takeaway: "ความสม่ำเสมอแยกขาขึ้นที่เงียบและยั่งยืน ออกจากการพุ่งที่มีเสียงรบกวนและมีแนวโน้มจะจางหายไป"
    }
  },

  /* ───────────────────────────── MOAT (judged) ───────────────────────────── */

  moat_tech: {
    cat: "moat",
    related: ["moat", "moat_dur", "opp_bot"],
    formula: "Technology & IP = judged score from 0 to 20",
    where: [
      ["0–5", "No meaningful technical edge; product is easy to match", "ไม่มีความได้เปรียบทางเทคนิคที่มีนัย สินค้าตามทันได้ง่าย"],
      ["6–12", "A real but narrow lead, or one rivals are closing", "มีความได้เปรียบจริงแต่แคบ หรือคู่แข่งกำลังไล่ตาม"],
      ["13–20", "A lead protected by patents, know-how or process depth that takes years to copy", "ความได้เปรียบที่มีสิทธิบัตร ความรู้เฉพาะ หรือกระบวนการที่ลึกปกป้อง ต้องใช้เวลาหลายปีจึงลอกได้"]
    ],
    en: {
      title: "Technology & IP",
      intro: "How hard it is for competitors to match what the company can build. It covers patents, trade secrets, manufacturing know-how and design talent — Morningstar groups these under “intangible assets”, one of its five moat sources.",
      interp: [
        "Low: the product is a commodity or close to it; differentiation comes mainly from price.",
        "High: rivals would need years of R&D and specialised staff to reach the same performance.",
        "Warning: in fast-moving AI hardware a technical lead can shrink within one or two product cycles."
      ],
      use: "Moat pillar, 0–20 of 100 points. Judged in the stock's research notes, not computed.",
      takeaway: "Technology & IP scores how far ahead the company's products are and how well that lead is protected."
    },
    th: {
      title: "เทคโนโลยีและทรัพย์สินทางปัญญา",
      intro: "วัดว่าคู่แข่งจะสร้างสิ่งที่บริษัทสร้างได้ยากเพียงใด ครอบคลุมสิทธิบัตร ความลับทางการค้า ความรู้ด้านการผลิต และบุคลากรด้านการออกแบบ Morningstar จัดสิ่งเหล่านี้ไว้ในกลุ่ม “สินทรัพย์ไม่มีตัวตน” ซึ่งเป็นหนึ่งในห้าแหล่งของคูเมือง",
      interp: [
        "ต่ำ: สินค้าเป็นหรือใกล้เคียงสินค้าโภคภัณฑ์ ความแตกต่างมาจากราคาเป็นหลัก",
        "สูง: คู่แข่งต้องวิจัยพัฒนาหลายปีและใช้บุคลากรเฉพาะทางจึงจะทำได้เท่า",
        "ข้อควรระวัง: ในฮาร์ดแวร์ AI ที่เปลี่ยนเร็ว ความได้เปรียบทางเทคนิคอาจหดหายภายในหนึ่งถึงสองรอบผลิตภัณฑ์"
      ],
      use: "เสาคูเมือง 0–20 จาก 100 คะแนน ประเมินในบันทึกวิเคราะห์ของหุ้น ไม่ได้คำนวณจากสูตร",
      takeaway: "เทคโนโลยีและทรัพย์สินทางปัญญาให้คะแนนว่าสินค้านำหน้าไปไกลแค่ไหนและได้รับการปกป้องดีเพียงใด"
    }
  },

  moat_sw: {
    cat: "moat",
    related: ["moat", "moat_net", "opp_bot"],
    formula: "Switching costs = judged score from 0 to 20",
    where: [
      ["0–5", "Customers can switch supplier quickly and cheaply", "ลูกค้าเปลี่ยนผู้ขายได้เร็วและเสียค่าใช้จ่ายน้อย"],
      ["6–12", "Switching takes effort, retraining or requalification", "การเปลี่ยนต้องใช้ความพยายาม ฝึกอบรมใหม่ หรือทดสอบรับรองใหม่"],
      ["13–20", "The product is embedded in customers' designs, code or operations; leaving is costly and risky", "สินค้าฝังอยู่ในการออกแบบ โค้ด หรือการดำเนินงานของลูกค้า การเลิกใช้มีต้นทุนและความเสี่ยงสูง"]
    ],
    en: {
      title: "Switching costs",
      intro: "How painful it is for a customer to move to a competitor. Costs can be money, time, retraining, re-writing software or re-qualifying a part in a chip design; Morningstar treats this as one of its five moat sources.",
      interp: [
        "Low: customers shop on price each cycle and can walk away easily.",
        "High: once designed in, the company is usually kept for years — think toolchains, design software or qualified components.",
        "Warning: a big enough price or performance gap from a rival can overcome even high switching costs."
      ],
      use: "Moat pillar, 0–20 of 100 points. Judged in the stock's research notes, not computed.",
      takeaway: "Switching costs measure how sticky customers are once they have chosen this company."
    },
    th: {
      title: "ต้นทุนการเปลี่ยนผู้ขาย",
      intro: "วัดว่าลูกค้าจะเจ็บตัวแค่ไหนถ้าย้ายไปใช้คู่แข่ง ต้นทุนอาจเป็นเงิน เวลา การฝึกอบรมใหม่ การเขียนซอฟต์แวร์ใหม่ หรือการทดสอบรับรองชิ้นส่วนในงานออกแบบชิปใหม่ Morningstar ถือเป็นหนึ่งในห้าแหล่งของคูเมือง",
      interp: [
        "ต่ำ: ลูกค้าเลือกตามราคาทุกรอบและเดินจากไปได้ง่าย",
        "สูง: เมื่อถูกเลือกเข้าไปในการออกแบบแล้ว มักถูกใช้ต่อหลายปี เช่น ชุดเครื่องมือพัฒนา ซอฟต์แวร์ออกแบบ หรือชิ้นส่วนที่ผ่านการรับรอง",
        "ข้อควรระวัง: ถ้าคู่แข่งมีราคาหรือประสิทธิภาพเหนือกว่ามากพอ ต้นทุนการเปลี่ยนที่สูงก็อาจไม่พอรั้งลูกค้าไว้"
      ],
      use: "เสาคูเมือง 0–20 จาก 100 คะแนน ประเมินในบันทึกวิเคราะห์ของหุ้น ไม่ได้คำนวณจากสูตร",
      takeaway: "ต้นทุนการเปลี่ยนผู้ขายวัดว่าลูกค้าติดหนึบแค่ไหนเมื่อเลือกบริษัทนี้แล้ว"
    }
  },

  moat_net: {
    cat: "moat",
    related: ["moat", "moat_sw", "moat_scale"],
    formula: "Network & ecosystem = judged score from 0 to 20",
    where: [
      ["0–5", "Each customer gains nothing from other customers using the product", "ลูกค้าแต่ละรายไม่ได้ประโยชน์เพิ่มจากการที่ผู้อื่นใช้สินค้าเดียวกัน"],
      ["6–12", "Some partner, developer or standards advantage", "มีความได้เปรียบบ้างจากพันธมิตร นักพัฒนา หรือมาตรฐาน"],
      ["13–20", "A self-reinforcing ecosystem: more users attract more developers and partners, which attracts more users", "ระบบนิเวศที่เสริมตัวเอง ผู้ใช้มากดึงนักพัฒนาและพันธมิตรมาก ซึ่งดึงผู้ใช้เพิ่มอีก"]
    ],
    en: {
      title: "Network & ecosystem",
      intro: "Whether the product becomes more valuable as more people, developers and partners use it. Network effects are one of Morningstar's five moat sources and explain why software platforms and industry standards are so hard to dislodge.",
      interp: [
        "Low: a stand-alone product; a new rival starts on equal terms.",
        "High: a large community of developers, libraries and partners that a newcomer cannot replicate quickly.",
        "Warning: open standards or a coalition of rivals can deliberately erode an ecosystem advantage."
      ],
      use: "Moat pillar, 0–20 of 100 points. Judged in the stock's research notes, not computed.",
      takeaway: "Network & ecosystem scores how much the company's user base itself protects it."
    },
    th: {
      title: "เครือข่ายและระบบนิเวศ",
      intro: "วัดว่าสินค้ามีคุณค่ามากขึ้นหรือไม่เมื่อมีผู้ใช้ นักพัฒนา และพันธมิตรเพิ่มขึ้น ผลของเครือข่ายเป็นหนึ่งในห้าแหล่งของคูเมืองตาม Morningstar และอธิบายว่าทำไมแพลตฟอร์มซอฟต์แวร์และมาตรฐานอุตสาหกรรมจึงโค่นได้ยาก",
      interp: [
        "ต่ำ: สินค้าเดี่ยว คู่แข่งรายใหม่เริ่มต้นได้เท่าเทียมกัน",
        "สูง: มีชุมชนนักพัฒนา ไลบรารี และพันธมิตรขนาดใหญ่ที่ผู้มาใหม่สร้างตามได้ไม่เร็ว",
        "ข้อควรระวัง: มาตรฐานเปิดหรือการรวมตัวของคู่แข่งอาจถูกใช้เพื่อกัดกร่อนความได้เปรียบด้านระบบนิเวศโดยเจตนา"
      ],
      use: "เสาคูเมือง 0–20 จาก 100 คะแนน ประเมินในบันทึกวิเคราะห์ของหุ้น ไม่ได้คำนวณจากสูตร",
      takeaway: "เครือข่ายและระบบนิเวศให้คะแนนว่าฐานผู้ใช้ของบริษัทช่วยปกป้องบริษัทเองได้มากแค่ไหน"
    }
  },

  moat_scale: {
    cat: "moat",
    related: ["moat", "moat_net", "q_om"],
    formula: "Scale & cost = judged score from 0 to 20",
    where: [
      ["0–5", "No cost advantage; sub-scale against the leaders", "ไม่มีความได้เปรียบด้านต้นทุน ขนาดเล็กกว่าผู้นำ"],
      ["6–12", "Some purchasing, manufacturing or distribution scale", "มีขนาดในการจัดซื้อ การผลิต หรือการกระจายสินค้าอยู่บ้าง"],
      ["13–20", "Lowest-cost producer or so large that rivals cannot justify matching the investment", "ผู้ผลิตต้นทุนต่ำที่สุด หรือใหญ่จนคู่แข่งลงทุนตามไม่คุ้ม"]
    ],
    en: {
      title: "Scale & cost",
      intro: "Whether size lets the company make or deliver its product more cheaply than rivals. Porter's “cost leadership” strategy and Morningstar's cost-advantage and efficient-scale moat sources both describe this; in chips and data centres the up-front investment alone can keep competitors out.",
      interp: [
        "Low: a small player paying more per unit than the leaders.",
        "High: the scale leader whose unit costs or capital budget competitors cannot match.",
        "Warning: scale advantages can turn into burdens when demand drops and large fixed costs remain."
      ],
      use: "Moat pillar, 0–20 of 100 points. Judged in the stock's research notes, not computed.",
      takeaway: "Scale & cost scores whether being big makes this company structurally cheaper or harder to challenge."
    },
    th: {
      title: "ขนาดและต้นทุน",
      intro: "วัดว่าขนาดทำให้บริษัทผลิตหรือส่งมอบสินค้าได้ถูกกว่าคู่แข่งหรือไม่ กลยุทธ์ “ผู้นำด้านต้นทุน” ของ Porter และแหล่งคูเมืองด้านต้นทุนและขนาดที่มีประสิทธิภาพของ Morningstar ต่างอธิบายเรื่องนี้ ในอุตสาหกรรมชิปและศูนย์ข้อมูล เงินลงทุนเริ่มต้นเพียงอย่างเดียวก็กันคู่แข่งออกไปได้",
      interp: [
        "ต่ำ: ผู้เล่นรายเล็กที่มีต้นทุนต่อหน่วยสูงกว่าผู้นำ",
        "สูง: ผู้นำด้านขนาดที่ต้นทุนต่อหน่วยหรืองบลงทุนสูงจนคู่แข่งตามไม่ได้",
        "ข้อควรระวัง: ความได้เปรียบด้านขนาดกลายเป็นภาระได้เมื่อความต้องการลดลงแต่ต้นทุนคงที่ก้อนใหญ่ยังอยู่"
      ],
      use: "เสาคูเมือง 0–20 จาก 100 คะแนน ประเมินในบันทึกวิเคราะห์ของหุ้น ไม่ได้คำนวณจากสูตร",
      takeaway: "ขนาดและต้นทุนให้คะแนนว่าการเป็นบริษัทใหญ่ทำให้ต้นทุนต่ำกว่าเชิงโครงสร้างหรือท้าทายได้ยากขึ้นหรือไม่"
    }
  },

  moat_dur: {
    cat: "moat",
    related: ["moat", "q_stab", "q_om"],
    formula: "Proven durability = judged score from 0 to 20",
    where: [
      ["0–5", "Short or unproven record; returns have not held through a downturn", "ประวัติสั้นหรือยังพิสูจน์ไม่ได้ ผลตอบแทนไม่เคยผ่านช่วงขาลง"],
      ["6–12", "Has held position through at least one cycle with some loss of share or margin", "รักษาตำแหน่งผ่านอย่างน้อยหนึ่งรอบวัฏจักร แต่เสียส่วนแบ่งหรืออัตรากำไรไปบ้าง"],
      ["13–20", "Decades of high returns and stable share through several technology shifts", "ผลตอบแทนสูงและส่วนแบ่งตลาดคงที่มาหลายทศวรรษ ผ่านการเปลี่ยนเทคโนโลยีหลายครั้ง"]
    ],
    en: {
      title: "Proven durability",
      intro: "Evidence that the moat has actually held up over time, not just that it looks strong today. Morningstar separates “narrow” from “wide” moats by how many years excess returns are expected to last; this sub-score rewards a track record through past cycles.",
      interp: [
        "Low: a new or recently disrupted business; the advantage is still a hypothesis.",
        "High: has kept share and returns through recessions, product transitions and new entrants.",
        "Warning: a long track record can breed complacency; the AI transition may be the shift that finally breaks it."
      ],
      use: "Moat pillar, 0–20 of 100 points. Judged in the stock's research notes, not computed.",
      takeaway: "Durability asks whether the moat has survived real tests, which is the best evidence it will survive the next."
    },
    th: {
      title: "ความทนทานที่พิสูจน์แล้ว",
      intro: "หลักฐานว่าคูเมืองยืนหยัดได้จริงตามกาลเวลา ไม่ใช่แค่ดูแข็งแรงในวันนี้ Morningstar แยกคูเมือง “แคบ” กับ “กว้าง” ตามจำนวนปีที่คาดว่าผลตอบแทนส่วนเกินจะคงอยู่ คะแนนย่อยนี้ให้รางวัลแก่ประวัติที่ผ่านวัฏจักรต่าง ๆ มาแล้ว",
      interp: [
        "ต่ำ: ธุรกิจใหม่หรือเพิ่งถูกดิสรัปต์ ความได้เปรียบยังเป็นเพียงสมมติฐาน",
        "สูง: รักษาส่วนแบ่งและผลตอบแทนผ่านภาวะเศรษฐกิจถดถอย การเปลี่ยนผ่านผลิตภัณฑ์ และผู้เล่นรายใหม่มาแล้ว",
        "ข้อควรระวัง: ประวัติยาวนานอาจทำให้ประมาท การเปลี่ยนผ่านสู่ AI อาจเป็นจุดที่ทำลายความได้เปรียบนั้นในที่สุด"
      ],
      use: "เสาคูเมือง 0–20 จาก 100 คะแนน ประเมินในบันทึกวิเคราะห์ของหุ้น ไม่ได้คำนวณจากสูตร",
      takeaway: "ความทนทานถามว่าคูเมืองผ่านบททดสอบจริงมาแล้วหรือยัง ซึ่งเป็นหลักฐานที่ดีที่สุดว่าจะผ่านครั้งต่อไปได้"
    }
  },

  /* ───────────────────────────── AI OPPORTUNITY (judged) ───────────────────────────── */

  opp_exp: {
    cat: "opp",
    related: ["opp", "opp_mkt", "g_rev"],
    formula: "AI revenue exposure = judged score from 0 to 20",
    where: [
      ["0–5", "AI-related sales are a small slice of revenue", "ยอดขายที่เกี่ยวกับ AI เป็นสัดส่วนเล็กของรายได้"],
      ["6–12", "A meaningful and growing share, but other markets still dominate", "สัดส่วนมีนัยและเพิ่มขึ้น แต่ตลาดอื่นยังเป็นหลัก"],
      ["13–20", "AI demand drives most of the revenue and nearly all of the growth", "ความต้องการด้าน AI ขับเคลื่อนรายได้ส่วนใหญ่และการเติบโตเกือบทั้งหมด"]
    ],
    en: {
      title: "AI revenue exposure",
      intro: "How much of the company's revenue today comes from AI infrastructure demand — accelerators, networking, memory, power, cooling, cloud capacity or AI software. The higher the share, the more directly the AI spending cycle shows up in results.",
      interp: [
        "Low: AI is a small part of the business; results depend mainly on other end markets.",
        "High: AI is the main engine; the stock behaves like a direct bet on AI capex.",
        "Warning: high exposure cuts both ways — a pause in AI spending would hit this company first."
      ],
      use: "AI opportunity pillar, 0–20 of 100 points. Judged in the stock's research notes, not computed.",
      takeaway: "Exposure measures how directly the AI boom flows into this company's revenue."
    },
    th: {
      title: "สัดส่วนรายได้จาก AI",
      intro: "วัดว่ารายได้ปัจจุบันของบริษัทมาจากความต้องการโครงสร้างพื้นฐาน AI มากเพียงใด ไม่ว่าจะเป็นชิปเร่งความเร็ว ระบบเครือข่าย หน่วยความจำ ไฟฟ้า ระบบระบายความร้อน กำลังประมวลผลบนคลาวด์ หรือซอฟต์แวร์ AI ยิ่งสัดส่วนสูง วัฏจักรการใช้จ่ายด้าน AI ยิ่งสะท้อนในผลประกอบการโดยตรง",
      interp: [
        "ต่ำ: AI เป็นส่วนเล็กของธุรกิจ ผลประกอบการขึ้นกับตลาดปลายทางอื่นเป็นหลัก",
        "สูง: AI เป็นเครื่องยนต์หลัก หุ้นเคลื่อนไหวเหมือนการเดิมพันโดยตรงกับการลงทุนด้าน AI",
        "ข้อควรระวัง: สัดส่วนสูงเป็นดาบสองคม ถ้าการใช้จ่ายด้าน AI ชะลอ บริษัทนี้จะโดนก่อน"
      ],
      use: "เสาโอกาสด้าน AI 0–20 จาก 100 คะแนน ประเมินในบันทึกวิเคราะห์ของหุ้น ไม่ได้คำนวณจากสูตร",
      takeaway: "สัดส่วนรายได้จาก AI วัดว่ากระแส AI ไหลเข้าสู่รายได้ของบริษัทนี้โดยตรงแค่ไหน"
    }
  },

  opp_mkt: {
    cat: "opp",
    related: ["opp", "opp_pos", "opp_exp"],
    formula: "Market growth = judged score from 0 to 20",
    where: [
      ["0–5", "The company's AI-related market is growing slowly or maturing", "ตลาดที่เกี่ยวกับ AI ของบริษัทโตช้าหรือเริ่มอิ่มตัว"],
      ["6–12", "Solid growth, roughly in line with overall AI spending", "เติบโตดี ใกล้เคียงกับการใช้จ่ายด้าน AI โดยรวม"],
      ["13–20", "One of the fastest-growing segments of the AI build-out", "หนึ่งในส่วนที่โตเร็วที่สุดของการสร้างโครงสร้างพื้นฐาน AI"]
    ],
    en: {
      title: "Market growth",
      intro: "How fast the specific market the company sells into is expected to grow over the next few years. It is the vertical axis of the BCG growth–share matrix: a strong player in a fast-growing market (a “star”) has more room to compound than the same player in a slow one.",
      interp: [
        "Low: a mature segment; growth must come from taking share.",
        "High: a segment expanding much faster than the economy, lifting most participants.",
        "Warning: fast-growing markets attract new entrants and capacity, which can later crush prices."
      ],
      use: "AI opportunity pillar, 0–20 of 100 points. Judged in the stock's research notes, not computed.",
      takeaway: "Market growth scores the tide; position scores how well this company's boat sits in it."
    },
    th: {
      title: "การเติบโตของตลาด",
      intro: "วัดว่าตลาดเฉพาะที่บริษัทขายสินค้าอยู่คาดว่าจะเติบโตเร็วเพียงใดในอีกไม่กี่ปีข้างหน้า เป็นแกนตั้งของ BCG growth–share matrix ผู้เล่นที่แข็งแรงในตลาดโตเร็ว (“ดาวรุ่ง”) มีพื้นที่เติบโตทบต้นมากกว่าผู้เล่นแบบเดียวกันในตลาดที่โตช้า",
      interp: [
        "ต่ำ: ตลาดอิ่มตัว การเติบโตต้องมาจากการแย่งส่วนแบ่ง",
        "สูง: ตลาดขยายตัวเร็วกว่าเศรษฐกิจมาก ยกระดับผู้เล่นเกือบทุกราย",
        "ข้อควรระวัง: ตลาดที่โตเร็วดึงดูดผู้เล่นใหม่และกำลังการผลิตเพิ่ม ซึ่งอาจกดราคาลงอย่างหนักในภายหลัง"
      ],
      use: "เสาโอกาสด้าน AI 0–20 จาก 100 คะแนน ประเมินในบันทึกวิเคราะห์ของหุ้น ไม่ได้คำนวณจากสูตร",
      takeaway: "การเติบโตของตลาดให้คะแนนกระแสน้ำ ส่วนตำแหน่งในตลาดให้คะแนนว่าเรือของบริษัทลอยอยู่ในกระแสนั้นได้ดีแค่ไหน"
    }
  },

  opp_pos: {
    cat: "opp",
    related: ["opp", "opp_mkt", "moat"],
    formula: "Position in market = judged score from 0 to 20",
    where: [
      ["0–5", "A small or follower position with little influence on price or standards", "ส่วนแบ่งเล็กหรือเป็นผู้ตาม มีอิทธิพลต่อราคาหรือมาตรฐานน้อย"],
      ["6–12", "One of several credible suppliers", "หนึ่งในผู้ขายที่น่าเชื่อถือหลายราย"],
      ["13–20", "Clear leader or one of two, often setting the technology roadmap", "ผู้นำชัดเจนหรือหนึ่งในสองราย มักเป็นผู้กำหนดทิศทางเทคโนโลยี"]
    ],
    en: {
      title: "Position in that market",
      intro: "How strong the company's share and standing are within its AI market. It is the horizontal axis of the BCG growth–share matrix: leaders usually capture a disproportionate share of a market's profit, especially in technology where volume lowers unit cost.",
      interp: [
        "Low: a niche or follower that competes mainly on price.",
        "High: the leader or co-leader that customers default to.",
        "Warning: leadership in today's generation does not guarantee leadership in the next one."
      ],
      use: "AI opportunity pillar, 0–20 of 100 points. Judged in the stock's research notes, not computed.",
      takeaway: "Position scores how much of its market's growth this company is likely to keep for itself."
    },
    th: {
      title: "ตำแหน่งในตลาด",
      intro: "วัดว่าส่วนแบ่งและสถานะของบริษัทในตลาด AI ของตนแข็งแรงเพียงใด เป็นแกนนอนของ BCG growth–share matrix ผู้นำตลาดมักได้ส่วนแบ่งกำไรมากเกินสัดส่วน โดยเฉพาะในธุรกิจเทคโนโลยีที่ปริมาณการผลิตทำให้ต้นทุนต่อหน่วยลดลง",
      interp: [
        "ต่ำ: ผู้เล่นเฉพาะกลุ่มหรือผู้ตามที่แข่งขันด้วยราคาเป็นหลัก",
        "สูง: ผู้นำหรือผู้นำร่วมที่ลูกค้าเลือกเป็นอันดับแรก",
        "ข้อควรระวัง: การเป็นผู้นำในเทคโนโลยีรุ่นนี้ไม่รับประกันการเป็นผู้นำในรุ่นถัดไป"
      ],
      use: "เสาโอกาสด้าน AI 0–20 จาก 100 คะแนน ประเมินในบันทึกวิเคราะห์ของหุ้น ไม่ได้คำนวณจากสูตร",
      takeaway: "ตำแหน่งในตลาดให้คะแนนว่าบริษัทจะเก็บการเติบโตของตลาดไว้กับตัวเองได้มากแค่ไหน"
    }
  },

  opp_bot: {
    cat: "opp",
    related: ["opp", "moat_tech", "moat_sw", "q_om"],
    formula: "Bottleneck & pricing power = judged score from 0 to 20",
    where: [
      ["0–5", "Plentiful supply; buyers set the price", "อุปทานล้นเหลือ ผู้ซื้อเป็นผู้กำหนดราคา"],
      ["6–12", "Periodically tight supply that gives some pricing leverage", "อุปทานตึงเป็นช่วง ๆ ทำให้มีอำนาจต่อรองราคาบ้าง"],
      ["13–20", "Controls a step the whole AI build-out cannot route around; can raise prices", "ควบคุมขั้นตอนที่การสร้างโครงสร้างพื้นฐาน AI ทั้งระบบเลี่ยงไม่ได้ และขึ้นราคาได้"]
    ],
    en: {
      title: "Bottleneck & pricing power",
      intro: "Whether the company controls a scarce step that limits how fast AI capacity can be built. Goldratt's Theory of Constraints holds that a system's output is set by its tightest constraint; whoever owns that constraint tends to capture outsized value and can charge for it.",
      interp: [
        "Low: one of many interchangeable suppliers; prices are negotiated down.",
        "High: customers queue for supply and accept price rises because there is no alternative.",
        "Warning: bottlenecks move — new capacity or a design change can shift the constraint elsewhere within a few years."
      ],
      use: "AI opportunity pillar, 0–20 of 100 points. Judged in the stock's research notes, not computed.",
      takeaway: "Bottleneck scores whether the company sits on the narrowest point of the AI supply chain, where pricing power lives."
    },
    th: {
      title: "คอขวดและอำนาจตั้งราคา",
      intro: "วัดว่าบริษัทควบคุมขั้นตอนที่หายากซึ่งจำกัดความเร็วในการสร้างกำลังประมวลผล AI หรือไม่ ทฤษฎีข้อจำกัด (Theory of Constraints) ของ Goldratt ระบุว่าผลผลิตของทั้งระบบถูกกำหนดโดยจุดที่ตึงที่สุด ผู้ที่ครองจุดนั้นมักได้มูลค่าส่วนใหญ่และเรียกราคาได้",
      interp: [
        "ต่ำ: หนึ่งในผู้ขายจำนวนมากที่ทดแทนกันได้ ราคาถูกต่อรองลง",
        "สูง: ลูกค้าต่อคิวรอสินค้าและยอมรับการขึ้นราคาเพราะไม่มีทางเลือก",
        "ข้อควรระวัง: คอขวดย้ายที่ได้ กำลังการผลิตใหม่หรือการเปลี่ยนการออกแบบอาจย้ายข้อจำกัดไปที่อื่นภายในไม่กี่ปี"
      ],
      use: "เสาโอกาสด้าน AI 0–20 จาก 100 คะแนน ประเมินในบันทึกวิเคราะห์ของหุ้น ไม่ได้คำนวณจากสูตร",
      takeaway: "คอขวดให้คะแนนว่าบริษัทอยู่ ณ จุดที่แคบที่สุดของห่วงโซ่อุปทาน AI ซึ่งเป็นที่มาของอำนาจตั้งราคาหรือไม่"
    }
  },

  opp_opt: {
    cat: "opp",
    related: ["opp", "opp_mkt", "opp_pos"],
    formula: "Optionality = judged score from 0 to 20",
    where: [
      ["0–5", "Little beyond the current product line", "แทบไม่มีอะไรนอกเหนือจากสายผลิตภัณฑ์ปัจจุบัน"],
      ["6–12", "One or two credible adjacent markets in development", "มีตลาดข้างเคียงที่น่าเชื่อถือหนึ่งหรือสองตลาดที่กำลังพัฒนา"],
      ["13–20", "Several large new markets the company is well placed to enter, not yet in forecasts", "มีตลาดใหม่ขนาดใหญ่หลายตลาดที่บริษัทพร้อมจะเข้าไป และยังไม่อยู่ในประมาณการ"]
    ],
    en: {
      title: "Optionality",
      intro: "The upside from new products, markets or business models that are not yet in the numbers — for example edge AI, robotics or new chip packaging. The idea borrows from real-options thinking (Myers, 1977): an opportunity you can choose to pursue later has value today.",
      interp: [
        "Low: what you see is what you get; future growth depends on the existing business.",
        "High: several credible ways to grow that the market is not yet paying for.",
        "Warning: optionality is the easiest score to over-estimate; most options are never exercised."
      ],
      use: "AI opportunity pillar, 0–20 of 100 points. Judged in the stock's research notes, not computed.",
      takeaway: "Optionality scores the potential surprises on the upside that today's forecasts leave out."
    },
    th: {
      title: "ทางเลือกในอนาคต (Optionality)",
      intro: "โอกาสเติบโตจากสินค้า ตลาด หรือรูปแบบธุรกิจใหม่ที่ยังไม่ปรากฏในตัวเลข เช่น AI บนอุปกรณ์ปลายทาง หุ่นยนต์ หรือเทคโนโลยีบรรจุชิปแบบใหม่ แนวคิดนี้ยืมมาจาก real options (Myers, 1977) คือโอกาสที่เลือกจะคว้าได้ในภายหลังมีมูลค่าตั้งแต่วันนี้",
      interp: [
        "ต่ำ: เห็นอย่างไรได้อย่างนั้น การเติบโตในอนาคตขึ้นกับธุรกิจเดิม",
        "สูง: มีหลายเส้นทางการเติบโตที่น่าเชื่อถือ ซึ่งตลาดยังไม่ได้จ่ายราคาให้",
        "ข้อควรระวัง: ทางเลือกในอนาคตเป็นคะแนนที่ประเมินสูงเกินจริงได้ง่ายที่สุด ทางเลือกส่วนใหญ่ไม่เคยถูกใช้จริง"
      ],
      use: "เสาโอกาสด้าน AI 0–20 จาก 100 คะแนน ประเมินในบันทึกวิเคราะห์ของหุ้น ไม่ได้คำนวณจากสูตร",
      takeaway: "ทางเลือกในอนาคตให้คะแนนความเป็นไปได้ที่จะเซอร์ไพรส์ด้านบวก ซึ่งประมาณการวันนี้ยังไม่ได้นับรวม"
    }
  },

  /* ───────────────────────────── TECHNICAL (AI Analysis tab, not scored) ───────────────────────────── */

  i_price: {
    cat: "tech",
    related: ["i_52w", "i_ema", "i_vol", "d_usd"],
    formula: "Change % = (Last price − Previous close) ÷ Previous close × 100",
    where: [
      ["Last price", "Most recent traded or closing price", "ราคาซื้อขายล่าสุดหรือราคาปิด"],
      ["Previous close", "Closing price of the prior trading session", "ราคาปิดของวันทำการก่อนหน้า"]
    ],
    en: {
      title: "Price & daily change",
      intro: "The latest share price and how much it moved since the previous close. It is the starting point for every chart indicator on the AI Analysis tab.",
      interp: [
        "Low (large negative change): a sharp one-day drop, often on news, earnings or a sector sell-off.",
        "High (large positive change): a sharp one-day gain; check whether volume confirms it.",
        "Warning: a single day's move says little about the trend; prices may be delayed and are shown in the listing currency unless noted."
      ],
      use: "Shown at the top of the AI Analysis tab. Not part of any score.",
      takeaway: "Price and change tell you where the stock is right now, not where it is heading."
    },
    th: {
      title: "ราคาและการเปลี่ยนแปลงรายวัน",
      intro: "ราคาหุ้นล่าสุดและการเปลี่ยนแปลงจากราคาปิดวันก่อน เป็นจุดตั้งต้นของอินดิเคเตอร์ทุกตัวบนแท็บ AI Analysis",
      interp: [
        "ต่ำ (ลดลงมาก): ร่วงแรงในวันเดียว มักมาจากข่าว งบการเงิน หรือการเทขายทั้งกลุ่ม",
        "สูง (เพิ่มขึ้นมาก): พุ่งแรงในวันเดียว ควรดูว่าปริมาณการซื้อขายยืนยันหรือไม่",
        "ข้อควรระวัง: การเคลื่อนไหววันเดียวบอกเรื่องแนวโน้มได้น้อย ราคาอาจล่าช้า และแสดงเป็นสกุลเงินของตลาดที่จดทะเบียน เว้นแต่ระบุไว้"
      ],
      use: "แสดงด้านบนของแท็บ AI Analysis ไม่ได้ใช้ในการคำนวณคะแนนใด ๆ",
      takeaway: "ราคาและการเปลี่ยนแปลงบอกว่าหุ้นอยู่ตรงไหนตอนนี้ ไม่ได้บอกว่ากำลังจะไปทางไหน"
    }
  },

  i_rsi: {
    cat: "tech",
    related: ["i_macd", "i_bb", "i_price"],
    formula: "RSI = 100 − 100 ÷ (1 + RS), where RS = Average gain ÷ Average loss over 14 days",
    where: [
      ["Average gain", "Smoothed average of up-day price changes over 14 days", "ค่าเฉลี่ยแบบปรับเรียบของการเปลี่ยนแปลงราคาในวันที่ขึ้น ช่วง 14 วัน"],
      ["Average loss", "Smoothed average of down-day price changes over 14 days (as a positive number)", "ค่าเฉลี่ยแบบปรับเรียบของการเปลี่ยนแปลงราคาในวันที่ลง ช่วง 14 วัน (เป็นค่าบวก)"],
      ["RS", "Relative strength: how large gains have been compared with losses", "ความแข็งแกร่งสัมพัทธ์ คือขนาดของการขึ้นเทียบกับการลง"]
    ],
    en: {
      title: "RSI (14)",
      intro: "A 0–100 oscillator that compares the size of recent gains with recent losses. J. Welles Wilder introduced it in 1978, with 14 periods as the default and 70/30 as the usual overbought/oversold lines.",
      interp: [
        "Low (below 30): the stock has fallen hard and fast; it may be oversold and due for a pause.",
        "High (above 70): the stock has risen hard and fast; it may be overbought in the short term.",
        "Warning: in strong trends RSI can stay above 70 or below 30 for weeks; it is a timing aid, not a sell or buy signal on its own."
      ],
      use: "Shown on the AI Analysis tab with a 14-day setting. Not part of any score.",
      takeaway: "RSI tells you how stretched the recent move is, which helps with timing rather than with picking stocks."
    },
    th: {
      title: "RSI (14)",
      intro: "ออสซิลเลเตอร์ 0–100 ที่เปรียบเทียบขนาดของการขึ้นกับการลงในช่วงล่าสุด J. Welles Wilder เสนอไว้ในปี 1978 โดยใช้ 14 ช่วงเวลาเป็นค่าเริ่มต้น และใช้เส้น 70/30 เป็นระดับซื้อมากเกินไป/ขายมากเกินไป",
      interp: [
        "ต่ำ (ต่ำกว่า 30): หุ้นลงแรงและเร็ว อาจขายมากเกินไปและใกล้พักตัว",
        "สูง (เกิน 70): หุ้นขึ้นแรงและเร็ว อาจซื้อมากเกินไปในระยะสั้น",
        "ข้อควรระวัง: ในแนวโน้มที่แรง RSI อาจค้างเหนือ 70 หรือใต้ 30 ได้หลายสัปดาห์ เป็นเครื่องช่วยจับจังหวะ ไม่ใช่สัญญาณซื้อขายในตัวเอง"
      ],
      use: "แสดงบนแท็บ AI Analysis โดยตั้งค่า 14 วัน ไม่ได้ใช้ในการคำนวณคะแนนใด ๆ",
      takeaway: "RSI บอกว่าการเคลื่อนไหวล่าสุดยืดตัวไปมากแค่ไหน ช่วยเรื่องจังหวะมากกว่าการเลือกหุ้น"
    }
  },

  i_macd: {
    cat: "tech",
    related: ["i_ema", "i_rsi", "m_slope"],
    formula: "MACD = EMA(12) − EMA(26); Signal = EMA(9) of MACD; Histogram = MACD − Signal",
    where: [
      ["EMA(12), EMA(26)", "Fast and slow exponential moving averages of the closing price", "ค่าเฉลี่ยเคลื่อนที่แบบเอ็กซ์โพเนนเชียลของราคาปิด แบบเร็วและแบบช้า"],
      ["Signal", "A 9-day EMA of the MACD line, used as a trigger line", "EMA 9 วันของเส้น MACD ใช้เป็นเส้นสัญญาณ"],
      ["Histogram", "Gap between MACD and its signal line", "ระยะห่างระหว่าง MACD กับเส้นสัญญาณ"]
    ],
    en: {
      title: "MACD (12, 26, 9)",
      intro: "Tracks the gap between a fast and a slow moving average to show the direction and strength of a trend. Gerald Appel developed it in the late 1970s; the 12/26/9 setting has been the standard ever since.",
      interp: [
        "Low (MACD below signal and below zero): downward momentum is in control.",
        "High (MACD above signal and above zero): upward momentum is in control and building.",
        "Warning: MACD lags price and gives many false crossovers when the stock moves sideways."
      ],
      use: "Shown on the AI Analysis tab with the 12/26/9 setting. Not part of any score.",
      takeaway: "MACD shows whether short-term momentum is pulling ahead of, or falling behind, the longer trend."
    },
    th: {
      title: "MACD (12, 26, 9)",
      intro: "ติดตามระยะห่างระหว่างค่าเฉลี่ยเคลื่อนที่แบบเร็วกับแบบช้า เพื่อแสดงทิศทางและความแรงของแนวโน้ม Gerald Appel พัฒนาขึ้นในช่วงปลายทศวรรษ 1970 และค่า 12/26/9 เป็นมาตรฐานมาตั้งแต่นั้น",
      interp: [
        "ต่ำ (MACD อยู่ใต้เส้นสัญญาณและต่ำกว่าศูนย์): แรงส่งขาลงครองตลาด",
        "สูง (MACD อยู่เหนือเส้นสัญญาณและสูงกว่าศูนย์): แรงส่งขาขึ้นครองตลาดและกำลังเพิ่มขึ้น",
        "ข้อควรระวัง: MACD ตามหลังราคา และให้สัญญาณตัดกันหลอกบ่อยเมื่อหุ้นเคลื่อนไหวออกข้าง"
      ],
      use: "แสดงบนแท็บ AI Analysis ด้วยค่า 12/26/9 ไม่ได้ใช้ในการคำนวณคะแนนใด ๆ",
      takeaway: "MACD แสดงว่าแรงส่งระยะสั้นกำลังแซงหน้าหรือตามหลังแนวโน้มระยะยาว"
    }
  },

  i_bb: {
    cat: "tech",
    related: ["i_rsi", "i_ema", "i_52w"],
    formula: "Middle = SMA(20); Upper = Middle + 2 × σ(20); Lower = Middle − 2 × σ(20)",
    where: [
      ["SMA(20)", "Simple average of the last 20 closing prices", "ค่าเฉลี่ยอย่างง่ายของราคาปิด 20 วันล่าสุด"],
      ["σ(20)", "Standard deviation of those 20 closes", "ส่วนเบี่ยงเบนมาตรฐานของราคาปิด 20 วันนั้น"],
      ["2", "Number of standard deviations for the band width", "จำนวนส่วนเบี่ยงเบนมาตรฐานที่ใช้กำหนดความกว้างของแถบ"]
    ],
    en: {
      title: "Bollinger Bands (20, 2)",
      intro: "A 20-day average with bands two standard deviations above and below it, so the bands widen when the price is volatile and narrow when it is calm. John Bollinger introduced them in the 1980s.",
      interp: [
        "Low (price at or below the lower band): unusually weak relative to the last month — stretched to the downside.",
        "High (price at or above the upper band): unusually strong relative to the last month — stretched to the upside.",
        "Warning: in strong trends price can “walk the band” for a long time; a narrow squeeze often comes before a big move in either direction."
      ],
      use: "Shown on the AI Analysis tab with the 20/2 setting. Not part of any score.",
      takeaway: "Bollinger Bands show whether today's price is ordinary or extreme compared with the past month's range."
    },
    th: {
      title: "Bollinger Bands (20, 2)",
      intro: "ค่าเฉลี่ย 20 วัน พร้อมแถบบนและล่างห่างออกไปสองส่วนเบี่ยงเบนมาตรฐาน แถบจึงกว้างขึ้นเมื่อราคาผันผวนและแคบลงเมื่อราคานิ่ง John Bollinger นำเสนอในทศวรรษ 1980",
      interp: [
        "ต่ำ (ราคาแตะหรือต่ำกว่าแถบล่าง): อ่อนผิดปกติเมื่อเทียบกับเดือนที่ผ่านมา ยืดตัวด้านลบ",
        "สูง (ราคาแตะหรือสูงกว่าแถบบน): แข็งผิดปกติเมื่อเทียบกับเดือนที่ผ่านมา ยืดตัวด้านบวก",
        "ข้อควรระวัง: ในแนวโน้มที่แรง ราคาอาจ “เดินเลียบแถบ” ได้นาน และช่วงที่แถบบีบแคบมักเกิดก่อนการเคลื่อนไหวใหญ่ได้ทั้งสองทิศ"
      ],
      use: "แสดงบนแท็บ AI Analysis ด้วยค่า 20/2 ไม่ได้ใช้ในการคำนวณคะแนนใด ๆ",
      takeaway: "Bollinger Bands บอกว่าราคาวันนี้ปกติหรือสุดโต่งเมื่อเทียบกับกรอบราคาของเดือนที่ผ่านมา"
    }
  },

  i_ema: {
    cat: "tech",
    related: ["i_macd", "m_slope", "i_bb"],
    formula: "EMA today = α × Price today + (1 − α) × EMA yesterday, where α = 2 ÷ (N + 1)",
    where: [
      ["N", "Number of days: 50, 100 or 200", "จำนวนวัน: 50, 100 หรือ 200"],
      ["α", "Smoothing weight given to the newest price", "น้ำหนักที่ให้กับราคาล่าสุด"]
    ],
    en: {
      title: "EMA 50 / 100 / 200",
      intro: "Exponential moving averages that give more weight to recent prices than a simple average does. The 50-, 100- and 200-day lines are widely watched as medium- and long-term trend guides, and many investors treat the 200-day as the dividing line between a healthy and an unhealthy trend.",
      interp: [
        "Low (price below the 200-day, 50 below 200): a long-term downtrend.",
        "High (price above all three, lines stacked 50 > 100 > 200): a healthy, established uptrend.",
        "Warning: moving averages lag; crossovers often happen after much of the move is over."
      ],
      use: "Shown on the AI Analysis tab. Not part of any score; the scored momentum pillar uses a 12-1 month regression instead.",
      takeaway: "Where price sits against its 50/100/200-day EMAs summarises the trend at three time scales in one glance."
    },
    th: {
      title: "EMA 50 / 100 / 200",
      intro: "ค่าเฉลี่ยเคลื่อนที่แบบเอ็กซ์โพเนนเชียลที่ให้น้ำหนักราคาล่าสุดมากกว่าค่าเฉลี่ยอย่างง่าย เส้น 50, 100 และ 200 วันเป็นที่จับตาอย่างกว้างขวางในฐานะตัวบอกแนวโน้มระยะกลางและยาว นักลงทุนจำนวนมากถือเส้น 200 วันเป็นเส้นแบ่งระหว่างแนวโน้มที่แข็งแรงกับไม่แข็งแรง",
      interp: [
        "ต่ำ (ราคาต่ำกว่าเส้น 200 วัน และเส้น 50 อยู่ใต้เส้น 200): แนวโน้มขาลงระยะยาว",
        "สูง (ราคาอยู่เหนือทั้งสามเส้น และเรียงตัว 50 > 100 > 200): ขาขึ้นที่แข็งแรงและตั้งตัวแล้ว",
        "ข้อควรระวัง: ค่าเฉลี่ยเคลื่อนที่ตามหลังราคา การตัดกันมักเกิดหลังจากราคาเคลื่อนไปมากแล้ว"
      ],
      use: "แสดงบนแท็บ AI Analysis ไม่ได้ใช้ในการคำนวณคะแนน เสาโมเมนตัมที่ให้คะแนนใช้การถดถอยช่วง 12-1 เดือนแทน",
      takeaway: "ตำแหน่งของราคาเทียบกับ EMA 50/100/200 สรุปแนวโน้มสามช่วงเวลาได้ในแวบเดียว"
    }
  },

  i_52w: {
    cat: "tech",
    related: ["i_price", "m_slope", "i_bb"],
    formula: "Range position = (Price − 52-week low) ÷ (52-week high − 52-week low) × 100",
    where: [
      ["52-week high / low", "Highest and lowest prices over the past year", "ราคาสูงสุดและต่ำสุดในรอบหนึ่งปี"],
      ["Price", "Latest price", "ราคาล่าสุด"]
    ],
    en: {
      title: "52-week range",
      intro: "Where today's price sits between its lowest and highest points of the past year. George and Hwang (2004) found that stocks trading near their 52-week high tended to keep outperforming, because investors anchor on that level and are slow to push through it.",
      interp: [
        "Low (below 20%): near the yearly low — weak, or possibly a value opportunity if fundamentals hold.",
        "High (above 80%): near the yearly high — strong demand; breaking above it is often a bullish sign.",
        "Warning: a stock with a very narrow range can swing from 0% to 100% on a small move."
      ],
      use: "Shown on the AI Analysis tab. Not part of any score.",
      takeaway: "The 52-week range shows at a glance whether the stock is closer to its yearly peak or its yearly trough."
    },
    th: {
      title: "กรอบราคา 52 สัปดาห์",
      intro: "บอกว่าราคาวันนี้อยู่ตรงไหนระหว่างจุดต่ำสุดกับสูงสุดในรอบปี George และ Hwang (2004) พบว่าหุ้นที่ซื้อขายใกล้ราคาสูงสุด 52 สัปดาห์มักให้ผลตอบแทนดีกว่าต่อไป เพราะนักลงทุนยึดติดกับระดับนั้นและช้าในการดันราคาให้ทะลุ",
      interp: [
        "ต่ำ (ต่ำกว่า 20%): ใกล้จุดต่ำสุดของปี อ่อนแอ หรืออาจเป็นโอกาสถ้าพื้นฐานยังดี",
        "สูง (เกิน 80%): ใกล้จุดสูงสุดของปี ความต้องการแรง การทะลุขึ้นไปมักเป็นสัญญาณบวก",
        "ข้อควรระวัง: หุ้นที่กรอบราคาแคบมากอาจเหวี่ยงจาก 0% ไป 100% ได้ด้วยการขยับเพียงเล็กน้อย"
      ],
      use: "แสดงบนแท็บ AI Analysis ไม่ได้ใช้ในการคำนวณคะแนนใด ๆ",
      takeaway: "กรอบราคา 52 สัปดาห์บอกในแวบเดียวว่าหุ้นอยู่ใกล้ยอดหรือก้นของปี"
    }
  },

  i_vol: {
    cat: "tech",
    related: ["i_price", "i_macd"],
    formula: "Relative volume = Today's volume ÷ Average daily volume over the last 20 days",
    where: [
      ["Today's volume", "Shares traded in the latest session", "จำนวนหุ้นที่ซื้อขายในวันล่าสุด"],
      ["20-day average", "Mean daily shares traded over the previous 20 sessions", "ค่าเฉลี่ยจำนวนหุ้นที่ซื้อขายต่อวันใน 20 วันทำการก่อนหน้า"]
    ],
    en: {
      title: "Volume vs 20-day average",
      intro: "How busy trading is today compared with a normal day over the past month. Volume shows how much conviction sits behind a price move: big moves on heavy volume usually carry more information than the same moves on light trading.",
      interp: [
        "Low (below 0.7×): quiet trading; price moves may not be meaningful.",
        "High (above 1.5×): unusually heavy interest, often around earnings, news or index changes.",
        "Warning: volume spikes on option expiry or index rebalancing days can be purely mechanical."
      ],
      use: "Shown on the AI Analysis tab. Not part of any score.",
      takeaway: "Relative volume tells you whether a price move has real participation behind it."
    },
    th: {
      title: "ปริมาณซื้อขายเทียบค่าเฉลี่ย 20 วัน",
      intro: "วัดว่าวันนี้มีการซื้อขายคึกคักแค่ไหนเมื่อเทียบกับวันปกติในเดือนที่ผ่านมา ปริมาณซื้อขายบอกความมั่นใจที่อยู่เบื้องหลังการเคลื่อนไหวของราคา การขยับแรงพร้อมปริมาณหนาแน่นมักมีความหมายมากกว่าการขยับเท่ากันแต่ซื้อขายเบาบาง",
      interp: [
        "ต่ำ (ต่ำกว่า 0.7 เท่า): ซื้อขายเงียบ การเคลื่อนไหวของราคาอาจไม่มีนัยสำคัญ",
        "สูง (เกิน 1.5 เท่า): ความสนใจสูงผิดปกติ มักเกิดช่วงประกาศงบ มีข่าว หรือมีการปรับดัชนี",
        "ข้อควรระวัง: ปริมาณที่พุ่งในวันหมดอายุออปชันหรือวันปรับพอร์ตดัชนีอาจเป็นแค่กลไกตลาด"
      ],
      use: "แสดงบนแท็บ AI Analysis ไม่ได้ใช้ในการคำนวณคะแนนใด ๆ",
      takeaway: "ปริมาณซื้อขายสัมพัทธ์บอกว่าการเคลื่อนไหวของราคามีผู้ร่วมตลาดหนุนหลังจริงหรือไม่"
    }
  },

  /* ───────────────────────────── DATA & METHODS ───────────────────────────── */

  d_usd: {
    cat: "data",
    related: ["d_slope", "d_ttm", "g_rev"],
    formula: "Value in USD = Value in local currency × Today's exchange rate (USD per unit of local currency)",
    where: [
      ["Local currency", "The currency the company reports in (e.g. TWD, JPY, KRW, EUR)", "สกุลเงินที่บริษัทใช้รายงาน (เช่น TWD, JPY, KRW, EUR)"],
      ["Today's exchange rate", "One current rate applied to every year of history", "อัตราแลกเปลี่ยนปัจจุบันอัตราเดียว ใช้กับข้อมูลทุกปีย้อนหลัง"]
    ],
    en: {
      title: "Currency: all values in USD",
      intro: "Every money figure on the page is shown in US dollars so companies from different countries can be compared directly. Historical figures are converted at today's rate rather than each year's rate, so a trend reflects the company's own performance in its home currency and is not bent by exchange-rate swings.",
      interp: [
        "Low distortion: growth rates and margins are identical to what the company reports in its own currency.",
        "High comparability: sizes (revenue, market cap) line up across US, Asian and European companies.",
        "Warning: past USD amounts will differ from figures quoted elsewhere that used each year's historical exchange rate."
      ],
      use: "Applied to all financial data on the page before any score is calculated. Ratios and percentages are unaffected by the conversion.",
      takeaway: "One exchange rate for all years keeps trends honest while still letting you compare company sizes in dollars."
    },
    th: {
      title: "สกุลเงิน: ทุกค่าเป็น USD",
      intro: "ตัวเลขเงินทุกตัวในหน้านี้แสดงเป็นดอลลาร์สหรัฐ เพื่อให้เปรียบเทียบบริษัทจากต่างประเทศได้โดยตรง ข้อมูลย้อนหลังแปลงด้วยอัตราแลกเปลี่ยนวันนี้ ไม่ใช่อัตราของแต่ละปี แนวโน้มจึงสะท้อนผลงานของบริษัทในสกุลเงินของตัวเอง และไม่ถูกบิดเบือนจากการแกว่งของค่าเงิน",
      interp: [
        "บิดเบือนต่ำ: อัตราเติบโตและอัตรากำไรเท่ากับที่บริษัทรายงานในสกุลเงินของตัวเองทุกประการ",
        "เปรียบเทียบได้สูง: ขนาด (รายได้ มูลค่าตลาด) ของบริษัทสหรัฐ เอเชีย และยุโรปวางเทียบกันได้",
        "ข้อควรระวัง: ตัวเลข USD ในอดีตจะต่างจากที่แหล่งอื่นอ้างถึง ซึ่งใช้อัตราแลกเปลี่ยนของแต่ละปี"
      ],
      use: "ใช้กับข้อมูลการเงินทั้งหมดในหน้านี้ก่อนคำนวณคะแนนใด ๆ อัตราส่วนและเปอร์เซ็นต์ไม่ได้รับผลกระทบจากการแปลงค่า",
      takeaway: "การใช้อัตราแลกเปลี่ยนเดียวกับทุกปีทำให้แนวโน้มตรงไปตรงมา และยังเทียบขนาดบริษัทเป็นดอลลาร์ได้"
    }
  },

  d_pct: {
    cat: "data",
    related: ["growth", "quality", "value", "mom", "d_slope"],
    formula: "Percentile = (Rank − 1) ÷ (N − 1) × 100, with Rank 1 = worst and Rank N = best in the peer group",
    where: [
      ["Rank", "Position of the stock when the peer group is sorted from worst to best", "ลำดับของหุ้นเมื่อเรียงกลุ่มเปรียบเทียบจากแย่ที่สุดไปดีที่สุด"],
      ["N", "Number of stocks with data in the peer group (all 55, or the sector)", "จำนวนหุ้นที่มีข้อมูลในกลุ่มเปรียบเทียบ (ทั้ง 55 ตัว หรือเฉพาะกลุ่มอุตสาหกรรม)"]
    ],
    en: {
      title: "Percentile ranks",
      intro: "Every data-driven sub-metric is turned into a 0–100 percentile: the share of the peer group the stock beats. Ranks ignore the size of the gaps and are not thrown off by extreme outliers, which is why factor researchers commonly use them to combine very different measures.",
      interp: [
        "Low (near 0): among the worst in the peer group on that measure.",
        "High (near 100): among the best in the peer group on that measure.",
        "Warning: a percentile is relative — 90 in a weak peer group can still mean a mediocre absolute number."
      ],
      use: "Growth and momentum rank across all 55 stocks; quality and valuation rank within the stock's sector. For “lower is better” metrics (debt to equity, earnings stability) the order is reversed. Points = weight × percentile ÷ 100.",
      takeaway: "Percentiles turn different units into one common scale: how this stock compares with its peers."
    },
    th: {
      title: "อันดับเปอร์เซ็นไทล์",
      intro: "ตัวชี้วัดย่อยที่คำนวณจากข้อมูลทุกตัวถูกแปลงเป็นเปอร์เซ็นไทล์ 0–100 คือสัดส่วนของกลุ่มเปรียบเทียบที่หุ้นตัวนี้ชนะ การจัดอันดับไม่สนใจขนาดของช่องว่างและไม่ถูกค่าสุดโต่งดึง นักวิจัยด้านปัจจัยการลงทุนจึงนิยมใช้รวมตัวชี้วัดที่ต่างกันมาก",
      interp: [
        "ต่ำ (ใกล้ 0): อยู่ในกลุ่มแย่ที่สุดของกลุ่มเปรียบเทียบในตัวชี้วัดนั้น",
        "สูง (ใกล้ 100): อยู่ในกลุ่มดีที่สุดของกลุ่มเปรียบเทียบในตัวชี้วัดนั้น",
        "ข้อควรระวัง: เปอร์เซ็นไทล์เป็นค่าสัมพัทธ์ ได้ 90 ในกลุ่มที่อ่อนแอ ตัวเลขจริงอาจยังธรรมดา"
      ],
      use: "การเติบโตและโมเมนตัมจัดอันดับเทียบหุ้นทั้ง 55 ตัว คุณภาพและมูลค่าจัดอันดับภายในกลุ่มอุตสาหกรรม สำหรับตัวชี้วัดที่ “ยิ่งต่ำยิ่งดี” (หนี้สินต่อทุน ความเสถียรของกำไร) จะกลับลำดับ คะแนน = น้ำหนัก × เปอร์เซ็นไทล์ ÷ 100",
      takeaway: "เปอร์เซ็นไทล์แปลงหน่วยที่ต่างกันให้อยู่บนมาตรเดียว คือหุ้นตัวนี้เทียบกับกลุ่มแล้วเป็นอย่างไร"
    }
  },

  d_slope: {
    cat: "data",
    related: ["d_ttm", "d_pct", "g_rev", "quality", "value"],
    formula: "Slope b = Σ (t − t̄)(y − ȳ) ÷ Σ (t − t̄)², fitted over 5 points: 4 fiscal years + TTM",
    where: [
      ["t", "Time in years for each data point (TTM placed at its own date)", "เวลาเป็นปีของแต่ละจุดข้อมูล (TTM วางตามวันที่ของตัวเอง)"],
      ["y", "The metric's value at that time (or its log, for growth rates)", "ค่าของตัวชี้วัด ณ เวลานั้น (หรือค่าลอการิทึม สำหรับอัตราเติบโต)"],
      ["t̄, ȳ", "Averages of t and y across the 5 points", "ค่าเฉลี่ยของ t และ y จาก 5 จุด"]
    ],
    en: {
      title: "Trend slope (least squares)",
      intro: "The slope of the straight line that best fits a metric's last five readings, found by ordinary least squares. Using every point instead of only the first and last makes the trend less sensitive to one unusual year.",
      interp: [
        "Low (negative slope): the metric has been deteriorating over the period.",
        "High (positive slope): the metric has been improving steadily.",
        "Warning: five points is a short history; one exceptional year can still tilt the line, so read it with the multi-year average."
      ],
      use: "Growth uses slope only. Quality and valuation use mode both: half the percentile from the slope, half from the multi-year average. Earnings stability uses the level only.",
      takeaway: "The slope tells you the direction and speed of change, which a single year's figure cannot."
    },
    th: {
      title: "ความชันของแนวโน้ม (กำลังสองน้อยที่สุด)",
      intro: "ความชันของเส้นตรงที่ฟิตกับค่าห้าจุดล่าสุดของตัวชี้วัดได้ดีที่สุด คำนวณด้วยวิธีกำลังสองน้อยที่สุด การใช้ทุกจุดแทนที่จะดูแค่จุดแรกกับจุดสุดท้าย ทำให้แนวโน้มไม่อ่อนไหวต่อปีที่ผิดปกติปีเดียว",
      interp: [
        "ต่ำ (ความชันติดลบ): ตัวชี้วัดแย่ลงตลอดช่วงเวลา",
        "สูง (ความชันเป็นบวก): ตัวชี้วัดดีขึ้นอย่างสม่ำเสมอ",
        "ข้อควรระวัง: ห้าจุดเป็นประวัติที่สั้น ปีที่โดดเด่นเพียงปีเดียวยังเอียงเส้นได้ ควรอ่านคู่กับค่าเฉลี่ยหลายปี"
      ],
      use: "เสาการเติบโตใช้เฉพาะความชัน เสาคุณภาพและมูลค่าใช้โหมดผสม: เปอร์เซ็นไทล์ครึ่งหนึ่งจากความชัน อีกครึ่งจากค่าเฉลี่ยหลายปี ส่วนความเสถียรของกำไรใช้เฉพาะระดับ",
      takeaway: "ความชันบอกทิศทางและความเร็วของการเปลี่ยนแปลง ซึ่งตัวเลขปีเดียวบอกไม่ได้"
    }
  },

  d_ttm: {
    cat: "data",
    related: ["d_slope", "d_usd", "v_ey"],
    formula: "TTM = Sum of the last 4 reported quarters (for flows such as revenue, profit, cash flow)",
    where: [
      ["Flows", "Income-statement and cash-flow items, added over 4 quarters", "รายการในงบกำไรขาดทุนและงบกระแสเงินสด รวม 4 ไตรมาส"],
      ["Balances", "Balance-sheet items (assets, debt, cash) taken from the latest quarter", "รายการในงบดุล (สินทรัพย์ หนี้ เงินสด) ใช้ค่าของไตรมาสล่าสุด"]
    ],
    en: {
      title: "TTM (trailing twelve months)",
      intro: "The most recent full year of results, built from the last four reported quarters rather than the last fiscal year. It brings the data up to date between annual reports and is the fifth point in every 5-point trend on this page.",
      interp: [
        "Low TTM versus last fiscal year: results have weakened since the annual report.",
        "High TTM versus last fiscal year: results have improved since the annual report.",
        "Warning: TTM includes any one-off items from the last four quarters and can overlap heavily with the latest fiscal year."
      ],
      use: "Added as the fifth point after 4 fiscal years in all growth, quality and valuation trends and averages.",
      takeaway: "TTM gives the freshest full-year view of the business without waiting for the next annual report."
    },
    th: {
      title: "TTM (สิบสองเดือนล่าสุด)",
      intro: "ผลประกอบการเต็มปีล่าสุด สร้างจากสี่ไตรมาสที่รายงานล่าสุดแทนปีบัญชีล่าสุด ทำให้ข้อมูลทันสมัยระหว่างรอรายงานประจำปี และเป็นจุดที่ห้าของแนวโน้มห้าจุดทุกตัวในหน้านี้",
      interp: [
        "TTM ต่ำกว่าปีบัญชีล่าสุด: ผลประกอบการอ่อนลงนับจากรายงานประจำปี",
        "TTM สูงกว่าปีบัญชีล่าสุด: ผลประกอบการดีขึ้นนับจากรายงานประจำปี",
        "ข้อควรระวัง: TTM รวมรายการพิเศษครั้งเดียวในสี่ไตรมาสล่าสุดด้วย และอาจซ้อนทับกับปีบัญชีล่าสุดมาก"
      ],
      use: "เพิ่มเป็นจุดที่ห้าต่อจาก 4 ปีบัญชี ในทุกแนวโน้มและค่าเฉลี่ยของเสาการเติบโต คุณภาพ และมูลค่า",
      takeaway: "TTM ให้ภาพเต็มปีที่สดใหม่ที่สุดของธุรกิจ โดยไม่ต้องรอรายงานประจำปีฉบับถัดไป"
    }
  },

  d_roe: {
    cat: "data",
    related: ["q_roa", "q_de", "q_gpa"],
    formula: "ROE = Net income ÷ Shareholders' equity × 100",
    where: [
      ["Net income", "Profit after all expenses, interest and tax", "กำไรสุทธิหลังหักค่าใช้จ่าย ดอกเบี้ย และภาษีทั้งหมด"],
      ["Shareholders' equity", "Assets − Liabilities; the owners' book stake", "สินทรัพย์ − หนี้สิน คือส่วนของเจ้าของตามบัญชี"]
    ],
    en: {
      title: "Return on equity (ROE)",
      intro: "Profit earned on the owners' book capital. The DuPont breakdown splits ROE into margin × asset turnover × leverage, which shows its weakness: more debt alone raises ROE, and buybacks that shrink or wipe out equity can make it huge or meaningless.",
      interp: [
        "Low (below 8%): owners' capital earns little.",
        "High (above 20%): strong returns on owners' capital — if leverage is moderate.",
        "Warning: very high or negative ROE usually reflects tiny or negative equity, not exceptional performance."
      ],
      use: "Shown for reference only and not scored. The quality pillar uses ROA and GP/A instead because they are not distorted by leverage or negative equity.",
      takeaway: "ROE is a popular headline number, but read it next to debt to equity before trusting it."
    },
    th: {
      title: "อัตราผลตอบแทนต่อส่วนของผู้ถือหุ้น (ROE)",
      intro: "กำไรที่ได้จากเงินทุนตามบัญชีของเจ้าของ การแยกแบบ DuPont แบ่ง ROE เป็นอัตรากำไร × การหมุนของสินทรัพย์ × ระดับหนี้ ซึ่งเผยจุดอ่อน คือแค่กู้มากขึ้นก็ทำให้ ROE สูงขึ้นได้ และการซื้อหุ้นคืนจนส่วนของผู้ถือหุ้นเหลือน้อยหรือติดลบ ทำให้ ROE สูงลิ่วหรือไม่มีความหมาย",
      interp: [
        "ต่ำ (ต่ำกว่า 8%): เงินทุนของเจ้าของสร้างผลตอบแทนได้น้อย",
        "สูง (เกิน 20%): ผลตอบแทนต่อทุนเจ้าของสูง หากระดับหนี้ไม่มากเกินไป",
        "ข้อควรระวัง: ROE ที่สูงมากหรือติดลบมักสะท้อนส่วนของผู้ถือหุ้นที่น้อยมากหรือติดลบ ไม่ใช่ผลงานที่โดดเด่น"
      ],
      use: "แสดงไว้เพื่ออ้างอิงเท่านั้น ไม่ได้ใช้คิดคะแนน เสาคุณภาพใช้ ROA และ GP/A แทน เพราะไม่ถูกบิดเบือนจากหนี้หรือส่วนของผู้ถือหุ้นติดลบ",
      takeaway: "ROE เป็นตัวเลขยอดนิยม แต่ควรดูคู่กับหนี้สินต่อส่วนของผู้ถือหุ้นก่อนเชื่อ"
    }
  },

  d_fpe: {
    cat: "data",
    related: ["v_ey", "d_eve", "value"],
    formula: "Forward P/E = Share price ÷ Expected earnings per share for the next 12 months (analyst consensus)",
    where: [
      ["Share price", "Latest price", "ราคาล่าสุด"],
      ["Expected EPS", "Average analyst forecast of earnings per share", "ค่าเฉลี่ยประมาณการกำไรต่อหุ้นของนักวิเคราะห์"]
    ],
    en: {
      title: "Forward P/E",
      intro: "How many years of next year's expected profit you pay for in the share price. Unlike the trailing earnings yield used in scoring, it looks ahead, which matters for fast-growing AI companies whose current profit understates what is coming.",
      interp: [
        "Low (below 15): cheap on expected earnings — or analysts expect profits to fall.",
        "High (above 40): the price assumes strong growth beyond next year.",
        "Warning: forecasts are often too optimistic, and they can be revised quickly; a low forward P/E built on a rosy estimate is not really cheap."
      ],
      use: "Shown in the peer comparison table for context. Not scored, because forecasts are not available consistently for all 55 stocks.",
      takeaway: "Forward P/E shows what you pay for next year's expected profit, which is only as good as the forecast."
    },
    th: {
      title: "P/E ล่วงหน้า (Forward P/E)",
      intro: "บอกว่าราคาหุ้นเท่ากับกำไรที่คาดไว้ในปีหน้ากี่ปี ต่างจาก Earnings yield ย้อนหลังที่ใช้คิดคะแนน ตัวนี้มองไปข้างหน้า ซึ่งสำคัญสำหรับบริษัท AI ที่โตเร็วจนกำไรปัจจุบันต่ำกว่าสิ่งที่กำลังจะมา",
      interp: [
        "ต่ำ (ต่ำกว่า 15): ถูกเมื่อเทียบกับกำไรที่คาด หรือนักวิเคราะห์คาดว่ากำไรจะลดลง",
        "สูง (เกิน 40): ราคาคาดหวังการเติบโตแรงต่อเนื่องเกินปีหน้า",
        "ข้อควรระวัง: ประมาณการมักมองโลกในแง่ดีเกินไปและปรับได้เร็ว P/E ล่วงหน้าที่ต่ำเพราะประมาณการสวยหรูไม่ได้ถูกจริง"
      ],
      use: "แสดงในตารางเปรียบเทียบกับคู่แข่งเพื่อเป็นบริบท ไม่ได้ใช้คิดคะแนน เพราะประมาณการไม่มีครบสม่ำเสมอสำหรับหุ้นทั้ง 55 ตัว",
      takeaway: "P/E ล่วงหน้าบอกว่าคุณจ่ายเท่าไรต่อกำไรที่คาดในปีหน้า ซึ่งน่าเชื่อถือเท่ากับประมาณการเท่านั้น"
    }
  },

  d_evs: {
    cat: "data",
    related: ["v_sy", "d_eve", "value"],
    formula: "EV/Sales = Enterprise value ÷ Revenue (TTM)",
    where: [
      ["Enterprise value (EV)", "Market cap + Total debt − Cash", "มูลค่าตลาด + หนี้สินรวม − เงินสด"],
      ["Revenue (TTM)", "Sales over the last twelve months", "ยอดขายในสิบสองเดือนล่าสุด"]
    ],
    en: {
      title: "EV/Sales",
      intro: "The value of the whole firm, debt included, as a multiple of its annual sales. It is the familiar way to quote the same information as the sales-to-EV yield used in scoring, just turned upside down.",
      interp: [
        "Low (below 3×): inexpensive relative to sales, common for hardware and lower-margin businesses.",
        "High (above 15×): the market expects high margins and fast growth for years.",
        "Warning: compare only with similar business models — a 10× software company and a 10× contract manufacturer are not equally priced."
      ],
      use: "Shown in the peer table for reference. The scored version is its inverse, Sales/EV (valuation pillar, 15 points).",
      takeaway: "EV/Sales tells you how many years of current revenue the market is paying for the whole business."
    },
    th: {
      title: "EV/Sales",
      intro: "มูลค่าทั้งกิจการรวมหนี้ คิดเป็นกี่เท่าของยอดขายรายปี เป็นวิธีที่คุ้นเคยในการแสดงข้อมูลเดียวกับอัตรายอดขายต่อ EV ที่ใช้คิดคะแนน เพียงแต่กลับเศษเป็นส่วน",
      interp: [
        "ต่ำ (ต่ำกว่า 3 เท่า): ไม่แพงเมื่อเทียบกับยอดขาย พบบ่อยในธุรกิจฮาร์ดแวร์และธุรกิจมาร์จินต่ำ",
        "สูง (เกิน 15 เท่า): ตลาดคาดหวังอัตรากำไรสูงและการเติบโตเร็วไปอีกหลายปี",
        "ข้อควรระวัง: ควรเทียบเฉพาะธุรกิจที่มีโมเดลคล้ายกัน บริษัทซอฟต์แวร์ 10 เท่ากับผู้รับจ้างผลิต 10 เท่า ไม่ได้มีราคาแพงเท่ากัน"
      ],
      use: "แสดงในตารางเปรียบเทียบเพื่ออ้างอิง เวอร์ชันที่ใช้คิดคะแนนคือส่วนกลับ Sales/EV (เสามูลค่า 15 คะแนน)",
      takeaway: "EV/Sales บอกว่าตลาดจ่ายเงินซื้อธุรกิจทั้งก้อนเท่ากับรายได้ปัจจุบันกี่ปี"
    }
  },

  d_eve: {
    cat: "data",
    related: ["v_eby", "d_evs", "d_fpe", "value"],
    formula: "EV/EBITDA = Enterprise value ÷ EBITDA (TTM)",
    where: [
      ["Enterprise value (EV)", "Market cap + Total debt − Cash", "มูลค่าตลาด + หนี้สินรวม − เงินสด"],
      ["EBITDA (TTM)", "Earnings before interest, tax, depreciation and amortisation over the last twelve months", "กำไรก่อนดอกเบี้ย ภาษี ค่าเสื่อมราคา และค่าตัดจำหน่าย ในสิบสองเดือนล่าสุด"]
    ],
    en: {
      title: "EV/EBITDA",
      intro: "The value of the whole firm as a multiple of its operating cash earnings — the “enterprise multiple” that bankers and acquirers use most often. The scored valuation pillar uses the same numbers flipped into a yield (EBITDA/EV).",
      interp: [
        "Low (below 10×): inexpensive for the cash earnings the business produces.",
        "High (above 30×): the market expects earnings to grow strongly from here.",
        "Warning: negative EBITDA makes the multiple meaningless, which is one reason the page scores the yield version instead."
      ],
      use: "Shown in the peer table for reference. The scored version is its inverse, EBITDA/EV (valuation pillar, 25 points).",
      takeaway: "EV/EBITDA is the standard takeover-style price tag: what the whole business costs per dollar of operating cash earnings."
    },
    th: {
      title: "EV/EBITDA",
      intro: "มูลค่าทั้งกิจการคิดเป็นกี่เท่าของกำไรเงินสดจากการดำเนินงาน เป็น “enterprise multiple” ที่วาณิชธนากรและผู้ซื้อกิจการใช้บ่อยที่สุด เสามูลค่าที่ใช้คิดคะแนนใช้ตัวเลขชุดเดียวกันแต่กลับเป็นอัตราผลตอบแทน (EBITDA/EV)",
      interp: [
        "ต่ำ (ต่ำกว่า 10 เท่า): ไม่แพงเมื่อเทียบกับกำไรเงินสดที่ธุรกิจสร้างได้",
        "สูง (เกิน 30 เท่า): ตลาดคาดว่ากำไรจะเติบโตแรงจากนี้",
        "ข้อควรระวัง: EBITDA ติดลบทำให้ตัวคูณไม่มีความหมาย นี่คือเหตุผลหนึ่งที่หน้านี้ใช้แบบอัตราผลตอบแทนคิดคะแนนแทน"
      ],
      use: "แสดงในตารางเปรียบเทียบเพื่ออ้างอิง เวอร์ชันที่ใช้คิดคะแนนคือส่วนกลับ EBITDA/EV (เสามูลค่า 25 คะแนน)",
      takeaway: "EV/EBITDA เป็นป้ายราคาแบบที่ใช้ในการซื้อกิจการ คือธุรกิจทั้งก้อนมีราคาเท่าไรต่อกำไรเงินสดจากการดำเนินงานหนึ่งดอลลาร์"
    }
  },
  d_panel: {
    cat: "data",
    related: ["moat", "opp", "d_pct"],
    formula: "Panel sub-score = Σ (weight × model score) ÷ Σ weight, over the models that scored the stock",
    where: [
      ["Model score", "One model’s 0–20 score for one moat or opportunity part, judged with the same written rubric", "คะแนน 0–20 ของโมเดลหนึ่งสำหรับคูเมืองหรือโอกาสหนึ่งด้าน ให้คะแนนด้วยเกณฑ์เดียวกัน"],
      ["Weight", "How much each model counts (equal by default; set in ai-accounts.json, judges)", "น้ำหนักของแต่ละโมเดล (เท่ากันโดยค่าเริ่มต้น ตั้งได้ใน ai-accounts.json ส่วน judges)"]
    ],
    en: {
      title: "AI judging panel",
      intro: "The moat and AI-opportunity scores are judgements, not formulas. Instead of trusting one model, up to three high-effort models (Claude Opus 5.5, Gemini 4 Neon High, GPT-6.2 Sol) score every stock independently with the same rubric, one sector at a time so the scores are calibrated against peers. The page shows the weighted average and each model’s own total. Averaging independent judges reduces any single model’s bias — the same idea as averaging several analysts’ estimates.",
      interp: [
        "Models agree (totals within ~5 points): the judgement is robust.",
        "Models disagree (gap of 10+ points): treat the score as uncertain and read each model’s reasoning.",
        "Warning: only signed-in models score; with one model there is no averaging, and a stock not yet scored falls back to the hand-set score."
      ],
      use: "Sets the 5 moat and 5 AI-opportunity sub-scores (0–20 each), which give the Moat and AI-opportunity pillars. Refresh with Update → AI judgment.",
      takeaway: "Several independent AI judges, averaged, give a steadier judgement than any single model."
    },
    th: {
      title: "คณะกรรมการ AI",
      intro: "คะแนนคูเมืองและโอกาสจาก AI เป็นการประเมินเชิงคุณภาพ ไม่ใช่สูตร แทนที่จะเชื่อโมเดลเดียว โมเดลระดับสูงสุดถึงสามตัว (Claude Opus 5.5, Gemini 4 Neon High, GPT-6.2 Sol) ให้คะแนนหุ้นทุกตัวแยกกันด้วยเกณฑ์เดียวกัน ทีละกลุ่มอุตสาหกรรมเพื่อให้เทียบกับคู่แข่งได้ หน้าเว็บแสดงค่าเฉลี่ยถ่วงน้ำหนักและคะแนนรวมของแต่ละโมเดล การเฉลี่ยผู้ประเมินที่เป็นอิสระต่อกันช่วยลดอคติของโมเดลใดโมเดลหนึ่ง เหมือนการเฉลี่ยประมาณการของนักวิเคราะห์หลายคน",
      interp: [
        "โมเดลเห็นตรงกัน (คะแนนรวมต่างกันไม่เกินราว 5): การประเมินน่าเชื่อถือ",
        "โมเดลเห็นต่างกัน (ต่างกัน 10 คะแนนขึ้นไป): ถือว่าคะแนนไม่แน่นอนและควรอ่านเหตุผลของแต่ละโมเดล",
        "ข้อควรระวัง: เฉพาะโมเดลที่ลงชื่อเข้าใช้เท่านั้นที่ให้คะแนน ถ้ามีโมเดลเดียวจะไม่มีการเฉลี่ย และหุ้นที่ยังไม่ถูกประเมินจะใช้คะแนนที่ตั้งด้วยมือ"
      ],
      use: "กำหนดคะแนนย่อยของคูเมือง 5 ด้านและโอกาสจาก AI 5 ด้าน (ด้านละ 0–20) ซึ่งรวมเป็นเสาคูเมืองและโอกาสจาก AI อัปเดตได้ที่ อัปเดต → การประเมินโดย AI",
      takeaway: "ผู้ประเมิน AI หลายตัวที่เป็นอิสระต่อกันเมื่อนำมาเฉลี่ย ให้ผลที่นิ่งกว่าโมเดลเดียว"
    }
  }
};
