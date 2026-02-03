{response && (
  <div style={{ marginTop: 24 }}>
    <h2 style={{ fontSize: 20, fontWeight: 700 }}>Report</h2>

    <p style={{ marginTop: 8 }}>{response.summary}</p>

    <h3 style={{ marginTop: 16, fontWeight: 700 }}>Themes</h3>
    <ul>
      {(response.themes || []).map((t: string) => (
        <li key={t}>{t}</li>
      ))}
    </ul>

    <h3 style={{ marginTop: 16, fontWeight: 700 }}>Personality</h3>
    <ul>
      {(response.personality || []).map((p: string) => (
        <li key={p}>{p}</li>
      ))}
    </ul>

    <h3 style={{ marginTop: 16, fontWeight: 700 }}>Month-by-month</h3>
    <table style={{ width: "100%", marginTop: 8, borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>Month</th>
          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>Score</th>
          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>Note</th>
        </tr>
      </thead>
      <tbody>
        {(response.monthByMonth || []).map((m: any) => (
          <tr key={m.month}>
            <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{m.month}</td>
            <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{m.score}</td>
            <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{m.note}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <details style={{ marginTop: 16 }}>
      <summary style={{ cursor: "pointer" }}>Why (Trace)</summary>
      <ul>
        {(response.trace || []).map((x: any) => (
          <li key={x.ruleId}>{x.ruleId}</li>
        ))}
      </ul>
    </details>
  </div>
)}
