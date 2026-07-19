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

The button stores a local backup under `tama-os-demo-backup-v1` before writing demo data to `tama-v8` and `tama-research-v1`.

## Manual import fallback

If the button is not available in a browser context, import these files manually:

- `finance-demo.json` in Tama Finance.
- `research-demo.json` in Tama Research.

Always export existing personal data before loading demo data.
