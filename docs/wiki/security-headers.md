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
updated: 2026-09-25
status: built
---

# Security Headers and CSP

> A `'self'`-only Content Security Policy on a static site, with the one unavoidable inline
> script hashed at build time so the hash can never go stale.

**Status: built.** The build-time hash pipeline shipped with DSI-87; `dist/_headers` is generated
from `headers.template` on every build, never hand-edited. The separate production audit
(DSI-105 — zero CSP violations, A grade externally) is still open.

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
  frame-ancestors 'none'; form-action 'none';
  script-src 'self' 'sha256-...' https://static.cloudflareinsights.com;
  style-src 'self'; font-src 'self'; img-src 'self' data:;
  connect-src 'self' https://cloudflareinsights.com; upgrade-insecure-requests
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

Because almost nothing on the site is third-party. Fonts are self-hosted, there is no embedded
video, no map, no CDN. The one exception is the Cloudflare Web Analytics beacon, adopted
deliberately in DSI-111 — see [below](#cloudflare-web-analytics-2026-09-25-dsi-111). Every one of those would require widening the policy, and under
an enforcing CSP a blocked resource fails **silently** — it simply never loads. So the rule is:
adding any third-party script, style, font, image host or fetch target requires a matching
header edit in the same change, or the feature will appear to work locally and be invisible in
production.

Analytics shows the rule in practice: it needed its script origin in `script-src` and its
reporting endpoint in `connect-src`, both in the same change.

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

**The JSON-LD exemption in step 5 was written before it was built (DSI-103).** Neither guard
actually exempted it, so the first build with structured data failed in `generate-headers.mjs`
with five distinct inline scripts. Both scripts now skip `<script type="application/ld+json">`
by exact type — a data block is never executed, so `script-src` does not govern it and it needs
no hash. `check-dist.mjs` does not skip the body, though: it `JSON.parse`s it and fails the
build if it doesn't parse. Without that, the exemption would be a hole any inline script could
walk through by borrowing the type. Tested with three tampered builds: a stray inline script, a
broken JSON-LD body, and `alert(1)` wearing the JSON-LD type — each fails the build.

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

**Resolved at source, 2026-09-11.** Automatic beacon injection was disabled in the Cloudflare
dashboard — account home (not the zone) → **Analytics & Logs → Web Analytics** → the site card →
**Manage site** → **Disable**. It is on by default for any proxied zone, so nobody switched it
on; it arrived with the orange cloud. The beacon is now not sent, rather than sent and blocked,
and the policy was not widened by a character to achieve that.

Verified on production: no `cloudflareinsights` string and no `cf-beacon` token in the served
HTML, exactly three scripts on `/` (the hashed inline theme script plus the two module scripts),
console clean on `/`, `/404/` and an unmatched path, `www` still 301ing to the apex with path and
query preserved, and `/fonts/*` still `immutable`.

Two things worth keeping from the verification:

- **A cached copy will lie to you.** The first two checks still showed the violation, and adding
  a cache-busting query did not help — the stale copy was the *browser's*, not the edge's. A
  `curl` against the origin and a brand-new tab were what separated "still injected" from "stale
  copy". Hard-reload before believing a negative result here.
- **There is a header-only alternative, not taken.** Cloudflare cannot inject into a response
  marked `Cache-Control: public, no-transform`, since injection is an edge HTML transform. That
  would work from the repo alone, but it uses a caching header as a feature switch, and appending
  it to the `/*` block interacts with the rule-append behaviour documented above. The dashboard
  setting stops the request rather than blocking it, and needs no such reasoning.

The deliberate-adoption path remains **DSI-111**, which would need `script-src` *and*
`connect-src` widened in the same change — the beacon fetches as well as loads.

## Production audit, 2026-09-24 (DSI-105)

Run against `https://deepayansinha.com` once all the real content, the JSON-LD and the social
cards were deployed. **Gate met: zero violations on every route, A+ from securityheaders.com.**

**Headers, by `curl -I`, on every route and every kind of asset** — the five pages, an unmatched
path, a hashed stylesheet, a hashed script, a hashed image, a font, an OG card, `resume.pdf`,
`robots.txt`, the sitemap and the favicon. All sixteen carry all seven security headers, and the
live `script-src` hash is byte-identical to the one in `dist/_headers`. Cache rules as intended:
`/_astro/*` and `/fonts/*` a year and `immutable`; HTML and every unhashed file (`/og/*`,
`resume.pdf`, `robots.txt`) `max-age=0, must-revalidate`, which is right for files whose URL does
not change when their content does. `http://` and `www` both 301 to the https apex, path kept.

**Violations, in a real browser, on every route** — `/`, `/resume/`, the three case studies and
an unmatched path. A `securitypolicyviolation` listener on each page, every button clicked
(theme toggle, disclosure, all ten popovers — certificate viewers and experience details),
every image forced to load, and the console read for load-time reports: **zero violations, zero
broken images, zero third-party requests.** The only console error is the 404 page's own 404.

Three things worth keeping:

- **Clicking is part of the walk.** Half the site's images sit in popovers — certificate scans,
  employer logos — and never request until opened. A load-and-scroll pass does not exercise them.
- **A lazy image in a pane that isn't painting never loads.** The first pass reported every
  employer logo broken. Each returned 200 by `fetch`; the browser pane was not drawing, so
  `loading="lazy"` never fired. Forcing `loading="eager"` loaded all four. Check a "broken" lazy
  image by fetching it before believing it.
- **Cloudflare adds `nel` and `report-to` headers** pointing at `a.nel.cloudflare.com`. That is
  Network Error Logging, sent by the browser outside the page, so `connect-src` does not govern it
  and it is not a CSP gap. The scanner lists it as informational.

Not done, and not needed for the gate: `Cross-Origin-Embedder-Policy` and
`Cross-Origin-Resource-Policy`, which the scanner lists as "upcoming". COEP would isolate the page
for features it does not use.

## Cloudflare Web Analytics, 2026-09-25 (DSI-111)

The site's first and only third-party origin, adopted on purpose after DSI-132 had removed the
uninvited version. Cookieless, no fingerprinting, no backend on our side.

- **Manual snippet, not edge injection.** Automatic injection stays off in the dashboard. The
  `<script>` lives in `Head.astro`, so it is in the built HTML where `check-dist.mjs` and a local
  `wrangler dev` run can see it — the DSI-132 failure was precisely a script that existed only
  at the edge. It is external and `defer`, so it needs no hash and never blocks render.
- **Two origins, one change.** `https://static.cloudflareinsights.com` in `script-src` (the
  loader) and `https://cloudflareinsights.com` in `connect-src` (the beacon POSTs to
  `/cdn-cgi/rum` there). Either alone and the beacon fails silently.
- **The token is public.** It sits in `src/data/site.ts` as `cloudflareAnalyticsToken`; every
  visitor receives it in page source.
- **What the local check proved, and what it cannot.** Under `wrangler dev` there were zero CSP
  violations: the script loaded and the beacon's POST left the page. That POST then failed CORS,
  as it should — Cloudflare accepts reports only from the registered hostname. So locally proves
  the policy; only production proves collection, which is the issue's gate.

This supersedes the launch audits' "zero third-party requests" result (DSI-105, DSI-108); every
other directive is unchanged.

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
