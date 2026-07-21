# Roadmap

Project: Tama OS
Status: Post-Build-Week product roadmap

---

# Mission

Transform Tama Finance and Tama Research Desk into a single local-first AI Financial Operating System that helps users make better decisions.

The goal is not to build another finance tracker.

The goal is to build a decision support system that helps users answer:

> What should I do next?

The product should require less manual entry over time by automatically deriving state, defaults, data-quality warnings, and next-action prompts from existing local data.

---

# Updated Guiding Principles

The project is no longer optimized for a hackathon deadline. The priority order is now:

1. User trust and data safety.
2. Correct deterministic financial reasoning.
3. Good user experience, treated as a core product requirement rather than final polish.
4. AI-assisted explanation and planning.
5. Maintainable architecture.
6. Long-term scalability.

Speed still matters, but this phase can take more UI/UX risk when it makes Finance, Research, and OS feel like one coherent Tama OS product.

---

# Architecture Goals

Tama OS should evolve toward:

```text
Tama OS
├── Today / Decision Brief
├── Finance Workspace
├── Investment Portfolio
├── Research Workspace
├── Goals and Rules
├── Simulations
├── Recommendation Journal
├── Financial Memory
├── Settings / Data Safety
└── AI Copilot
```

Every module should ultimately read from a canonical local state contract while preserving JSON portability and offline usefulness.

Important product decision: Finance, Research, and OS should become one cohesive user experience. They may remain separate HTML files during migration, but shared chrome, navigation, visual language, and action patterns should make them feel like one Tama OS.

---

# Core Workflow

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

If this workflow is reliable, explainable, and safe for local data, the product is moving in the right direction.

---

# Milestone 0 — Baseline Preservation

Status: Complete / maintain continuously

Tasks:

- Preserve existing Finance and Research functionality.
- Maintain manual browser checklist.
- Keep JSON import/export working.
- Keep old localStorage keys readable.

Deliverable:

Stable baseline users can trust.

Priority: P0

---

# Milestone 1 — Unified Tama OS Experience / Fix 3-App Vibe

Goal:

Make `tama-os.html`, `tama-finance.html`, and `tama-research.html` stop feeling like three different apps. This milestone owns the UI/UX unification layer: shared shell, shared navigation, shared design language, shared empty states, and consistent next-action affordances. It accepts more UI/UX risk than the original Build Week plan because product coherence is now a core requirement.

Tasks:

- Add shared Tama OS navigation across all HTML entry points.
- Normalize the three different app vibes into one Tama OS visual system.
- Align visual language, spacing, typography, cards, buttons, and empty states.
- Make `tama-os.html` the default command center.
- Add clear paths from OS recommendations into Finance and Research workflows.
- Add consistent backup/data-safety affordances before risky actions.
- Keep local data readable while UI consolidation happens.

Deliverable:

A unified Tama OS user experience across Finance, Research, and OS pages. Use `docs/high-roi-audit.md` as the product audit for high-ROI UI/UX and automation opportunities.

Priority: P0

---

# Milestone 2 — Canonical Contracts and Decision Engine Hardening

Goal:

Define the state contracts and make deterministic recommendations trustworthy.

Responsibilities:

- Document `tama-os-snapshot-v1` and `tama-os-state-v1`.
- Document decision-engine input/output and AI context payloads.
- Budget evaluation.
- Emergency fund calculation.
- Allocation calculation.
- Portfolio distribution.
- Rule validation.
- Financial health scoring.
- Recommendation ranking.
- Data-quality confidence flags.

Deliverable:

Versioned contracts plus a tested offline financial decision engine.

Priority: P0

---

# Milestone 3 — Safe Unified Storage Migration

Goal:

Introduce canonical `tama-os-v1` storage without risking existing data.

Tasks:

- Build migration dry run.
- Preview records and warnings.
- Create restore points.
- Export backup before migration.
- Write `tama-os-v1` only after explicit confirmation.
- Keep Finance and Research legacy keys intact.

Deliverable:

Reversible local migration path.

Priority: P0

---

# Milestone 4 — Recommendation Journal

Goal:

Close the loop from insight to action history.

Tasks:

- Save recommendations as local journal entries.
- Track accepted, dismissed, snoozed, and noted outcomes.
- Preserve the engine snapshot that generated the recommendation.
- Export/import recommendation history.

Deliverable:

Durable recommendation/action history.

Priority: P1

---

# Milestone 5 — Financial Memory and Rules

Goal:

Store user preferences that influence deterministic and AI-assisted recommendations.

Examples:

- Emergency fund target.
- Allocation rules.
- Investment strategy.
- Risk tolerance.
- Financial goals.
- Preferred liquidity buffer.

Deliverable:

Persistent financial profile used by the decision engine and AI context builder.

Priority: P1

---

# Milestone 6 — GPT Copilot Hardening

Goal:

Make the AI copilot a safe explanation and planning layer on top of deterministic output.

Requirements:

- Uses curated structured financial data.
- Never modifies user data directly.
- Explains reasoning and assumptions.
- References deterministic findings.
- Gracefully degrades offline or without an API key.

Deliverable:

Reliable AI assistant for financial reasoning.

Priority: P1

---

# Milestone 7 — Simulation

Goal:

Help users evaluate financial decisions before making them.

Examples:

- What happens if I buy an iPad?
- What happens if I invest Rp5M?
- What happens if my salary increases 10%?
- What happens if I lose my job?
- What happens if I receive a bonus?

Deliverable:

Interactive scenario simulation connected to recommendations and journal outcomes.

Priority: P2

---

# Milestone 8 — Workspace Consolidation

Goal:

Consolidate Finance and Research workflows behind a coherent Tama OS shell. The near-term goal is one product experience across all HTML pages; the later goal may be embedded or single-runtime workspaces once collision and migration risks are handled.

Recommended order:

1. Link position to thesis.
2. Goal/rule edits.
3. Journal entries.
4. New research note creation.
5. Position review workflow.
6. Transaction/account editing only after lower-risk flows are stable.

Deliverable:

Finance and Research workflows that feel native to Tama OS, share UI foundations, and connect through OS-level contracts for cross-workspace decisions.

Priority: P2

---

# Milestone 9 — Durability and Scale

Goal:

Introduce IndexedDB where LocalStorage is no longer sufficient.

Candidates:

- AI conversation history.
- Recommendation journal archive.
- Restore point archive.
- Large research notes.
- Future attachments/imported documents.

Deliverable:

More durable local-first storage while retaining JSON portability.

Priority: P2

---

# Future Roadmap

Version 2:

- Broker or bank imports with explicit user control.
- OCR for statements/receipts.
- Calendar reminders.
- Optional cloud sync.
- Optional authentication.
- Mobile-friendly experience.

Version 3:

Expand beyond finance:

- Career.
- Learning.
- Reading.
- Health.
- Projects.

The long-term destination is a local-first Personal Operating System with shared reasoning, memory, and action planning.

---

# Definition of Success

A first-time user should be able to:

✓ Record or import a financial event.

✓ Understand financial health immediately.

✓ Receive a useful next-action recommendation.

✓ Understand the reasoning and assumptions.

✓ Simulate a decision before acting.

✓ Save the decision outcome to local history.

without relying on a backend service.

---

# Development Rules

Every feature must satisfy at least one of these, and every user-facing feature must pass a UI/UX review for clarity, fewer inputs, visible next action, and safe recovery:

- Improves user decision making.
- Improves recommendation correctness.
- Reduces data-loss risk.
- Preserves or improves existing functionality.
- Supports the long-term local-first OS architecture.

If a feature does not satisfy these rules, defer it.
