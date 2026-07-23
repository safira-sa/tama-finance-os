# Technical Debt Review

## Executive Summary

The current codebase is valuable because both applications work and already support local-first workflows. The main debt is not poor product design; it is accumulated single-file growth. Both applications contain inline HTML, CSS, JavaScript, domain logic, persistence, rendering, patches, and bridge compatibility code in one file each.

The most important principle for addressing this debt is to preserve working behavior. Refactoring should follow user-visible milestones and should not be done for elegance alone.

## Highest-Priority Debt

### 1. Global mutable state

Both applications use a global mutable `S` object. Any function can mutate it directly. This keeps development fast, but it makes it difficult to guarantee correctness after merging.

Risk:

- Accidental mutation from unrelated modules.
- Hard-to-debug side effects.
- GPT/decision-engine integration may receive inconsistent state.

Recommended future mitigation:

- Introduce a small state adapter with `getState()`, `setState()`, `updateState(actionName, updater)`, and `saveState()`.
- Do not immediately rewrite all handlers.
- Wrap existing `S` first, then migrate write paths incrementally.

### 2. Global function collisions

Finance and Research both define common global names including `save`, `loadState`, `renderAll`, `exportData`, `toast`, `charts`, and `S`.

Risk:

- A single integrated HTML page could overwrite one app's functions with the other app's functions.
- Patch wrappers may wrap the wrong function.
- Debugging becomes difficult because the final runtime function depends on script order.

Recommended future mitigation:

- Namespace each app before merging:
  - `window.TamaFinance`
  - `window.TamaResearch`
  - `window.TamaBridge`
  - `window.TamaStorage`
- Export only intentional public APIs.

### 3. Patch-layer accumulation

Both apps include multiple later script blocks that monkey-patch existing functions. This approach is practical for incremental MVP work, but it creates hidden ordering requirements.

Risk:

- Removing or moving a script block can break downstream patches.
- Multiple wrappers around `renderAll()` may cause redundant renders and race-like UI updates via `setTimeout`.
- Function identity becomes hard to trace.

Recommended future mitigation:

- Create a documented extension lifecycle:
  - `onLoad`
  - `beforeSave`
  - `afterSave`
  - `afterRender`
  - `beforeExport`
  - `afterImport`
- Convert patch wrappers into registered hooks only after the integrated shell exists.

### 4. DOM-coupled business logic

Most save/calculation handlers read form values directly from DOM IDs and then write directly into `S`.

Risk:

- Logic cannot be easily reused by a decision engine, tests, or AI context builder.
- Renaming a field can break calculations.
- Headless validation is difficult.

Recommended future mitigation:

- Extract pure functions only where they directly support the roadmap:
  - financial health score inputs
  - emergency fund calculation
  - budget evaluation
  - allocation calculation
  - research score calculation
  - bridge summary generation

### 5. No central schema registry

Finance has `SCHEMA_VERSION=9` and legacy key handling. Research has simpler base state and later bridge normalization patches.

Risk:

- A merged OS may mix several schema concepts without a single migration path.
- Bridge imports can preserve stale or partial data.
- AI context generation may rely on fields that are absent or renamed.

Recommended future mitigation:

- Define a `tama-os-state-v1` contract in documentation before coding migration.
- Include sub-schemas:
  - `finance`
  - `research`
  - `bridge`
  - `memory`
  - `decision_engine`
  - `journal`
- Keep old keys readable during transition.

### 6. LocalStorage size and durability limits

LocalStorage is simple and portable, but it has browser-specific quota limits and synchronous writes.

Risk:

- Large research notes, bridge snapshots, charts, journal data, and restore points may exceed quota.
- Synchronous writes may eventually cause UI jank.
- Corruption affects the whole app state if one large JSON blob becomes invalid.

Recommended future mitigation:

- Continue localStorage for current milestone.
- Add defensive backup reminders and restore points.
- Consider IndexedDB only when data volume or attachment-like data requires it.

### 7. No automated tests

The apps are manual-test MVPs. There are no observed automated unit tests or browser smoke tests.

Risk:

- Refactors and merge work can regress existing flows.
- Decision-engine calculations may drift without detection.

Recommended future mitigation:

- Start with small pure-function tests after extracting the decision engine.
- Add a lightweight browser smoke checklist before larger integration work.
- Do not introduce a heavy framework solely for testing during Build Week.

## Potential Bugs / Fragile Areas

### Storage and import

- Invalid JSON is caught in several places, but user recovery depends on restore points being available.
- Import handlers can replace large portions of state; a schema mismatch may silently drop fields unless normalization captures them.
- Finance supports legacy keys; Research relies more heavily on current key plus patch normalization.

### Rendering

- Multiple wrappers around `renderAll()` may cause repeated rendering.
- `setTimeout`-based patch rendering may update stale DOM after another render.
- Chart instances require careful destruction/reuse to avoid memory leaks.

### Data consistency

- Finance stores transactions, expenses, accounts, positions, journal, bridge data, and derived cache assumptions. Some values can become duplicated or denormalized.
- Research stores calculated scores on entries while also computing from modal inputs. Formula changes may not update old entries unless recalculated.
- Bridge snapshots can become stale; UI freshness warnings help but do not solve synchronization.

### Currency handling

