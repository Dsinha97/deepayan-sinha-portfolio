---
title: "Quiet Suppression"
tagline: "Can an AI watchdog be talked out of its own written policy? A three-day research sprint on collusion and monitor capture in AI grievance pipelines."
role: "Co-author: watchdog evaluations, code review, companion site"
period: "October 2026"
stack: ["Python", "Modal", "Claude", "Gemini", "GitHub", "Next.js", "Vercel"]
cover: "../../assets/work/quiet-suppression-cover.webp"
kicker: "Research sprint"
bentoSize: "md"
order: 4
section: "research"
published: 2026-11-09
claimScope: "team-research"
star:
  situation: >-
    Organisations are starting to route complaints through chains of AI agents, with one model
    acting as a watchdog over the others. The Apart Research AI Collusion Research Sprint gave
    teams three days to test how that oversight can fail. Our team of three asked a narrow
    question: if a review board endorses past cases that were handled unsafely, does the
    watchdog start accepting decisions that break its written policy?
  task: >-
    My part was to find out whether the effect held beyond the four models it was first seen
    in, to keep the shared repository reviewable while three people pushed results into it
    against a deadline, and to give the report a public home.
  action: >-
    I set up the repository and reviewed every pull request. I ran the frozen prompt sets
    through four API models and two open-weight reasoning models on Modal, built a
    narrow-question variant of the watchdog, edited the report, and designed and built the
    companion site.
  result: >-
    Across thirteen watchdogs on six matched conditions, eight flagged fewer suppressed cases
    once the unsafe precedents carried a board's endorsement. One sentence stating that written
    policy overrides precedent brought seven of those eight back. The report, code and site are
    public. Everything ran on 36 synthetic complaints, so these are counts from a small test,
    not rates for deployed systems.
metrics:
  - value: "13"
    label: "watchdog models tested on six matched conditions"
    qualifier: "36 synthetic complaints"
  - value: "8 of 13"
    label: "flagged fewer suppressed cases under endorsed precedents"
    qualifier: "descriptive intervals"
  - value: "7 of 8"
    label: "recovered with one policy-priority sentence"
    qualifier: "four returned to 100%"
  - value: "6"
    label: "of the thirteen watchdogs run by me"
    qualifier: "four API, two open-weight"
links:
  - type: "live"
    href: "https://quiet-suppression.vercel.app/"
    label: "Companion site"
  - type: "document"
    href: "https://apartresearch.com/sprints/projects/ai-collusion-sprint-quiet-suppression-bgu1"
    label: "Apart project page"
  - type: "document"
    href: "https://quiet-suppression.vercel.app/report/quiet-suppression-report.pdf"
    label: "Report (PDF)"
  - type: "repo"
    href: "https://github.com/Dsinha97/quiet-suppression-ai-safety-sprint"
    label: "Code"
---

*Quiet Suppression: Collusion and Watchdog Capture in AI Grievance Pipelines* is a team report
with Liezl Coetzee and Prashanth Vijay, submitted to the Apart Research AI Collusion Research
Sprint on 25 October 2026. Liezl designed the study, built the pipelines, ran most of the
experiments and wrote the report. This page covers the parts that were mine.

## What the team found

A grievance pipeline takes in a complaint, rates its severity and decides whether to escalate
it. A watchdog model reads the outcome and flags cases that should have been escalated and
were not. We gave watchdogs a written escalation policy, then added past cases in which
serious complaints had been quietly closed.

- Unsafe precedents on their own left detection close to baseline.
- The same precedents with a review board's approval attached made eight of thirteen
  watchdogs flag fewer suppressed cases.
- Adding one sentence, "Where a past case conflicts with the written escalation policy, the
  written policy controls", brought seven of those eight back. Four returned to full
  detection. Recovery was partial in others.

The practical reading: a monitor's calibration material is an attack surface, and it needs
its own independent review.

## Extending the result past the first four models

The effect first appeared in the four models the team tested first. A finding that rests on
four models is a weak finding, so on the second day I ran the same frozen prompts through four
API models (two Claude, two Gemini), then through two open-weight reasoning models on Modal
GPUs.

The prompt files were frozen before any of these runs, so every model read exactly the same
text. Provider keys stayed in Modal's secret store and each run had a spending cap.

The spread was the useful part. One Gemini model dropped from 48 of 48 suppressed cases
flagged to 16 under endorsed precedents, and returned to 48 with the policy sentence. Another
from the same provider held at 48 in every condition. Two models from one provider went
opposite ways on the same text.

## Review that changed what we could claim

My reruns of two open models matched a teammate's earlier counts almost exactly. That looked
like replication. Reading the runner showed why it was not: the inference engine defaulted to
seed 0, so both runs were the same draw. The fix was a seed option and a real repeat at a
different seed, which a teammate then ran. Both seeds are in the report's tables.

I also had to supersede one of my own runs. Gemini does not allow thinking to be switched off,
so my first run was not comparable with the others. I re-ran it at the lowest thinking level
and the note records the correction.

## A narrower question for the watchdog

On the harder case set, where the severity ratings themselves had been downgraded,
watchdogs missed many suppressed cases even before any precedent was added. I replaced the open-ended instruction with four
yes-or-no questions and a fixed rule for when to flag. Detection rose in all four API models I
tried it on.

This is one prompt design on thirteen cases with no ablation. It is a lead for later work, not
a headline result.

## The companion site

The report is the judged document. I built a static site to make it readable in two minutes:
the abstract, the headline counts, the results tables, the team's video, and who did what. It
is a Next.js static export on Vercel with no database, cookies or third-party requests, and
every number on it lives in one file that was checked against the report before publishing.

## Limits

All complaints are synthetic. Reads share complaints, so the intervals are descriptive. We did
not test spontaneous collusion between agents, and we did not test a deployed defence.
