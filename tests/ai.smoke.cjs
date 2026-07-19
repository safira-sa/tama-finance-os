const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadAI() {
  const context = { window: {}, console };
  context.window.window = context.window;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js/ai.js'), 'utf8'), context, { filename: 'js/ai.js' });
  return context.window.TamaAI;
}

const snapshot = {
  version: 'tama-os-snapshot-v1',
  generated_at: '2026-07-19T00:00:00.000Z',
  finance: { available: true, error: null, summary: { storage_key: 'tama-v8', counts: { accounts: 1 }, active_position_tickers: ['BBCA'], financial_signals: { monthly: { income: 1, expenses: 0 } } } },
  research: { available: true, error: null, summary: { storage_key: 'tama-research-v1', counts: { entries: 1 }, decision_ready_thesis_tickers: ['BBCA'] } },
};
const decision = {
  version: 'tama-decision-engine-v1',
  decision_readiness: { label: 'Ready for review', score: 86 },
  top_priority: { title: 'Review Today’s Brief before making changes', why: 'Data is available.' },
  key_risks: [],
  recommended_next_action: 'Use Finance and Research normally, then refresh Tama OS before the next decision.',
};

(async function aiHelperBuildsPromptAndOfflineFallback() {
  const ai = loadAI();
  const prompt = ai.buildPrompt(snapshot, decision, 'What should I do next?');
  assert.match(prompt, /Tama OS copilot/);
  assert.match(prompt, /Ready for review/);
  assert.equal(prompt.includes('raw full localStorage'), false);

  const result = await ai.explain({ snapshot, decision, question: 'What should I do next?' });
  assert.equal(result.mode, 'offline');
  assert.match(result.text, /Deterministic mode answer/);
})();

(async function aiHelperCallsResponsesApiWithCuratedContext() {
  const ai = loadAI();
  let capturedRequest;
  const result = await ai.explain({
    apiKey: 'test-key',
    snapshot,
    decision,
    question: 'Explain my biggest risk.',
    fetchImpl: async (url, request) => {
      capturedRequest = { url, request };
      return {
        ok: true,
        json: async () => ({ output_text: 'Mock GPT-5.6 explanation.' }),
      };
    },
  });

  assert.equal(result.mode, 'api');
  assert.equal(result.text, 'Mock GPT-5.6 explanation.');
  assert.equal(capturedRequest.url, 'https://api.openai.com/v1/responses');
  assert.equal(capturedRequest.request.method, 'POST');
  assert.equal(capturedRequest.request.headers.Authorization, 'Bearer test-key');
  const body = JSON.parse(capturedRequest.request.body);
  assert.equal(body.model, ai.DEFAULT_MODEL);
  assert.equal(body.input[0].role, 'developer');
  assert.equal(body.input[1].role, 'user');
})();

console.log('ai smoke checks passed');
