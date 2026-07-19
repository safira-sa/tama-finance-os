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

function snapshotFrom(financeState, researchState) {
  const tama = loadTamaModules();
  const records = {};
  if (financeState !== undefined) records[tama.TamaState.FINANCE_KEY] = JSON.stringify(financeState);
  if (researchState !== undefined) records[tama.TamaState.RESEARCH_KEY] = JSON.stringify(researchState);
  const snapshot = tama.TamaState.buildSnapshot(memoryStorage(records));
  return { tama, snapshot, decision: tama.TamaDecisionEngine.analyze(snapshot) };
}

(function persistedTimestampsSurviveRefresh() {
  const savedAt = '2026-06-15T10:00:00.000Z';
  const { snapshot } = snapshotFrom(
    { meta: { last_saved_at: savedAt }, accounts: [{ id: 1, initial_balance: 1000 }], transactions: [], expenses: [], positions: [], months: {} },
    { meta: { last_saved_at: '2026-06-16T10:00:00.000Z' }, entries: [], universe: [{ ticker: 'BBCA' }], journal_import: [] }
  );
  assert.equal(snapshot.finance.summary.last_updated, savedAt);
  assert.notEqual(snapshot.finance.summary.last_updated, snapshot.generated_at);
})();

(function closedPositionsDoNotRequireResearchThesis() {
  const { decision } = snapshotFrom(
    { meta: { last_saved_at: new Date().toISOString() }, positions: [{ ticker: 'BBCA', status: 'closed', lots: 1, avgbuy: 1000 }], accounts: [{ id: 1, initial_balance: 1000 }], transactions: [], expenses: [], months: {} },
    { meta: { last_saved_at: new Date().toISOString() }, entries: [], universe: [{ ticker: 'BBCA' }], journal_import: [] }
  );
  assert.equal(decision.all_key_risks.some((risk) => risk.title === 'Holdings without thesis coverage'), false);
})();

(function staleFinanceDataIsSurfaced() {
  const { decision } = snapshotFrom(
    { meta: { last_saved_at: '2026-01-01T00:00:00.000Z' }, accounts: [{ id: 1, initial_balance: 1000 }], transactions: [], expenses: [], positions: [], months: {} },
    { meta: { last_saved_at: new Date().toISOString() }, entries: [{ ticker: 'BBCA', thesis: 'Quality compounder', thesis_status: 'intact' }], universe: [], journal_import: [] }
  );
  assert.equal(decision.all_key_risks.some((risk) => risk.title === 'Finance data is stale' && risk.severity === 'high'), true);
})();

(function blockedLocalStorageIsHandledSafely() {
  const tama = loadTamaModules();
  const blockedStorage = { getItem() { throw new Error('denied'); } };
  const snapshot = tama.TamaState.buildSnapshot(blockedStorage);
  const decision = tama.TamaDecisionEngine.analyze(snapshot);
  assert.equal(snapshot.finance.available, false);
  assert.match(snapshot.finance.error, /Unable to read/);
  assert.equal(decision.all_key_risks.some((risk) => risk.title === 'Finance data missing'), true);
})();

console.log('decision-engine smoke checks passed');
