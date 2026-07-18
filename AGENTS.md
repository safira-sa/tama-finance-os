# AGENTS.md

# Tama OS

Welcome to Tama OS.

This repository contains an existing browser-based financial application that is being evolved into a local-first AI Financial Operating System during OpenAI Build Week.

Your responsibility is to improve the project while preserving its stability.

---

# Product Goal

This is NOT a finance tracker.

The goal is to build a Financial Operating System that helps users answer:

> What should I do next?

instead of

> What happened?

Every implementation should support this goal.

Read VISION.md before making architectural decisions.

---

# Repository Structure

finance/
Existing finance application.

research/
Investment research workspace.

assets/
Static resources.

js/
Shared JavaScript modules.

Future shared modules may include:

- decision-engine.js
- ai.js
- storage.js
- state.js

---

# Engineering Principles

Always:

- Preserve existing functionality.
- Prefer extending instead of rewriting.
- Keep commits focused.
- Keep files modular.
- Prefer reusable utilities.
- Explain architectural decisions.

Never:

- Rewrite the entire application.
- Introduce unnecessary frameworks.
- Break existing features.
- Add unnecessary dependencies.

---

# Technology Stack

- HTML
- CSS
- Vanilla JavaScript

Storage:

- LocalStorage
- IndexedDB

AI:

- OpenAI GPT-5.6
- Responses API

No backend.

No authentication.

No server.

---

# Development Workflow

Before coding:

1. Understand existing implementation.
2. Check VISION.md.
3. Check ROADMAP.md.
4. Implement only the requested milestone.

Never implement future milestones unless requested.

---

# Code Style

Prefer:

- Small functions.
- Explicit variable names.
- Modular architecture.
- Low coupling.
- High readability.

Avoid:

- Global mutable state.
- Duplicate logic.
- Deep nesting.

---

# Pull Requests

Every change should include:

- Summary
- Files changed
- Why the change was necessary
- Risks
- Suggested testing

---

# Definition of Done

A task is complete only if:

- Existing functionality still works.
- No regression is introduced.
- Code is understandable.
- No unnecessary complexity is added.
- The requested milestone is fully completed.

---

# Testing

Before finishing any task:

- Check console errors.
- Verify existing features.
- Test affected workflows.
- Report edge cases found.

Do not claim success without verification.

---

# General Rule

This repository evolves incrementally.

The goal is to improve the existing product, not replace it.

# Cost Awareness

Development time is limited.

When multiple solutions exist:

1. Choose the simplest.
2. Choose the lowest regression risk.
3. Choose the highest user impact.

Avoid gold-plating.

Prefer shipping a working feature over designing a perfect architecture.

# Product Constraints

Never optimize for engineering elegance over user value.

If a feature improves architecture but provides no immediate user benefit during the hackathon, postpone it.

Hackathon priorities:

1. Working demo
2. User experience
3. Product intelligence
4. Clean architecture
5. Scalability

# Build Week Scope

Highest Priority

- Tama OS Shell
- Snapshot Adapter
- Decision Engine
- Today's Brief
- GPT-5.6 Copilot

If time remains:

- Demo Data

Do NOT implement unless explicitly requested:

- Recommendation Journal
- Multi-agent
- Backend
- Authentication
- Cloud Sync
- Scenario Simulation
