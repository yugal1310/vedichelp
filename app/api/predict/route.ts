export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dob = String(body?.dob ?? "").trim();
    const tob = String(body?.tob ?? "").trim();
    const place = String(body?.place ?? "").trim();

    if (!dob || !tob || !place) {
      return Response.json({ error: "dob, tob, and place are required" }, { status: 400 });
    }

    // DO NOT return name/dob/tob/place back to the browser
    return Response.json({
      output: {
        themes: ["Discipline", "Structured growth"],
        personality: ["Analytical", "Focused"],
      },
      trace: [{ ruleId: "MVP-001", source: "placeholder", fired: true }],
    });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
