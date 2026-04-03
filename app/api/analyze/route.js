import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 ذاكرة خفيفة
let memory = [];

// 🔍 بحث من الإنترنت (DuckDuckGo API مجاني)
async function webSearch(query) {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
    );
    const data = await res.json();

    return data.Abstract || data.RelatedTopics?.slice(0, 3)
      .map((t) => t.Text)
      .join("\n") || "";
  } catch {
    return "";
  }
}

// 🧠 GPT
async function askGPT(messages) {
  const res = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages,
    temperature: 0.7,
  });
  return res.choices[0].message.content;
}

// 🤖 Claude
async function askClaude(messages) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "anthropic/claude-3-haiku",
      messages,
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// 🔥 الدمج النهائي (العقل الحقيقي)
async function fuse(gpt, claude, web) {
  const res = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: [
      {
        role: "system",
        content: `
أنت نظام ذكاء خارق.

عندك:
1) جواب GPT
2) جواب Claude
3) معلومات من الإنترنت

مهمتك:
- دمجهم
- حذف التكرار
- إضافة تحليل ذكي

اكتب الرد بهذا الشكل:

🧠 التحليل:
...

📊 النقاط المهمة:
...

💡 الفرص / الأفكار:
...

🎯 القرار:
...

⚡ التنفيذ:
...
`,
      },
      {
        role: "user",
        content: `
GPT:
${gpt}

Claude:
${claude}

Web:
${web}
`,
      },
    ],
  });

  return res.choices[0].message.content;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const input = body.input;

    memory.push({ role: "user", content: input });

    // 🔍 بحث
    const web = await webSearch(input);

    const base = [
      {
        role: "system",
        content: "أنت مساعد ذكي يجاوب بوضوح وبنفس لغة المستخدم",
      },
      ...memory.slice(-6),
    ];

    // ⚡ استدعاء متعدد
    const [gpt, claude] = await Promise.all([
      askGPT(base),
      askClaude(base),
    ]);

    // 🔥 الدمج
    const final = await fuse(gpt, claude, web);

    memory.push({ role: "assistant", content: final });

    return Response.json({ output: final });
  } catch (err) {
    return Response.json({ error: err.message });
  }
}
