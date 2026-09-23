## Phase 3 — Preview Deployments


1. Create a branch, change something visible on the page, push it, and open a pull request.

2. Find the preview URL. It appears in two places: the Vercel bot's comment on the PR, and the project's Deployments list.

The Preview URL is available:
- the Vercel bot's comment on the PR -> See msg in the PR.
- the project's Deployments list: `Vercel → ton projet → Deployments`


3. Open the preview and confirm the banner says preview and the temperature is Milan, not Paris. Same code, different config.

After opening the preview deployment:
- The banner displays `preview`.
- The temperature uses Milan's coordinates.

The application uses the same code but different environment variables.

| Environment | Branch | Label | Coordinates |
|---|---|---|---|
| Preview | Feature branch | `preview` | Milan |
| Production | `main` | `production` | Paris |

4. Push a second commit to the same branch. Note that the PR's preview URL now points at the new build, while the first build still has its own permanent URL.

5. Merge the PR and watch production redeploy on its own.

6. Test Preview access
- Open the Preview URL in a logged-out private window.
- At this stage, an unprotected Preview URL is public to anyone who obtains it.
