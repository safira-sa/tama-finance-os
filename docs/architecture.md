# Architecture Review

## Context

Tama OS currently consists of two standalone, production-quality MVPs:

- `tama-finance.html`: personal finance, ledger, accounts, investment positions, monthly/yearly workflows, bridge export/import, and recovery utilities.
- `tama-research.html`: research log, universe/watchlist, scorecards, analytics, portfolio bridge import, and recovery utilities.

The product direction is to evolve these applications into a single local-first Financial Operating System that helps users decide what to do next, not merely record what happened.

## Overall Architecture

Both applications are single-file browser applications built with HTML, CSS, vanilla JavaScript, and Chart.js loaded from CDN. There is no backend, authentication layer, build system, or framework. Each app owns its own DOM, state object, persistence key, rendering functions, event handlers, import/export flow, and patch-style runtime extensions.

### Tama Finance OS

Finance uses a global state object named `S`, initialized from `DEF`, with a schema version and a localStorage key of `tama-v8`. The default state contains finance configuration, investment rules, months, transactions, expenses, accounts, positions, and journal entries.

Primary modules observed:

- Account and bucket model.
- Monthly income and expense workflows.
- Transaction ledger.
- Monthly and yearly closing.
- Investment configuration and position management.
- Journal management.
- Configuration/settings.
- JSON backup/restore.
- Research bridge import/export and contract panels.
- Restore points and currency recovery utilities.

Finance has a more advanced normalization layer than Research. `normalizeState(raw)` deep-merges legacy or imported data into the current default state, applies schema metadata, initializes arrays/objects, and preserves backward compatibility with older storage keys.

### Tama Research Desk

Research also uses a global state object named `S`, initialized from `DEF`, with a localStorage key of `tama-research-v1`. The baseline default state contains research entries, universe records, and imported journal data.

Primary modules observed:

- Research overview.
- Research log.
- Research entry modal.
- Universe/watchlist modal.
- Technical score calculation.
- Scorecard analytics.
- Portfolio/finance bridge import.
- Research export/import.
- Patch-style enhancements for market modes, target zones, high-ROI analysis, bridge panels, copy polish, restore points, and currency repair.

Research started with a simpler `loadState()` and `save()` pair, then later patches wrap those functions to add normalized bridge state and finance import support.

## Data Flow

### Finance Data Flow

1. User edits form fields in the active page or modal.
2. Save handlers read DOM values directly with `document.getElementById` / `querySelector`.
3. Handlers mutate `S` directly.
4. `save()` marks the derived cache dirty, rebuilds/ensures derived data, stamps metadata, and writes `S` to localStorage.
5. Render functions such as `rDash()`, `rMonthly()`, `rTxn()`, `rInvest()`, and `renderAll()` re-read `S` and update the DOM.
6. Chart rendering reads derived values and replaces/destroys Chart.js instances through the shared `charts` registry.
7. Export produces a JSON snapshot of `S`, with later patches wrapping export to emit a bridge envelope and contract metadata.

### Research Data Flow

1. User creates or edits a research or universe record via modal DOM fields.
2. Save handlers read the DOM directly.
3. Handlers mutate `S.entries`, `S.universe`, `S.journal_import`, or `S.bridge`.
4. `save()` writes `S` to localStorage.
5. `renderAll()` refreshes overview, log, universe, and portfolio OS panels.
6. Technical score calculations are recomputed from form values and stored onto entries when saved.
7. Bridge imports parse finance envelopes and attach finance data into `S.bridge.finance` and sometimes `S.journal_import`.

### Cross-Application Data Flow

The current integration mechanism is JSON bridge import/export, not live shared storage. Finance can export a finance bridge envelope. Research can import finance bridge data. Research can export research bridge data. Finance can import research bridge data. Each app stores the imported counterpart under its own `S.bridge` namespace.

This is a practical local-first approach, but it means the two apps do not yet share a single source of truth. They exchange snapshots.

## State Management

State management is global, mutable, and DOM-coupled in both applications.

### Strengths

- Simple mental model: one global `S` object per app.
- Easy JSON backup/restore.
- No hidden server state.
- Finance normalization is mature and supports legacy storage keys.
- Derived caches in Finance reduce repeated expensive calculations.
- Bridge snapshots preserve local-first portability.

### Weaknesses

- `S` is mutable from anywhere in the script chain.
- Many functions both mutate state and render UI.
- DOM IDs are effectively part of the application API.
- Later patches monkey-patch global functions such as `renderAll`, `save`, `loadState`, `exportData`, and modal open/save handlers.
- There is no event bus, state transaction boundary, or centralized action layer.
- Both apps use the same global names (`S`, `SK`, `charts`, `save`, `loadState`, `renderAll`, `exportData`, `toast`), which will collide if the files are merged naively into one page.

