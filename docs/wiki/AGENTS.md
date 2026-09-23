# Operating instructions for docs/wiki/

Governs how any agent maintains `docs/wiki/`. Scoped to this folder — it does not override
the root `CLAUDE.md`, and where the two disagree, `CLAUDE.md` wins.

Ported from the `abhijitsinha.in` wiki contract, which shares this repo's authority model.
Do not re-import the FPL App version: there `roadmap.md` outranks the wiki, which is the
opposite of the arrangement here.

## What this wiki is

`docs/wiki/` is synthesis: one page per real topic, written in your own words, cross-linked,
each claim traceable to the file or shipped behaviour it came from.

**Who wins.** This wiki is the **authoritative content reference** for the website — what
goes on the page, in what words, under what constraints. `docs/sources/` is provenance only:
historical research documents, frozen, never more current than the wiki. The two research
docs in particular are **factually wrong about Deepayan** (see `research-synthesis.md`) and
must never be treated as a content source.

The one thing that outranks the wiki is **shipped code plus the live site**. A wiki claim
contradicted by what actually deploys is a wiki bug.

`private/sources/mba-brain/` is a frozen snapshot of an external vault. It is provenance of
the same kind, with one extra rule: nothing from it reaches a wiki page or the website except
through `content-guardrails.md`.

## Folder conventions

<!-- RETRO fills this in over time. Each line is a rule learned from a correction Deepayan gave
Claude while working in docs/wiki/ specifically — not a general repo rule, those belong in the
root CLAUDE.md. Empty until the first RETRO pass has something to add. -->

## The jobs

### INGEST

When source material or shipped behaviour changes:

1. Read what changed.
2. Find the existing page the topic belongs to and update it. **Never create a near-duplicate
   page** — create one only for a genuinely new topic with no existing home, and add it to
   `index.md` under the right section.
3. Write synthesis, not a changelog paste. Say what the thing now does and why, including the
   reasoning that would otherwise be lost — a decision without its rationale gets re-litigated
   six months later.
4. Cross-link both directions.
5. Update the page's frontmatter (`related`, `sources`, `updated`).
6. Append one line to `log.md`, dated `YYYY-MM-DD`.
7. Update `.manifest.json` for any source file processed (hash + date).
8. If the change alters a rule an agent must not violate, also add it to the root `CLAUDE.md`
   — the wiki is read on demand, `CLAUDE.md` is read every session.

Ingest only ever writes to `docs/wiki/` and, for rule changes, `CLAUDE.md`. It never edits
`docs/sources/` or `private/`.

### ANSWER

Answer from the wiki first and name the page used. If the wiki does not cover it, say so
plainly rather than improvising, then go read the code or the sources and say that is what you
are doing. A gap you had to fill from source is a gap worth writing up next ingest.

### TIDY

Produce a **punch list only**, never auto-fix:

- Pages contradicting each other, or contradicting shipped code.
- Claims gone stale — a "planned" item that now exists, a superseded decision, a passed date.
- Orphan pages nothing links to; dead links to pages that do not exist.
- Topics that keep coming up with no page of their own.
- Pages with no `## Sources` block.
- Frontmatter that has drifted from the page's actual links.

Present it and stop. Fixes are a follow-up pass.

Run RETRO at the end of the same TIDY pass, unless only the punch list was asked for. Skip it
on the first TIDY if there is no history yet.

### RETRO

This file is written once and otherwise never changes, so a correction Deepayan keeps repeating
gets re-learned from scratch every session instead of sticking.

- Look back over this conversation (and recent sessions, if transcript access exists) for
  moments where he corrected how something in `docs/wiki/` was organised, tagged, or named —
  not general project preferences, those belong in the root `CLAUDE.md`.
- Distill each real, **recurring** correction into one short rule. One-off fixes are not
  conventions; the same correction twice is.
- Compare against **Folder conventions** above: add what is new, let the newest correction
  replace a conflicting older line, drop what no longer applies.
- **Show the exact lines being added, changed or removed before writing them.** This is the one
  part of TIDY that edits this file, so it gets a diff and waits for a yes.
- On approval, update the section and append a line to `log.md`.

Keep **Folder conventions** short. Past ~15 lines, fold related rules together.

## Page conventions

Every page opens with frontmatter, then a one-line summary, and closes with `## Sources`:

```yaml
---
title: "Design System"
type: reference          # profile | reference | case-study | rules | synthesis
tags: [design, tokens]
sources:
  - docs/sources/design-suggestions.md
related:
  - site-architecture.md
updated: 2026-09-10
status: planned          # planned | built — omit on pages that describe no build artefact
---
```

- **Filenames** lowercase kebab-case, `.md`. Descriptive, not clever.
- **Links** standard markdown with relative paths. No Obsidian `[[wikilinks]]` — portability.
- **Attribution**: every substantive claim points at the file it came from, with the section.
  A page with no `## Sources` block is a bug. The heading is always `## Sources`, plural, even
  when there is one.
- **Voice**: synthesis in your own words. Never paste source text.
- **`status: planned`** marks a page describing something not yet built. Flip it to `built`
  in the same change that ships the thing, never before.

### Dated claims

Any figure tied to a moment in time gets marked inline so TIDY can find it:
`226 respondents (Sept–Nov 2025 engagement)`.

## Ground rules

- **Never move, rename or delete a file without explicit sign-off.** Never delete wiki content:
  correct a wrong claim in place, with a note.
- **Plain markdown only.**
- **Never state something as verified without checking it.** Behaviour claims get confirmed
  against a build or the live site before being written as fact.
- **Nothing from `private/` gets copied into the wiki** except what `content-guardrails.md`
  permits. That page is the only gate, and it is the only place the rules are stated.
- **Never introduce a claim the guardrails forbid**, and keep the three self-reported Wipro
  figures marked as self-reported in the wiki. The published site does not label them
  (owner decision, 2026-09-11), so the mark never carries into site copy.
