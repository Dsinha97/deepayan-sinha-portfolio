---
title: "Deployment and Domain"
type: reference
tags: [cloudflare, dns, email]
sources:
  - "C:/FPL App/docs/wiki/deployment.md"
  - "C:/FPL App/wrangler.jsonc"
related:
  - site-architecture.md
  - security-headers.md
updated: 2026-09-11
status: built
---

# Deployment and Domain

> Static build on Cloudflare Workers static assets, apex-canonical, with `www` redirecting and
> `contact@` routed to Gmail.

**Status: built.** Cloudflare Workers Builds deploys `main` on every push (DSI-83), the apex
serves the build, `www` 301s to it preserving path and query, and `http` 301s to `https` (DSI-84).
`contact@` routes to Gmail with SPF and a `p=reject` DMARC record (DSI-85). Replies go out from
Gmail directly, per the Email section below.

`deepayansinha.com` is already registered and its zone is already on Cloudflare, which removes
the usual first step and means the whole stack sits in one account.

## Shape

A pure static build. No adapter, no server at runtime, no route handlers. `wrangler.jsonc`
points the Worker at `dist/` and declares the apex as a custom domain:

```jsonc
{
  "name": "deepayansinha-com",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  },
  "routes": [{ "pattern": "deepayansinha.com", "custom_domain": true }]
}
```

`html_handling` stays at its default, which resolves both `/work/x` and `/work/x/` to the
directory index. Setting it to `none` would 404 every route — that is recorded in the FPL App
wiki as a real trap, not a hypothetical one.

Keeping the routes in this file rather than only in the dashboard means a future change shows up
in a diff instead of silently differing from what anyone remembers configuring.

## Three things learned on the sibling deployment

These come from `fpldecision.com`, which has the same shape. They are worth not rediscovering.

**Do not register `www` as a second custom domain.** It was tried there and reverted: the Worker
then serves `www` directly with a 200, which is the opposite of making the apex canonical.
`www` is instead a proxied A record pointing at `192.0.2.1` — a documentation address that is
never reached, because the proxy intercepts first — plus a Cloudflare Redirect Rule issuing a
301 to the apex with the path and query preserved. The redirect rule cannot be expressed in
`wrangler.jsonc`; it is dashboard-only, same as the domain attachment.

**Cloudflare's setup wizard will suggest a Next/Astro server adapter** on detecting the
framework. That is wrong for a static export and produces a build that fails looking for files a
static build never emits. The build command is plain `npm run build`.

**Environment variables are build-time, not runtime.** A static export has no runtime, so
anything set only as a runtime binding is simply absent from the bundle. Nothing on this site is
environment-driven — `site` is hardcoded — specifically so this cannot bite.

## Build integration

Cloudflare Workers Builds is connected to the GitHub repository (DSI-83): pushes to `main` build
and deploy automatically. Build command `npm run build`, deploy `npx wrangler deploy`, Node
version from `.nvmrc`. Non-production branches get their own preview URLs; `site` stays hardcoded
to the apex so canonical URLs and the sitemap always point
at production regardless of which host served the build.

The original `*.workers.dev` URL keeps resolving and cannot cleanly be turned off for a
Git-integration Worker. Treat it as a live fallback rather than assuming it is private.

## DNS

The zone exists; these are the records the site needs.

| Type | Name | Value | Proxied | Purpose |
|---|---|---|---|---|
| managed | apex | Worker custom domain | yes | created automatically when the route attaches on first deploy — do not hand-create an A record |
| A | `www` | `192.0.2.1` | yes | placeholder so the proxy can intercept and the redirect rule can fire |
| MX | apex | Cloudflare Email Routing targets | n/a | written by the Email Routing wizard |
| TXT | apex | SPF for Email Routing | n/a | written by the wizard |
| TXT | `_dmarc` | `v=DMARC1; p=reject; rua=mailto:contact@deepayansinha.com` | n/a | the domain sends no mail of its own, so reject is correct |

