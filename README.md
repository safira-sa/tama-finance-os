# Tama OS

Tama OS is a local-first personal-finance decision workspace. It keeps two focused workspaces separate—Money Workspace and Research Workspace—then provides a read-only Tama OS brief that highlights data readiness, missing thesis coverage, and stale local records.

The current milestone is a deterministic, read-only decision hub. Its rules and explicit non-goals are documented in [`docs/decision-engine.md`](docs/decision-engine.md).

## OpenAI Build Week track

**Apps for Your Life** — a consumer app for personal finance and investment-research workflows.

## Run locally

No build step or server is required.

1. Download or clone this repository.
2. Open `tama-os.html` in a modern desktop browser.
3. Click **Load demo data** for a fictional no-setup walkthrough, or use **Update Money Data** and **Fix Thesis Coverage** to create local browser data manually.
4. Click **Refresh Local Snapshot** to update the read-only Today’s Brief without reloading the page.
5. Ask the Copilot “What should I do next?” with no API key to use local deterministic mode.
6. Optional: paste an OpenAI API key into the Copilot field to ask GPT-5.6 to explain the same deterministic recommendation. The key is used for that browser session only and is not stored.

All user data is stored in the browser’s `localStorage`. Use each app’s export function before clearing browser data or moving to another browser. The demo loader saves the previous Money/Research workspace values under `tama-os-demo-backup-v1` before writing fictional demo data.

## Judge demo path

1. Open **Tama OS** and click **Load demo data**.
2. Confirm Today’s Brief flags the intentional `TLKM` thesis gap.
3. Ask the Copilot “What should I do next?” with no API key and show the local deterministic explanation.
4. Optionally paste an OpenAI API key to show GPT-5.6 explaining the same structured findings.
5. Click **Money Workspace** and **Research Workspace** to show the standalone apps remain preserved.
6. Optionally export Finance JSON and import it in Research to inspect the explicit, user-controlled bridge.


## What changed during Build Week

- Added `tama-os.html` as the unified local-first decision hub.
- Added read-only snapshot helpers in `js/storage.js` and `js/state.js`.
- Added deterministic Today’s Brief rules in `js/decision-engine.js`.
- Added the GPT-5.6 Copilot explanation layer in `js/ai.js`, with no-key local fallback.
- Added fictional demo data in `demo-data/` and a guarded **Load demo data** button for repeatable judging.
- Preserved `tama-finance.html` and `tama-research.html` as standalone Money and Research workspaces with explicit navigation back to Tama OS.

## Design and safety boundaries

- Tama OS reads local snapshots only; it makes no storage writes.
- Money and Research workspaces remain independent full-page applications.
- Cross-workspace data exchange is explicit import/export, never automatic sync.
- The deterministic brief surfaces data readiness rather than claiming to provide financial advice. It is educational decision support only, with a visible rule trace explaining why the top recommendation was selected.

## Repository map

- `tama-os.html` — unified decision hub.
- `tama-finance.html` — standalone Money Workspace.
- `tama-research.html` — standalone Research Workspace.
- `js/` — shared read-only snapshot, decision, AI, and demo helpers.
- `demo-data/` — fictional judging/demo payloads.
- `tests/` — Node smoke and acceptance checks.
- `docs/` — architecture, migration, implementation, debt, and submission notes.

## Submission notes

- **What was built during Build Week:** the Tama OS decision hub, read-only snapshot adapter, deterministic Today’s Brief, GPT-5.6 Copilot explanation layer, guarded demo loader, shared visual shell, demo scenario catalog, and smoke/acceptance tests.
- **What existed before:** the standalone Finance and Research browser apps. They remain independently usable and are intentionally not merged into one write path yet.
- **How GPT-5.6 is used:** GPT-5.6 explains structured deterministic findings through the Responses API when a session-only key is supplied; without a key, Tama OS shows the same recommendation through a deterministic offline explanation.
- **How Codex was used:** Codex inspected the existing apps, implemented the new read-only OS layer and tests, and helped harden safety boundaries. Include the required `/feedback` Codex Session ID in Devpost.
- **Demo data:** all demo payloads are fictional and non-personal; loading demo data saves a local backup under `tama-os-demo-backup-v1` before writing sample Finance/Research records, and Tama OS can restore that previous data from the same browser.

## Built with Codex and GPT-5.6

Codex was used during the hackathon to inspect the existing Money and Research workspaces, implement the Tama OS read-only snapshot and deterministic decision rules, add the GPT-5.6 copilot explanation layer, improve storage failure handling, and validate the decision engine with smoke tests. Product, UX, and safety-boundary decisions remained human-directed.

For submission, include the required `/feedback` Codex Session ID from the thread where the majority of the core work was completed, plus a short walkthrough of the Codex-assisted changes in the demo video.

## Verification

The decision-engine smoke test verifies that:

- persisted timestamps remain persisted rather than becoming “now” on refresh;
- closed positions do not create a false thesis-coverage warning;
- stale Finance data is surfaced; and
- blocked local storage is handled safely.

Run the test with:

```bash
node tests/decision-engine.smoke.cjs
node tests/persona-acceptance.cjs
node tests/source-integration.smoke.cjs
node tests/ai.smoke.cjs
node tests/demo-data.smoke.cjs
```

Use [`tests/MANUAL_BROWSER_CHECKLIST.md`](tests/MANUAL_BROWSER_CHECKLIST.md) for the final browser-level verification before recording the demo.

## Judge demo personas

Fictional, non-personal demo personas are available in [`demo-data/`](demo-data/README.md). They support a repeatable healthy-path, missing-research, chaotic-records, and fresh-install walkthrough without requiring a reviewer to enter their own financial information.

## Third-party software

Finance and Research load [Chart.js](https://www.chartjs.org/) from cdnjs. Verify its license and preserve all applicable notices before publishing the repository.
