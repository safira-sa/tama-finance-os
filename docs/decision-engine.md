# Deterministic Decision Engine

The current Tama OS milestone uses a read-only deterministic decision engine before AI explanation.

## Scope

- Read the canonical local snapshot from `js/state.js`.
- Evaluate data readiness, stale records, missing Finance or Research data, and position/thesis coverage.
- Produce a top priority, key risks, decision readiness, and a recommended next action.
- Keep routine financial calculations local and deterministic.

## Non-goals

- No direct writes to Finance or Research localStorage keys.
- No raw localStorage dump to AI.
- No replacement for Finance or Research write workflows.
- No claim to provide personalized financial advice.

## AI boundary

`js/ai.js` may explain the deterministic output, but the decision engine remains the source of deterministic findings.
