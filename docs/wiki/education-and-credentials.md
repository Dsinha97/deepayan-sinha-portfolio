---
title: "Education and Credentials"
type: profile
tags: [education, certifications, recognition]
sources:
  - private/sources/mba-brain/deepayan-sinha.md
  - docs/sources/research-paper-details.md
  - docs/sources/additional-cert-links.md
related:
  - experience.md
  - content-guardrails.md
updated: 2026-09-24
---

# Education and Credentials

> Two degrees, one publication, one honour society, and nine certificates — with the
> verification links the site publishes for each.

## Degrees

**William & Mary, Raymond A. Mason School of Business** — MBA, Business Analytics and Supply
Chain Management. August 2024 – May 2026. Williamsburg, VA.

- Beta Gamma Sigma inductee (top 20% of the MBA cohort).
- Lean Six Sigma Green Belt, certificate no. A2026-129.

**Vellore Institute of Technology** — B.Tech, Mechanical Engineering. July 2014 – April 2018.
Vellore, India.

No GPA is recorded anywhere in the source material, so none is published.

## Publication

*Design and Analysis of Thermal Comfort of a Naturally Ventilated Recreational Vehicle* —
published in the International Journal of Energy, Environment and Economics, presented at
ICPAT-19.

The work designed a recreational vehicle for India's climate range with minimal HVAC load,
using energy modelling to show that orientation, fabric and glazing ratio changes bring
consumption to roughly a quarter of an equivalent hotel room. Link:
[ResearchGate](https://www.researchgate.net/publication/334469078_Analysis_of_Thermal_Comfort_of_a_naturally_ventilated_Recreational_Vehicle).

Worth keeping on the site precisely because it is off-axis: it is evidence of quantitative
modelling that predates and is independent of the MBA.

## Certificates

Published with issuer, date and either the certificate itself or a verification URL. Since the
redesign (2026-09-24) every entry is a card with a picture, in one "Certifications and courses"
grid:

- **Certificates** (no verification URL) show page 1 of the certificate, rendered from the PDF
  by `scripts/render-certs.py`; the card opens it in a viewer. The PDFs stay in
  `private/Certificates/` — only the rendered image ships. See
  [content-guardrails](content-guardrails.md#files) for the rule and its limits.
- **Courses** (with a verification URL) link out to the issuer's page, previewed with the image
  that page publishes.

| Certificate | Issuer | Date | Verification |
|---|---|---|---|
| Lean Six Sigma Green Belt (A2026-129) | William & Mary | May 2026 | certificate on file |
| Claude Code 101 | Anthropic | Jun 2026 | certificate on file |
| AI Fluency: Framework & Foundations | Anthropic | May 2026 | certificate on file |
| AI Capabilities and Limitations | Anthropic | May 2026 | certificate on file |
| Power BI Data Modeling with DAX | LinkedIn Learning | Aug 2025 | [verify](https://www.linkedin.com/learning/certificates/88e165371499c5e946bb363e6d6a18e9ea60984fea90b9f38059a034cbe25ee3?u=51086953) |
| Power BI Essential Training | LinkedIn Learning | Jul 2025 | [verify](https://www.linkedin.com/learning/certificates/fc6fe15ae3a6ba6e0d049b94956bd86cb375e7a6bcb66ee9cac458607287243d?u=51086953) |
| SQL Essential Training | LinkedIn Learning | Jun 2025 | [verify](https://www.linkedin.com/learning/certificates/3d2e06df96914e928a9405d59467cf20aca13089e5e554fca2b0731cabd374e8?u=51086953) |
| Aha! Product Management Professional | Aha! | Mar 2025 | certificate on file |
| MBA Math | MBA Math | Jul 2024 | [verify](https://www.mbamath.com/Certificate.aspx?id=93t8lyrdThg%3d) |

Ordered certificates first, then courses. The `group` field (process, product, AI, analytics)
is kept in the data but no longer splits the page.

**Where the dates came from (DSI-94, 2026-09-11).** Three titles in the earlier version of this
table were wrong and are corrected above: the LinkedIn courses are *Power BI Data Modeling with
DAX* and *Power BI Essential Training*, and the Anthropic one is *AI Fluency: **Framework &
Foundations***, not "Foundation and Frameworks". Titles now match what the issuer prints.

- **Read off the certificate file:** LSSGB (May 2026, consistent with certificate no. A2026-129)
  and Aha! (14 March 2025, the only file with an extractable text date).
- **Read off the issuer's verification page:** the three LinkedIn Learning courses and MBA Math.
- **Supplied by the owner:** the three Anthropic certificates. Those PDFs carry **no date
  anywhere on the certificate** — the design simply does not print one, so the files cannot
  settle it and re-reading them will not help a future pass.

## MBA coursework

Course projects are listed **by title and skill only**: no deliverables, no team documents, no
downloads. Team-authored client work is not his to publish. The titles worth naming, each one
a recognisable analytical method rather than a course code: new product development, market
research, lean six sigma, supply chain, global competitive strategy, data analysis, database
management, macroeconomics, cybersecurity strategy, case competition.

## Institution marks

`images/` holds the William & Mary business school logo, the VIT seal and the Wipro wordmark.
Third-party marks need the treatment the `abhijitsinha.in` design system documents: a fixed
tile, `object-contain`, alt text equal to the institution's name, and area balanced rather
than height — wide marks otherwise dwarf compact ones at the same `max-h`.

**They were blurry until the redesign.** Only a 1x file at exactly the display size shipped, so
any 2x or 3x screen upscaled it, and the lossy WebP conversion softened the seal's fine strokes.
They now ship `densities={[1, 2, 3]}` as lossless PNG. Checked at 2x after the change.

## Recognition on the homepage

Beta Gamma Sigma and the ICPAT-19 paper moved out of this section into the homepage bento's
Recognition tile, which expands in place to show the BGS certificate (openable in the same
viewer as the others) and the paper's title, venue, full abstract and ResearchGate link. The
abstract is the paper's own, from `research-paper-details.md`; the data lives in
`src/content/recognition/items.yaml`.

## Sources

- [deepayan-sinha.md](../../private/sources/mba-brain/deepayan-sinha.md) — degrees, honours,
  publication
- [research-paper-details.md](../sources/research-paper-details.md) — the paper's link and
  abstract
- [additional-cert-links.md](../sources/additional-cert-links.md) — the four verification URLs
