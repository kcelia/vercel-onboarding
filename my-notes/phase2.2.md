## Phase 2 — Environment Variables


✅ 1. Create the variables

In **vercel-onboarding → Settings → Environment Variables**, add:

| Variable | Production | Preview | Use |
|---|---|---|---|
| `NEXT_PUBLIC_ENV_LABEL` | `production` | `preview` | Public environment label. |
| `CITY_LAT` | `48.8566` | `45.4642` | Server-side latitude. |
| `CITY_LON` | `2.3522` | `9.1900` | Server-side longitude. |

### Config, Secret, `NEXT_PUBLIC_`, and `"use client"`

- **Config** and **Secret** determine how Vercel stores and displays the value in its dashboard.

- The **`NEXT_PUBLIC_` prefix** determines whether Next.js can make the variable available to client code. When referenced in client code, its value is embedded in the JavaScript during the build.
- Each environment has its own configuration: changing Preview values does not change Production.
- Variables can be configured through local `.env` files, the Vercel dashboard (config or secret), or `vercel env` CLI commands.
- `"use client"` defines a client boundary.
- Without `"use client"`, `page.tsx` is a Server Component by default.
- Config and Secret variables without `NEXT_PUBLIC_` are not exposed automatically. However, server code can expose any variable by returning its value in an API response or rendered content.

| Type | Definition | - `NEXT_PUBLIC_` & Server Comp. | - `NEXT_PUBLIC_` & Client Comp. | + `NEXT_PUBLIC_` & Server Comp. | + `NEXT_PUBLIC_` & Client Comp. |
|---|---|---|---|---|---|
| **Config** | Non-sensitive value readable in the Vercel dashboard. | Available on the server. | Not available in client code. | Available on the server; its value may reach the browser through rendered output. | Embedded in the client JavaScript bundle during the build. |
| **Secret** | Sensitive value hidden by the dashboard after saving in Vercel. | Available on the server. | Not available in client code. | Invalid combination | Invalid combination|

```
Env. Variables
          │
          ├── local files
          │     .env
          │     .env.local
          │
          ├── dashboard Vercel
          │     Production
          │     Preview
          │     Development
          │
          └── Vercel CLI
                vercel env ...
```


✅ 2. Redeploy Production

#### Error encountered:

| Variable | Points to |
|---|---|
| `VERCEL_URL` | This specific deployment's hostname. A new deployment gets a new hostname. |
| `VERCEL_PROJECT_PRODUCTION_URL` | The stable production hostname, which points to the current production deployment. |

In our setup, the deployment URL was protected by **Vercel Authentication**, while the production domain was publicly accessible.

- The page's server code requested `https://${process.env.VERCEL_URL}/api/weather`.
- That request did not carry our browser's Vercel login session.
- Vercel returned an **HTML authentication page**, instead of the expected **JSON weather data**.
- `res.json()` could not parse that HTML, causing:

```text
Unexpected token '<'
"<!DOCTYPE "... is not valid JSON
```

**Workaround:** use `VERCEL_PROJECT_PRODUCTION_URL` to call the public production endpoint.

- Delete a deployement:
![alt text](image-4.png)

✅ 1. Load the production page and confirm the banner says production and the temperature is Paris.

✅  2. Open browser devtools, go to the Sources or Network tab, and search the shipped JavaScript for the string production. You will find your environment variable sitting in the **bundle**.

- The exercise said `production` would appear in the browser bundle.
- However, our original `page.tsx` was a **Server Component** and read the label on the server.
- The label reached the browser through rendered HTML and React Server Component data.
- A `NEXT_PUBLIC_` variable directly referenced in client code is embedded in that JavaScript during the build.
- The prefix does **not** guarantee that every public variable appears in a client `.js` file.
- `CITY_LAT` and `CITY_LON` were used only by the server route and were not returned to the browser.

✅ 3. Now search the same bundle for 48.8566. You will not find it.
- `48.8566` was not found.
- `CITY_LAT` was used only on the server and was not returned in the rendered content or an API response.

- JavaScript Bundler

    - A **bundler** is a build tool that processes the application's source code and dependencies, then produces optimized files for deployment.
    - A **bundle** is one of the generated files, usually JavaScript or CSS.
    - In our project, Next.js used **Turbopack** as its bundler.
    - The browser receives the generated output, not the original `page.tsx` file.

> Bundler = the tool that builds.

> Bundle = the file produced by this tool.


- Environment Variables in the Generated Output

    - `NEXT_PUBLIC_` allows a variable to be used in client code, Next.js embeds its value in the client JavaScript during the build.
    - In our original code, `NEXT_PUBLIC_ENV_LABEL` was read by a **Server Component** because `page.tsx` did not contain `"use client"`.
    - Therefore, `production` appeared in the rendered HTML but not in a client JavaScript bundle.
    - `CITY_LAT` was server-only and was not included in the response, so `48.8566` was not found in the browser files.



✅  4. Change CITY_LAT in the dashboard and reload the page without redeploying. Nothing changes. Work out why, then redeploy and watch it change.

- The existing deployment keeps its previous value.
- Reloading the page still uses the old deployment and therefore the old value.
- After redeploying, the new deployment receives the updated `CITY_LAT` value and the displayed temperature changes.

✅  5. Mark one variable as Sensitive and note what the dashboard will and will not show you afterwards.

- A Config value can be revealed by authorized users after saving.
- A Secret value cannot be revealed again after saving, but the application can still use it.
- This setting only controls how Vercel protects the value in its dashboard.
- A hidden or masked value can still be exposed if the application sends it to the browser.
