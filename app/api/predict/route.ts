// app/api/predict/route.ts
import { computeChart } from "@/lib/chart";

type MonthOutlook = { month: string; score: number; note: string };

async function geocodePlace(place: string): Promise<{ lat: number; lon: number }> {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
    encodeURIComponent(place);

  const res = await fetch(url, { headers: { "User-Agent": "vedichelp/1.0" } });
  if (!res.ok) throw new Error("Geocoding failed");

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error("Place not found");

  return { lat: Number(data[0].lat), lon: Number(data[0].lon) };
}

async function getTimezone(lat: number, lon: number) {
  const key = process.env.TIMEZONE_API_KEY;
  if (!key) throw new Error("TIMEZONE_API_KEY missing");

  const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${key}&format=json&by=position&lat=${lat}&lng=${lon}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Timezone lookup failed");

  const data = await res.json();
  if (data.status !== "OK") throw new Error("Invalid timezone response");

  return { tz: data.zoneName as string, gmtOffset: Number(data.gmtOffset) };
}

function buildMonths(): MonthOutlook[] {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months.map((m) => ({ month: m, score: 5, note: "Baseline outlook (MVP)" }));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const dob = String(body?.dob ?? "").trim();   // YYYY-MM-DD
    const tob = String(body?.tob ?? "").trim();   // HH:MM
    const place = String(body?.place ?? "").trim();

    if (!dob || !tob || !place) {
      return Response.json({ error: "dob, tob, and place are required" }, { status: 400 });
    }

    const { lat, lon } = await geocodePlace(place);
    const { tz, gmtOffset } = await getTimezone(lat, lon);

    const localIso = `${dob}T${tob}:00`;
    const localMillis = Date.parse(localIso);
    const utcMillis = localMillis - gmtOffset * 1000;
    const utcBirthDateTime = new Date(utcMillis).toISOString();

    // ✅ Chart (Sun/Moon/Nakshatra)
    const chart = computeChart({ utcBirthDateTime, lat, lon });

    return Response.json({
      engineVersion: "0.5.0",
      summary: "Chart generated (Sun/Moon + nakshatra). Next: rules engine.",
      themes: ["Infrastructure ready"],
      personality: [],
      monthByMonth: buildMonths(),
      confidence: "low",
      meta: { location: { lat, lon }, tz, utcBirthDateTime },
      chart,
      trace: [
        { ruleId: "GEO-OK", source: "nominatim" },
        { ruleId: "TZ-OK", source: "timezonedb" },
        { ruleId: "CHART-5A", source: "astronomy-engine" },
      ],
    });
  } catch (e: any) {
    return Response.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
