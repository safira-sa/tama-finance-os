# High-ROI Product Audit — Finance, Research, and Tama OS

## Purpose

This audit identifies the highest-return updates for moving Tama OS toward the vision: users should enter less data manually, receive more automatic insight, and know what to do next.

The key product shift is:

```text
Less manual entry
↓
More automatic state inference
↓
Better deterministic recommendations
↓
AI explanation only after the system has structured facts
```

This document is intentionally practical. It focuses on changes that can improve user value quickly even if the branch accepts more UI/UX and integration risk.

---

## North Star: Entry Dikit, Automatic Banyak

The product should not ask the user to maintain a perfect spreadsheet. Finance and Research should move toward assisted capture:

- Detect what can be inferred from existing records.
- Pre-fill the next likely input.
- Convert repeated manual actions into one-click confirmations.
- Ask for missing information only when it changes the recommendation.
- Treat incomplete data as a data-quality issue, not as a blocker.

The system should feel like it is doing the operational work and asking the user for judgment only at the right moments.


---

## UI/UX Must Stay in the Loop

UI/UX is not polish at the end. For Tama OS, UI/UX is part of the decision engine because the product only succeeds if the next action is obvious, trusted, and easy to complete. Every Finance, Research, or OS change should be reviewed through these questions:

1. **Can the user understand the next action in under 10 seconds?**
2. **Can the user complete the action with fewer inputs than before?**
3. **Does the screen explain why the action matters?**
4. **Does the UI show confidence, data freshness, and missing-data blockers?**
5. **Is there a safe exit: cancel, export, restore, or undo?**

A technically correct feature is not done if the user still has to hunt through tabs, infer what changed, or manually connect Finance and Research context.

### UI/UX Acceptance Gate

Before shipping any high-ROI update, verify:

- The primary action is visually dominant.
- Secondary actions do not compete with the next best action.
- Empty states teach the user what to enter next.
- Data-quality warnings are actionable, not just alerts.
- Cross-workspace navigation preserves context, such as ticker, month, recommendation ID, or review reason.
- The user can recover from risky actions through backup, restore, undo, or explicit confirmation.

---

# High-ROI Updates for Tama OS Shell

## 1. Unified Command Center

### Milestone

Milestone 1 owns this. The explicit goal is to fix the “three different app vibes” problem before deeper state migration.

### Update

Make `tama-os.html` the default starting point with a persistent Tama OS header shared across OS, Finance, and Research.

### Why it is high ROI

This immediately makes the product feel like one OS instead of three different apps with separate vibes. It also gives every workflow a consistent place to return to: Today's Brief, Decision Queue, Data Status, and Copilot.

### Expected user impact

- User opens one page and knows where to go.
- Recommendations can route the user into the exact Finance or Research workflow needed.
- The product story becomes obvious in seconds.

### Risks

- Shared navigation can break existing layout if injected too aggressively.
- Multiple pages may have conflicting theme variables or button styles.
- If the shell tries to own too much too early, it may duplicate Finance/Research workflows.

### Bugs to watch

- Broken relative links between HTML files.
- Theme button state mismatch between pages.
- Header overlapping existing sticky elements or modals.
- Mobile viewport overflow after adding shared chrome.

---

## 2. Decision Queue as the Primary UX

### Update

Replace passive dashboard emphasis with a ranked action queue:

1. Must do now.
2. Should review.
3. Optional improvement.
4. Missing data needed.

Each item should link to the relevant workspace and include a reason, confidence level, and source data.

### Why it is high ROI

It directly implements “What should I do next?” and makes Finance/Research feel like supporting modules rather than separate destinations.

### Expected user impact

- User does not need to inspect every chart.
- The OS tells the user which area deserves attention first.
- AI can explain an existing deterministic recommendation instead of inventing one.

### Risks

- Bad ranking can reduce user trust.
- Too many recommendations can feel noisy.
- Missing data may be mistaken for a real financial problem.

### Bugs to watch

- Health score outside 0-100.
- Duplicate recommendations from repeated render calls.
- Recommendations based on stale bridge snapshots.
- Links that open the wrong tab/workflow.

---

## 3. Data Quality Panel

### Update

Add a visible data-quality panel that explains why the OS may be uncertain:

- No current-month activity.
- No salary/income assumption.
- Portfolio prices stale.
- Missing research thesis.
- Finance and Research bridge data out of date.
- No recent backup.

### Why it is high ROI

This turns incomplete data into a guided next step instead of making users feel the app is broken.

### Risks

- Too many warnings can overwhelm users.
- Warning severity may need tuning.

