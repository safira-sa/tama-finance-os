# Migration Plan

## Goal

Evolve `tama-finance.html` and `tama-research.html` into a single local-first Financial Operating System without rebuilding either application, changing frameworks, or breaking existing user data.

The migration should support the roadmap workflow:

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
Journal
```

## Non-Goals

Do not do these during the first integration pass:

- Rewrite either application.
- Introduce a frontend framework.
- Add a backend.
- Add authentication.
- Replace localStorage immediately.
- Force all data into one schema before bridge behavior is stable.
- Build future roadmap items before Milestone 1 is approved.

## Migration Principles

1. Preserve working applications first.
2. Consolidate through contracts, not rewrites.
3. Keep storage migration reversible.
4. Prefer read-only integration before shared write paths.
5. Extract pure decision logic only when it directly enables recommendations.
6. Keep Finance and Research independently usable until the unified app is proven.

## Phase 0 — Baseline Freeze

Status: documentation only.

Objectives:

- Treat current `tama-finance.html` and `tama-research.html` as the production baseline.
- Document architecture, technical debt, and merge risks.
- Do not modify runtime code.

Deliverables:

- `architecture.md`
- `technical-debt.md`
- `migration-plan.md`

Acceptance criteria:

- No application behavior changed.
- Documentation identifies storage keys, state ownership, bridge flow, and merge risks.

## Phase 1 — Integrated Shell Without State Merge

Objective:

Create a single user-facing Tama OS shell while preserving each app's current internal behavior.

Recommended approach:

- Add a top-level shell page only after approval.
- Link or embed Finance and Research as separate modules/views.
- Do not merge scripts into one global runtime yet.
- Keep existing storage keys:
  - `tama-v8`
  - `tama-research-v1`
- Keep JSON bridge import/export available.

Why this phase matters:

- It delivers user-visible consolidation quickly.
- It avoids global namespace collisions.
- It lets the team validate navigation and product positioning before deeper refactors.

Risks:

- If embedded with iframes, shared navigation and styling may be limited.
- If combined into one DOM too early, global collisions are likely.

Suggested testing:

- Open Finance from the shell.
- Open Research from the shell.
- Verify both themes, modals, charts, imports, and exports still work.
- Verify existing localStorage data remains visible.

## Phase 2 — Shared Contract Layer

Objective:

Define a canonical read-only Tama OS state snapshot that both apps can produce.

Recommended contract shape:

```json
{
  "schema": "tama-os-snapshot-v1",
  "generated_at": "ISO_DATE",
  "finance": {},
  "research": {},
  "bridge": {},
  "data_quality": [],
  "recommendation_inputs": {}
}
```

Key design rule:

This snapshot is not yet the write database. It is the structured input for dashboards, the decision engine, and AI reasoning.

Data quality should include:

- Missing FX rates.
- Stale research imports.
- Missing thesis for open positions.
- Unclosed months.
- Missing salary assumptions.
- Empty emergency fund target data.
- Stale portfolio prices.

Acceptance criteria:

- Finance can generate a snapshot.
- Research can generate a snapshot.
- A unified dashboard can read snapshots without mutating app state.

## Phase 3 — Shared Utilities

Objective:

Extract only low-risk duplicate utilities.

Candidate modules:

- `js/storage.js`
  - localStorage get/set JSON wrappers
  - restore-point helpers
  - safe JSON parse
- `js/ui.js`
  - toast
  - modal close helper
  - HTML escape
- `js/date.js`
  - today string
  - days since/until
  - freshness helpers
- `js/bridge.js`
  - bridge schema constants
  - import/export envelope validation
  - checksum helper

Rules:

- Keep original functions as wrappers during transition.
- Do not change existing state shapes yet.
- Avoid large patches that touch unrelated workflows.

Acceptance criteria:

- Existing app behavior is unchanged.
- Shared utilities are used by one narrow path first, preferably bridge validation or restore points.

## Phase 4 — Deterministic Decision Engine

Objective:

Create the offline engine described in `VISION.md` before adding AI reasoning.

Initial engine responsibilities:

- Budget evaluation.
- Emergency fund status.
- Cash allocation status.
- Portfolio allocation status.
- Rule violations.
- Financial health score.
- Next recommended action candidates.

Recommended module:

- `js/decision-engine.js`

Input:

- Read-only Tama OS snapshot.

Output:

```json
{
  "generated_at": "ISO_DATE",
  "health_score": 0,
  "findings": [],
  "recommendations": [],
  "risks": [],
  "required_data": []
}
```

Rules:

- No AI dependency.
- No direct DOM reads.
- No direct writes to `S`.
- No localStorage writes.
- Pure functions where possible.

Acceptance criteria:

- The engine can produce useful recommendations offline.
- Recommendations cite the data quality issues that affect confidence.

## Phase 5 — Unified Dashboard / Today’s Brief

Objective:

Create the first truly unified Tama OS experience.

Recommended scope:

- Read Finance state.
- Read Research state.
- Generate a Tama OS snapshot.
- Run the deterministic decision engine.
- Display:
  - financial health
  - urgent issues
  - top recommendation
  - missing data warnings
  - research/position thesis gaps

Why this comes before write-path unification:

- It creates immediate user value.
- It validates the shared contract.
- It supports the product goal directly.

Acceptance criteria:

- A first-time user can understand what needs attention within one minute.
- The dashboard does not break either app's existing workflows.

## Phase 6 — Shared Storage Migration

Objective:

Move toward one common financial state only after contracts and dashboard behavior are stable.

Proposed storage strategy:

- Keep old keys readable:
  - `tama-v8`
  - `tama-research-v1`
- Add new unified key:
  - `tama-os-v1`
- On first unified load:
  1. Read old Finance state.
  2. Read old Research state.
  3. Build unified state.
  4. Save a restore point.
  5. Write `tama-os-v1`.
  6. Do not delete old keys.

Rollback strategy:

- Continue exporting old app-compatible JSON until the unified app is stable.
- Keep restore points per app and unified restore points.

Acceptance criteria:

- Existing users do not lose data.
- Import/export remains available.
- Old standalone files can still read their original keys.

## Phase 7 — GPT-5.6 Copilot Integration

Objective:

Add AI reasoning on top of structured deterministic outputs.

Rules:

- The copilot never directly mutates user data.
- The copilot receives a curated context, not raw full localStorage by default.
- The decision engine remains the source of deterministic calculations.
- The copilot explains recommendations, tradeoffs, and scenarios.

Input context should include:

- User financial snapshot.
- Decision-engine output.
- Data quality warnings.
- Relevant research thesis summaries.
- User financial memory/preferences once Milestone 5 exists.

Acceptance criteria:

- User can ask: “What should I do next?”
- AI answer is grounded in deterministic findings.
- AI clearly distinguishes facts, assumptions, and suggestions.

## Phase 8 — Write-Path Consolidation

Objective:

Only after successful read integration, consolidate selected write workflows.

Candidate first write paths:

1. Journal recommendation outcome.
2. Mark recommendation accepted/dismissed.
3. Save financial memory preference.
4. Link a position to a research thesis.

Avoid initially:

- Rewriting all transaction entry.
- Rewriting all research entry.
- Replacing all modals.
- Changing account or position schemas broadly.

Acceptance criteria:

- A recommendation can become a journal/action record.
- The user can see why an action was recommended.
- Existing Finance and Research save flows remain intact.

## Recommended File/Module Direction

Future structure, when implementation is approved:

```text
js/
  storage.js
  ui.js
  date.js
  bridge.js
  state.js
  decision-engine.js
  ai.js

tama-os.html

tama-finance.html

tama-research.html
```

Important:

- `tama-finance.html` and `tama-research.html` should remain available during migration.
- `tama-os.html` should begin as an integration shell and dashboard, not a rewrite.

## Risk Register

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| Global name collisions | High | High | Namespace before single-runtime merge |
| Data loss during migration | Medium | Very high | Restore points, old keys retained, export before import |
| Bridge schema drift | High | High | Document and validate bridge contracts |
| Duplicate rendering / UI races | Medium | Medium | Hook lifecycle, avoid wrapper stacking |
| LocalStorage quota | Medium | Medium | Keep snapshots lean, consider IndexedDB later |
| AI overreach | Medium | High | AI reads decision output; never writes directly |
| Refactor regression | High | High | Small changes, manual smoke tests, preserve standalone apps |

## Immediate Recommendation

Stop at documentation until approval.

When approved, the first implementation milestone should be a low-risk integrated shell and read-only unified snapshot, not a full state merge. This provides visible progress toward Tama OS while protecting the two working MVPs.
