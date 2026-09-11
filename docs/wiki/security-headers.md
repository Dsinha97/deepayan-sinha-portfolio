---
title: "Security Headers and CSP"
type: reference
tags: [csp, headers, build]
sources:
  - "C:/Abhijit-Sinha-Website/docs/wiki/security-hardening.md"
  - "C:/FPL App/docs/wiki/deployment.md"
related:
  - deployment-domain.md
  - site-architecture.md
updated: 2026-09-10
status: built
---

# Security Headers and CSP

> A `'self'`-only Content Security Policy on a static site, with the one unavoidable inline
> script hashed at build time so the hash can never go stale.

**Status: planned.**

## The problem the design solves

A theme toggle needs one script to run **before first paint**, or the page flashes the wrong
theme. That script cannot be deferred or bundled, so it is inline — and an inline script under a
strict CSP needs either `'unsafe-inline'` (which discards the point of having a policy), a nonce
(which needs a server this site does not have), or a hash.

A hash works, but a hand-maintained hash in a static header file goes stale the first time
someone edits the script, and the failure is silent: the theme simply stops applying. That exact
trap is documented on the Abhijit site.

## The approach

Generate the header file at build time so the hash cannot drift from the script.

1. `src/scripts/theme-init.js` is the only inline script. Hand-minified, LF line endings
   enforced by `.gitattributes`, because the hash is over exact bytes.
2. The layout injects it with a raw import and `is:inline`, so the bytes in the HTML equal the
   bytes on disk.
3. `headers.template` carries the policy with a placeholder where the hash goes.
4. A postbuild script computes the SHA-256 of the script file, substitutes it, and writes
   `dist/_headers`. There is deliberately **no `public/_headers`** — it would be copied over the
   generated one.
5. A second postbuild script fails the build on anything that would violate the policy: any
   inline `<script>` other than the theme script and JSON-LD, any `style=""` attribute, or a
   phone-number pattern anywhere in `dist/`.

The last check is not a security control; it enforces
[content-guardrails](content-guardrails.md#personal-data) mechanically rather than by review.

## Header set

```
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none';
  frame-ancestors 'none'; form-action 'none'; script-src 'self' 'sha256-...';
  style-src 'self'; font-src 'self'; img-src 'self' data:; connect-src 'self';
  upgrade-insecure-requests
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
```

Plus cache rules: HTML revalidates, hashed assets and fonts get a year and `immutable`.

`form-action 'none'` is correct only while there is no form. Adding one means changing it.

`site.webmanifest` (DSI-89) is covered without a line of its own: `manifest-src` falls back to
`default-src 'self'`. That holds only while `default-src` is present — if this policy is ever
rewritten as explicit per-directive rules, the manifest needs `manifest-src 'self'` or it is
blocked silently and the icon set stops applying.

## Why the policy can be this strict

Because nothing on the site is third-party. Fonts are self-hosted, there is no analytics, no
embedded video, no map, no CDN. Every one of those would require widening the policy, and under
an enforcing CSP a blocked resource fails **silently** — it simply never loads. So the rule is:
adding any third-party script, style, font, image host or fetch target requires a matching
header edit in the same change, or the feature will appear to work locally and be invisible in
production.

If analytics is added later, it needs its script origin in `script-src` and its reporting
endpoint in `connect-src`.

## What building it changed

Built in DSI-87. Two things came out of it that the plan above did not anticipate, both worth
keeping.

**The hash is taken from the built HTML, not from the source file.** The plan said to hash
`src/scripts/theme-init.js`. That is one step removed from what matters: the browser hashes the
bytes it actually receives, so hashing the source is a proxy that is correct only while nothing
transforms the script on its way into the page. `generate-headers.mjs` now extracts the inline
script out of `dist/`, hashes that, and **cross-checks it against the hash of the source** — if
the two ever disagree, the build stops and says so, rather than shipping a policy that blocks its
own script. It also fails if it finds more than one distinct inline script, since the policy
carries exactly one hash.

**`_headers` rules append; they do not override.** A `Cache-Control` in the `/*` block combined
with the immutable rules below it into
`public, max-age=0, must-revalidate, public, max-age=31536000, immutable` — and a browser takes
the first `max-age` it sees, so every font and hashed asset silently dropped to no-cache. Caught
by curling the asset URLs under `wrangler dev` rather than by reading the file. The `/*` block
now carries security headers only; HTML gets Workers' own default for unhashed assets, which
already revalidates.

Measured under `wrangler dev`: HTML `public, max-age=0, must-revalidate`; `/_astro/*` and
`/fonts/*` `public, max-age=31536000, immutable`; zero console output on either route, which is
what zero CSP violations looks like.

The inline script lands at **byte 6 of `<head>`**, ahead of the title and 1.4KB ahead of the
stylesheet, so it has set `data-theme` before there is any CSS to paint with.

## What the local check cannot see

`wrangler dev` serves `dist/` with `_headers` applied and is faithful to what the build
produces — but **it only tests the policy against our own output.** Cloudflare injects its Web
Analytics beacon at the edge, so it exists only on the deployed site, and the first production
load after the M2 deploy logged a blocked `static.cloudflareinsights.com` script on every page
view (DSI-132). Locally: clean. Live: one violation, every time.

The policy behaved correctly — an uninvited third-party script was refused — but the lesson
generalises: **a clean local CSP run is necessary and not sufficient.** Anything the platform
adds above the origin has to be checked against the live site, which is why DSI-105 audits
production rather than a local build.

## Testing locally

`wrangler dev` serves `dist/` **with `_headers` applied**, which is a genuine advantage of this
hosting shape: the CSP can be exercised locally by building, serving and walking every route
with the console open. The Abhijit site cannot do that and had to use a report-only pass against
a deployed preview instead.

Chrome prints the expected `sha256-` value in any violation message, which doubles as a check
that the generated hash is the one the browser wants.

## Fallbacks, documented and not implemented

- **If the hash approach proves fragile**, load the theme script as a synchronous external
  `<script src>` in the head. That keeps `script-src 'self'` at the cost of one small blocking
  request, and removes the hash from the picture entirely.
- **If `style-src 'self'` cannot hold**, drop to `'unsafe-inline'` for styles only and record
  why. The Abhijit site ships that compromise. It is strictly worse and should be a last resort,
  but it is better than removing the policy.

Neither is built. They are written down so the decision does not have to be re-derived under
pressure.

## Sources

- Abhijit site `docs/wiki/security-hardening.md` — the per-host CSP rationale and the inlining
  build settings
- FPL App `docs/wiki/deployment.md` — the `_headers` convention on Workers static assets
