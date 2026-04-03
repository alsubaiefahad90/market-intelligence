"use client";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    const currentInput = input;
    setInput("");

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ input: currentInput }),
    });

    const data = await res.json();

    let aiMsg = { role: "ai", content: data.output };

    try {
      aiMsg.parsed = JSON.parse(data.output);
    } catch {}

    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <main style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>QATNAN AI</h1>
        <p>Strategic Intelligence</p>
      </div>

      {/* Chat */}
      <div style={styles.chat}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf:
                msg.role === "user" ? "flex-end" : "flex-start",
              background:
                msg.role === "user" ? "#000" : "#f2f2f2",
              color:
                msg.role === "user" ? "#fff" : "#000",
            }}
          >
            {msg.parsed ? (
              <StructuredResponse data={msg.parsed} />
            ) : (
              msg.content
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب سؤالك..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </main>
  );
}

// 🎯 عرض التحليل بشكل مرتب
function StructuredResponse({ data }) {
  return (
    <div>
      <p><b>📊 Analysis:</b> {data.market_analysis}</p>

      <p><b>🏭 Sectors:</b></p>
      <ul>
        {data.sectors?.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <p><b>💡 Opportunities:</b></p>
      {data.opportunities?.map((op, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <b>{op.title}</b>
          <p>{op.reason}</p>
          <small>{op.hidden_edge}</small>
        </div>
      ))}

      <p><b>🎯 Decision:</b></p>
      <p>
        {data.decision?.entry} | {data.decision?.risk} | {data.decision?.term}
      </p>

      <p><b>⚙️ Execution:</b> {data.execution}</p>
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "sans-serif",
  },
  header: {
    padding: "20px",
    borderBottom: "1px solid #eee",
  },
  chat: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
  },
  message: {
    padding: "12px",
    borderRadius: "10px",
    maxWidth: "70%",
  },
  inputBox: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #eee",
  },
  input: {
    flex: 1,
    padding: "10px",
    marginRight: "10px",
  },
  button: {
    padding: "10px 20px",
  },
};
