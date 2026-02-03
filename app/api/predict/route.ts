// app/api/predict/route.ts

type MonthOutlook = { month: string; score: number; note: string };

async function geocodePlace(place: string): Promise<{ lat: number; lon: number }> {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
    encodeURIComponent(place);

  const res = await fetch(url, {
    headers: {
      // Nominatim requests a user-agent. Keep it simple.
      "User-Agent": "vedichelp/1.0",
    },
  });

  if (!res.ok) throw new Error("Geocoding failed. Try a more specific place.");

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Place not found. Try: City, State, Country");
  }

  return { lat: Number(data[0].lat), lon: Number(data[0].lon) };
}

function buildMonths(): MonthOutlook[] {
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  // MVP baseline: always return 12 months. We’ll replace scores/notes with real logic later.
  return months.map((m) => ({
    month: m,
    score: 5,
    note: "Baseline outlook (MVP).",
  }));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // We accept these inputs, but we do NOT return them back.
    const dob = String(body?.dob ?? "").trim(); // YYYY-MM-DD
    const tob = String(body?.tob ?? "").trim(); // HH:MM
    const place = String(body?.place ?? "").trim();

    if (!dob || !tob || !place) {
      return Response.json(
        { error: "dob, tob, and place are required" },
        { status: 400 }
      );
    }

    const { lat, lon } = await geocodePlace(place);

    // Placeholder “engine” output for now. Next steps will compute a real chart + rules.
    const response = {
      engineVersion: "0.2.0",
      summary:
        "This is a baseline reading while we build the full astrology engine (chart + rules).",
      themes: ["Consistency pays off", "Clarity improves decisions", "Steady progress"],
      personality: ["Analytical", "Goal-oriented", "Prefers structure"],
      monthByMonth: buildMonths(),
      confidence: "low",
      meta: {
        // Safe metadata: no raw place string, no dob/tob echoed back
        location: { lat, lon },
      },
      trace: [
        { ruleId: "MVP-BASELINE", source: "engine placeholder" },
        { ruleId: "GEO-OK", source: "nominatim" },
      ],
    };

    return Response.json(response);
  } catch (e: any) {
    return Response.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