## LocalStorage / IndexedDB Usage

### LocalStorage

LocalStorage is the primary persistence layer.

Observed keys include:

- `tama-v8`: current Finance state.
- `tama-v7`, `tama-v6`, `tama-v5`, `tama-finance`, `tama-state`: Finance legacy fallback keys.
- `tama-research-v1`: current Research state.
- `tama-theme`: Finance theme.
- `tama-research-theme`: Research theme.
- `tama-last-export-at`: Finance backup badge timestamp.
- `tama-finance-restorepoints-v1`: Finance restore points.
- `tama-research-restorepoints-v1`: Research restore points.
- `research-p12-chart-mode`: Research chart display preference.

### IndexedDB

No IndexedDB usage was found in the current code. Despite the product direction listing LocalStorage and IndexedDB as storage technologies, the present implementation appears to rely on localStorage plus JSON import/export.

## Shared Logic

The apps independently implement or duplicate several concepts:

- Global state object and default state.
- `loadState()` / `save()` persistence wrappers.
- `exportData()` / import handlers.
- Theme initialization and toggling.
- Toast notifications.
- DOM helper patterns.
- Chart.js lifecycle handling.
- HTML escaping helpers.
- Date helpers.
- Currency/bridge freshness helpers in later patches.
- Restore point management.
- Bridge contract stamping.

These are strong candidates for future shared modules, but they should be extracted incrementally after a baseline contract is frozen.

## Duplicate Logic

High-value duplicate areas:

1. Persistence and normalization
   - Both apps serialize a global state object to localStorage.
   - Both have import/export flows.
   - Both now need bridge-aware normalization.

2. UI utilities
   - Toasts, theme buttons, modal close behavior, DOM setters, HTML escaping, and small formatting helpers are repeated.

3. Bridge mechanics
   - Both apps implement bridge envelope handling, contract stamping, freshness checks, import history, and clear/import flows.

4. Recovery mechanics
   - Both apps maintain restore points and local restore/download functions.

5. Render patching
   - Both apps repeatedly wrap global render functions to add incremental patches.

## Tight Coupling

The highest coupling is between:

- DOM IDs and business logic.
- Global `S` shape and render functions.
- Save handlers and rendering side effects.
- Bridge schema and UI panels.
- Patch scripts and exact function names.

Because many enhancements wrap previously defined functions, script order is part of the architecture. Reordering or bundling scripts without care could break behavior.

## Current Strengths

- Fully local-first and portable.
- No framework or backend complexity.
- Mature Finance domain model relative to the current MVP.
- Research workflow is rich and decision-oriented, not just note-taking.
- JSON import/export already supports migration toward shared state.
- Bridge work has begun and aligns with the unified Financial OS vision.
- Restore-point patches reduce data-loss risk during import/export.
- Both apps are already useful independently, which provides a stable baseline.

## Biggest Architectural Risks When Merging

1. Global namespace collisions
   - Both files define `S`, `SK`, `charts`, `save`, `loadState`, `renderAll`, `exportData`, `toast`, and many globals.

2. Conflicting render lifecycle
   - Each app assumes it controls `DOMContentLoaded`, page tabs, modals, theme, chart registry, and full render refresh.

3. Snapshot bridge versus shared state
   - The current bridge model exchanges snapshots. A merged OS needs one common financial state or a clearly defined synchronization contract.

4. Script-order dependency
   - Later patches rely on wrapping earlier functions. Combining or modularizing without preserving order could silently disable behavior.

5. Schema drift
   - Finance has schema versioning; Research has incremental normalization patches. A unified app will need explicit schema contracts for finance, research, bridge, memory, and decision-engine data.

6. DOM ID collisions
   - A merged single page may contain duplicate IDs, duplicate modal IDs, duplicate buttons, duplicate chart IDs, and duplicate theme controls unless namespaced.

7. LocalStorage migration risk
   - Users may already have data under separate keys. A unified key must migrate without overwriting or losing existing Finance or Research data.

8. Decision-engine coupling risk
   - If deterministic recommendations are built directly into UI render functions, the future GPT copilot will lack clean structured data to reason over.

## Architectural Direction

For Milestone 1, the safest direction is not a rewrite. The recommended path is an incremental shell around existing apps:

1. Preserve both apps' state keys and behavior initially.
2. Define a canonical shared state contract separately from both app internals.
3. Move only low-risk shared utilities first: storage wrappers, escaping, dates, toasts, theme, and bridge validation.
4. Keep Finance and Research as modules with namespaced APIs.
5. Introduce a read-only unified dashboard/brief before attempting write-path consolidation.
6. Only after the bridge contract is stable, migrate toward a single shared storage key.

