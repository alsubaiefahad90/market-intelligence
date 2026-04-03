"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();

    const botMsg = {
      role: "bot",
      content: data.market_analysis || JSON.stringify(data),
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>QATNAN AI</h1>
      <p style={styles.subtitle}>Strategic Intelligence Engine</p>

      {/* الرسائل */}
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background:
                msg.role === "user" ? "#000" : "#f1f1f1",
              color: msg.role === "user" ? "#fff" : "#000",
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* الإدخال */}
      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب سؤالك التحليلي..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.button}>
          إرسال
        </button>
      </div>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "auto",
    padding: "40px",
    fontFamily: "system-ui",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  subtitle: {
    color: "#666",
    marginBottom: "20px",
  },
  chatBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minHeight: "400px",
    border: "1px solid #eee",
    padding: "20px",
    borderRadius: "10px",
    background: "#fafafa",
    marginBottom: "15px",
  },
  message: {
    padding: "10px 15px",
    borderRadius: "10px",
    maxWidth: "70%",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#000",
    color: "#fff",
    cursor: "pointer",
  },
};
