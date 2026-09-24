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
updated: 2026-09-24
---

# Case Study — FPL Decision

> A decision-support app for Fantasy Premier League: an expected-points model, a transfer
> optimiser and a live matchday hub, built solo and running in production at
> [fpldecision.com](https://fpldecision.com/). `claimScope: own-outcomes`.

His own project, so the ordinary claim rules apply — anything true and checkable may be
published. **The repository is public** (github.com/Dsinha97/fpl-app, corrected 2026-09-24 —
it was private when this page was first written), so the case study now links the source.

**Corrected 2026-09-24 against `C:/FPL App` (roadmap, linear.md, wiki timeline).** Four claims
here and in the shipped case study were wrong, and the case study was rewritten:

| Was | Is |
|---|---|
| Period "2025 – present" | Aug 2026 – present; first commit 2026-08-02 |
| "A full season of in-season use" | The opening weeks of the 2026-27 season (GW1 was ~2026-08-21) |
| "Thirty-six shipped sprints" | Forty, by the roadmap's numbering (which has gaps); Sprint 40 shipped 2026-09-24 |
| "Validated by walk-forward backtesting" | **Held to** a walk-forward gate it **does not yet pass**: out of sample it trails a naive last-5-gameweeks baseline in every season tested (Sprint 17a), and no accuracy claim may be made until it beats it |
| "Two engine bugs caught in a data harness before release" | Two engine bugs (knapsack fill order, pruned funding move), fixed in the engine — the pre-release framing is not supported by the sprint docs |
| Three documented negatives | Seven: the xP baseline, the results FDR, FPL login, the price-fall classifier (and its withdrawn false pass), the cancelled calibration refit, the cancelled cold-start phase 2, the latency plan's wrong hypothesis |

The stack gained React, TypeScript, Tailwind, pg_cron and Telegram, and the case study gained a
paragraph on what else shipped (matchday hub, chips, mini-league and top-1k EO, news, Telegram
bot, price-watch, player profile, shortlist, decision analytics, 20 club tactical profiles).

**Recent updates are synced, not written.** `src/lib/fpl-updates.ts` fetches
`docs/wiki/timeline.md` from the public repo at build time and shows the latest six rows,
reduced to a title and one sentence, with tracker ids scrubbed. It falls back to the committed
`src/data/fpl-updates.snapshot.json` when offline (refresh it with
`SYNC_FPL_SNAPSHOT=1 npm run build`), and the panel says "Snapshot" instead of "Synced" when it
does. Build-time only, so the CSP is unchanged.

The Situation / Task / Action / Result below is the original write-up, kept for its reasoning;
where it disagrees with the table above, the table wins.

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
