"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ input }),
    });

    const data = await res.json();

    try {
      const parsed = JSON.parse(data.output);
      setResult(parsed);
    } catch {
      console.log("Parsing error", data);
    }

    setLoading(false);
  };

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        🚀 AI Market Intelligence
      </h1>

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="اكتب السوق أو الفكرة..."
        style={{
          width: "100%",
          height: "120px",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <button onClick={analyze} style={{ padding: "10px 20px" }}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {/* Results */}
      {result && (
        <div style={{ marginTop: "40px" }}>
          {/* Market Analysis */}
          <div style={card}>
            <h2>📊 Market Analysis</h2>
            <p>{result.market_analysis}</p>
          </div>

          {/* Sectors */}
          <div style={card}>
            <h2>🏭 Sectors</h2>
            <ul>
              {result.sectors.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div style={card}>
            <h2>💡 Opportunities</h2>
            {result.opportunities.map((op, i) => (
              <div key={i} style={innerCard}>
                <h3>{op.title}</h3>
                <p><b>Reason:</b> {op.reason}</p>
                <p><b>Edge:</b> {op.hidden_edge}</p>
              </div>
            ))}
          </div>

          {/* Decision */}
          <div style={card}>
            <h2>🎯 Decision</h2>
            <p>Entry: {result.decision.entry}</p>
            <p>Risk: {result.decision.risk}</p>
            <p>Term: {result.decision.term}</p>
          </div>

          {/* Execution */}
          <div style={card}>
            <h2>⚙️ Execution</h2>
            <p>{result.execution}</p>
          </div>
        </div>
      )}
    </main>
  );
}

const card = {
  background: "#f5f5f5",
  padding: "20px",
  marginBottom: "20px",
  borderRadius: "10px",
};

const innerCard = {
  background: "#fff",
  padding: "15px",
  marginTop: "10px",
  borderRadius: "8px",
};
