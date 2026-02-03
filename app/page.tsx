"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState(""); // YYYY-MM-DD
  const [tob, setTob] = useState(""); // HH:MM
  const [place, setPlace] = useState("");

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob, tob, place }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Request failed");
      setResponse(json);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Astrology MVP</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Enter birth details to generate a basic reading.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: 20, display: "grid", gap: 12 }}>
        <label>
          Name (optional)
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
            placeholder="Yugal Shah"
          />
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Time of Birth
          <input
            type="time"
            value={tob}
            onChange={(e) => setTob(e.target.value)}
            required
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Place of Birth
          <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            required
            style={{ width: "100%", padding: 10, marginTop: 6 }}
            placeholder="Petlad, Anand, India"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 12, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && <p style={{ marginTop: 16, color: "crimson" }}>Error: {error}</p>}

      {response && (
        <pre
          style={{
            marginTop: 16,
            padding: 16,
            background: "#111",
            color: "#0f0",
            borderRadius: 8,
            overflowX: "auto",
          }}
        >
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </main>
  );
}
