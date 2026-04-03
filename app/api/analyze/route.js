import { saveMemory, getMemory } from "../../../lib/memory";

export async function POST(req) {
  const body = await req.json();

  // 🧠 استرجاع الذاكرة
  const history = getMemory();

  const context = history.map(h =>
    `طلب سابق:\n${h.input}\nنتيجة:\n${h.output}`
  ).join("\n\n");

  // 🧠 نظام التفكير
  const systemPrompt = `
أنت نظام ذكاء استثماري واستراتيجي متقدم.

مهمتك:
تحليل الأسواق واستخراج فرص حقيقية قابلة للتنفيذ.

اعمل وفق هذا الهيكل فقط:

{
  "market_analysis": "...",
  "sectors": ["...", "..."],
  "opportunities": [
    {
      "title": "...",
      "reason": "...",
      "hidden_edge": "..."
    }
  ],
  "decision": {
    "entry": "yes/no",
    "risk": "low/medium/high",
    "term": "short/long"
  },
  "execution": "..."
}

❗ قواعد صارمة:
- أرجع JSON فقط
- لا تكتب أي نص خارج JSON
- اربط كل شيء بتحليل منطقي
- لا تعطي كلام عام

السياق السابق:
${context}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: body.input }
      ]
    }),
  });

const data = await response.json();

if (!response.ok) {
  return Response.json({
    error: data
  });
}

let output = data.choices?.[0]?.message?.content || "{}";
  
  // 🧹 التعديل الأمني: تنظيف المخرجات من علامات Markdown لحماية الموقع
  output = output.replace(/```json/g, "").replace(/```/g, "").trim();

  // 💾 حفظ في الذاكرة
  saveMemory({
    input: body.input,
    output: output
  });

  return Response.json({
  success: true,
  raw: data,
  output: output
});
