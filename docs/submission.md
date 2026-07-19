# Submission narrative

## One-sentence pitch

Tama OS is a local-first deterministic decision-readiness layer that tells a personal investor what evidence or financial safeguard is missing before they take more risk.

## What is novel

Finance trackers explain what happened. Research tools explain an idea. Tama OS connects the two without silently merging or mutating either source: it checks whether the user has the financial readiness and decision-ready thesis required to act.

## Three-minute demo structure

1. **Problem (0:00–0:20):** “Finance apps tell me what happened; Tama OS tells me what to fix before I take more risk.”
2. **Load demo (0:20–0:45):** Open Tama OS, click **Load demo data**, and refresh Today’s Brief.
3. **Decision gap (0:45–1:30):** Show the intentional `TLKM` thesis gap: TLKM exists as an open Money Workspace holding, but Research Workspace only has a decision-ready BBCA thesis.
4. **Resolve path (1:30–2:00):** Click **Resolve Top Priority** or **Fix Thesis Coverage** to show where the user should act next.
5. **Copilot explanation (2:00–2:35):** Ask “What should I do next?” with no API key to show deterministic offline mode; optionally add a session-only key to show GPT-5.6 explaining the same structured findings.
6. **Why it is trustworthy (2:35–3:00):** Show local-first boundaries: no backend, no storage writes from Tama OS, explicit Finance/Research workspaces, fictional demo data, and smoke tests.

## Claims to make

- Local-first and read-only at the OS layer.
- Deterministic recommendations are grounded in visible Money Workspace and Research Workspace inputs.
- A holding is covered only by an active, intact, non-empty thesis.
- GPT-5.6 is an explanation layer on top of deterministic findings, not the source of financial calculations.
- The no-key fallback is intentional so the demo remains working without a personal API key.
- The project was built and hardened with Codex and GPT-5.6; provide the required Codex Session ID and dated development evidence in the Devpost form.

## Claims to avoid

- Personalized financial advice, market prediction, live prices, or real-time market analysis.
- Automatic trading, automatic sync, or automatic mutation of Finance/Research records.
- Saying the OS merged Finance and Research write paths; this milestone is intentionally read-only at the OS layer.
- Saying a watchlist item is a complete thesis.

## What was built during Build Week

- `tama-os.html` decision hub with Today’s Brief, demo loading, snapshot refresh, Resolve Top Priority, and Copilot UI.
- `js/storage.js`, `js/state.js`, and `js/decision-engine.js` for local read-only snapshots and deterministic findings.
- `js/ai.js` for curated GPT-5.6 Responses API calls plus offline deterministic explanation fallback.
- `js/demo-data.js` and `demo-data/` for guarded fictional demo payloads and scenario fixtures.
- `assets/tama-shell.css` and workspace navigation updates for Decision Hub / Money Workspace / Research Workspace consistency.
- Smoke and acceptance tests in `tests/` for source integration, demo data, AI prompt behavior, decision rules, and persona outcomes.

## API-key demo fallback

If no OpenAI API key is available, leave the Copilot key field blank. Tama OS will still answer using deterministic local mode and can show the exact curated prompt that would be sent to GPT-5.6.
