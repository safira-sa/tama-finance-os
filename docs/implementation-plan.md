# Implementation Plan — Post-Build-Week

## Purpose

This plan replaces the two-day Build Week execution plan with a durable product engineering plan. Tama OS should now prioritize safe migration, deterministic correctness, and maintainable local-first architecture while continuing to deliver visible user value.

## Strategy

The safest path is not a blind rewrite, but this branch may make large intentional changes. The product shape should be: `tama-os.html` as the command center, with Finance and Research presented as one cohesive Tama OS experience. They can remain separate HTML files during migration, but the UI/UX should feel unified. The project should evolve through shell unification, contracts, tests, adapters, and reversible migration:

1. Unify shell/navigation/design language across OS, Finance, and Research.
2. Freeze and document contracts.
3. Add tests around pure decision logic and snapshot normalization.
4. Namespace existing app APIs while preparing for possible embedded workflows.
5. Keep read integration safe.
6. Introduce canonical write paths one at a time.
7. Migrate storage only with preview, backup, and rollback.
8. Harden AI as an explanation layer, not a source of truth.

## Immediate Workstream A — Milestone 1: Unified Shell and Visual System

### Scope

- Add shared Tama OS navigation/chrome to all HTML entry points.
- Fix the current three-app vibe by making OS, Finance, and Research share one visual system.
- Align cards, buttons, spacing, typography, status badges, empty states, and safety copy.
- Make cross-links between OS, Finance, and Research obvious.
- Move shared styles into `assets/` where practical.
- Keep data-affecting behavior unchanged unless explicitly part of a tested workflow.

### Acceptance Criteria

- A user no longer perceives Finance, Research, and OS as three separate apps.
- `tama-os.html` is the obvious default entry point.
- Existing Finance and Research workflows remain usable.
- UI-only changes do not rewrite persisted data.

## Immediate Workstream B — Contracts and Tests

### Scope

- Define `tama-os-snapshot-v1`.
- Define `tama-os-state-v1`.
- Define decision-engine output, recommendation journal entries, AI context payloads, and migration report shape.
- Snapshot builder fixtures.
- Decision-engine recommendation fixtures.
- Empty-state and corrupt-state behavior.
- Thesis coverage matching.
- Stale research detection.
- Health score bounds.

### Acceptance Criteria

- Tests run from the command line.
- Core logic can be verified without opening the browser.
- Invalid input produces warnings instead of crashes.

## Immediate Workstream C — Workspace Contracts

### Scope

Add thin compatibility APIs around existing standalone workspaces:

```js
window.TamaFinance
window.TamaResearch
window.TamaStorage
window.TamaDecisionEngine
window.TamaAI
```

### Acceptance Criteria

- `tama-finance.html` and `tama-research.html` remain usable during transition.
- Existing global functions keep working until replaced intentionally.
- New OS code uses namespaced APIs where available.
- Larger UI cleanup is allowed if it makes the whole Tama OS experience clearer and does not break data recovery.
- Future embedding into one runtime is allowed only after globals and DOM IDs are collision-safe.

## Workstream D — Recommendation Journal

### Scope

- Store recommendation outcomes locally.
- Support accepted, dismissed, snoozed, and noted states.
- Attach decision-engine output for auditability.
- Add export/import support.

### Acceptance Criteria

- User can preserve why a recommendation mattered.
- Journal writes do not mutate Finance or Research data unexpectedly.
- Entries survive refresh and export.

## Workstream E — Safe Unified Migration

### Scope

- Migration dry run from legacy keys.
- User-visible migration report.
- Restore point creation.
- Backup export prompt.
- Confirmed write to `tama-os-v1`.
- Rollback instructions.

### Acceptance Criteria

- No legacy key is deleted.
- Migration can be repeated safely.
- User can inspect warnings before committing.
- Standalone apps remain usable during migration.

## Workstream F — AI Copilot Hardening

### Scope

- Curated context builder.
- Prompt/version metadata.
- Offline fallback.
- Clear assumption handling.
- Optional journal draft creation requiring confirmation.

### Acceptance Criteria

- AI responses are grounded in deterministic findings.
- AI never claims to change data automatically.
- AI degrades gracefully when API access is unavailable.

## Workstream G — Storage Durability

### Scope

- Keep LocalStorage for boot-critical app state.
- Add IndexedDB for append-heavy records when needed.
- Ensure JSON export includes complete local data or clear references.

### Acceptance Criteria

- Large journals and AI history do not risk LocalStorage quota issues.
- IndexedDB failure does not prevent core dashboard boot.
- Export/import remains understandable to users.

## Suggested Sequence

| Step | Work | Why |
| --- | --- | --- |
| 1 | Unified shell and visual system | Make Finance, Research, and OS feel like one product |
| 2 | Contract docs | Prevent schema drift before more code depends on it |
| 3 | Decision/snapshot tests | Protect product correctness |
| 4 | Workspace contracts | Connect Finance/Research to Tama OS safely |
| 5 | Recommendation journal | Adds user value with low migration risk |
| 6 | Migration dry run | Makes unified storage safe |
| 7 | `tama-os-v1` confirmed writes | Establishes canonical storage |
| 8 | AI hardening | Improves reasoning without replacing deterministic logic |
| 9 | IndexedDB history | Scales durable local-first records |
| 10 | Selected write consolidation | Unifies product workflows incrementally |

## Quality Gates

Before merging changes that affect UI, state, recommendations, or migration:

- Run automated tests.
- Run manual browser checklist for affected pages.
- Confirm the primary next action is visible, understandable, and not competing with lower-priority actions.
- Confirm the changed workflow requires the same or fewer manual inputs unless the extra input improves recommendation quality.
- Verify no console errors in changed workflows.
- Verify risky actions include clear confirmation, backup, restore, or undo behavior.
- Export data before testing destructive import/migration paths.
- Confirm old localStorage keys are not deleted.
- Confirm AI context excludes unnecessary raw localStorage.

## Updated Cut Line

If capacity is limited, cut scope in this order:

1. Visual polish.
2. New non-finance modules.
3. IndexedDB migration.
4. Advanced AI conversation memory.
5. Runtime embedding / broad rewrites that do not directly improve Tama OS coherence.

Do not cut:

1. Data safety.
2. Decision-engine tests.
3. Migration rollback behavior.
4. Existing Finance and Research compatibility.
5. Clear user-facing explanations for recommendations.
