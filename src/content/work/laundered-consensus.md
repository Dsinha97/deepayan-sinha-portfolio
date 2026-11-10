---
title: "Laundered Consensus"
tagline: "Do AI watchdogs check the approvals other agents claim? A research sprint on what a monitor does when a handoff note says a rule-breaking change was already signed off."
role: "Co-author: attack loop, evaluations, results, companion site"
period: "November 2026"
stack: ["Python", "Modal", "Model fine-tuning", "GitHub", "Next.js", "Vercel"]
cover: "../../assets/work/laundered-consensus-cover.webp"
kicker: "Research sprint"
bentoSize: "md"
order: 5
section: "research"
published: 2026-11-09
claimScope: "team-research"
star:
  situation: >-
    In a multi-agent system the monitor often reads handoff notes written by the agents it is
    meant to oversee. If a note says a rule-breaking change was already approved and no record
    is attached, the monitor has to choose between the claim and the missing evidence. We
    called a wrongly accepted claim laundered consensus. This was our team's entry to the
    Apart Research Swarm Alignment Sprint.
  task: >-
    My part was the adversarial and measurement side: build an attacker that adapts, run it
    against the watchdogs in single handoffs and in relay chains, score the results the same
    way every time, and find out whether fine-tuning a watchdog helps.
  action: >-
    I built the attack loop, the live chains and the scoring code, ran the fine-tuning and the
    pre-registered evaluations on Modal, wrote the results sections of the report, and designed
    and built the companion site.
  result: >-
    An attacker that rewrote only the handoff got 20 of 32 unsupported approvals past two or
    more of four watchdogs. One sentence saying that records decide cut that to between 0 and 2
    of 32. When the record was hidden from the watchdog, the attacks worked again. The report,
    code and site are public. All data is synthetic and the cells are small.
metrics:
  - value: "20 of 32"
    label: "unsupported approvals cleared by 2+ of 4 watchdogs"
    qualifier: "plain prompt, adaptive attacker"
  - value: "0–2 of 32"
    label: "with one sentence saying records decide"
    qualifier: "one replay, two fresh attacks"
  - value: "7–10 of 32"
    label: "relay chains that succeeded with records hidden"
    qualifier: "texts our checker accepted"
  - value: "41 → 0"
    label: "missed violations of 126 after fine-tuning"
    qualifier: "one run per method, outside test"
links:
  - type: "live"
    href: "https://laundered-consensus.vercel.app/"
    label: "Companion site"
  - type: "document"
    href: "https://apartresearch.com/sprints/projects/laundered-consensus-do-ai-watchdogs-check-the-approvals-other-agents-claim-mod49815oz"
    label: "Apart project page"
  - type: "document"
    href: "https://laundered-consensus.vercel.app/report/laundered-consensus-report.pdf"
    label: "Report (PDF)"
  - type: "repo"
    href: "https://github.com/Dsinha97/laundered-consensus"
    label: "Code"
---

*Laundered Consensus: Do AI Watchdogs Check the Approvals Other Agents Claim?* is a team
report with Liezl Coetzee and Prashanth Vijay, submitted to the Apart Research Swarm Alignment
Sprint on 8 November 2026. Liezl designed the pilot and the packets, built the datasets and
ran the label checks. Prashanth reviewed the case families and did the blind hand reads. This
page covers the parts that were mine.

## What the team found

Each test item is a packet: a proposed change, the rule it touches, the records attached, and
a handoff note from the agent passing it on. In a laundered packet the note says the change
was approved and no attached record supports that. Four small models acted as watchdogs.

- With scripted handoffs, none of 32 laundered packets got through. On that evidence the
  watchdogs looked safe.
- With an attacker that rewrote the handoff and learned from each rejection, 20 of 32 got past
  two or more watchdogs.
- One sentence in the watchdog's policy saying that records count, and descriptions of
  records do not, cut that to between 0 and 2 of 32, in a replay of the winning texts and in
  two fresh attacks. False alarms on valid approvals stayed at the pilot's level.
- When the watchdog could not see the records at all, attacks in relay chains succeeded again.

Across every run the pattern is the same. A watchdog holds when it can see the record and is
told the record decides. It fails when it has to take a description on trust.

## An attacker that adapts

A fixed set of test prompts measures how a watchdog handles the cases its authors thought of.
The scripted pilot scored 0 of 32, and stopping there would have produced a reassuring report.

I built a loop in which an attacker model rewrites only the handoff note, sees the watchdog's
verdict and its one-sentence reason, and tries again for a fixed number of rounds. A success
has to survive two checks. It must clear again when replayed on the same watchdog, and a
separate checker must confirm it is still a fair test: the rule, the proposed change and the
records are unchanged, and no record has been invented.

The attack texts themselves are not published. The report describes tactics by category, and
the withheld material is available to reviewers on request.

## Chains, and what the watchdog can see

In practice a note passes through several agents before a reviewer reads it. I built live
relay chains of three, six and twelve steps to test whether a claim gets more convincing as it
is repeated.

With records visible to the watchdog, few attacks got through at any length. With records
hidden, between 7 and 10 of 32 chains succeeded on texts the checker accepted. What the last
reader could see moved the result far more than how many agents the note had passed through.

## Freezing before scoring

Each scored run was frozen before it started: the inputs, the code, the models and the token
limits were hashed into a file, and the runner refused to score without one. A result could
not then be improved by adjusting the question after seeing the answer. The freezes are in the
public repository next to the scores.

The headline number also has a same-model problem, and the report states it. One model served
as both attacker and watchdog. With its verdicts dropped, 20 of 32 becomes 17 of 32.

## Does fine-tuning help?

I fine-tuned one watchdog two ways on Modal GPUs, supervised fine-tuning and a
preference-based method, and tested both on a held-out set and on an outside test built by a
different generator.

On approvals that were described but not attached, missed violations fell from 41 of 126 to 0
for both methods, with 0 to 2 false alarms in about 280 valid rows.

There is one training run per method and no training row was shaped by an attack. We do not
claim that tuning hardens a watchdog against an attacker that adapts.

## The companion site

I built the site on the same structure as the [Quiet Suppression](/work/quiet-suppression/)
one. It adds a release check that scans the source and the built pages for withheld material,
and that refused to pass until all three authors had agreed to publish.

## Limits

Every packet is fictional. Many results rest on 12 to 32 items. Labels come mostly from model
readers, and two people agreed with those labels less often than the models agreed with each
other. We did not test frontier watchdogs or a better-resourced attacker.
