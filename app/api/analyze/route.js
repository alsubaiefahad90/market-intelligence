import { saveMemory, getMemory } from "../../../../lib/memory";

export async function POST(req) {
  try {
    const body = await req.json();

    // 🧠 استرجاع الذاكرة
    const history = getMemory();

    const context = history
      .map((h) => `طلب سابق: ${h.input}\nنتيجة: ${h.output}`)
      .join("\n\n");

    // 🧠 نظام التفكير (مختصر وسريع)
    const systemPrompt = `
أنت محلل سوق ذكي.
أعطِ تحليل واضح + فرص قابلة للتنفيذ.
ارجع النتيجة بصيغة JSON فقط بهذا الشكل:

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
    "term": "short/medium/long"
  },
  "execution": "..."
}
`;

    // 🔥 طلب OpenAI
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ⚡ سريع + ذكي
        input: `${systemPrompt}\n\n${context}\n\nتحليل:\n${body.input}`,
        temperature: 0.7,
        max_output_tokens: 500,
      }),
    });

    const data = await response.json();

    // 🛑 لو فيه خطأ (مهم جدًا)
    if (data.error) {
      return Response.json({ error: data.error });
    }

    // 🧠 استخراج النص
    const output =
      data.output?.[0]?.content?.[0]?.text || JSON.stringify(data);

    // 💾 حفظ في الذاكرة
    saveMemory({
      input: body.input,
      output: output,
    });

    return Response.json({ output });
  } catch (error) {
    return Response.json({ error: error.message });
  }
}
