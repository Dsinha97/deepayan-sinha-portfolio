---
title: "Research — the Apart sprints"
type: case-study
tags: [research, ai-safety, team-work]
sources:
  - "https://quiet-suppression.vercel.app/"
  - "https://apartresearch.com/sprints/projects/ai-collusion-sprint-quiet-suppression-bgu1"
  - "https://github.com/Dsinha97/quiet-suppression-ai-safety-sprint"
  - "https://laundered-consensus.vercel.app/"
  - "https://apartresearch.com/sprints/projects/laundered-consensus-do-ai-watchdogs-check-the-approvals-other-agents-claim-mod49815oz"
  - "https://github.com/Dsinha97/laundered-consensus"
related:
  - content-guardrails.md
  - site-architecture.md
  - skills.md
updated: 2026-11-09
---

# Research — the Apart sprints

> Two co-authored AI-safety reports from Apart Research sprints, published as their own
> homepage section with one case-study page each (DSI-222). The rules for what these pages may
> say are in [content-guardrails](content-guardrails.md#co-authored-research).

## The two entries

| | Quiet Suppression | Laundered Consensus |
|---|---|---|
| Full title | *Collusion and Watchdog Capture in AI Grievance Pipelines* | *Do AI Watchdogs Check the Approvals Other Agents Claim?* |
| Sprint | AI Collusion Research Sprint, 23–25 Oct 2026 | Swarm Alignment Sprint, 6–8 Nov 2026 |
| Authors | Liezl Coetzee, Deepayan Sinha, Prashanth Vijay | same |
| Page | `/work/quiet-suppression/` | `/work/laundered-consensus/` |
| Entry | `src/content/work/quiet-suppression.md` | `src/content/work/laundered-consensus.md` |
| His printed contribution | Repository set-up and review of every pull request; the Claude, Gemini, gpt-oss and OLMo watchdog runs; the narrow-question watchdog; editing the report; the companion site | The attack loop, live chains and scoring code; the training and the pre-registered evaluations; the results sections (4.1 to 4.7); the companion site |

Each page links four things: the companion site, the Apart project page, the report PDF as
served by the companion site, and the public code repository. Nothing is rehosted.

## Where the facts come from

The page copy was written from the public companion sites, whose every number is copied from
the final report, and from the reports' Author Contributions. Details of how the runs were
done (frozen prompts, seeds, freezes, the checker) come from the public repositories' READMEs.

The owner's sprint workspace is a separate local folder outside this repository. It was read
for this work and nothing was copied from it except the two cover images. It holds material
that must never reach this repo: the withheld attack texts, teammates' drafts and messages,
and a funding application.

## Decisions (owner, 2026-11-09)

- **Two pages, not one.** The first plan was a single combined case study; the owner chose a
  page per report.
- **A separate Research section.** Team research sits apart from Selected work so it never
  reads as solo or client work. Its heading is generic, "Research and publications", not
  about AI safety (owner correction, same day), and it also holds the ICPAT-19 paper, moved
  from the retired Recognition tile.
- **Co-authors are named.** See the guardrails page for why this differs from Fort Monroe.
- **Covers come from the companion sites**: the *Quiet Suppression* hero image and the
  *Laundered Consensus* social card, both converted to WebP in `src/assets/work/`. Both were
  checked by eye: no attack text, no transcript, no person.
- **No Experience role**, and no employer is named for this work.

## What these pages must not say

- Anything beyond the printed contributions. He did not design either study.
- A count as a general rate. "20 of 32" is 20 of 32 synthetic packets.
- Any attack text, planted line or forged note from *Laundered Consensus*, or a link to the
  private repository.
- A judging result, prize or ranking. None is known.
- Anything about funding, spend, or a sprint that has not happened.

## Not done

- **Report figures are not embedded.** They are drawn on white and would be white boxes in
  dark theme. Redrawing them on the site's tokens would be a separate piece of work.
- **No video embed.** The CSP has no `media-src` or `frame-src`, and the videos are a
  co-author's work; the companion sites carry them.
- **The sprint reports are not presented as publications.** They are sprint submissions, not
  peer-reviewed. The one peer-reviewed item, the ICPAT-19 paper, sits in the same section in
  its own tile, labelled "Published paper", so the two kinds stay distinct.
- A third sprint, AI x Epistemics, is tracked as DSI-223 and blocked until it is finished
  and public.

## Sources

- The two companion sites, Apart project pages and public repositories listed in the
  frontmatter, read 2026-11-09. All six URLs returned 200 on that date.
