// ne considère pas cette route comme une réponse statique/cacheable ; exécute-la dynamiquement.
export const dynamic = "force-dynamic";

// fonction exportée détermine la méthode HTTP :
export async function GET() {
  const lat = process.env.CITY_LAT;
  const lon = process.env.CITY_LON;

  if (!lat || !lon) {
    return Response.json(
      { error: "XXX CITY_LAT / CITY_LON not set" },
      { status: 500 }
    );
  }

  // utilise WEATHER_API_BASE si elle existe, sinon utilise Open-Meteo
  // ??: nullish coalescing operator.
  const base =
    process.env.WEATHER_API_BASE ?? "https://api.open-meteo.com/v1";

  const res = await fetch(
  `${base}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`,
  {
    headers: {
      "X-API-Key": process.env.DATA_API_KEY ?? "",
    },
  }
  );

  if (!res.ok) {
    return Response.json(
      { error: `upstream ${res.status}` },
      { status: 502 }
    );
  }

  const data = await res.json();

  return Response.json({
    temperature: data.current?.temperature_2m,
  });
}
