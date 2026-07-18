# Implementation Plan — OpenAI Build Week Submission

## Purpose

This plan translates the architecture, technical-debt, and migration documents into a tightly scoped 2-day execution plan optimized for:

1. Maximum demo impact.
2. Lowest regression risk.
3. Highest judging score.
4. Clear alignment with the Tama OS product goal: helping users answer **“What should I do next?”**

The plan intentionally avoids a rewrite. The fastest path to a strong Build Week submission is to preserve the two working MVPs and add a thin, impressive, decision-oriented layer above them.

## Build Week Strategy

### Judging Narrative

The submission should tell a simple story:

> Tama OS turns existing finance and research records into a local-first AI Financial Operating System that reads the user’s financial situation, detects risks and opportunities, runs deterministic decision logic locally, and uses GPT-5.6 only to explain the next best action.

### Demo Spine

The demo should fit in 3-5 minutes:

1. Open Tama OS dashboard.
2. Show existing Finance and Research apps are preserved.
3. Show unified snapshot from local browser data.
4. Show deterministic “Today’s Brief” with health, risks, and recommended next action.
5. Ask the GPT-5.6 copilot: “What should I do next?”
6. Show the AI answer grounded in local structured data and deterministic findings.
7. Save/export or journal the recommendation outcome if time allows.

### Technical Strategy

- Keep `tama-finance.html` and `tama-research.html` untouched as much as possible.
- Add new files for the integrated experience and shared logic.
- Read existing localStorage keys instead of merging write paths.
- Use deterministic decision logic for calculations.
- Use GPT only for explanation and reasoning.
- Make every feature demo-visible.

## 2-Day Timeline Overview

| Day | Theme | Outcome |
| --- | --- | --- |
| Day 1 | Safe integration + deterministic insight | A unified `tama-os.html` dashboard reads local data and produces Today’s Brief offline. |
| Day 2 | AI reasoning + demo polish | GPT-5.6 copilot explains recommendations, demo data is stable, and the submission is polished. |

## Scope Control

### Must Ship

- Unified Tama OS entry page.
- Read-only localStorage snapshot from Finance and Research.
- Deterministic decision engine with visible recommendations.
- Today’s Brief / “What should I do next?” dashboard.
- GPT-5.6 copilot explanation using structured data.
- Demo-safe empty states and sample-data guidance.

### Should Ship If Time Allows

- Recommendation journal/export action.
- Simple scenario simulation for one decision, such as “invest bonus vs hold cash.”
- Data-quality panel showing confidence blockers.

### Explicitly Out of Scope

- Full state merge.
- Rewriting either application.
- Authentication.
- Backend.
- Cloud sync.
- IndexedDB migration.
- Framework migration.
- Multi-agent architecture.
- RAG.
- Full test suite.

---

# Day 1 — Unified Local-First Decision Layer

## Milestone 1 — Create Tama OS Shell

### Objective

Create a single Build Week entry point that visually presents Tama OS as one product while preserving Finance and Research as stable existing applications.

The shell should make the product feel integrated immediately, even before state is merged.

### Files to Modify

- `tama-os.html` — new integrated entry page.
- `README.md` — optional only if time remains; add launch instructions after approval.

No existing application runtime files should be modified for this milestone unless absolutely necessary.

### Estimated Implementation Time

2-3 hours.

### Regression Risk

Low.

Reason:

- Adds a new page instead of changing the two working MVPs.
- Existing localStorage keys remain untouched.
- Finance and Research can be opened as standalone apps if anything goes wrong.

### Implementation Notes

- Use vanilla HTML/CSS/JS.
- Provide top navigation:
  - Dashboard
  - Finance
  - Research
  - Copilot
  - Settings / Data
- Link to `tama-finance.html` and `tama-research.html` directly.
- Prefer links or isolated views over embedding both full apps into one DOM to avoid global collisions.
- Brand the dashboard around decision support, not tracking.

### Demo Impact

High.

This creates the immediate perception that the project has become one operating system rather than two separate files.

