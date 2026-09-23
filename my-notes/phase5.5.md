## Phase 5 — Domains and Access

**Goal:** Understand how custom domains follow Production and how Preview deployments can be protected.

### Definitions

| Term | Definition |
|---|---|
| **Custom domain** | A domain or subdomain connected to a Vercel project. |
| **CNAME record** | A DNS record that points a subdomain to another hostname. |
| **DNS propagation** | The time required for a DNS change to become visible across DNS servers. |
| **Deployment Protection** | Access control that requires visitors to authenticate before opening protected deployments. |

1. Add a custom subdomain

2. Check which deployment receives the domain

3. Protect Preview deployments

- Go to **Settings → Deployment Protection**.
- Enable Vercel Authentication for protected deployments.
- Opening the Preview URL in a logged-out private window -> failed :  Vercel displayed a login page instead of the application.

4. a preview URL is unguessable but public by default. Is that acceptable for a product frontend before launch? Argue it either way, but have a reason.

- An unguessable URL provides obscurity not access control
- it can still be shared, leaked through pull requests, browser history, logs, analytics, screenshots, or messages.
- A pre-launch preview may reveal unreleased features, branding, API endpoints, or test data.
- I would therefore enable Vercel Authentication for preview deployments and grant access only to authorized collaborators.
- A public preview can be acceptable for a simple prototype containing no sensitive or confidential information, but that should be an explicit risk decision rather than the default.