Edge certificates: Always Use HTTPS on, minimum TLS 1.2, TLS 1.3 enabled. The HSTS header ships
from the generated `_headers` file rather than the Cloudflare toggle, so it lives in version
control. Preload submission waits until the site has served cleanly over HTTPS for a week —
preload is difficult to reverse.

## Email

Cloudflare Email Routing, inbound only. `contact@deepayansinha.com` forwards to the personal
Gmail address, which is verified once as a destination. Catch-all stays off.

Email Routing cannot send. If replies should appear to come from `contact@` rather than the
Gmail address, that needs Gmail's send-mail-as over its own SMTP, and the SPF record then has to
include Google as well. Until that is set up, replies come from Gmail as normal — which is
fine, and is the default assumption.

The Gmail address is a routing destination, never a published one. See
[content-guardrails](content-guardrails.md#personal-data).

## Verification after any deploy change

- `curl -sI https://deepayansinha.com/` returns 200 with the full security header set.
- `curl -sI 'https://www.deepayansinha.com/x?y=1'` returns 301 to the apex with path and query
  intact.
- `curl -sI http://deepayansinha.com/` returns 301 to https.
- A bad path returns a styled 404 with a 404 status, not a 200.
- A test message to `contact@` arrives in Gmail.

## Repository safety

Made public 2026-09-24, with the same rules as fpl-app and in fpl-app's order — the ruleset went
on while the repo was still private, so there was no window where it was public and `main` was
open.

| Control | Setting | Why |
|---|---|---|
| `main` ruleset (`main protection`, id 23974689) | Blocks deletion and force-push; requires a pull request (0 approvals) and the `build` check, up to date with `main`; **no bypass actors** | A rule an admin can wave through is documentation, not a control. Zero approvals is deliberate: GitHub will not let a PR's author approve it, so on a one-person repo a count of 1 means nothing can merge |
| `.github/workflows/ci.yml` | Job `build` runs `npm ci` then `npm run build` — `astro check`, the build, the resume PDF, the CSP header generation and `check-dist` | CI enforces exactly what a local build does, so a phone number or a stray inline script cannot merge. `permissions: contents: read` |
| `.github/CODEOWNERS` | `* @Dsinha97` | Auto-requests the owner's review on any PR, forks included. The *rule* requiring code-owner review stays off until a second maintainer exists |
| Fork pull request workflows | Approval required for all external contributors | A fork PR cannot run a workflow until the owner approves it |
| Secret scanning + push protection | Enabled | A commit containing a recognised secret is refused at push time |

**Consequence: nothing pushes to `main` directly — the owner and any agent included.** Branch,
open a PR, merge once `build` is green; the merge is what deploys. Renaming the CI job breaks
every PR, since the ruleset waits for a check called `build` that would never report.

**What was checked before the flip, against all history rather than the working tree** (fpl-app
learned that history is what publishing exposes): 47 commits, every one authored as
`Deepayan Sinha <deepayansinha@gmail.com>`; no secret-shaped string, no phone number, no path
under `private/` or `References/` in any version of any file; no Wipro client or vendor name and
no individual named — tested by searching every commit for each proper name in the private vault
notes. Three things were changed rather than accepted:

- `docs/sources/` keeps its two research documents, which are false about Deepayan, and now opens
  with a README saying so in its first line. The owner chose that over deleting them.
- The mis-migrated parking figure and the site it came from are no longer written anywhere in the
  tree — the rule stays, the value lives only in the private vault. **Earlier commits still
  contain both**, reachable with `git log -p`; accepted, like fpl-app's email, over rewriting
  history.
- `LICENSE` now exists: MIT for the code only, content and brand assets reserved. The four
  vendored skills carry their upstream MIT notices (sources in `skills-lock.json`).

## Sources

- FPL App `docs/wiki/deployment.md` — the migration landmines and the apex/www arrangement
- FPL App `wrangler.jsonc` — the annotated config this one is modelled on
