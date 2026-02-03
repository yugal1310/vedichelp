"use client";

import { useState } from "react";

type ApiResponse = {
  engineVersion?: string;
  summary?: string;
  themes?: string[];
  personality?: string[];
  monthByMonth?: { month: string; score: number; note: string }[];
  confidence?: string;
  trace?: { ruleId: string; source?: string }[];
};

export default function Home() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState("");

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
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
      <h1 style={{ fontSize: 30, fontWeight: 800 }}>Astrology MVP</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        Enter birth details to generate a basic reading.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: 20,
          display: "grid",
          gap: 14,
          padding: 16,
          border: "1px solid #2a2a2a",
          borderRadius: 12,
        }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>Name (optional)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{ padding: 10, borderRadius: 8, border: "1px solid #333" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Date of Birth</span>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            style={{ padding: 10, borderRadius: 8, border: "1px solid #333" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Time of Birth</span>
          <input
            type="time"
            value={tob}
            onChange={(e) => setTob(e.target.value)}
            required
            style={{ padding: 10, borderRadius: 8, border: "1px solid #333" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Place of Birth</span>
          <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            required
            placeholder="City, State, Country"
            style={{ padding: 10, borderRadius: 8, border: "1px solid #333" }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid #333",
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && (
        <p style={{ marginTop: 16, color: "crimson" }}>
          Error: {error}
        </p>
      )}

      {response && (
        <section
          style={{
            marginTop: 22,
            padding: 16,
            border: "1px solid #2a2a2a",
            borderRadius: 12,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Report</h2>

          {response.summary && (
            <p style={{ marginTop: 10, opacity: 0.9 }}>{response.summary}</p>
          )}

          <div style={{ marginTop: 14 }}>
            <h3 style={{ fontWeight: 800 }}>Themes</h3>
            <ul style={{ marginTop: 6 }}>
              {(response.themes || []).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 14 }}>
            <h3 style={{ fontWeight: 800 }}>Personality</h3>
            <ul style={{ marginTop: 6 }}>
              {(response.personality || []).map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 14 }}>
            <h3 style={{ fontWeight: 800 }}>Month-by-month</h3>
            <table style={{ width: "100%", marginTop: 8, borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #333", padding: 8 }}>
                    Month
                  </th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #333", padding: 8 }}>
                    Score
                  </th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #333", padding: 8 }}>
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {(response.monthByMonth || []).map((m) => (
                  <tr key={m.month}>
                    <td style={{ borderBottom: "1px solid #222", padding: 8 }}>{m.month}</td>
                    <td style={{ borderBottom: "1px solid #222", padding: 8 }}>{m.score}</td>
                    <td style={{ borderBottom: "1px solid #222", padding: 8 }}>{m.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <details style={{ marginTop: 14 }}>
            <summary style={{ cursor: "pointer", fontWeight: 800 }}>Why (Trace)</summary>
            <ul style={{ marginTop: 8 }}>
              {(response.trace || []).map((x) => (
                <li key={x.ruleId}>
                  {x.ruleId}
                  {x.source ? ` — ${x.source}` : ""}
                </li>
              ))}
            </ul>
          </details>

          {response.engineVersion && (
            <p style={{ marginTop: 12, opacity: 0.7 }}>
              Engine: {response.engineVersion}
            </p>
          )}
        </section>
      )}
    </main>
  );
}