### Bugs to watch

- Incorrect stale-date calculations.
- Invalid dates showing as `NaN` or `Invalid Date`.
- False warnings when data exists under legacy keys.

---

# High-ROI Updates for Finance Workspace

## 1. Quick Capture Instead of Full Manual Entry

### Update

Add a fast-entry surface for common financial events:

- Salary received.
- Expense paid.
- Transfer between accounts.
- Investment buy/sell.
- Price update.
- Month closed.

The form should pre-fill date, account, category, currency, and likely bucket based on prior records.

### Why it is high ROI

Finance currently contains detailed workflows, but detailed entry slows users down. Quick capture helps the product stay useful even when users do not want to maintain everything manually.

### Automation direction

- Use last used account/category as defaults.
- Suggest category from note text.
- Suggest month from date.
- Auto-create linked transaction rows when safe.
- Auto-detect recurring salary/expense patterns.
- Ask only for amount and confirmation when confidence is high.

### Risks

- Incorrect auto-categorization can corrupt decision outputs.
- Auto-created linked rows can duplicate transactions.
- Users may not notice wrong default account/currency.

### Bugs to watch

- `Date.now()` ID collisions during rapid entry/import.
- Expense and transaction duplication when quick capture creates both records.
- Incorrect sign handling for expenses, transfers, and sells.
- Currency conversion fallback silently using stale or missing FX rates.

---

## 2. Automatic Monthly Operating Review

### Update

Generate an automatic monthly review from existing Finance data:

- Income detected / missing.
- Spending versus configured targets.
- Emergency fund status.
- Cash above/below target.
- Sinking fund progress.
- Suggested invest/hold/spend action.

### Why it is high ROI

This turns Finance from a ledger into a decision engine input. It reduces the need for the user to inspect separate monthly, transaction, and investment screens.

### Risks

- Recommendations may be wrong if month close logic and live transactions disagree.
- Salary assumptions may be stale.
- Over-precise recommendations can feel like financial advice.

### Bugs to watch

- Closed months being modified unexpectedly.
- Reopened months not rolling back all generated rows.
- Surplus allocation posted twice.
- Current month calculated differently across pages.

---

## 3. Finance-to-Research Action Links

### Update

When an open position lacks research coverage or has stale thesis data, Finance should show a direct action:

- “Create thesis in Research.”
- “Review thesis.”
- “Update target/stop.”

### Why it is high ROI

It connects money decisions to reasoning. This is a core Financial OS behavior.

### Risks

- Ticker matching can fail across markets or aliases.
- Research import snapshots can be stale.

### Bugs to watch

- Case-sensitive ticker mismatches.
- IDX/US ticker suffix mismatches.
- Closed positions still appearing as needing thesis.
- Bridge import age not updating after refresh.

---

# High-ROI Updates for Research Workspace

## 1. Research Intake Assistant

### Update

Add a guided research intake that captures only the minimum needed for a useful decision:

- Ticker.
- Thesis in one sentence.
- Time horizon.
- Risk level.
- Buy/hold/watch decision.
- Review date.

Optional details can stay collapsed until needed.

### Why it is high ROI

Research should not feel like writing a long report before the OS can help. Minimum viable thesis coverage is enough to improve recommendations.

### Automation direction

- Pre-fill ticker from Finance open positions.
- Suggest review date based on hold type.
- Flag missing thesis automatically.
- Convert stale thesis into a Decision Queue item.
- Use AI to draft a thesis summary only from user-provided notes and structured fields.

### Risks

- Too little research data can create shallow recommendations.
- AI-drafted summaries may sound more confident than the underlying data.

### Bugs to watch

- Score formulas not recalculating older entries after field changes.
- Duplicate research entries for the same ticker.
- Stale status not updating on load.
- Modal fields losing values after patch-render cycles.

---

## 2. Portfolio Coverage Board

### Update

Show coverage for every Finance position:

- Covered.
- Missing thesis.
- Stale thesis.
- Contradiction between Finance position and Research recommendation.
- High-risk position without exit plan.

### Why it is high ROI

This makes Research operational. The user sees exactly what research work affects current money decisions.

### Risks

- Requires Finance data freshness.
- Bad ticker normalization can create false gaps.

### Bugs to watch

- Bridge data unavailable or stale but treated as current.
- Duplicate positions inflating coverage gaps.
- Closed/zero positions counted as active.
- Research entry status ignored when computing coverage.

---

## 3. Review Cadence Automation

### Update

Automatically create review prompts based on thesis age, holding type, price movement, or upcoming event date.

### Why it is high ROI

