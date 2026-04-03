"use client";
import { useState } from "react";

const getUserId = () => {
  let id = localStorage.getItem("user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("user_id", id);
  }
  return id;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input) return;

    const userMsg = { type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const userId = getUserId();

    setInput("");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input, userId }),
    });

    const data = await res.json();

    const aiMsg = { type: "ai", text: data.output };
    setMessages((prev) => [...prev, aiMsg]);
  };

  function extractQuestions(text) {
    const match = text.split("الأسئلة:");
    return match[1] || "";
  }

  return (
    <main style={{ padding: 30, maxWidth: 800, margin: "auto" }}>
      <h1>AI Engine</h1>

      {messages.map((msg, i) => (
        <div key={i} style={{ marginBottom: 15 }}>
          {msg.type === "user" ? (
            <div style={{ textAlign: "right" }}>{msg.text}</div>
          ) : (
            <div style={{ background: "#eee", padding: 10 }}>
              <pre>{msg.text}</pre>

              <div>
                {extractQuestions(msg.text)
                  .split("\n")
                  .filter((q) => q.trim())
                  .map((q, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setInput(q.replace("-", "").trim())
                      }
                      style={{ margin: 4 }}
                    >
                      {q}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ flex: 1 }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </main>
  );
}
