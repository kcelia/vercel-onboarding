async function getTemp() {
  console.log("[env]", {
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    NEXT_PUBLIC_ENV_LABEL: process.env.NEXT_PUBLIC_ENV_LABEL,
    CITY_LAT: process.env.CITY_LAT,
    CITY_LON: process.env.CITY_LON,
  });

  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/weather`, { cache: "no-store" });


  return res.json();
}

export default async function Home() {
  const label = process.env.NEXT_PUBLIC_ENV_LABEL ?? "unset";
  const data = await getTemp();

  return (
    <main style={{ fontFamily: "system-ui", padding: 40 }}>
      <div style={{ padding: 12, background: label === "production" ? "#fee" : "#eef" }}>
        environment: {label}
      </div>
      <h1>{data.temperature ?? "—"}°C</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
