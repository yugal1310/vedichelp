// app/api/predict/route.ts

type MonthOutlook = { month: string; score: number; note: string };

// ---------- PLACE → LAT/LON ----------
async function geocodePlace(place: string): Promise<{ lat: number; lon: number }> {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
    encodeURIComponent(place);

  const res = await fetch(url, {
    headers: { "User-Agent": "vedichelp/1.0" },
  });

  if (!res.ok) throw new Error("Geocoding failed");

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Place not found");
  }

  return {
    lat: Number(data[0].lat),
    lon: Number(data[0].lon),
  };
}

// ---------- LAT/LON → TIMEZONE ----------
async function getTimezone(lat: number, lon: number) {
  const key = process.env.TIMEZONE_API_KEY;
  if (!key) {
    throw new Error("TIMEZONE_API_KEY missing");
  }

  const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${key}&format=json&by=position&lat=${lat}&lng=${lon}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("Timezone lookup failed");

  const data = await res.json();
  if (data.status !== "OK") {
    throw new Error("Invalid timezone response");
  }

  return {
    tz: data.zoneName as string,
    gmtOffset: Number(data.gmtOffset), // seconds
  };
}

// ---------- MONTH PLACEHOLDER ----------
function buildMonths(): MonthOutlook[] {
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  return months.map((m) => ({
    month: m,
    score: 5,
    note: "Baseline outlook (MVP)",
  }));
}

// ---------- API ----------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const dob = String(body?.dob ?? "").trim();   // YYYY-MM-DD
    const tob = String(body?.tob ?? "").trim();   // HH:MM
    const place = String(body?.place ?? "").trim();

    if (!dob || !tob || !place) {
      return Response.json(
        { error: "dob, tob, and place are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Place → lat/lon
    const { lat, lon } = await geocodePlace(place);

    // 2️⃣ lat/lon → timezone
    const { tz, gmtOffset } = await getTimezone(lat, lon);

    // 3️⃣ Local time → UTC
    const localIso = `${dob}T${tob}:00`;
    const localMillis = Date.parse(localIso);
    const utcMillis = localMillis - gmtOffset * 1000;
    const utcBirthDateTime = new Date(utcMillis).toISOString();

    return Response.json({
      engineVersion: "0.4.0",
      summary: "Birth time normalized to UTC successfully.",
      themes: ["Infrastructure ready"],
      personality: [],
      monthByMonth: buildMonths(),
      confidence: "low",
      meta: {
        location: { lat, lon },
        tz,
        utcBirthDateTime,
      },
      trace: [
        { ruleId: "GEO-OK", source: "nominatim" },
        { ruleId: "TZ-OK", source: "timezonedb" },
      ],
    });
  } catch (e: any) {
    return Response.json(
      { error: e.message || "Server error" },
      { status: 500 }
    );
  }
}
