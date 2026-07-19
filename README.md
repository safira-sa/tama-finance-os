# Tama OS

Tama OS is a local-first personal-finance decision workspace. It keeps two focused tools separate—Tama Finance and Tama Research Desk—then provides a read-only Tama OS brief that highlights data readiness, missing thesis coverage, and stale local records.

The current milestone is a deterministic, read-only decision engine. Its rules and explicit non-goals are documented in [`docs/m4-deterministic-engine.md`](docs/m4-deterministic-engine.md).

## OpenAI Build Week track

**Apps for Your Life** — a consumer app for personal finance and investment-research workflows.

## Run locally

No build step or server is required.

1. Download or clone this repository.
2. Open `tama-os.html` in a modern desktop browser.
3. Click **Load demo data** for a fictional no-setup walkthrough, or use **Open Finance** and **Open Research** to create local browser data manually.
4. Click **Refresh Local Snapshot** to update the read-only Today’s Brief without reloading the page.
5. Ask the Copilot “What should I do next?” with no API key to use local deterministic mode.
6. Optional: paste an OpenAI API key into the Copilot field to ask GPT-5.6 to explain the same deterministic recommendation. The key is used for that browser session only and is not stored.

All user data is stored in the browser’s `localStorage`. Use each app’s export function before clearing browser data or moving to another browser. The demo loader saves the previous Finance/Research localStorage values under `tama-os-demo-backup-v1` before writing fictional demo data.

## Judge demo path

1. Open **Tama OS** and click **Load demo data**.
2. Confirm Today’s Brief flags the intentional `TLKM` thesis gap.
3. Ask the Copilot “What should I do next?” with no API key and show the local deterministic explanation.
4. Optionally paste an OpenAI API key to show GPT-5.6 explaining the same structured findings.
5. Click **Open Finance** and **Open Research** to show the standalone apps remain preserved.
6. Optionally export Finance JSON and import it in Research to inspect the explicit, user-controlled bridge.


## What changed during Build Week

- Added `tama-os.html` as the unified local-first decision hub.
- Added read-only snapshot helpers in `js/storage.js` and `js/state.js`.
- Added deterministic Today’s Brief rules in `js/decision-engine.js`.
- Added the GPT-5.6 Copilot explanation layer in `js/ai.js`, with no-key local fallback.
- Added fictional demo data in `demo-data/` and a guarded **Load demo data** button for repeatable judging.
- Preserved `tama-finance.html` and `tama-research.html` as standalone applications with explicit navigation back to Tama OS.

## Design and safety boundaries

- Tama OS reads local snapshots only; it makes no storage writes.
- Finance and Research remain independent full-page applications.
- Cross-app data exchange is explicit import/export, never automatic sync.
- The deterministic brief surfaces data readiness rather than claiming to provide financial advice.

## Built with Codex and GPT-5.6

Codex was used during the hackathon to inspect the existing Finance and Research applications, implement the Tama OS read-only snapshot and deterministic decision rules, add the GPT-5.6 copilot explanation layer, improve storage failure handling, and validate the decision engine with smoke tests. Product, UX, and safety-boundary decisions remained human-directed.

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
