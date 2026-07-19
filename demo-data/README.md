# Demo Data

These fictional Build Week demo files create a repeatable Tama OS walkthrough without using personal financial data.

## Persona

The demo persona is a self-directed investor with:

- current-month income and expenses;
- an emergency fund and investment cash account;
- two open holdings (`BBCA` and `TLKM`);
- one decision-ready BBCA thesis; and
- one intentional TLKM thesis gap so Today’s Brief recommends fixing research coverage before adding more risk.

## Safest usage

1. Open `tama-os.html`.
2. Click **Load demo data**.
3. Confirm the overwrite warning if existing local data is detected.
4. Review Today’s Brief and ask the Copilot: “What should I do next?”

The button stores a local backup under `tama-os-demo-backup-v1` before writing demo data to `tama-v8` and `tama-research-v1`. Use **Restore previous data** in Tama OS to restore the last saved pre-demo values in the same browser.

## Manual import fallback

If the button is not available in a browser context, import these files manually:

- `finance-demo.json` in Money Workspace.
- `research-demo.json` in Research Workspace.

Always export existing personal data before loading demo data.

## Scenario catalog

`os-scenarios.json` is a reviewer/developer fixture catalog for checking the major decision states Tama OS can show:

- ready for review;
- the intentional `TLKM` thesis gap;
- stale Finance data;
- missing Research data;
- emergency fund below target;
- monthly spending above income; and
- a completely empty browser.

These scenarios are not installed by the **Load demo data** button. Tama OS links to them from a collapsed **Demo scenarios** section so reviewers can inspect edge cases without distracting from the main Today’s Brief flow.
