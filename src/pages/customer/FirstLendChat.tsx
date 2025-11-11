import React, { useState } from "react";

function FirstLendChat() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:5128/api/Gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prompt),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setResponse(`Error: ${errorData.title || "Unknown error"}`);
      } else {
        const data = await res.text();
        setResponse(data);
      }
    } catch (err: any) {
      setResponse(`Request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>FirstLend Chat</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
          placeholder="Ask about our loans, repayment, or interest rates..."
        />
        <button
          type="submit"
          style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
      {response && (
        <div
          style={{
            marginTop: "1rem",
            whiteSpace: "pre-wrap",
            background: "#f4f4f4",
            padding: "1rem",
            borderRadius: "4px",
          }}
        >
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default FirstLendChat;
