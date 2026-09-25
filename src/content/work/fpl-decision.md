---
title: "FPL Decision"
tagline: "An expected-points model, a transfer optimiser and a live matchday hub for Fantasy Premier League, built solo and running in production."
role: "Solo — model, optimiser, interface, deployment"
period: "Aug 2026 – present"
stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Postgres", "Deno", "pg_cron", "Cloudflare Workers", "Telegram"]
cover: "../../assets/work/fpl-decision-cover.webp"
coverLight: "../../assets/work/fpl-decision-cover-light.webp"
kicker: "Solo build"
bentoSize: "lg"
order: 1
published: 2026-09-12
updated: 2026-09-24
claimScope: "own-outcomes"
updates: "fpl-timeline"
star:
  situation: >-
    Fantasy Premier League decisions are cheap to make badly and expensive to unwind: a
    transfer costs points, a captaincy choice swings a week, and the public statistics are
    backward-looking totals that say nothing about what a player will do next. The problem
    worth solving isn't displaying data — it's producing a number worth acting on, and being
    honest about how much to trust it.
  task: >-
    Build the thing end to end — data pipeline, model, optimiser, interface, deployment — as
    one person, and hold it to a standard where a recommendation is either defensible or
    labelled for what it is.
  action: >-
    A static Next.js export on Cloudflare Workers, with Supabase Postgres, Deno edge functions
    and pg_cron behind it — row-level security is the real access boundary, not a hosting-level
    gate. An expected-points model held to a walk-forward backtest against a gate agreed before
    each run. A transfer optimiser that treats squad-building as a knapsack problem rather than a
    ranking problem. An interface that keeps costs and assumptions as separate terms instead of a
    bare net figure.
  result: >-
    Live at fpldecision.com since August 2026 and in use through the opening weeks of the
    2026-27 season, across forty numbered sprints. The model does not yet beat its baseline, and
    the project documents that rather than claiming accuracy. Seven findings came back negative and stayed
    documented as negative rather than quietly dropped.
metrics:
  - value: "40"
    label: "sprints shipped since Aug 2026"
    qualifier: "by the roadmap's numbering"
  - value: "20"
    label: "clubs with a tactical profile"
  - value: "1"
    label: "person — model, optimiser, interface, deploy"
  - value: "7"
    label: "findings shipped as documented negatives"
links:
  - type: "live"
    href: "https://fpldecision.com/"
    label: "fpldecision.com"
  - type: "repo"
    href: "https://github.com/Dsinha97/fpl-app"
    label: "Source on GitHub"
---

## The model has to earn its number

An expected-points engine with position calibration, judged by walk-forward backtesting rather
than in-sample fit. The rule that shaped most of the engineering: an acceptance threshold you
invented after seeing the results is not evidence. Every model change has to clear a gate on bias,
mean absolute error and correlation, agreed before the run, or it doesn't ship.

Today the model does not clear it. Out of sample, at the level of a single gameweek, it still
trails a naive average of each player's last five gameweeks, in every season tested. So no
accuracy claim is made for it — not in the app, not here — until the model beats that baseline.

## More than a model

What a manager actually opens the app for: a live matchday hub on deadline day, chip planning,
mini-league and top-1k ownership with effective ownership, a news feed, price-watch, a player
profile reachable from every page, a shortlist, historical decision analytics, tactical profiles
for all twenty clubs, and a two-way Telegram bot that pushes alerts and answers commands.

## Squad construction is a knapsack problem

Filling a squad greedily by raw score under a budget produces a legal squad that is quietly bad
— legality is not quality. The fill orders by score per million, then spends the surplus on raw
points. The transfer search carries funding moves alongside winning ones, because a beam ranked
purely by gain drops the move that only pays off in combination with another. Both of those
started as bugs, and were fixed in the engine rather than patched over in the interface.

## The interface doesn't collapse the math

A headline shows the expected-points gain, the transfer hit and the risk charge as separate
numbers that sum to the net — never a bare net figure. Downgrades are labelled as downgrades. An
empty result set says so rather than ranking worse options anyway. Where upstream data is
missing between seasons, the term is dropped and the remaining weights renormalised, with a
visible note next to the number — never multiplied by zero and shipped as if intact.

## What shipped as a documented negative

Seven findings came back negative and are part of the record, not omissions from it:

- The expected-points model trails the naive last-five-gameweeks baseline out of sample.
- A results-derived fixture-difficulty rating found a real signal and still didn't ship, because
  the baseline it beat wasn't the one production uses.
- Automated FPL login was probed and closed as impossible, rather than left pending.
- A price-fall classifier failed its gate at every budget, so the simpler heuristic ships — and an
  earlier run that appeared to pass was traced to a broken input and withdrawn.
- A planned calibration refit was cancelled once the data showed it would fit the wrong thing.
- A second cold-start phase was cancelled: the players it needed have no source to fit from.
- The latency work's own starting hypothesis was wrong; the real cost was elsewhere, and the
  write-up says so. Every route still came out 135–153 KB lighter.

## Why it's here

It's the clearest single piece of evidence for the whole positioning: a product decision, a
statistical model, an optimisation problem and a production deployment, all in one artefact, all
done by one person. It's also where the "say what the number means" discipline that runs through
the consulting work shows up in software — including when the number is "not yet".
