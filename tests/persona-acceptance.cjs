const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadTamaModules() {
  const context = { window: {}, console };
  context.window.window = context.window;
  vm.createContext(context);
  ['js/storage.js', 'js/state.js', 'js/decision-engine.js'].forEach((file) => {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
  });
  return context.window;
}

function memoryStorage(records = {}) {
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(records, key) ? records[key] : null;
    },
  };
}

function decide(financeState, researchState) {
  const tama = loadTamaModules();
  const records = {
    [tama.TamaState.FINANCE_KEY]: JSON.stringify(financeState),
    [tama.TamaState.RESEARCH_KEY]: JSON.stringify(researchState),
  };
  const snapshot = tama.TamaState.buildSnapshot(memoryStorage(records));
  return tama.TamaDecisionEngine.analyze(snapshot);
}

const freshIso = new Date().toISOString();

(function healthyPathPersonaIsReadyForReview() {
  const decision = decide(
    {
      meta: { last_saved_at: freshIso },
      accounts: [
        { id: 1, type: 'cash', buckets: ['Emergency Fund'], initial_balance: 10000000 },
        { id: 2, type: 'cash', buckets: ['Investment'], initial_balance: 5000000 },
      ],
      transactions: [],
      expenses: [],
      positions: [{ ticker: 'BBCA', status: 'open', lots: 1, avgbuy: 1000 }],
      months: { '2026-07': { salary: 6000000, overtimes: [], windfalls: [], sidejobs: [] } },
      config: { parent_tax: 1000000, internet: 200000, transport_buf: 100000 },
      inv: { cash_min: 1000000 },
    },
    {
      meta: { last_saved_at: freshIso },
      entries: [{ ticker: 'BBCA', thesis: 'Decision-ready bank thesis', thesis_status: 'intact' }],
      universe: [],
      journal_import: [],
    }
  );
  assert.equal(decision.decision_readiness.label, 'Ready for review');
  assert.equal(decision.key_risks.length, 0);
})();

(function missingResearchPersonaIsBlockedByThesisCoverage() {
  const decision = decide(
    {
      meta: { last_saved_at: freshIso },
      accounts: [{ id: 1, type: 'cash', buckets: ['Emergency Fund'], initial_balance: 10000000 }],
      transactions: [],
      expenses: [],
      positions: [{ ticker: 'TLKM', status: 'open', lots: 1, avgbuy: 3000 }],
      months: { '2026-07': { salary: 6000000, overtimes: [], windfalls: [], sidejobs: [] } },
      config: { parent_tax: 1000000, internet: 200000, transport_buf: 100000 },
    },
    { meta: { last_saved_at: freshIso }, entries: [{ ticker: 'BBCA', thesis: 'Different holding', thesis_status: 'intact' }], universe: [], journal_import: [] }
  );
  assert.equal(decision.all_key_risks.some((risk) => risk.title === 'Holdings without thesis coverage'), true);
})();

console.log('persona acceptance checks passed');
