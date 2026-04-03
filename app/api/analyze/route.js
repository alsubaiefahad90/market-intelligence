import OpenAI from "openai";

let memory = [];

export async function POST(req) {
  try {
    const body = await req.json();
    const input = body.input;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 🧠 ذاكرة بسيطة
    const context = memory
      .slice(-5)
      .map((m) => `سؤال: ${m.input}\nجواب: ${m.output}`)
      .join("\n\n");

    const prompt = `
أنت نظام ذكاء استثماري واستراتيجي متقدم.

تفكيرك:
- لا تعطي إجابات سطحية
- ابحث عن العلاقات المخفية
- اربط بين الاقتصاد والتقنية والتنظيم
- استخرج فرص غير واضحة

السياق السابق:
${context}

حلل الطلب التالي بعمق:

${input}

أعطِ:
1. تحليل السوق
2. القطاعات
3. 1-3 فرص حقيقية (مع سبب + ميزة مخفية)
4. قرار (دخول / مخاطرة / مدة)
5. طريقة التنفيذ
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      temperature: 0.7,
    });

    const text =
      response.output?.[0]?.content?.[0]?.text || "لا يوجد رد";

    // 💾 حفظ في الذاكرة
    memory.push({
      input,
      output: text,
    });

    return Response.json({
      market_analysis: text,
    });
  } catch (error) {
    return Response.json({
      error: error.message,
    });
  }
}
