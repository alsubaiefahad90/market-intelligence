import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const userMemory = {};

// 🔍 بحث
async function webSearch(query) {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
    );
    const data = await res.json();
    return (
      data.Abstract ||
      data.RelatedTopics?.slice(0, 3).map((t) => t.Text).join("\n") ||
      ""
    );
  } catch {
    return "";
  }
}

// 🧠 GPT
async function askGPT(messages) {
  const res = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages,
    temperature: 0.5,
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
      temperature: 0.5,
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// 🔥 الدمج
async function fuse(gpt, claude, web, systemPrompt) {
  const res = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `
مصادر:

GPT:
${gpt}

Claude:
${claude}

Web:
${web}

ادمجها في نتيجة واحدة قوية + اطرح أسئلة ذكية.
`,
      },
    ],
    temperature: 0.4,
  });

  return res.choices[0].message.content;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const input = body.input;
    const userId = body.userId || "default";

    if (!userMemory[userId]) {
      userMemory[userId] = [];
    }

    const memory = userMemory[userId];

    memory.push({ role: "user", content: input });

    const systemPrompt = `
أنت نظام ذكاء استراتيجي متعدد النماذج.

- مباشر
- حازم
- بدون حشو

رد بنفس لغة المستخدم.

اكتب بهذا الشكل:

التحليل:
...

الواقع:
- ...

الفرص:
1) ...

القرار:
...

التنفيذ:
...

الأسئلة:
- ...
- ...
`;

    const base = [
      { role: "system", content: systemPrompt },
      ...memory.slice(-6),
    ];

    const web = await webSearch(input);

    const [gpt, claude] = await Promise.all([
      askGPT(base),
      askClaude(base),
    ]);

    const final = await fuse(gpt, claude, web, systemPrompt);

    memory.push({ role: "assistant", content: final });

    return Response.json({ output: final });
  } catch (err) {
    return Response.json({ error: err.message });
  }
}
