# AGENTS.md

Multi-agent rules for this public repository. Where this file and `CLAUDE.md` or `docs/wiki/content-guardrails.md` differ, those win on content. `docs/wiki/AGENTS.md` is separate: it governs how `docs/wiki/` is maintained.

## Multi-agent rules (lean roster)

Roles
- Main Claude session: orchestrator. Only writer of `docs/wiki/log.md`, `docs/wiki/index.md` and `CLAUDE.md`. Delegates by brief. Merges.
- `worker` and `reviewer` (Claude subagents): one ticket, then a check against its `eval.md`.
- Antigravity (Gemini model): coding briefs only. Writes code, raw outputs with hashes, run logs, test output and the status handoff. No analysis, copy, wiki text, or decision candidates.
The user alone approves moves, renames, deletions, pushes, PRs and merges. `main` changes only through a pull request with no bypass, and a merge deploys the site.

Lanes
- Agents other than Claude never edit: `src/data/profile.ts`, `headers.template`, `src/scripts/theme-init.js` (the CSP hash covers its exact bytes), `docs/`, `.github/`, `.claude/`, `CLAUDE.md`, `AGENTS.md`, `private/`, or a file named in an active freeze. They never write copy.
- A brief may allow named components, styles and pages under `src/`.
- Never open: `private/`, `Referernces/`, `References/`, `.env*`, `plans-private/`. A Gemini-model agent opens only the one brief its prompt names, by path.

Content rules that every agent restates (full list: `docs/wiki/content-guardrails.md`)
- The phone number is never published, in any route or artifact. Visa status and work authorization are never published.
- Published contact channels are exactly the three in `CLAUDE.md`.
- Wipro is genericized: no client name, no vendor or platform names.
- Engagement outcomes may be claimed; business outcomes may not.
- Issue numbers never appear in copy a visitor can read.
- The `selfReported` field in `src/data/profile.ts` stays a separate field.
- Nothing from `private/` appears in the repo, in a commit message, in a PR or in a tracked file.

Git
- One branch per task: `agent/<name>/<topic>`. Antigravity works in a local clone with no remote. Its handoff and raw outputs go in a lane-only branch under `agent-lanes/` in the clone; lane branches are never merged or pushed.
- Agents commit only to their branch and never push, open PRs or merge. Commits carry the trailers `Agent:` and `Model:`.
- The repo is public: anything committed is readable forever, history included.

Review and provenance
- Review before promotion: a reviewer reports pass or fail per check with evidence and never fixes. The main session recomputes any number before using it.
- Draft files carry `author`, `model`, `status`, `reviewed_by` in frontmatter.

Where things live
- Briefs, handoffs, tickets and the decision register are in `plans-private/` (gitignored).
