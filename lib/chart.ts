// lib/chart.ts
import { Body, GeoVector, Ecliptic } from "astronomy-engine";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
  "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
  "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati",
];

function normalizeDeg(deg: number): number {
  let x = deg % 360;
  if (x < 0) x += 360;
  return x;
}

function signFromLongitude(longitudeDeg: number): string {
  const lon = normalizeDeg(longitudeDeg);
  const idx = Math.floor(lon / 30);
  return SIGNS[idx];
}

function nakshatraFromLongitude(longitudeDeg: number): string {
  const lon = normalizeDeg(longitudeDeg);
  const size = 360 / 27;
  const idx = Math.floor(lon / size);
  return NAKSHATRAS[idx];
}

export function computeChart(params: {
  utcBirthDateTime: string;
  lat: number;
  lon: number;
}) {
  const date = new Date(params.utcBirthDateTime);

  // Sun
  const sunVec = GeoVector(Body.Sun, date, true);
  const sunEcl = Ecliptic(sunVec);
  const sunLon = normalizeDeg(sunEcl.elon);

  // Moon
  const moonVec = GeoVector(Body.Moon, date, true);
  const moonEcl = Ecliptic(moonVec);
  const moonLon = normalizeDeg(moonEcl.elon);

  return {
    system: "phase-5A",
    zodiac: "tropical (sidereal later)",
    sun: {
      longitude: sunLon,
      sign: signFromLongitude(sunLon),
    },
    moon: {
      longitude: moonLon,
      sign: signFromLongitude(moonLon),
      nakshatra: nakshatraFromLongitude(moonLon),
    },
  };
}