### Testing Checklist

- Open `tama-os.html` directly in the browser.
- Navigate from Tama OS to Finance.
- Navigate from Tama OS to Research.
- Return to Tama OS without losing localStorage data.
- Verify Finance still loads from `tama-finance.html`.
- Verify Research still loads from `tama-research.html`.
- Check browser console for errors on the new shell.
- Confirm no edits were made to Finance or Research runtime behavior.

---

## Milestone 2 — Add Read-Only Local Snapshot Adapter

### Objective

Read current Finance and Research localStorage data into one canonical read-only Tama OS snapshot without mutating either app’s state.

This creates the foundation for the dashboard, decision engine, and AI copilot.

### Files to Modify

- `js/storage.js` — new safe localStorage JSON helper.
- `js/state.js` — new read-only Tama OS snapshot builder.
- `tama-os.html` — load and display snapshot status.

### Estimated Implementation Time

3-4 hours.

### Regression Risk

Low.

Reason:

- Read-only localStorage access.
- No writes to `tama-v8` or `tama-research-v1`.
- No changes to existing app internals.

### Implementation Notes

Snapshot should read:

- Finance state from `tama-v8`.
- Research state from `tama-research-v1`.
- Finance theme/research theme only if needed for display.

Canonical shape:

```json
{
  "schema": "tama-os-snapshot-v1",
  "generated_at": "ISO_DATE",
  "finance": {
    "available": true,
    "summary": {},
    "accounts": [],
    "transactions": [],
    "expenses": [],
    "positions": [],
    "journal": []
  },
  "research": {
    "available": true,
    "summary": {},
    "entries": [],
    "universe": []
  },
  "data_quality": []
}
```

Keep extraction shallow and defensive. The goal is not perfect normalization; the goal is reliable demo data for recommendations.

### Demo Impact

Medium-high.

Judges can see that the OS reads existing local data without backend infrastructure.

### Testing Checklist

- Load Tama OS with no localStorage data and verify empty state.
- Load Tama OS with Finance data and no Research data.
- Load Tama OS with Research data and no Finance data.
- Load Tama OS with both data sets.
- Corrupt a copied test localStorage value and verify the shell does not crash.
- Confirm `tama-v8` is not modified by snapshot read.
- Confirm `tama-research-v1` is not modified by snapshot read.
- Check console for parse errors and user-friendly warnings.

---

## Milestone 3 — Build Deterministic Decision Engine

### Objective

Create a local, offline decision engine that turns the snapshot into findings, risks, and next-action recommendations.

This is the core product differentiator: deterministic logic answers “What should I do next?” before AI explains it.

### Files to Modify

- `js/decision-engine.js` — new deterministic engine.
- `tama-os.html` — display engine output.

### Estimated Implementation Time

4-5 hours.

### Regression Risk

Low-medium.

Reason:

- New logic only.
- No existing app writes.
- Risk is mostly incorrect calculations or confusing recommendations, not regression to existing workflows.

### Implementation Notes

Implement a small set of high-impact, demo-friendly rules:

1. Emergency fund status
   - Detect available emergency/cash-like buckets or accounts when possible.
   - Flag missing or underfunded emergency data.

2. Cash allocation status
   - Detect cash-heavy or investment-heavy posture using available account/position data.

3. Open-position research coverage
   - Compare Finance positions with Research entries by ticker.
   - Flag open positions without thesis/research coverage.

4. Research freshness
   - Flag stale research entries or entries needing review.

5. Monthly activity status
   - Detect if current month has income/expense records or is missing activity.

6. Next best action ranking
   - Produce one primary recommendation and 3-5 supporting actions.

Recommended output:

```json
{
  "generated_at": "ISO_DATE",
  "health_score": 72,
  "status": "attention_needed",
  "primary_recommendation": {
    "title": "Review thesis gaps before adding risk",
    "why": "2 open positions do not have active research coverage.",
    "action": "Open Research Desk and write/update thesis for the uncovered holdings.",
    "confidence": "medium"
  },
  "findings": [],
  "risks": [],
  "opportunities": [],
  "data_quality": []
}
```

