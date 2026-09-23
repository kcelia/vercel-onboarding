## Stretch Goal — API Key Exposure and Build Checks

### Where the code runs

| Component | Role in our application |
|---|---|
| **Browser** | Displays the page and executes client-side JavaScript. |
| **Vercel server** | Executes `app/api/weather/route.ts`, reads the private key, and requests weather data. |
| **Open-Meteo** | The external API that provides weather data, also called the upstream API. |

### Definitions

| Term | Meaning |
|---|---|
| **API key** | A credential a provider may use to identify and authorize requests. We used the fake value `toto`. |
| **HTTP header** | Metadata sent with a request or response. A provider may require an API key in a request header. |
| **Route handler** | Server code that handles HTTP requests. Our weather handler implements `/api/weather`. |
| **Origin** | The combination of a URL's protocol, hostname, and port. Our application and Open-Meteo have different origins. |
| **CORS** | Browser-enforced rules through which a server authorizes access to its responses from other origins. |
| **Preflight** | An `OPTIONS` request the browser sends to check permission before certain cross-origin requests, such as one containing `X-API-Key`. |
| **GitHub Actions workflow** | An automated process defined in a YAML file, such as building the application when a pull request is opened or updated. |
| **Required check** | A check made mandatory by a branch protection rule or ruleset before merging. |

### Moving the weather request into the browser

Our original `Home` component ran on the server. For the deliberate leak, we used:

| Element | Purpose |
|---|---|
| `"use client"` | Define a Client Component boundary. |
| `useEffect` | Run the weather request in the browser after rendering. |
| `useState` | Store the received temperature and update the display. |

This made the browser call Open-Meteo directly with the fake key, exposing that key in its JavaScript.


### Error Encountered — Sending the Fake API Key

We used the fake key `toto` to demonstrate how a provider key can leak.

1. Move the request from the server to the browser

    - Initially, our Vercel route called Open-Meteo.
    - For the leak experiment, we moved that call into the browser and sent: `headers: { "X-API-Key": "toto" }
    - The key became visible in the browser bundle, but the request failed with `TypeError: Load failed`.

2. Understand the possible browser restriction

    - Our page and Open-Meteo have different **origins**: they use different hostnames.
    - Because the request includes `X-API-Key`, the browser first sends an **OPTIONS preflight request**, asking Open-Meteo: “May this website send a request with this header?”
    - The API answers through **CORS response headers**. Without the required permission, the browser blocks the actual request.


3. Move the request back to the server

- The browser now calls `/api/weather`, and our server calls Open-Meteo.
    - Browser CORS restrictions no longer apply to the server-to-server request.
    - However, Open-Meteo still checks authentication.
    - Our server logs revealed the actual provider response: **“The supplied API key is invalid.”** Workaourn: ```"X-Demo-API-Key": "toto"```


- **Calling from the server** keeps the key out of browser code and avoids browser CORS enforcement.
- **Changing the header name** avoids using the provider's authentication header.
- Changing the header alone would not remove CORS requirements for a browser request.




========




### Origins, HTTPS, and CORS

- Our page is hosted at `https://my-project.vercel.app` and its JavaScript requests weather data from `https://api.open-meteo.com`.

- An **origin** is the combination of **protocol, hostname, and port**. These two URLs have different hostnames, so they have different origins. The browser request is therefore **cross-origin**.

### How the browser handles the request

- **HTTPS** transports the request and response securely.
- **CORS — Cross-Origin Resource Sharing** lets Open-Meteo specify which origins may access its responses through browser JavaScript.
- Open-Meteo communicates these permissions through HTTP response headers and the browser enforces them.
- **CORS is not an HTTPS option.** It is a browser access-control mechanism that uses HTTP headers and works with both HTTP and HTTPS.


- Our request includes `X-API-Key`. Before sending it, the browser makes an **OPTIONS request**, called a **preflight**, asking: > “May JavaScript from my-project.vercel.app send a GET request with an X-API-Key header?”

`OPTIONS` is an HTTP method, not an HTTPS setting.

- If Open-Meteo allows the origin, method, and header, the browser sends the GET request.
- Otherwise, the browser blocks it.

### Why moving the call to our server changes this

The browser calls `/api/weather` on its own origin. Our Vercel server then calls Open-Meteo.

That second request is server-to-server, so browser CORS restrictions do not apply. Open-Meteo can still reject the request if the API key is invalid.


=======



### Vercel:

- retrieve your code
- install dependencies (npm)
- run the Next.js build
- convert the result into deployable assets
    - static files
    - server-side code / dynamic routes

- create a Deployment
- associate a URL with it
  ▼
Internet