Research becomes proactive instead of archival. The app tells the user which thesis matters now.

### Risks

- Too frequent prompts become notification noise.
- Event-date parsing can be unreliable.

### Bugs to watch

- Timezone/date parsing shifts review date by one day.
- Invalid dates generating permanent stale warnings.
- Review status not saved consistently.

---

# Cross-App Automation Opportunities

## 1. Auto-Derived Snapshot

Build a canonical snapshot automatically on OS load from Finance and Research localStorage. The user should not need to manually export/import bridge files just to see Today's Brief.

### Risk

If automatic reads treat stale data as live, recommendations may be misleading.

### Guardrail

Always show source, generated time, and freshness warnings.

## 2. Smart Missing-Data Prompts

Ask for only the missing field that changes the next recommendation, such as salary, emergency fund target, or thesis for an active position.

### Risk

The app may ask too many questions.

### Guardrail

Rank prompts by impact and show at most one primary missing-data prompt at a time.

## 3. One-Click Confirmed Actions

Convert recommendations into guided actions:

- Save recommendation to journal.
- Open quick expense entry.
- Open research intake for uncovered ticker.
- Mark thesis reviewed.
- Set next review date.

### Risk

One-click actions can modify data too easily.

### Guardrail

Use preview/confirm for any data mutation and create restore points before destructive changes.

---

# Priority Matrix

| Priority | Area | Update | Why now | Main risk |
| --- | --- | --- | --- | --- |
| P0 | OS | Unified shell/navigation/design | Makes the product feel like one Tama OS | Layout regressions |
| P0 | OS | Decision Queue | Directly answers “what should I do next?” | Bad ranking/noise |
| P0 | Finance | Quick Capture | Reduces manual entry | Incorrect defaults/duplicates |
| P0 | Research | Portfolio Coverage Board | Connects research to real positions | Stale bridge data |
| P1 | Finance | Automatic Monthly Review | Turns ledger into recommendations | Month close inconsistencies |
| P1 | Research | Research Intake Assistant | Makes thesis coverage lightweight | Shallow/overconfident notes |
| P1 | Cross-app | Auto-derived snapshot | Removes manual bridge friction | Stale data interpreted as live |
| P2 | Cross-app | One-click confirmed actions | Closes recommendation loop | Accidental writes |
| P2 | Research | Review cadence automation | Makes research proactive | Alert fatigue |

---

# Known Bug / Fragility Audit

## Finance

- Many write paths generate IDs with `Date.now()`, which can collide during rapid entry or bulk import.
- Quick expense logging creates linked transactions; future quick capture must avoid duplicate records.
- Month close/reopen is sensitive because auto-generated surplus rows must be idempotent.
- Currency conversion can become misleading when FX rates are missing or stale.
- Multiple render paths can create repeated UI work and stale chart state.

## Research

- `renderAll()` and save/load behavior are wrapped by several patch layers, making execution order fragile.
- Research scoring can be stored on entries while formulas evolve, so old entries may need recalculation.
- Ticker matching between Finance positions and Research entries can fail by case, market suffix, or aliases.
- Stale bridge imports can look current if freshness is not visible.
- Modal field patching can create lost values or duplicate listeners.

## Tama OS Shell

- Snapshot reads must never mutate Finance or Research legacy keys.
- Demo data helpers must not overwrite real user data without backup and confirmation.
- AI context must stay curated and avoid raw full localStorage dumps.
- Dashboard recommendations must handle empty, partial, corrupt, or legacy state gracefully.
- Cross-page navigation must not break when opened from local file paths.

---

# Recommended Next Milestones

## Milestone A — Unified UX Pass

- Shared header/navigation across all HTML pages.
- Shared theme tokens and card/button styles.
- Clear “Back to Tama OS” path from Finance and Research.
- Consistent backup/data-safety language.

## Milestone B — Automatic Snapshot and Decision Queue

- Build snapshot automatically on OS load.
- Show data freshness and confidence.
- Rank the next best actions.
- Link each action to Finance or Research.

## Milestone C — Finance Quick Capture

- Add fast-entry for salary, expense, transfer, price update, and position action.
- Use defaults from prior records.
- Preview generated records before save.
- Prevent duplicate linked transactions.

## Milestone D — Research Coverage Board

- Show active Finance positions with thesis coverage state.
- Add one-click create/review thesis route.
- Flag stale thesis and missing exit plan.

## Milestone E — Confirmed Action Journal

- Let the user accept/dismiss/snooze recommendations.
- Save decision context and source data.
- Keep all writes user-confirmed and recoverable.