Scoring should be simple and explainable. Avoid false precision.

### Demo Impact

Very high.

This is the main judging hook because it proves Tama OS is not just a tracker.

### Testing Checklist

- Run engine with empty snapshot.
- Run engine with Finance-only snapshot.
- Run engine with Research-only snapshot.
- Run engine with both Finance and Research data.
- Verify open positions without matching research generate a clear recommendation.
- Verify stale/missing data lowers confidence rather than crashing.
- Verify health score stays within 0-100.
- Verify all recommendations have a title, why, action, and confidence.
- Confirm no localStorage writes occur from the engine.

---

## Milestone 4 — Today’s Brief Dashboard

### Objective

Create a visually compelling dashboard that summarizes financial health, current risks, research gaps, and the next best action in under one minute.

This is the primary demo surface.

### Files to Modify

- `tama-os.html` — dashboard UI.
- `js/ui.js` — optional small shared UI helpers if needed.
- `js/decision-engine.js` — only if display requires minor output adjustments.

### Estimated Implementation Time

3-4 hours.

### Regression Risk

Low.

Reason:

- UI is isolated to the new Tama OS page.
- Existing app files remain unchanged.

### Implementation Notes

Dashboard sections:

1. Today’s Brief
   - Greeting.
   - Health score.
   - Primary recommendation.
   - Confidence level.

2. Decision Queue
   - Ranked list of recommended actions.
   - Use clear action verbs: Review, Fund, Invest, Hold, Update, Export.

3. Risk Radar
   - Missing thesis.
   - Stale research.
   - Missing backup.
   - Missing FX/currency assumptions.
   - No current-month data.

4. Local Data Status
   - Finance data found / missing.
   - Research data found / missing.
   - Last saved/exported if available.

5. Launch Cards
   - Open Finance.
   - Open Research.

Design should be polished enough for judging but avoid complex UI architecture.

### Demo Impact

Very high.

This is where judges understand the product in seconds.

### Testing Checklist

- Dashboard renders with no data.
- Dashboard renders with partial data.
- Dashboard renders with full demo data.
- Primary recommendation is visible above the fold.
- Launch cards open the correct existing apps.
- Health score and risk count update after localStorage changes and refresh.
- Browser console has no errors.
- Layout is usable on a laptop screen for demo recording.

---

# Day 2 — AI Copilot, Demo Polish, and Submission Readiness

## Milestone 5 — GPT-5.6 Copilot Explanation

### Objective

Add an AI copilot panel that explains the deterministic recommendation in natural language using structured local data.

The copilot should not perform calculations or modify data. It should explain, contextualize, and suggest the next step.

### Files to Modify

- `js/ai.js` — new AI request/context helper.
- `tama-os.html` — copilot UI.
- `README.md` — optional API key/config instructions after approval.

### Estimated Implementation Time

4-5 hours.

### Regression Risk

Medium.

Reason:

- Network/API behavior can fail.
- API key handling and error states must be demo-safe.
- Existing local apps remain isolated, so app regression risk is low.

### Implementation Notes

Copilot prompt should include:

- Tama OS product role.
- User question.
- Decision-engine output.
- Condensed Finance summary.
- Condensed Research summary.
- Data-quality warnings.

Rules for AI response:

- Do not claim to be financial advice.
- State assumptions.
- Explain the deterministic recommendation.
- Give 1-3 concrete next actions.
- Never say it changed user data.
- Prefer concise executive language.

Demo questions:

- “What should I do next?”
- “Can I invest more this month?”
- “Which position needs review first?”
- “Explain my biggest financial risk today.”

Must include graceful fallback:

- If no API key, show prepared prompt/context and explain that deterministic mode still works offline.
- If request fails, keep Today’s Brief usable.

### Demo Impact

Very high.

This directly aligns with OpenAI Build Week and demonstrates AI reasoning on top of local structured data.

### Testing Checklist

