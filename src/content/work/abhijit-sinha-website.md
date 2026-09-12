---
title: "Abhijit Sinha — Mutual Fund Distributor Website"
tagline: "A regulated-content marketing site for an AMFI-registered mutual fund distributor in India, where a wrong sentence is a compliance problem, not a style issue."
role: "Solo developer & maintainer"
period: "2026 – present"
stack: ["Astro", "Tailwind CSS", "Supabase", "Postgres", "Vercel"]
cover: "/work/abhijit-sinha-website-cover.webp"
bentoSize: "md"
order: 2
claimScope: "own-outcomes"
star:
  situation: >-
    An independent mutual fund distributor in India needed a public site. Every page there
    carries statutory disclosures under AMFI regulation, registration identifiers must be
    exact, and copy that reads as personalised advice, a return guarantee, or a
    commission-driven recommendation is a compliance breach, not a style issue. He also needed
    to publish content himself, with no developer in the loop.
  task: >-
    Ship a fast, accessible, statutorily compliant site, plus a way for a non-technical owner
    to capture leads and publish articles — without opening a path by which a careless edit
    becomes a regulatory incident.
  action: >-
    Astro and Tailwind, static, on Vercel, with one site-data module as the source of truth for
    every regulatory identifier. Compliance enforced in Postgres with a check constraint and a
    trigger, not just the interface. A lead pipeline through an edge function reaching a table
    with no insert policy at all. Cookieless first-party analytics, and an enforcing Content
    Security Policy with no inlined scripts or styles anywhere.
  result: >-
    Live on its own domain since September 2026, indexable, with the full statutory framework
    in place and the owner publishing content himself. Every published article has passed an
    automated compliance lint and a human acknowledgement before going live.
metrics:
  - value: "0"
    label: "IP, user agent or location stored"
    qualifier: "cookieless analytics"
  - value: "2"
    label: "checks before an article publishes"
    qualifier: "automated lint + owner acknowledgement"
  - value: "13 mo"
    label: "analytics retention, enforced by a scheduled job"
  - value: "0"
    label: "insert policies on the leads table"
links:
  - type: "live"
    href: "https://abhijitsinha.in"
    label: "Visit the site"
---

This is client work with real regulatory exposure, which makes it closer to most real product
work than a greenfield app is. The interesting constraint was never the design — it was that a
wrong sentence is a compliance problem.

## Compliance enforced where it can't be bypassed

Publishing an article requires a clean automated compliance lint and a ticked acknowledgement,
and both are enforced by a Postgres check constraint and trigger rather than by front-end
validation alone. The compliance-locked identifiers — the registration number, the statutory
disclosures — are deliberately absent from the editable content table. They're the one thing
the owner cannot change through the admin panel, by construction rather than by convention.

## A lead pipeline with no writable table

Forms post to an edge function that runs honeypot, dwell-time, field-cap, rate-limit and CAPTCHA
checks, then forwards server-to-server to a second function that writes the row. The leads table
itself has no insert policy at all — only a service-role key can write to it, so the public
bundle can't reach it even in principle. The CAPTCHA check fails open while unconfigured and
closed once configured, so a missing secret can never take the only lead channel offline.

## Cookieless, first-party analytics

No IP address, no user agent, no location. The session hash is salted server-side and rotates
daily, and it no-ops entirely on localhost, in the admin panel, and under Do Not Track.
Retention is 13 months, enforced by a scheduled job and disclosed in the privacy policy —
because adding collection without a matching policy edit is the actual failure mode.

## What transferred to this site

A single source of truth for identifiers, a content contract enforced where it can't be
bypassed, self-hosted fonts and no third-party requests so the Content Security Policy can stay
strict, and a set of mobile layout rules learned from one horizontal-scroll bug that took five
deploys to kill and never reproduced in desktop emulation.
