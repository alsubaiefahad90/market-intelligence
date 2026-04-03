import { saveMemory, getMemory } from "../../../lib/memory";

export async function POST(req) {
  const body = await req.json();

  // 1. استرجاع السياق من الذاكرة
  const history = getMemory();
  const context = history.map(h =>
    `طلب سابق: ${h.input}\nنتيجة: ${h.output}`
  ).join("\n\n");

  // 2. إعداد التوجيهات للنظام
  const systemPrompt = `
أنت نظام ذكاء استثماري متقدم. مهمتك تحليل الأسواق واستخراج فرص حقيقية.
يجب أن يكون الرد بصيغة JSON فقط كما يلي:
{
  "market_analysis": "تحليل عام للمشهد",
  "sectors": ["قطاع 1", "قطاع 2"],
  "opportunities": [
    {
      "title": "اسم الفرصة",
      "reason": "لماذا الآن؟",
      "hidden_edge": "الميزة التنافسية"
    }
  ],
  "decision": {
    "entry": "yes/no",
    "risk": "low/medium/high",
    "term": "short/long"
  },
  "execution": "خطة العمل"
}
السياق السابق:
${context}
`;

  // 3. الاتصال بـ OpenAI
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 1000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: body.input }
      ]
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return Response.json({ error: data });
  }

  // 4. تنظيف ومعالجة المخرجات
  let output = data.choices?.[0]?.message?.content || "{}";
  output = output.replace(/```json/g, "").replace(/```/g, "").trim();

  // 5. حفظ العملية في الذاكرة
  saveMemory({
    input: body.input,
    output: output
  });

  return Response.json({
    success: true,
    data: output
  });
}
