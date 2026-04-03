"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleAnalyze = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setResult(data.data);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>AI Engine</h1>

      <textarea
        rows="6"
        style={{ width: "100%" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <br /><br />

      <button onClick={handleAnalyze}>
        Analyze
      </button>

      <pre style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
        {result}
      </pre>
    </div>
  );
}
