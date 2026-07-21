# Migration Plan

## Goal

Evolve Tama OS from separate local-first Finance and Research workspaces into a durable Financial Operating System with a canonical state model, deterministic recommendations, AI explanation, action history, and safe migration tooling.

The workflow remains:

```text
Financial Event
↓
Update Financial State
↓
Decision Engine
↓
AI Reasoning
↓
Recommendation
↓
Journal / Action Outcome
```

## Updated Context

The project is no longer constrained by Build Week. The previous plan optimized for a two-day demo. The updated plan optimizes for:

1. Data safety.
2. Recommendation correctness.
3. Maintainability.
4. UI/UX unification across Finance, Research, and OS.
5. Long-term local-first extensibility.

Speed still matters, but it should no longer override migration quality.

## Non-Goals

Do not start with:

- Merging Finance and Research into one giant runtime before namespace, DOM, and migration risks are handled.
- Adding a backend.
- Adding authentication.
- Removing standalone Finance or Research before migration is proven.
- Sending raw full localStorage to AI.
- Converting everything to a framework just to modernize.
- Deleting old localStorage keys after first migration.

## Migration Principles

1. Preserve user data above all else.
2. Make every migration reversible until proven stable.
3. Prefer contracts and adapters before large rewrites.
4. Make Finance, Research, and OS feel like one coherent Tama OS experience.
5. Large changes are allowed when they improve UI/UX coherence, reduce coupling, remove patch layers, or improve decision quality.
6. Keep deterministic logic independent from UI and AI.
7. Keep AI explainable and non-mutating.
8. Add tests before refactoring critical calculation paths.
9. Preserve JSON import/export throughout the migration.

## Phase 0 — Baseline and Safety Audit

Status: complete enough to proceed, but should be refreshed before any destructive migration.

Deliverables:

- Architecture review.
- Technical-debt review.
- Migration plan.
- List of storage keys.
- Manual smoke checklist.

Acceptance criteria:

- Current app behavior is understood.
- Existing storage keys are documented.
- Known merge risks are documented.

## Phase 1 — Unified Shell and UX System

Objective:

Unify the user experience across `tama-os.html`, `tama-finance.html`, and `tama-research.html` before deeper state migration.

Deliverables:

- Shared navigation/header pattern.
- Shared theme tokens and common shell styling.
- Consistent launch and return paths between OS, Finance, and Research.
- Consistent empty states and safety copy.
- Shared UI assets moved to `assets/` or `js/` where practical.

Acceptance criteria:

- All three HTML pages feel like one Tama OS product.
- Finance and Research remain usable while UI changes land.
- No persisted user data is deleted or rewritten by UI-only consolidation.

## Phase 2 — Canonical Contracts and Test Harness for Core Logic

Objective:

Define stable contracts and protect recommendation correctness before deeper state refactors.

Deliverables:

- `tama-os-state-v1` and `tama-os-snapshot-v1` schema documentation.
- Decision-engine, recommendation journal, AI context, and bridge contracts.
- Unit/smoke tests for snapshot normalization.
- Decision-engine tests for empty, partial, and complete data.
- Tests for stale research detection and thesis coverage.
- Tests for score bounds and recommendation shape.

Acceptance criteria:

- Tests can run without a browser backend.
- Decision output remains deterministic for fixture snapshots.
- Invalid or partial state does not crash core logic.

## Phase 3 — Workspace Contracts and Namespaced App Adapters

Objective:

Wrap Finance and Research behavior behind explicit APIs. Workspaces may remain separate pages or later be embedded, but the contract must stay stable and collision-safe.

Target APIs:

```js
window.TamaFinance = {
  readState,
  writeState,
  normalizeState,
  exportSnapshot,
  createRestorePoint
};

window.TamaResearch = {
  readState,
  writeState,
  normalizeState,
  exportSnapshot,
  createRestorePoint
};
```

Acceptance criteria:

- Existing pages still work during transition.
- New OS code uses namespaced adapters where available.
- No single page accidentally overwrites another app's globals.
- If embedded into one runtime later, duplicate DOM IDs and globals are resolved first.

## Phase 4 — Canonical Read Integration

Objective:

Make the OS shell consume canonical snapshots rather than app-specific internals.

Deliverables:

- Snapshot builder using app adapters.
- Data-quality diagnostics.
- Unified Today's Brief based on snapshot and decision-engine output.

