---
title: "Research Synthesis"
type: synthesis
tags: [sources, provenance]
sources:
  - docs/sources/portfolio-website-plan.md
  - docs/sources/design-suggestions.md
related:
  - design-system.md
  - site-architecture.md
  - profile.md
updated: 2026-09-10
---

# Research Synthesis

> What was kept from the two research documents, what was thrown away, and why the distinction
> matters enough to write down.

## The problem

`docs/sources/portfolio-website-plan.md` and `docs/sources/design-suggestions.md` are the
starting research for this project. They are detailed, confident, and **factually wrong about
the person the site is for**.

They describe a "Software Engineer and Systems Specialist" whose portfolio should feature a
distributed microservices mesh in Go with Kafka and Kubernetes, a high-performance simulation
kernel compiled to WebAssembly, an enterprise telemetry pipeline, and a "Best Software and AI
Project" award at an international engineering competition. They cite specific performance
numbers: 64% query-latency reduction, 1.8 seconds down to 220 milliseconds, 75% faster
execution.

None of it exists. Not the projects, not the award, not the metrics, not the Go and Kubernetes
experience. The documents appear to have been generated from a template for a different
archetype, with plausible detail filled in.

## Why this page exists

Because the documents are still in the repository, and a future session reading them cold would
have no way to know. They are kept as provenance — they are where the structural thinking came
from — and freezing them is more honest than deleting them. But a frozen source that looks
authoritative is a trap unless something says plainly that it is not.

**Rule: the research documents are never a content source.** Content comes from the resume, from
[profile](profile.md) and [experience](experience.md), and ultimately from the MBA Brain vault
snapshot. The research documents inform structure and nothing else.

## What was kept

The structural thinking is genuinely good, and most of it survives:

- **Progressive disclosure.** A reader scanning for ten seconds gets the credentials; a reader
  going deeper gets the reasoning. This drives the homepage section order.
- **Case studies over a repository list.** Framing work as situation, task, action, result
  rather than a grid of project cards with no context. This became the `work` collection schema.
- **The bento grid** as the work index, with deliberate size hierarchy rather than a uniform
  grid.
- **An 8-point spatial system**, a 1200px container, and a 45 to 75 character measure.
- **Three typographic tiers** — display, body, monospace for metadata — with tight negative
  tracking on display text.
- **A skills matrix grouped by domain**, explicitly rejecting percentage proficiency bars.
- **Accessibility as a stated target** rather than an afterthought, with contrast minimums.
- **A performance budget** with named Core Web Vitals thresholds.
- **JSON-LD, Open Graph cards, and a canonical URL strategy.**
- **Edge hosting on Cloudflare with the apex canonical.**
- **Astro with islands** as the framework recommendation, which matches the sibling project.

## What was discarded

- **Every project.** All four flagship case studies are inventions. The real three are
  [FPL Decision](case-study-fpl-decision.md), the
  [Abhijit Sinha website](case-study-abhijit-sinha-website.md) and the
  [Fort Monroe consultancy](case-study-fort-monroe.md).
- **The award.** There is no "Best Software and AI Project" track win. The real recognition is
  Beta Gamma Sigma, the Wipro Trail Blazers award, and a published paper.
- **Every performance metric.** The percentages and latency figures are fabricated.
- **The technical arsenal.** Go, Kubernetes, Kafka, gRPC, PyTorch, Prometheus, Django,
  WebAssembly and the rest are not his stack. See [skills](skills.md) for what is.
- **The positioning.** "Software Engineer and Systems Specialist" is the wrong archetype
  entirely; see [profile](profile.md) for the one the evidence supports.
- **The palette.** Zinc canvas with sky-blue and emerald accents is a generic developer-portfolio
  look with no connection to his brand. Replaced by the logo-derived purple and teal in
  [design-system](design-system.md).
- **Dark-only.** The logo is drawn for a light background; light is the default, with dark
  available.
- **The "available for hire" pulsing status badge.** A live availability indicator has to be
  maintained or it lies, and it dates a page badly once it is stale.
- **GitHub profile telemetry widgets.** Commit streaks and language-distribution cards say
  nothing useful about someone whose most substantial repositories are private, and they pull
  third-party images that the Content Security Policy would have to allow.

## The one genuinely useful thing they got right by accident

The documents insist that a portfolio should be "an empirical proof-of-work system" rather than
a digital resume, and then demonstrate the failure mode by fabricating the proof. The site takes
the principle seriously in the opposite direction: every claim on it is traceable, self-reported
figures are marked as self-reported, and one case study carries a visible footnote about the
limits of what it can claim. See [content-guardrails](content-guardrails.md).

## Sources

- [portfolio-website-plan.md](../sources/portfolio-website-plan.md) — read in full, 2026-09-10
- [design-suggestions.md](../sources/design-suggestions.md) — read in full, 2026-09-10
