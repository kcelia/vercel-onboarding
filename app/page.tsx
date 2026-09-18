async function getTemp() {
  const res = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/weather`, { cache: "no-store" });
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