- Copilot panel loads with no API key.
- Copilot panel explains offline deterministic recommendation fallback.
- With API key configured, ask “What should I do next?” and receive a grounded response.
- Verify AI response references current recommendation and data-quality warnings.
- Verify AI does not claim to mutate data.
- Verify API failure shows a friendly error.
- Verify no sensitive raw full localStorage dump is sent unnecessarily.
- Check console for failed promise handling.

---

## Milestone 6 — Demo Data and Recovery-Safe Workflow

### Objective

Prepare a reliable demo path that works even if the browser has no existing user data.

Judges should see value immediately without requiring manual setup.

### Files to Modify

- `assets/demo-data/finance-demo.json` — optional new demo Finance data.
- `assets/demo-data/research-demo.json` — optional new demo Research data.
- `tama-os.html` — optional “Load demo data” helper after explicit approval.
- `implementation-plan.md` should remain the planning source; runtime code only after approval.

### Estimated Implementation Time

2-3 hours.

### Regression Risk

Medium if demo data writes to localStorage; low if demo data is only downloadable/importable.

Reason:

- Writing demo data into production keys could overwrite real user data if not guarded.

### Implementation Notes

Preferred low-risk option:

- Provide downloadable/importable demo JSON files.
- Include instructions to back up existing data before loading demo data.

Higher-impact but riskier option:

- Add “Load demo data” button in Tama OS.
- Before writing anything, detect existing data and require explicit confirmation.
- Save a restore point first.
- Never auto-load demo data.

Demo data should include:

- A salary/current month record.
- Several accounts and buckets.
- At least 2 open positions.
- At least 1 position with matching research.
- At least 1 position without research to trigger a thesis-gap recommendation.
- At least 1 stale research entry.
- At least 1 clear opportunity/action item.

### Demo Impact

High.

A reliable scripted dataset dramatically improves demo quality and reduces presentation risk.

### Testing Checklist

- Start in a clean browser profile.
- Load demo data or import demo JSON.
- Refresh Tama OS and verify dashboard recommendations appear.
- Open Finance and verify demo finance data appears.
- Open Research and verify demo research data appears.
- Confirm existing data warning appears before any write-based demo load.
- Confirm restore/export path exists before demo overwrite.
- Confirm demo path can be repeated for recording.

---

## Milestone 7 — Recommendation Journal / Action Capture

### Objective

Close the loop by allowing the user to capture a recommendation outcome locally.

This supports the roadmap workflow ending in Journal without rewriting Finance or Research journal systems.

### Files to Modify

- `js/storage.js` — local recommendation journal helper.
- `tama-os.html` — “Save to Tama OS Journal” action.

### Estimated Implementation Time

2-3 hours.

### Regression Risk

Low-medium.

Reason:

- Adds a new localStorage key instead of writing into existing Finance/Research state.
- Risk is limited to the new Tama OS journal feature.

### Implementation Notes

Use a separate key initially:

- `tama-os-recommendation-journal-v1`

Journal entry shape:

```json
{
  "id": "timestamp-or-random-id",
  "created_at": "ISO_DATE",
  "recommendation_title": "Review thesis gaps before adding risk",
  "decision": "accepted | dismissed | snoozed | noted",
  "reason": "User-entered note",
  "engine_snapshot": {}
}
```

Do not write into Finance `journal` yet. That can happen after approval in a later milestone.

### Demo Impact

Medium-high.

It shows a complete loop from insight to action history without risking existing journal workflows.

### Testing Checklist

- Save a recommendation to the Tama OS journal.
- Refresh and verify the entry persists.
- Mark a recommendation accepted/dismissed if implemented.
- Verify Finance `tama-v8` is unchanged.
- Verify Research `tama-research-v1` is unchanged.
- Export or view journal entries if available.
- Check localStorage key contains only Tama OS journal data.

---

## Milestone 8 — Polish, QA, and Submission Package

### Objective

Make the submission feel stable, understandable, and judge-ready.

### Files to Modify

