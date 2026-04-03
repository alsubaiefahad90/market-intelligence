"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();

    const botMessage = {
      role: "bot",
      content: JSON.stringify(data, null, 2),
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <h1>QATNAN AI</h1>

      {/* الرسائل */}
      <div style={{ marginBottom: "20px" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                background: msg.role === "user" ? "#d1e7ff" : "#f1f1f1",
              }}
            >
              <pre style={{ margin: 0 }}>{msg.content}</pre>
            </div>
          </div>
        ))}
      </div>

      {/* الإدخال */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب سؤالك..."
          style={{ flex: 1, padding: "10px" }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </main>
  );
}
