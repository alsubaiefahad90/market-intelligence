"use client";
import { useState } from "react";

export default function TestPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  async function handleAnalyze() {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setOutput(data.output);
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>AI Engine</h1>

      <textarea
        placeholder="اكتب Signal هنا..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", height: 150 }}
      />

      <br /><br />

      <button onClick={handleAnalyze}>
        Analyze
      </button>

      <pre style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
        {output}
      </pre>
    </main>
  );
}
