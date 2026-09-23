
Vercel Onboarding Exercise — Product Infra 17 sept. 2026

Link: https://claude.ai/artifact/6SgjHQAMHJuzv8Ngyg48h9?sk=576Z-1Qv5LEw9Qk6RDlw5w#8b7dea4d-47ea


Welcome — what you're doing this week
This is a one-day exercise to get you comfortable with Vercel, which is where the Product team deploys everything. By the end of it you will have deployed a site, broken it two different ways, and recovered it.

You do not need to know anything about blockchain, smart contracts or FHE for this. None of it comes up. The app you deploy is a page that shows the weather.

Use your own GitHub account and a personal Vercel Hobby account. Nothing here can touch anything real, so break things freely. That is the actual point of phase 4.

Budget a day. Phases 1-4 are the ones to finish; phase 5 and the stretch goal are there if you have time. If you are stuck on a single step for more than 20 minutes, come and find me rather than grinding on it. Where you get stuck is useful information for both of us.

Phase

Topic

Outcome

1

First deploy

A live URL from a git push

2

Environment variables

Preview and Production behave differently

3

Preview deployments

A PR with its own working URL

4

Break and recover

Two failures diagnosed, one rolled back

5

Domains and access

A custom subdomain, previews locked down

The sample app
Start from Vercel's own Next.js Boilerplate, the minimal App Router starter behind create-next-app. It has no database, no auth, no third-party account to sign up for, and no wallet.

npx create-next-app@latest vercel-onboarding --ts --app --no-src-dir
Push it to a personal GitHub repo. Then add two files, which turn the empty starter into something that can actually be misconfigured and broken.

app/api/weather/route.ts calls Open-Meteo, a public weather API that needs no key. The city comes from a server-side environment variable, so the route has a real dependency and a real config input.

export const dynamic = "force-dynamic";

export async function GET() {
  const lat = process.env.CITY_LAT;
  const lon = process.env.CITY_LON;
  if (!lat || !lon) {
    return Response.json({ error: "CITY_LAT / CITY_LON not set" }, { status: 500 });
  }

  const base = process.env.WEATHER_API_BASE ?? "https://api.open-meteo.com/v1";
  const res = await fetch(`${base}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`);
  if (!res.ok) {
    return Response.json({ error: `upstream ${res.status}` }, { status: 502 });
  }

  const data = await res.json();
  return Response.json({ temperature: data.current?.temperature_2m });
}
app/page.tsx shows an environment banner and the temperature. The banner reads a NEXT_PUBLIC_ variable, which is the hook for the Phase 2 lesson.

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
That is the whole app. Make it prettier if you like, but nothing below depends on how it looks.

Before you start
A personal GitHub account and a repo you own. Do this outside the org repos so a broken main branch costs nothing.

A Vercel Hobby account, signed in with that GitHub account. Do not use the team account for this.

Node 20 and npm locally, plus the Vercel CLI: npm i -g vercel.

A subdomain you can add a CNAME to, for Phase 5. If that is awkward, skip Phase 5.

Nothing here touches Zama infrastructure, production secrets, or a real chain.

Phase 1 — First deploy
Goal: a git push produces a live URL, and you can explain what happened in between.

Run the app locally with npm run dev and confirm the page renders. The temperature will be missing, because CITY_LAT and CITY_LON are not set yet. That is expected.

In Vercel, Add New → Project, import the GitHub repo, and deploy with the default settings.

Open the deployment's Build Logs and find: the install step, the build step, and the point where the build output is uploaded.

Open Deployments and note that the deployment has both a unique URL and a project-wide production URL pointing at it.

Write down answers to these before moving on:

Which branch did Vercel treat as production, and where is that configured?

The page rendered even though the weather route returns an error. Where did that rendering happen: your browser, or a server?

If you push to a branch that is not the production branch, what do you expect to happen?

Phase 2 — Environment variables
Goal: understand that "environment variable" means two different things depending on the prefix, and that Preview and Production are separate config namespaces.

Set these in Settings → Environment Variables, with different values per environment:

Variable

Production

Preview

Scope

NEXT_PUBLIC_ENV_LABEL

production

preview

Inlined into the browser bundle

CITY_LAT

48.8566

45.4642

Server only

CITY_LON

2.3522

9.1900

Server only

Redeploy production, then do the exercise that carries the whole phase:

Load the production page and confirm the banner says production and the temperature is Paris.

Open browser devtools, go to the Sources or Network tab, and search the shipped JavaScript for the string production. You will find your environment variable sitting in the bundle.

Now search the same bundle for 48.8566. You will not find it.

The difference is the NEXT_PUBLIC_ prefix. Anything carrying it is baked into the build output at build time and shipped to every visitor. Anything without it stays on the server. Vercel's dashboard shows both in the same list, under the same heading, with the same padlock icon, which is exactly why people get this wrong.

