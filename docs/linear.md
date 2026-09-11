# Linear ↔ docs

The join between this repo and the Linear project.
**[Deepayan-Portfolio](https://linear.app/dsinha-org/project/deepayan-portfolio-4de86f94d1f2)**,
team `Dsinha Org` (`DSI`). Any issue's URL is `https://linear.app/dsinha-org/issue/<id>`.

**Linear owns what is planned and what its status is** — priority, milestone, backlog order, open
or done. **`docs/` owns what happened and why** — the wiki, the decisions, the measured results,
the things tried and rejected. Neither restates the other: an issue links the doc that states its
gate rather than copying it into a second place where it can rot.

## Milestones

| Milestone | Target | Covers |
|---|---|---|
| M0 · Foundation | 2026-09-12 | Repo, private boundary, wiki, Linear setup |
| M1 · Scaffold and deploy | 2026-09-17 | Astro and Tailwind skeleton, tokens, Workers deploy, apex domain, email |
| M2 · Shell and design system | 2026-09-22 | Layout, theme toggle and CSP pipeline, fonts, logo, responsive pass |
| M3 · Content | 2026-09-29 | Hero, about, experience, education, skills, contact, resume |
| M4 · Case studies | 2026-10-03 | Collections and schema, three case studies, work index |
| M5 · Launch | 2026-10-08 | SEO, OG, headers audit, Lighthouse, QA, go-live |
| M6 · Beyond launch | — | Profile README, contact form, analytics, palette, fourth case study, writing |

## Shipped

| Item | Issue | Milestone | Doc |
|---|---|---|---|
| Repo, private boundary, first push | DSI-78 | M0 | [CLAUDE.md](../CLAUDE.md) |
| Build docs/wiki from the sources | DSI-79 | M0 | [wiki/index.md](wiki/index.md) |
| Linear mapping doc, skills, weekly drift check | DSI-80 | M0 | this file, and `.claude/skills/` |
| Scaffold Astro 5 and Tailwind 4 | DSI-81 | M1 | [site-architecture.md](wiki/site-architecture.md) |
| Design tokens: purple and teal, light and dark | DSI-82 | M1 | [design-system.md](wiki/design-system.md) |
| Apex domain, www redirect, HTTPS and HSTS | DSI-84 | M1 | [deployment-domain.md](wiki/deployment-domain.md) |

## Open

| Issue | Item | Milestone | Gate / blocker |
|---|---|---|---|
| DSI-83 | Cloudflare Workers static-assets deploy via Git integration | M1 | Manual `wrangler deploy` is live; Cloudflare Workers Builds not yet connected to the GitHub repo |
| DSI-85 | Email routing for contact@ | M1 | A test message arrives in Gmail. Check whether routing already exists on the zone |
| DSI-86 | BaseLayout, header, footer, navigation | M2 | Renders on every route, keyboard-navigable end to end |
| DSI-87 | Theme toggle, no-flash init, CSP hash pipeline | M2 | No flash either mode; dist guard passes; zero CSP violations under `wrangler dev` — [security-headers.md](wiki/security-headers.md) |
| DSI-88 | Self-hosted typography and spacing scale | M2 | No request to any origin but the site's own |
| DSI-89 | Logo cleanup: vector mark, favicons, OG base | M2 | Crisp at 32px and 512px; no white box in dark mode. **Blocks the shell** — the source is a JPEG on white |
| DSI-90 | Responsive pass across breakpoints and themes | M2 | No horizontal scroll at any breakpoint in either theme, checked on a real phone |
| DSI-91 | Hero | M3 | Owner approves the copy; zero layout shift from the headshot |
| DSI-92 | Proof strip and About | M3 | Every claim traceable to a wiki page |
| DSI-93 | Experience timeline | M3 | Guardrails grep passes: no withheld names, no phone number, self-reported figures marked — [content-guardrails.md](wiki/content-guardrails.md) |
| DSI-94 | Education, credentials and recognition | M3 | Verification links resolve. Certificate dates need reading off the files first |
| DSI-95 | Skills matrix | M3 | Each group maps to evidence elsewhere on the page |
| DSI-96 | Contact section with copy-to-clipboard | M3 | Works with JavaScript disabled |
| DSI-97 | Web-safe resume PDF and /resume | M3 | Text extracted from the shipped PDF contains no phone-number pattern |
| DSI-98 | Content collections, schema, page template | M4 | `astro check` clean; a deliberately broken entry fails the build |
| DSI-99 | Case study: FPL Decision | M4 | Owner review — [case study](wiki/case-study-fpl-decision.md) |
| DSI-100 | Case study: Abhijit Sinha website | M4 | Owner review — [case study](wiki/case-study-abhijit-sinha-website.md) |
| DSI-101 | Case study: Fort Monroe consultancy | M4 | **Engagement outcomes only.** Every result sentence describes a deliverable or the client's response — [case study](wiki/case-study-fort-monroe.md) |
| DSI-102 | Work index: bento grid | M4 | Reflows at 375, 768, 1280 |
| DSI-103 | SEO: metadata, sitemap, structured data | M5 | Schema validator reports zero errors — [seo-and-metadata.md](wiki/seo-and-metadata.md) |
| DSI-104 | Open Graph images | M5 | Each URL renders its card in a real link preview |
| DSI-105 | Security headers audit on production | M5 | Zero CSP violations across every route; A grade externally |
| DSI-106 | Lighthouse and accessibility audit | M5 | 95+/100/100/100 on the deployed site, both themes, no third-party requests |
| DSI-107 | Cross-device QA and link check | M5 | Zero broken links |
| DSI-108 | Go-live | M5 | Full checklist green on production in one sitting; wiki `status` flipped to `built` |
| DSI-109 | GitHub profile README | M6 | None. Owner decision on scope |
| DSI-110 | Contact form | M6 | **Blocked** — owner decides the form is worth a backend, a database and a CSP widening |
| DSI-111 | Privacy-preserving analytics | M6 | CSP widened in the same change; beacon confirmed reaching its endpoint |
| DSI-112 | Command palette | M6 | Only if the site stays inside its JavaScript budget with it included |
| DSI-113 | Fourth case study: Wipro | M6 | **Blocked** — owner decides whether enough survives genericization to carry a page |
| DSI-114 | Writing or notes section | M6 | **Blocked** — owner has at least three pieces drafted |

## How to keep it true

- **New work starts as a Linear issue**, not as a line in a doc. The dashboard is where priority
  and order are set.
- **A shipped item closes its issue** and moves from the Open table to the Shipped table above.
- **An issue with no row here, and a doc item with no issue, are both drift.** `/linear-sync`
  reports both directions; it does not silently fix either.
- **Don't copy a gate into Linear.** Link the doc that states it — a gate has exactly one home,
  and it isn't here.
- **The drift check runs itself.** A scheduled task fires `/linear-sync` every Monday morning and
  stays silent when the two sides agree. A report from it is a signal, not noise.
- **The wiki's `status` field is checked too.** A page marked `planned` whose issue is closed, or
  `built` whose issue is open, is drift. It is the only place a doc claims something is built, so
  it is the only place that claim can silently go stale.