- `README.md` — update launch/demo instructions after approval.
- `tama-os.html` — final copy polish and empty states.
- `js/*` new files only as needed.
- `assets/demo-data/*` if demo data is included.

### Estimated Implementation Time

3-4 hours.

### Regression Risk

Low.

Reason:

- Mostly documentation, copy, empty states, and QA.
- Avoid touching existing app runtime code unless a blocker is found.

### Implementation Notes

Polish checklist:

- Make the first screen self-explanatory.
- Add one-sentence product thesis near the top.
- Make the primary recommendation visually dominant.
- Add disclaimers without weakening the product story.
- Keep API-key setup clear and optional.
- Include a 3-minute demo script.
- Ensure all links work locally.

### Demo Impact

High.

Judges reward clarity. A polished, focused product story can outperform a broader but confusing implementation.

### Testing Checklist

- Full clean-profile demo run.
- Full existing-data demo run.
- Finance standalone smoke test.
- Research standalone smoke test.
- Tama OS dashboard smoke test.
- Copilot no-key fallback test.
- Copilot happy-path test if API key is available.
- Export/backup sanity check.
- Console error check on all three pages.
- Responsive check on laptop-size viewport.

---

# Recommended 2-Day Schedule

## Day 1 Schedule

| Time | Work |
| --- | --- |
| 09:00-09:30 | Confirm baseline, create branch, open apps, export backup. |
| 09:30-12:00 | Milestone 1: Tama OS shell. |
| 12:00-13:00 | Milestone 2: read-only snapshot adapter. |
| 13:00-14:00 | Break / manual test existing apps. |
| 14:00-18:00 | Milestone 3: deterministic decision engine. |
| 18:00-20:00 | Milestone 4: Today’s Brief dashboard. |
| 20:00-21:00 | Day 1 smoke test and bug fixes. |

Day 1 exit criteria:

- `tama-os.html` opens.
- Existing apps are reachable.
- Dashboard reads local data.
- Decision engine produces at least one useful recommendation.
- Existing Finance and Research still work.

## Day 2 Schedule

| Time | Work |
| --- | --- |
| 09:00-10:00 | Review Day 1 bugs and tighten dashboard copy. |
| 10:00-14:00 | Milestone 5: GPT-5.6 copilot. |
| 14:00-16:00 | Milestone 6: demo data path. |
| 16:00-18:00 | Milestone 7: recommendation journal if stable; otherwise skip. |
| 18:00-20:00 | Milestone 8: README, demo script, QA pass. |
| 20:00-21:00 | Record/practice final demo. |

Day 2 exit criteria:

- AI explanation works or degrades gracefully.
- Demo data path is reliable.
- No console errors during primary demo flow.
- README explains how to run the submission.
- Final demo script is rehearsed.

---

# Priority Cut Line

If time runs short, cut scope in this order:

1. Recommendation journal.
2. Scenario simulation.
3. Demo data write button.
4. Shared utility extraction polish.
5. README depth.

Do not cut:

1. Tama OS shell.
2. Today’s Brief.
3. Deterministic decision engine.
4. AI explanation or AI fallback.
5. Existing app stability checks.

---

# Final Submission Acceptance Criteria

The Build Week submission is ready when:

- A judge can open one Tama OS page and understand the product in 30 seconds.
- The system provides a deterministic next best action using local data.
- GPT-5.6 explains that recommendation using structured context.
- Finance and Research remain functional as existing MVPs.
- The demo works in a clean browser with demo data or clear fallback states.
- No backend, authentication, cloud sync, or framework migration is introduced.
- The product clearly answers “What should I do next?”

---

# Final Risk Controls

- Preserve `tama-finance.html` and `tama-research.html` behavior.
- Keep all cross-app reads read-only until after the demo.
- Use new localStorage keys for new Tama OS features.
- Keep old localStorage keys readable and untouched.
- Export backups before any demo data import.
- Avoid global script merging.
- Keep AI optional and gracefully degraded.
- Prefer a smaller polished demo over a larger unstable feature set.
