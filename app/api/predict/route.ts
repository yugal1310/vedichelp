export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Only validate; do NOT return PII
    const dob = String(body?.dob ?? "").trim();
    const tob = String(body?.tob ?? "").trim();
    const place = String(body?.place ?? "").trim();
    if (!dob || !tob || !place) {
      return Response.json({ error: "dob, tob, and place are required" }, { status: 400 });
    }

    return Response.json({
      engineVersion: "0.1.0",
      summary: "A basic reading generated from your birth details.",
      personality: ["Analytical", "Measured decision-maker"],
      themes: ["Discipline-driven progress", "Strategy over speed"],
      monthByMonth: [
        { month: "Jan", score: 6, note: "Reset and planning" },
        { month: "Feb", score: 7, note: "Better focus" },
        // ...we will fill all 12 later
      ],
      confidence: "low",
      trace: [{ ruleId: "MVP-001" }],
    });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
