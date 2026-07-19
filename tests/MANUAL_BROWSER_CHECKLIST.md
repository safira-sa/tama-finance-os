# Manual Browser Checklist

Use this before recording or submitting the demo. These checks cover browser-only behavior that the Node smoke tests cannot fully verify.

## Decision Hub

- Open `tama-os.html` directly in a modern desktop browser.
- Confirm the shared workspace map appears and links to:
  - Decision Hub (`tama-os.html`)
  - Money Workspace (`tama-finance.html`)
  - Research Workspace (`tama-research.html`)
- Click **Refresh Local Snapshot** and confirm Today’s Brief updates without reloading the page.
- Confirm the visible safety boundary says educational decision support only.

## Demo data

- Click **Load demo data**.
- If prompted, confirm only after exporting any real data you need to keep.
- Confirm Today’s Brief flags the intentional `TLKM` thesis gap.
- Expand **Why this recommendation?** and confirm it explains the top blocker, evidence, and rule action.
- Expand **Demo scenarios** and confirm **View scenario catalog** opens in a new tab.
- Click **Restore previous data** and confirm the previous local values are restored, or that a helpful message appears when no backup exists.

## Copilot

- Leave the API key blank and click **Explain recommendation**.
- Confirm the offline deterministic explanation appears.
- Click **Show context prompt** and confirm the prompt contains structured local context rather than raw localStorage dumps.
- Optional: paste a session-only OpenAI API key and confirm GPT-5.6 explains the same deterministic recommendation.

## Workspaces

- Open **Money Workspace** and confirm the page loads, the shared workspace map appears, and existing Money features still render.
- Open **Research Workspace** and confirm the page loads, the shared workspace map appears, and existing Research features still render.
- Return to the Decision Hub from each workspace.
