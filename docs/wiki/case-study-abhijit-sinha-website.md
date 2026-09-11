---
title: "Case Study — Abhijit Sinha Website"
type: case-study
tags: [engineering, compliance, client-work]
sources:
  - "C:/Abhijit-Sinha-Website/CLAUDE.md"
  - "C:/Abhijit-Sinha-Website/docs/wiki/index.md"
related:
  - case-study-fpl-decision.md
  - design-system.md
updated: 2026-09-10
---

# Case Study — Abhijit Sinha Website

> A regulated-content marketing site for an AMFI-registered mutual fund distributor in India,
> live at [abhijitsinha.in](https://abhijitsinha.in). `claimScope: own-outcomes`.

Built and maintained by him for a real client with real regulatory exposure. The interesting
constraint is not the design; it is that a wrong sentence is a compliance problem.

## Situation

An independent mutual fund distributor needed a public site. In India that is a regulated
activity: every page carries statutory disclosures, the registration identifiers must be exact,
and copy that reads as personalised investment advice, a return guarantee, or a
commission-driven recommendation is not a style issue but a breach. The client also needed to
publish content himself without a developer in the loop.

## Task

Ship a fast, accessible, statutorily compliant site, plus a way for a non-technical owner to
capture leads and publish articles — without creating a path by which a careless edit becomes a
regulatory incident.

## Action

**Architecture.** Astro with Tailwind, static output, no adapter, deployed on Vercel. A single
site-data module is the sole source of truth for every regulatory identifier, contact detail and
commission-table row; components read from it and nothing is hardcoded inline. One shared layout
mounts the regulatory strip, header, footer and statutory text on every page, so a disclosure
cannot be dropped by editing a single page.

**Compliance enforced in the database, not just the interface.** Publishing an article requires
a clean automated compliance lint and a ticked acknowledgement, and both are enforced by a
Postgres check constraint and trigger rather than by front-end validation alone. The
compliance-locked identifiers are deliberately absent from the editable content table — they are
the one thing the owner cannot change through the admin panel.

**A lead pipeline with no writable table.** Forms post to an edge function that runs honeypot,
dwell-time, field-cap, rate-limit and CAPTCHA checks, then forwards server-to-server to a second
function that writes the row. The leads table has no insert policy at all: only a service-role
key can write to it, so the public bundle cannot reach it even in principle. The CAPTCHA check
deliberately fails open while unconfigured and closed once configured, so a missing secret can
never take the only lead channel offline.

**First-party, cookieless analytics.** No IP address, no user agent, no location; the session
hash is salted server-side and rotates daily. It no-ops entirely on localhost, in the admin
panel, and under Do Not Track. Retention is 13 months, enforced by a scheduled job and disclosed
in the privacy policy — because adding collection without a matching policy edit is the actual
failure mode.

**A hard security posture.** An enforcing Content Security Policy, which on a static build means
no inlined scripts or styles anywhere — a build setting that turned out to be load-bearing, since
the framework will otherwise inline small scripts and violate the policy on every page.

## Result

Live on its own domain since September 2026, indexable, with the full statutory framework in
place and the owner publishing content himself. Every published article has passed both an
automated lint and a human acknowledgement before going live.

The lessons that transferred to this portfolio are concrete: a single source of truth for
identifiers, a content contract enforced where it cannot be bypassed, self-hosted fonts and no
third-party requests so the CSP can stay strict, and a set of mobile layout rules learned from
one horizontal-scroll bug that took five deploys to kill and does not reproduce in desktop
emulation.

## Why it belongs on the portfolio

It is client work, not a personal project, and the constraint it was built under — get the words
legally right, then make it fast — is closer to most real product work than a greenfield app is.
It also demonstrates handing control to a non-technical owner without handing over the parts
that must not change.

## Sources

- Abhijit site project root `CLAUDE.md` — compliance rules, data layer, deploy shape
- Abhijit site `docs/wiki/` — particularly the regulatory compliance, data model, security
  hardening and mobile viewport pages
