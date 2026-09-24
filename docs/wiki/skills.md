---
title: "Skills and Capabilities"
type: profile
tags: [skills]
sources:
  - private/sources/mba-brain/deepayan-sinha.md
  - private/sources/mba-brain/job-search-brief.md
related:
  - content-guardrails.md
  - experience.md
updated: 2026-09-24
---

# Skills and Capabilities

> Four groups, no proficiency bars, and a hard line between what he has done and what he has
> studied.

## Why no percentage bars

A self-assessed "Python 85%" tells a reader nothing and invites the obvious question of who
scored it. The research documents reached the same conclusion and recommended a
domain-separated matrix instead; that part of them survives. Grouping is the information.

## The groups

**Product** — AI/ML implementation, product lifecycle management, backlog prioritisation,
roadmapping, go-to-market strategy, cost optimisation.

**Analytics** — survey design and analysis, benchmarking, data governance.

**Process and strategy** — Lean Six Sigma Green Belt, process optimisation, make-or-buy
analysis, stakeholder and C-suite management, cross-functional delivery.

## The toolkit

Named software is a separate list since the redesign (2026-09-24), in `src/data/tools.ts`, each
entry rendered as a chip with its logo. The owner confirmed on 2026-09-24 that **every tool in
`images/Platforms/` is his own working experience**, so all of them are listed — the applied /
studied line below still governs anything added later.

- **Product & delivery** — JIRA, Confluence, Linear, Trello, Slack, Discord, Workday
- **Data & analytics** — SQL, MySQL, Python, NumPy, pandas, Power BI, Tableau, Microsoft Fabric,
  Excel, JASP
- **Build** — HTML, CSS, JavaScript, TypeScript, React, Next.js, Astro, Tailwind CSS, Supabase,
  Cloudflare, Vercel, GitHub, Postman, APIs
- **AI** — Claude, ChatGPT, Gemini, Perplexity, NotebookLM, prompt engineering
- **Design** — Canva

The Analytics and Engineering skill groups used to name products (SQL, Python, Power BI, Excel,
TypeScript, React…); those moved here so nothing is listed twice, and the Engineering group went
with them. Wipro-era Azure, Java and React Native stay on the Wipro role, where they are dated.

Postgres, Deno and Telegram have logos too, but only as case-study stack chips — they are
project stack, not toolkit, and stay off the homepage by the owner's call (2026-09-24). They
live in `projectLogos` in the same file and resolve through `logoFor`. pg_cron has no logo and
renders as a plain chip.

The logos are optimised copies of the originals (`src/assets/tools/`: rasters trimmed and capped
at 128px; SVG coordinates rounded to three decimals, one decimal for Claude's 1200-unit mark,
because long decimal runs in path data tripped the phone-number guard). They are other
companies' marks, used only to name the tool, and sit on the fixed `--mark-plate` in both
themes — several are black and would vanish on the dark ground.

## The applied / studied line

The MBA Brain vault keeps a careful boundary the website inherits: a long list of frameworks
he can discuss fluently, and a much shorter list of things he has actually been paid to do.
Five Forces, VRIO, CRISP-DM, Theory of Constraints, BATNA, COSO and the rest belong to the
first list.

**The skills section may list capabilities. It may never imply professional application of a
framework that was only studied.** The two studied rows that do carry applied backing are
already covered by the experience entries — data-driven decision making from the Wipro AI/ML
work, governance and risk from the W&M Workday audit — so neither needs special pleading here.

Practically: the engineering group is evidenced by the two shipped sites, the analytics group
by the survey and the internship, the product group by six years at Wipro, and the process
group by the credential. If a reader asks "where did he do this", every group has an answer on
the same page. That test is what keeps a skills list honest, and anything failing it does not
go in the list. See [content-guardrails](content-guardrails.md#framework-fluency-is-not-experience).

## Sources

- [deepayan-sinha.md](../../private/sources/mba-brain/deepayan-sinha.md) — the skills section
- [job-search-brief.md](../../private/sources/mba-brain/job-search-brief.md) — Layer 2, the
  capability inventory and its applied/studied depth column