Acceptance criteria:

- Finance-only, Research-only, and combined states render safely.
- Snapshot reads do not mutate legacy keys.
- Dashboard remains useful with missing data.

## Phase 5 — Recommendation and Journal Write Path

Objective:

Create the first canonical write path without touching high-risk transaction/research editing flows.

Deliverables:

- Recommendation journal store.
- Accept/dismiss/snooze/note actions.
- Engine snapshot attached to journal entries.
- Export/import for recommendation history.

Acceptance criteria:

- A recommendation can become a durable action record.
- User can see when and why an action was accepted or dismissed.
- Existing Finance and Research state remains unchanged unless explicitly approved by the user.

## Phase 6 — Reversible Unified Storage Migration

Objective:

Introduce `tama-os-v1` as the canonical state key.

Migration flow:

1. Read legacy Finance and Research keys.
2. Build a migration preview.
3. Show detected records, warnings, duplicates, and unsupported fields.
4. Export backup automatically or prompt the user to download one.
5. Create restore points.
6. Write `tama-os-v1` only after confirmation.
7. Keep legacy keys intact.

Acceptance criteria:

- Dry-run migration reports exactly what will be written.
- Migration can be repeated idempotently.
- Rollback path is documented and tested.
- Standalone apps can still read their original keys.

## Phase 7 — Workspace Modernization and Incremental Write Consolidation

Objective:

Modernize Finance and Research workflows so they feel native inside Tama OS while moving selected write workflows into canonical OS services.

Recommended order:

1. Recommendation outcomes.
2. Financial memory/preferences.
3. Goal and rule management.
4. Link position to research thesis.
5. Scenario/simulation records.
6. New journal entries.
7. Only later: transactions, account edits, positions, and full research editing.

Workspace modernization can include larger HTML cleanup, module extraction, shared shell integration, and UI restructuring when it improves the Tama OS workflow and preserves recovery paths.

Acceptance criteria:

- Each moved write path has tests and rollback behavior.
- Legacy app compatibility is preserved or intentionally deprecated with migration notes.
- No broad schema rewrite happens in the same change as UI changes.

## Phase 8 — IndexedDB for Durable History

Objective:

Use IndexedDB where LocalStorage becomes the wrong tool.

Good IndexedDB candidates:

- AI conversation history.
- Recommendation journal archive.
- Restore point archive.
- Large research notes.
- Imported statement/document metadata.
- Future attachments.

Acceptance criteria:

- LocalStorage remains enough to boot the app.
- IndexedDB failures degrade gracefully.
- JSON export includes or references IndexedDB-backed data clearly.

## Phase 9 — AI Copilot Hardening

Objective:

Make AI reasoning reliable, safe, and useful beyond demo prompts.

Deliverables:

- Curated AI context builder.
- Prompt/version registry.
- User-visible assumptions and limitations.
- Offline fallback for every copilot surface.
- Optional save-to-journal drafts requiring user confirmation.

Acceptance criteria:

- AI answers are grounded in deterministic findings.
- AI clearly distinguishes facts, assumptions, and suggestions.
- AI never claims to mutate user data unless a user-confirmed local write actually happened.

## Phase 10 — Product Expansion

Objective:

Expand from Financial OS toward Personal OS only after the finance module is reliable.

Candidate modules:

- Career.
- Learning.
- Reading.
- Health.
- Projects.

Acceptance criteria:

- New modules use shared memory/rules/recommendation patterns.
- Finance remains the reference module for local-first safety and explainable decisions.

## Risk Register

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| Data loss during migration | Medium | Very high | Dry run, restore points, old keys retained, JSON backup |
| Incorrect recommendations | Medium | High | Deterministic tests, explainable scoring, data-quality flags |
| Global name collisions | High | High | Namespaced adapters before single-runtime merge |
| Schema drift | High | High | Versioned contracts and migration tests |
| AI overreach | Medium | High | Curated context, non-mutating AI, user confirmation |
| LocalStorage quota | Medium | Medium | IndexedDB for append-heavy data |
| Refactor regression | High | High | Small phases, tests, standalone app preservation |

## Immediate Recommendation

The next implementation milestone should be **canonical contracts plus tests**, not a full rewrite. With Build Week pressure removed, the safest path is to strengthen correctness and migration safety before consolidating write paths.
