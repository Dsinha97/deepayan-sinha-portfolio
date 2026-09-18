---
title: "FPL Decision"
tagline: "An expected-points model, a transfer optimiser and a live matchday hub for Fantasy Premier League, built solo and running in production."
role: "Solo — model, optimiser, interface, deployment"
period: "2025 – present"
stack: ["Next.js", "Cloudflare Workers", "Supabase", "Postgres", "Deno"]
cover: "/work/fpl-decision-cover.webp"
coverLight: "/work/fpl-decision-cover-light.webp"
bentoSize: "lg"
order: 1
claimScope: "own-outcomes"
star:
  situation: >-
    Fantasy Premier League decisions are cheap to make badly and expensive to unwind: a
    transfer costs points, a captaincy choice swings a week, and the public statistics are
    backward-looking totals that say nothing about what a player will do next. The problem
    worth solving isn't displaying data — it's producing a number worth acting on, and being
    honest about how much to trust it.
  task: >-
    Build the thing end to end — data pipeline, model, optimiser, interface, deployment — as
    one person, and hold it to a standard where a recommendation is either defensible or not
    shipped.
  action: >-
    A static Next.js export on Cloudflare Workers, with Supabase Postgres and Deno edge
    functions behind it — row-level security is the real access boundary, not a hosting-level
    gate. An expected-points model validated by walk-forward backtesting against a pre-agreed
    gate on bias, error and correlation. A transfer optimiser that treats squad-building as a
    knapsack problem rather than a ranking problem. An interface that keeps costs and
    assumptions as separate terms instead of a bare net figure.
  result: >-
    Live at fpldecision.com through a full season of in-season use, across thirty-six shipped
    sprints. Two genuine engine bugs were caught in a data harness before they ever reached the
    interface. Several findings came back negative and stayed documented as negative rather
    than quietly dropped.
metrics:
  - value: "36"
    label: "sprints shipped this season"
  - value: "2"
    label: "engine bugs caught pre-release"
    qualifier: "knapsack fill & pruned funding move"
  - value: "1"
    label: "person — model, optimiser, interface, deploy"
  - value: "3"
    label: "findings shipped as documented negatives"
links:
  - type: "live"
    href: "https://fpldecision.com/"
    label: "Visit fpldecision.com"
---

The repository is private, so this case study is the artefact — written to be evaluable on its
own rather than pointing at code a reader can't see.

## The model has to earn its number

An expected-points engine with position calibration, validated by walk-forward backtesting
rather than in-sample fit. The rule that shaped most of the engineering: an acceptance threshold
you invented is not evidence. Every model change has to clear a pre-agreed gate on bias, mean
absolute error and correlation against a walk-forward run, or it doesn't ship.

## Squad construction is a knapsack problem

Filling a squad greedily by raw score under a budget produces a legal squad that is quietly bad
— legality is not quality. The fill orders by score per million, then spends the surplus on raw
points. The transfer search carries funding moves alongside winning ones, because a beam ranked
purely by gain drops the move that only pays off in combination with another.

## The interface doesn't collapse the math

A headline shows the expected-points gain, the transfer hit and the risk charge as separate
numbers that sum to the net — never a bare net figure. Downgrades are labelled as downgrades. An
empty result set says so rather than ranking worse options anyway. Where upstream data is
missing between seasons, the term is dropped and the remaining weights renormalised, with a
visible note next to the number — never multiplied by zero and shipped as if intact.

## What shipped as a documented negative

A results-derived fixture-difficulty rating was measured and not shipped. Automated login was
probed and proven impossible rather than left as a pending task. A set of model questions sit
explicitly blocked on data the upstream API doesn't publish. The blocked list is part of the
record, not an omission from it.

## Why it's here

It's the clearest single piece of evidence for the whole positioning: a product decision, a
statistical model, an optimisation problem and a production deployment, all in one artefact, all
done by one person. It's also where the "say what the number means" discipline that runs through
the consulting work shows up in software.
