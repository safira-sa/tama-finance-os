# Architecture Review

## Context

Tama OS is a local-first AI Financial Operating System. The repository currently contains two mature browser applications plus shared modules:

- `tama-finance.html`: personal finance, ledger, accounts, investment positions, monthly/yearly workflows, bridge export/import, and recovery utilities.
- `tama-research.html`: investment research workspace, universe/watchlist, scorecards, analytics, portfolio bridge import, and recovery utilities.
- `tama-os.html`: unified entry point/dashboard that reads local data and presents decision-oriented output.
- `js/`: shared modules for storage, state snapshots, deterministic decisioning, AI context, and demo data.

The product is no longer constrained by Build Week delivery timing. The architecture should therefore optimize for a coherent Tama OS product experience, long-term correctness, maintainability, user trust, and migration safety. This branch can accept larger UI/UX and integration risk when it clearly moves Finance, Research, and OS toward one unified user experience.

## Product Architecture North Star

Tama OS should answer:

> What should I do next?

The durable architecture is a layered local-first system. UI/UX quality is part of the architecture because recommendations only create value when the user can understand and act on them quickly:

```text
User Events / Imports
        ↓
Local Data Stores
        ↓
Canonical Domain State
        ↓
Deterministic Decision Engine
        ↓
Explainable Recommendation Graph
        ↓
AI Copilot Explanation + Scenario Dialogue
        ↓
Journal / Action History / Memory
```

Key rule: AI explains and reasons over structured outputs. It does not replace deterministic calculations and does not directly mutate financial state.

## Current Runtime Architecture

The current implementation is still intentionally simple:

- HTML/CSS/vanilla JavaScript.
- No backend.
- No authentication.
- No framework.
- LocalStorage as the primary persisted store.
- JSON import/export for portability and recovery.
- Shared JavaScript modules loaded directly by browser pages.

This remains a valid foundation, but the next architecture phase should introduce clearer boundaries rather than more global patching.

## Application Boundaries

### Finance Workspace

Finance owns the highest-fidelity personal finance data today. It uses a global state object initialized from defaults and persisted under the current Finance localStorage key. It includes:

- Accounts and buckets.
- Monthly income and expense workflows.
- Transaction ledger.
- Monthly/yearly closing.
- Investment configuration and positions.
- Journal entries.
- Backup/restore.
- Bridge import/export.

Finance has the most mature normalization and legacy-key handling, so it should be treated as an important migration source rather than rewritten wholesale.

### Research Workspace

Research owns qualitative and analytical investment context. It includes:

- Research entries.
- Watchlist/universe records.
- Scorecards.
- Imported portfolio context.
- Research export/import.
- Restore points.
- Bridge import/export.

Research is the source of thesis coverage, watchlist intent, review freshness, conviction, and qualitative risks.

### Tama OS Shell

The OS shell should become the primary user-facing command center. Its role is to:

- Read Finance and Research data safely.
- Build canonical snapshots.
- Run deterministic decision logic.
- Display Today's Brief and the decision queue.
- Host the AI copilot.
- Capture recommendation outcomes.
- Guide the user back into Finance or Research only when editing is required.

The shell should avoid directly duplicating complex Finance/Research editing workflows until canonical write paths are ready.

### Unified Product Experience Decision

Finance, Research, and OS should feel like one product; fixing the current three-app vibe belongs to Milestone 1. `tama-os.html` should become the primary command center and eventually the preferred entry point for navigating all workflows. `tama-finance.html` and `tama-research.html` may remain separate files during migration, but their UI chrome, navigation, visual language, empty states, and action patterns should be unified so the user experiences Tama OS as one system.

Because the time constraint is gone, this branch can take more risk than the original Build Week plan. Acceptable larger changes include shared navigation, shared layout, shared theme tokens, common launch/return controls, and deeper UI cleanup across all three HTML pages. The key is to make the product feel unified without losing local data safety.

Constraints for this higher-risk approach:

- `tama-os.html` is the default product entry point.
- Finance and Research should share the same Tama OS shell language, navigation affordances, and design tokens.
- Shared UI and domain logic should move into `js/` and `assets/` instead of being duplicated.
- If Finance/Research remain separate files, they should still feel like first-class OS workspaces, not external apps.
- If workflows are later embedded into a single runtime, namespace collisions and duplicate DOM IDs must be resolved first.
- Preserve import/export and recovery paths before changing persisted data.

## Target Domain Modules

Long-term modules should be browser-native ES modules where possible:

```text
js/
  storage.js          # safe JSON persistence, restore points, export/import helpers
  state.js            # canonical snapshot and unified state adapters
  decision-engine.js  # deterministic financial reasoning
  ai.js               # curated AI context and Responses API integration
  demo-data.js        # demo/sample data utilities
  bridge.js           # future bridge contract validation
  ui.js               # future small shared UI helpers
  date.js             # future time/freshness helpers
```

