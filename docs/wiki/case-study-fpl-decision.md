---
title: "Case Study — FPL Decision"
type: case-study
tags: [product, engineering, modelling]
sources:
  - "C:/FPL App/CLAUDE.md"
  - "C:/FPL App/docs/wiki/index.md"
related:
  - case-study-abhijit-sinha-website.md
  - content-guardrails.md
updated: 2026-09-10
---

# Case Study — FPL Decision

> A decision-support app for Fantasy Premier League: an expected-points model, a transfer
> optimiser and a live matchday hub, built solo and running in production at
> [fpldecision.com](https://fpldecision.com/). `claimScope: own-outcomes`.

His own project, so the ordinary claim rules apply — anything true and checkable may be
published. The repository is private, which makes the case study itself the artefact a reader
can evaluate.

## Situation

Fantasy Premier League decisions are cheap to make badly and expensive to unwind: a transfer
costs points, a captaincy choice swings a week, and the public statistics are backward-looking
totals that say nothing about what a player will do next. The interesting problem is not
displaying data. It is producing a number you would actually act on, and being honest about how
much to trust it.

## Task

Build the thing end to end — data pipeline, model, optimiser, interface, deployment — as one
person, and hold it to a standard where a recommendation is either defensible or not shipped.

## Action

**Architecture.** A static Next.js export on Cloudflare Workers static assets, with Supabase
Postgres and Deno edge functions behind it. No server at runtime: every page loads its own data
in the browser, and row-level security in Postgres is the real access boundary rather than a
hosting-level gate. Ingest and any privileged write goes through a service-role edge function
that the client bundle can never reach.

**The model.** An expected-points engine with position calibration, validated by walk-forward
backtesting rather than in-sample fit. The governing rule, and the one that shaped most of the
engineering: an acceptance threshold you invented is not evidence. Every model change has to
clear a pre-agreed gate on bias, mean absolute error and correlation against a walk-forward run,
or it does not ship.

**The optimiser.** Squad construction under a budget is a knapsack problem, not a ranking
problem — filling greedily by raw score produces a legal squad that is quietly bad, because
legality is not quality. The fill orders by score per million and then spends the surplus on raw
points. The transfer search carries funding moves alongside winning ones, because a beam ranked
purely by gain drops the move that pays off only in combination with another.

**Honesty in the interface.** Costs and assumptions stay their own terms: a headline shows the
expected-points gain, the transfer hit and the risk charge as separate numbers that sum to the
net, never a bare net figure. Downgrades are labelled as downgrades. An empty result set says so
rather than ranking worse options. Where upstream data is missing between seasons, the term is
dropped and the remaining weights renormalised, with a visible note next to the number — never
multiplied by zero and shipped as if intact.

## Result

Live at fpldecision.com through a full season of in-season use, across thirty-six shipped
sprints. The engine work is verified by running real modules against live data in a harness
before trusting the interface — two genuine bugs, the knapsack fill and the pruned funding
move, survived code review and were caught that way in minutes.

Several findings came back negative and stayed documented as negative: a results-derived
fixture-difficulty rating was measured and not shipped; automated login was probed and proven
impossible rather than left as a pending task; a set of model questions sit explicitly blocked
on data the upstream API does not publish. The blocked list is part of the record, not an
omission from it.

## Why it belongs on the portfolio

It is the clearest single piece of evidence for the positioning: a product decision, a
statistical model, an optimisation problem and a production deployment, all in one artefact,
all done by one person. It is also where the "say what the number means" discipline that runs
through the consulting work shows up in software.

## Sources

- FPL App project root `CLAUDE.md` — architecture, ground rules, the gotchas list
- FPL App `docs/wiki/` — particularly the expected-points model, transfer engine, deployment
  and blocked-data pages