Two follow-ups worth doing:

Change CITY_LAT in the dashboard and reload the page without redeploying. Nothing changes. Work out why, then redeploy and watch it change.

Mark one variable as Sensitive and note what the dashboard will and will not show you afterwards.

The takeaway: a NEXT_PUBLIC_ variable is not a secret, it is published. Treat putting a key in one as equivalent to committing it to a public repo, because the effect is the same.

Phase 3 — Preview deployments
Goal: see the branch-to-URL mapping that the whole Vercel workflow rests on.

Create a branch, change something visible on the page, push it, and open a pull request.

Find the preview URL. It appears in two places: the Vercel bot's comment on the PR, and the project's Deployments list.

Open the preview and confirm the banner says preview and the temperature is Milan, not Paris. Same code, different config.

Push a second commit to the same branch. Note that the PR's preview URL now points at the new build, while the first build still has its own permanent URL.

Merge the PR and watch production redeploy on its own.

push to branch

preview build

preview URL
preview env vars

merge to main

production build

production URL
production env vars

Every deployment keeps its own immutable URL forever. That is what makes the rollback in Phase 4 instant.

One thing to check deliberately: open the preview URL in a private browsing window while logged out. Note whether it loads. That question comes back in Phase 5.

Phase 4 — Break it and recover
Goal: tell the difference between a deploy that never shipped and a deploy that shipped and is now hurting users. These need completely different reactions and this is the phase that matters on call.

Failure A, build time. Add a line to app/page.tsx that reads an environment variable at module scope and throws if it is missing:

if (!process.env.REQUIRED_THING) throw new Error("REQUIRED_THING is not set");
Set REQUIRED_THING for Preview only, then merge to main. Production fails to build.

Where did you find out it failed?

What is production serving to users right now?

Which log did you read to diagnose it?

Failure B, runtime. Revert that, then set WEATHER_API_BASE in Production to https://api.open-meteo.invalid/v1 and redeploy. The build succeeds. The site is live. The site is also broken.

What are users seeing?

Which log tells you about this one, and why is it a different log from Failure A?

How long did it take you to notice? Nobody paged you. Sit with that for a second.

Recovery. Use Instant Rollback to put the previous production deployment back. Time it from the moment you decide to roll back to the moment the site is healthy.



Failure A

Failure B

Build result

Failed

Succeeded

What users see

Previous version, still fine

Broken current version

Where it shows

Build logs

Runtime logs

Urgency

Low

Page someone

Fix

Fix and redeploy

Roll back first, fix after

That table is the point of the whole exercise. A failed build is an inconvenience. A successful build of broken code is an incident.

Phase 5 — Domains and access
Optional, but it closes the loop on the question from Phase 3.

Add a custom subdomain to the project and create the CNAME record it asks for. Watch the domain sit in a pending state until DNS propagates.

Note which deployment the custom domain points at, and confirm it follows production rather than being pinned to one build.

Go to Settings → Deployment Protection and turn on protection for preview deployments. Re-test the logged-out private window from Phase 3.

The question to answer: a preview URL is unguessable but public by default. Is that acceptable for a product frontend before launch? Argue it either way, but have a reason.

Stretch goal
For anyone who finishes early.

Add a fake API key, DATA_API_KEY, and wire it into the weather route as a header. Then deliberately do it the wrong way first: rename it to NEXT_PUBLIC_DATA_API_KEY and call the upstream API directly from the page component. Deploy, find the key in the browser bundle, and then fix it properly by moving the call back behind the route handler.

This is the exact shape of the mistake that leaks provider keys in real frontends, and doing it once on purpose is cheaper than doing it once by accident.

Second stretch, if there is still time: add a GitHub Actions workflow that runs npm run build on pull requests, and make it a required check. Then work out what it does that Vercel's own preview build does not.

What you should be able to answer afterwards
We will go through these together when you are done. Do not look them up in advance. The point is to find out what the exercise actually taught you, and the gaps are more useful to me than a clean score.

Walk me through everything that happens between git push and the live site changing.

What is the difference between a NEXT_PUBLIC_ variable and a normal one, and at what moment does that difference take effect?

You changed an environment variable in the dashboard and nothing happened. Why not?

Production's build failed. How bad is it, and what are users seeing right now?

Production's build succeeded and the site is broken. What is your first move?

Someone put a provider API key in a NEXT_PUBLIC_ variable six months ago and it has just leaked. What does rotating it actually involve?

Questions 5 and 6 are the ones that matter for the on-call rotation, and neither is specific to Vercel. If you cannot answer them yet, that is fine and expected; it is what the next few weeks are for.