The target is not a framework migration. The target is explicit boundaries around state, deterministic logic, AI context, and UI rendering, plus a unified user experience across all HTML entry points. Larger refactors are acceptable when they make the app feel like one Tama OS product or reduce workspace coupling.

## Canonical Data Model Direction

The next durable state contract should be documented before broad migration:

```json
{
  "schema": "tama-os-state-v1",
  "created_at": "ISO_DATE",
  "updated_at": "ISO_DATE",
  "profile": {},
  "finance": {},
  "research": {},
  "goals": [],
  "rules": [],
  "memory": {},
  "recommendations": [],
  "journal": [],
  "data_quality": []
}
```

During transition, the OS can continue producing a read-only snapshot:

```json
{
  "schema": "tama-os-snapshot-v1",
  "generated_at": "ISO_DATE",
  "finance": {},
  "research": {},
  "data_quality": [],
  "recommendation_inputs": {}
}
```

The snapshot is the safe bridge between legacy app storage and new OS features. The unified state becomes the write source only after migrations are tested and reversible.

## Data Flow Target

### Read Flow

1. Read existing local stores defensively.
2. Normalize into a canonical snapshot.
3. Attach data-quality warnings.
4. Run the deterministic decision engine.
5. Render recommendations, risks, and action queue.
6. Build curated AI context only from the snapshot and engine output.

### Write Flow

1. User confirms an action.
2. Write through a named action/service, not direct global mutation.
3. Create a restore point before destructive or migratory writes.
4. Persist to the canonical OS key.
5. Optionally sync/export legacy-compatible representations while migration is incomplete.
6. Append journal/action history explaining what changed and why.

## Persistence Strategy

### Current

LocalStorage keys remain important compatibility contracts:

- `tama-v8` for Finance.
- Finance legacy keys such as `tama-v7`, `tama-v6`, `tama-v5`, `tama-finance`, and `tama-state`.
- `tama-research-v1` for Research.
- Theme, restore-point, export timestamp, and chart preference keys.
- New Tama OS keys for shell-level features where present.

### Target

Use a staged persistence approach:

1. Keep LocalStorage for small structured state and backward compatibility.
2. Add `tama-os-v1` as the canonical OS state after migration tooling exists.
3. Keep old keys readable and exportable.
4. Add IndexedDB for larger or append-heavy data when needed: journals, AI conversation history, snapshots, attachments, large research notes, and restore-point archives.
5. Keep JSON export/import as a non-negotiable local-first recovery path.

## AI Architecture

The AI copilot should receive a curated context, not a raw dump of all browser storage. Context should include:

- User question.
- Current snapshot summary.
- Decision-engine output.
- Data-quality warnings.
- Relevant goals/rules/memory.
- Small excerpts or summaries of relevant research theses.

AI responsibilities:

- Explain recommendations.
- Compare options.
- Surface assumptions.
- Ask for missing data.
- Draft journal notes or action plans for user confirmation.

AI must not:

- Directly write financial state.
- Invent account balances, prices, or transactions.
- Override deterministic calculations silently.
- Hide uncertainty caused by missing or stale data.

## Integration Risks

1. Global namespace collisions remain a risk if Finance and Research scripts are merged directly.
2. Existing DOM-coupled handlers make direct reuse difficult.
3. Patch-layer wrappers make script order an implicit dependency.
4. Snapshot bridge data can become stale.
5. LocalStorage quota and synchronous writes may become limiting as journals and AI history grow.
6. Schema drift can break recommendations if not versioned.
7. Users can lose trust quickly if migration overwrites local data.

## Architectural Decisions

- Make Finance, Research, and OS feel like one cohesive Tama OS experience.
- Prefer shared shell, navigation, theme tokens, and workspace contracts before forcing a single runtime.
- A single-runtime or embedded-workspace direction is acceptable later if namespace collisions, duplicate DOM IDs, and migration safety are handled explicitly.
- Larger structural changes are allowed when they improve UX coherence, remove patching, duplication, or global coupling without sacrificing data safety.
- Extract deterministic logic before expanding AI behavior.
- Treat every recommendation as explainable, attributable, journalable, and easy to act on from the UI.
- Introduce IndexedDB only for clear data-volume or durability needs.
- Avoid framework migration unless UI complexity creates sustained product drag.
- Maintain JSON import/export even after unified storage exists.

## Next Architecture Milestones

1. Freeze and document the canonical state contract.
2. Add namespaced APIs for Finance, Research, Storage, Bridge, Decision Engine, and AI.
3. Replace monkey-patch extension behavior with explicit lifecycle hooks.
4. Move high-value calculations into pure functions with tests.
5. Introduce reversible migration to `tama-os-v1`.
6. Add action journaling as the first canonical write path.
7. Add IndexedDB for append-heavy history after LocalStorage limits become real.
