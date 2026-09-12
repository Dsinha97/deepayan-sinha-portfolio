---
title: "Content Guardrails"
type: rules
tags: [content, claims, privacy]
sources:
  - private/sources/mba-brain/job-search-brief.md
  - private/sources/mba-brain/fort-monroe-engagement.md
  - private/sources/mba-brain/wipro-digital-health-assistant.md
related:
  - experience.md
  - case-study-fort-monroe.md
  - profile.md
updated: 2026-09-10
---

# Content Guardrails

> What may and may not be published on deepayansinha.com. This page is the single home for
> these rules — every other page links here rather than restating them.

Most of these come from the MBA Brain vault, which states them for outward-facing material
generally. They are not stylistic preferences. Each one exists because publishing the
alternative would be a fabrication, a privacy breach, or a claim the evidence does not support.

## The claim rule that generates most of the others

**Two kinds of outcome exist, and only one is documented.**

- **Engagement outcomes** — what was delivered, how the client responded, whether they came
  back. Documented. **Publishable.**
- **Business outcomes** — what the client then executed and what resulted. **Unknown.
  Never publish.**

"The client commissioned a follow-on engagement" is accurate and strong. "Increased parking
revenue by…" is a fabrication, however plausible it sounds. Recommendations were delivered;
adoption is not recorded.

Case studies declare which rule they are under in frontmatter (`claimScope`), and the
`engagement-outcomes` value renders a visible footnote on the page. See
[site-architecture](site-architecture.md).

## Fort Monroe

| Rule | Why |
|---|---|
| Engagement outcomes only | Above. The independent post-project review and the commissioned follow-on are the documented results |
| **Never use the $500,000 parking figure** | It is an Ocean Isle Beach, NC benchmark that migrated into the team roadmap as if it were a Fort Monroe baseline. Fort Monroe's own figure is ~$257K/yr (FMA, 2013) — roughly half. Publishing it would repeat the error the work itself caught |
| No SEO figures | Site health, visitor counts, broken pages, toxic domains: teammates' work, and stale |
| Claim only his four deliverables | The survey, the parking monetization analysis, the 15th-anniversary event plan, the Central Park Conservancy comparative. The Theory of Constraints diagnosis, four other benchmarks, the SEO audit and the ten-year roadmap were teammates' |
| Central Park Conservancy figures carry "as reported in source" | Dated third-party financials |
| No teammate, faculty or client-executive names | Real people who did not consent to appearing on a portfolio |

The catch is itself publishable, and it is the strongest credibility story available: a
benchmark from another site was propagating as a local baseline, and he caught it. Tell that
story **without the dollar amount and without naming who introduced it** — say "roughly double
the real figure". Printing the number beside the client's name is how it propagates again,
which is the exact failure the story is about.

## Wipro

| Rule | Why |
|---|---|
| **No client name** — write "a European insurance client" | Withheld at Deepayan's own request |
| **No vendor or platform names** — write "a conversational-AI platform", "a symptom-check service" | Same |
| The tech stack **is** publishable: Azure, Java, JavaScript, React Native | Explicitly cleared |
| Mark the 4.4-star rating, the ~$100K/yr platform cost and the 30% service-call reduction as self-reported | Good-faith recollection, not verified against a retained company document. He cannot produce the source post-departure |

Say **six years** (August 2018 – August 2024). One source says "5+"; every other says six, and
the dates settle it.

## Framework fluency is not experience

The vault carefully separates **applied** work from **studied** material. Five Forces, CRISP-DM,
Theory of Constraints, BATNA and the rest are things he can discuss fluently, not things he was
paid to do. The website may list them as capabilities; it may never imply professional
application. Only two studied rows carry an applied tag, and both are already covered by the
experience entries: data-driven decision making (the Wipro AI/ML work) and governance and risk
(the W&M Workday audit).

## Personal data

- **The phone number is never published, on any route or in any artifact.** Not in page copy,
  not in JSON-LD, not in the resume PDF that ships to `public/`, not on a case-study page added
  later. The rule is per-repository, not per-page, and nothing needs adding to the guard when a
  route is added: [`scripts/check-dist.mjs`](../../scripts/check-dist.mjs) walks `dist/`
  recursively and scans every text file and every PDF it finds.
  **This is enforced, not aspirational** — it runs as a build step and exits non-zero. It is
  deliberately over-eager: a false positive costs one conversation, a false negative is
  permanent and scrapeable.
- **The PDF scan inflates compressed streams (fixed 2026-09-11, DSI-97).** The earlier version
  scanned a PDF's raw bytes, which was wrong in both directions, and both were measured against
  the real resume rather than reasoned about:
  - **It could not see the number.** PDF text lives in FlateDecode streams, so normally
    compressed text is simply absent from the raw bytes. The resume carries four phone-shaped
    strings that appear only after inflating.
  - **It drowned in noise.** Binary font and image data matched the phone pattern 131 times in
    that same file, so *any* PDF failed the build with 131 unreadable hits and a real match
    would have been invisible among them.

  The guard now inflates each stream and scans the decoded text, scans short uncompressed
  streams, and scans the document structure outside streams — never binary payloads as bytes.
  Verified by copying the unredacted resume into `dist/` and confirming exit 1 with precise
  hits, then deleting it.
- **Not scanned, and worth knowing:** images. A phone number baked into a picture — an OG card,
  a screenshot of a business card, a scanned document — passes every check here. If an image
  ever carries contact details, that is a human review, not a build step.
- **Visa status and work authorization are not published.** Not the visa type, not OPT duration,
  not whether sponsorship is needed. A peer site reviewed during M3 states all three, and it is a
  legitimate choice — but it is the owner's to make explicitly, and the answer as of
  2026-09-11 is no. It belongs in an application form, where it is asked and answered in context,
  rather than on a public page that outlives the circumstance.
- Published contact channels are exactly: `contact@deepayansinha.com`, LinkedIn, GitHub.
- `deepayansinha@gmail.com` is the mail-routing destination, not a published address.
- No home address. City and state are fine.

## Files

- **`private/` is never committed and never copied into `public/`.** Certificates, transcripts,
  degree certificates, MBA coursework files, the original resume, and the vault snapshot all
  live there. Their factual *contents* — a certificate's name, issuer and public verification
  URL — may be published; the files themselves stay local.
- MBA course projects appear **by title and skill only**. No client deliverables, no team
  documents, no downloads.

## Sources

- [job-search-brief.md](../../private/sources/mba-brain/job-search-brief.md) — "What this pack
  is not", the Fort Monroe constraint section, and the Wipro withholding notice
- [fort-monroe-engagement.md](../../private/sources/mba-brain/fort-monroe-engagement.md) —
  attribution of deliverables, the $500K correction
- [wipro-digital-health-assistant.md](../../private/sources/mba-brain/wipro-digital-health-assistant.md)
  — the withheld names and the self-reported figures
