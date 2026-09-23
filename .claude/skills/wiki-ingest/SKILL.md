---
name: wiki-ingest
description: Update docs/wiki/ from what changed since the last ingest — reads git log since docs/wiki/log.md's last entry, updates or creates the right pages, cross-links them, refreshes the manifest, logs it, runs a quick tidy pass, and reports what needs attention. Use when asked to "ingest", "wiki-ingest", "update the wiki", or after shipping a change whose reasoning is not obvious from the diff.
---

# Wiki ingest

Runs the INGEST plus a quick TIDY pass as defined in
[docs/wiki/AGENTS.md](../../../docs/wiki/AGENTS.md) — **read that file first**. It is the
operating contract; this skill is the trigger and the mechanics.

Ported from the Abhijit Sinha website project, which shares this repo's authority model: the
wiki is the authoritative reference and `docs/sources/` is provenance only. Do not apply the FPL
App version of this rule, which is inverted.

## Steps

1. **Find what changed.** `git log` since the last dated entry in `docs/wiki/log.md`, **widened
   by a day**:

   ```bash
   git log --since="<last log.md date> -1 day" --name-only --oneline -- docs/sources CLAUDE.md README.md src astro.config.mjs wrangler.jsonc headers.template scripts
   ```

   The extra day is not padding. Anchoring exactly on the log date silently misses commits made
   later the same day. Over-reporting is harmless because step 2 filters; under-reporting loses
   the change.

   Also check `docs/sources/` and `private/sources/mba-brain/` against `docs/wiki/.manifest.json`
   — any file with no entry or a changed hash is new material regardless of what git says.

2. **Filter to what is actually wiki-worthy.** Ingest a change when it alters **behaviour, a
   decision, a constraint, or a rule**: a content guardrail, a design token, a schema field, a
   deployment or CSP step, a bug whose cause is non-obvious and would otherwise be rediscovered
   the hard way. Skip pure refactors, formatting, dependency bumps and copy tweaks that change no
   meaning. When unsure, ask rather than padding the wiki.

3. **For each kept change**, follow the INGEST job in `AGENTS.md`: update the existing page for
   that topic — never a near-duplicate — create a page only for a genuinely new topic and add it
   to `docs/wiki/index.md` under the right section, and cross-link both directions.

   Route by topic: `content-guardrails.md` for anything about what may be claimed or published,
   `design-system.md` for visual and layout values, `site-architecture.md` for routes, schemas
   and framework decisions, `deployment-domain.md` for hosting and DNS, `security-headers.md` for
   the CSP and the build guards, `seo-and-metadata.md` for structured data and social cards,
   `case-study-*.md` for a specific piece of work, the profile pages for biography.

4. **Flip `status` where a build landed.** A page describing something now shipped moves from
   `status: planned` to `status: built` in the same pass. This is the field that goes stale
   fastest and it is checked by `/linear-sync`.

5. **Append one line per logical change to `docs/wiki/log.md`**, dated `YYYY-MM-DD`, newest at
   the end.

6. **Update `docs/wiki/.manifest.json`** with the new hash and today's date for any source file
   processed.

7. **If the change creates a rule a future agent must not violate**, add it to the root
   `CLAUDE.md` too, in the matching section. The wiki is read on demand; `CLAUDE.md` is read
   every session. That is the difference between a rule that holds and a rule that gets
   rediscovered by breaking it.

8. **Quick TIDY pass** — not a full audit. Does anything just written contradict another page or
   the shipped code? Any claim added that is already stale? List findings; do not auto-fix beyond
   step 3.

9. **Report**: what was updated or created, and a short "needs your attention" note if step 8
   found anything.

## Ground rules

Inherited from `docs/wiki/AGENTS.md` and the root `CLAUDE.md`:

- Only `docs/wiki/` pages, and `CLAUDE.md` for rule changes, get written. Never edit
  `docs/sources/`; never edit anything in `private/`; never move, rename or delete without
  sign-off.
- Never delete wiki content — correct a wrong claim in place, with a note.
- Plain markdown only. Every page keeps its frontmatter and its `## Sources` block.
- Never write a behavioural claim as verified without checking it against a build or the live
  site.
- **Never introduce a claim the content guardrails forbid**, and keep the three self-reported
  Wipro figures marked as self-reported in the wiki. The published site does not label them
  (owner decision, 2026-09-11), so the mark never carries into site copy.
- Nothing from `private/` reaches a wiki page except what `content-guardrails.md` permits.
