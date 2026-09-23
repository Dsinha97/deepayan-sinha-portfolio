---
name: linear-sync
description: Reconcile the Deepayan-Portfolio Linear project against docs/linear.md, report drift in both directions, and propose the next work from the Linear backlog's own order. Use when asked "what's next", "/linear-sync", "plan the next milestone", "did anything change in Linear", or "reconcile Linear against the docs".
---

# Linear sync

Linear owns **what is planned and what its status is**; `docs/` owns **what happened and why**.
This skill checks the two still agree, and plans from Linear when asked.

## 1. Read Linear

```
list_issues  project: "Deepayan-Portfolio", limit: 250,
             fields: ["id","title","status","statusType","priority","projectMilestone","labels","updatedAt"]
```

Add `get_project` with `includeMilestones: true` when milestone dates matter.

## 2. Compare against the repo

- [docs/linear.md](../../../docs/linear.md) — the Shipped and Open tables. **Every issue should
  appear in exactly one of them.**
- [docs/wiki/](../../../docs/wiki/index.md) — a page carrying `status: planned` for something
  whose issue is closed is drift, and so is a `status: built` page for something still open.

That second check is specific to this repo. The wiki's `status` field is the only place where a
doc makes a claim about build state, so it is the only place it can silently go stale.

## 3. Report drift, in both directions

Say both of these explicitly and separately. A one-sided report is how the two halves quietly
diverge:

- **Linear to docs.** Issues added, re-prioritised, re-milestoned or closed in the dashboard that
  the docs do not reflect. This direction matters most: the dashboard is where the owner plans,
  so a change there is an instruction, not an inconsistency.
- **Docs to Linear.** Rows in `docs/linear.md` with no matching issue, issues pointing at a doc
  path that no longer exists, and wiki `status` values that contradict issue state.

Report "no drift" plainly when there is none. Do not pad it.

## 4. When asked to plan

Propose the next work from the **Linear backlog's own priority and milestone order**, not from a
narrative order in any doc. For each candidate, name the gate its issue states and say plainly
when that gate is not met. A blocked item stays blocked — do not plan around it or narrow it to
fit.

Milestone dates are the schedule. Check them against today before proposing anything.

## 5. Never write silently

Status changes, new issues and closures are outward-facing writes. List what you propose to
change and get approval first. Then apply **both** halves — the Linear write and the
`docs/linear.md` row — or the next run reports the half you skipped as drift.