- Later patches add currency recovery and base/native value handling, which implies earlier data may lack reliable currency metadata.
- Missing FX rates or assumed base currency can distort portfolio totals and bridge summaries.

### ID generation

- Many records appear to use `Date.now()` IDs. This is usually fine for manual use, but rapid creation/import may collide.

## Duplicate Logic Inventory

| Area | Finance | Research | Recommended handling |
| --- | --- | --- | --- |
| State persistence | `localStorage` under `tama-v8` | `localStorage` under `tama-research-v1` | Shared storage adapter later |
| Theme | `tama-theme` | `tama-research-theme` | Shared theme utility with app preference namespace |
| Toast | Inline `toast()` | Inline `toast()` | Shared UI utility |
| Export/import | JSON snapshot and bridge envelope | JSON snapshot and bridge envelope | Shared import/export shell |
| Restore points | Finance restore key | Research restore key | Shared restore service with app namespace |
| HTML escaping | Repeated helpers | Repeated helpers | Shared utility |
| Date/freshness | Repeated helpers | Repeated helpers | Shared utility |
| Bridge contracts | Finance bridge patches | Research bridge patches | Shared bridge schema validator |
| Render extensions | Monkey-patched globals | Monkey-patched globals | Hook registry |

## Tight Coupling Inventory

- Save handlers depend on exact input IDs.
- Render functions depend on exact panel IDs and card markup.
- Bridge patch UI depends on the Finance investment panel and Research portfolio panels existing.
- Theme buttons are app-specific.
- Chart registries are global per file.
- Import/export functions assume ownership of the full app state.
- `window.S` is used by patches and bridge code as a shared escape hatch.

## Debt That Should Not Be Fixed Yet

Debt that was intentionally postponed during Build Week can now be addressed, but still in product-value order. Do not spend time on:

- Framework migration.
- Build tooling.
- Full component rewrite without a clear Tama OS user benefit. UI/UX consolidation across the existing HTML pages is allowed when it makes the product feel unified.
- Full TypeScript conversion.
- Backend or cloud sync.
- Authentication.
- Multi-agent architecture.
- RAG.
- Full IndexedDB migration.

These may be valuable later, but they should be approved only when they unlock user value or reduce proven maintenance risk.

## Debt That Supports The Product Goal Now

The following cleanup directly supports “What should I do next?” and should be prioritized next:

1. Define a shared financial state snapshot for the decision engine.
2. Extract deterministic calculations from UI code.
3. Normalize bridge data into a stable contract.
4. Add freshness and data-quality flags to AI/briefing context.
5. Preserve journal/action history so recommendations can be explained.



## Post-Build-Week Debt Strategy

Because the project is no longer operating under a two-day demo constraint, the debt strategy should move from "minimum viable integration" to "safe foundation for long-term product development." Large changes are acceptable when they unify the UI/UX across Finance, Research, and OS, reduce coupling, remove fragile patch layers, or improve the Tama OS decision workflow. The priority is still not elegance for its own sake; the priority is protecting local user data while making recommendations more reliable.

### Recommended Sequence

1. **Unified shell first** — make Finance, Research, and OS share navigation, visual language, and action patterns.
2. **Contract baseline** — define `tama-os-state-v1`, bridge envelopes, and AI context schemas before data migration.
3. **Tests around decisions** — add tests for decision-engine scoring, recommendation ranking, stale-data detection, and snapshot normalization.
4. **Workspace contracts** — expose explicit APIs back to Tama OS whether workspaces remain separate files or become embedded later.
5. **Namespacing** — expose intentional globals only, such as `window.TamaFinance` and `window.TamaResearch`.
6. **Migration tooling** — build dry-run migration, restore points, export-before-migrate, and rollback checks before writing `tama-os-v1`.
7. **Hook lifecycle** — replace monkey-patches with registered hooks after adapters exist.
8. **Durable history** — move append-heavy recommendation journals, AI conversations, and restore archives toward IndexedDB when volume justifies it.

### Debt Priority Matrix

| Priority | Debt | Why it matters now | First safe step |
| --- | --- | --- | --- |
| P0 | Data-loss risk | Local-first trust depends on recoverability | Add migration dry-run and restore-point checks |
| P0 | Decision correctness | Recommendations are the product | Expand deterministic engine tests |
| P1 | Schema drift | AI and dashboards need stable inputs | Publish `tama-os-state-v1` contract |
| P1 | Global collisions | Blocks safe OS coordination or future embedding | Namespace public APIs and resolve duplicate DOM IDs |
| P1 | Patch accumulation | Makes behavior hard to reason about | Add lifecycle hook registry |
| P2 | LocalStorage scale | May limit journals/research/history | Use IndexedDB for append-heavy stores |
| P1 | UI fragmentation | Makes Tama OS feel like separate apps | Shared shell, theme tokens, and common navigation |
| P2 | UI duplication | Slows iteration | Extract small UI utilities after behavior is tested |
| P3 | Framework absence | Not a blocker today | Reassess only if vanilla UI becomes sustained drag |

### Updated Non-Priorities

The following should still not be first moves unless a concrete blocker appears:

- Full framework migration.
- Full TypeScript conversion.
- Backend/cloud sync.
- Authentication.
- Multi-agent architecture.
- RAG over external documents.

They are not rejected forever; they are deferred behind local correctness, schema stability, and user-visible decision quality.
