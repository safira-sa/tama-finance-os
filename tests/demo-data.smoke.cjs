const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadBrowserModules() {
  const context = { window: {}, console };
  context.window.window = context.window;
  vm.createContext(context);
  ['js/storage.js', 'js/state.js', 'js/decision-engine.js', 'js/demo-data.js'].forEach((file) => {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
  });
  return context.window;
}

function memoryStorage(initial = {}) {
  const records = { ...initial };
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(records, key) ? records[key] : null;
    },
    setItem(key, value) {
      records[key] = String(value);
    },
    removeItem(key) {
      delete records[key];
    },
    dump() {
      return { ...records };
    },
  };
}

function materializeScenarioValue(value, freshIso, staleIso) {
  if (value === '$FRESH_ISO') return freshIso;
  if (value === '$STALE_ISO') return staleIso;
  if (Array.isArray(value)) return value.map((item) => materializeScenarioValue(item, freshIso, staleIso));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, materializeScenarioValue(item, freshIso, staleIso)]));
  }
  return value;
}

function decideScenario(tama, scenario, freshIso, staleIso) {
  const records = {};
  const financeState = materializeScenarioValue(scenario.finance_state, freshIso, staleIso);
  const researchState = materializeScenarioValue(scenario.research_state, freshIso, staleIso);
  if (financeState) records[tama.TamaState.FINANCE_KEY] = JSON.stringify(financeState);
  if (researchState) records[tama.TamaState.RESEARCH_KEY] = JSON.stringify(researchState);
  const snapshot = tama.TamaState.buildSnapshot(memoryStorage(records));
  return tama.TamaDecisionEngine.analyze(snapshot);
}

(function demoDataInstallsBackupAndProducesThesisGapBrief() {
  const tama = loadBrowserModules();
  const storage = memoryStorage({ [tama.TamaState.FINANCE_KEY]: '{"old":true}' });
  const result = tama.TamaDemoData.install(storage);
  const records = storage.dump();

  assert.equal(result.backup_key, tama.TamaDemoData.BACKUP_KEY);
  assert.equal(JSON.parse(records[tama.TamaDemoData.BACKUP_KEY]).previous[tama.TamaState.FINANCE_KEY], '{"old":true}');
  assert.ok(records[tama.TamaState.FINANCE_KEY]);
  assert.ok(records[tama.TamaState.RESEARCH_KEY]);

  const snapshot = tama.TamaState.buildSnapshot(storage);
  const decision = tama.TamaDecisionEngine.analyze(snapshot);

  assert.equal(snapshot.finance.available, true);
  assert.equal(snapshot.research.available, true);
  assert.equal(snapshot.finance.summary.active_position_tickers.includes('TLKM'), true);
  assert.equal(snapshot.research.summary.decision_ready_thesis_tickers.includes('BBCA'), true);
  assert.equal(decision.all_key_risks.some((risk) => risk.title === 'Holdings without thesis coverage' && risk.detail.includes('TLKM')), true);
})();

(function demoDataRestoresPreviousLocalValues() {
  const tama = loadBrowserModules();
  const originalFinance = JSON.stringify({ existing: 'finance' });
  const storage = memoryStorage({ [tama.TamaState.FINANCE_KEY]: originalFinance });

  tama.TamaDemoData.install(storage);
  let records = storage.dump();
  assert.notEqual(records[tama.TamaState.FINANCE_KEY], originalFinance);
  assert.ok(records[tama.TamaState.RESEARCH_KEY]);

  const result = tama.TamaDemoData.restore(storage);
  records = storage.dump();
  assert.equal(result.backup_key, tama.TamaDemoData.BACKUP_KEY);
  assert.equal(records[tama.TamaState.FINANCE_KEY], originalFinance);
  assert.equal(Object.prototype.hasOwnProperty.call(records, tama.TamaState.RESEARCH_KEY), false);
})();

(function demoJsonFilesMatchScriptPayloads() {
  const tama = loadBrowserModules();
  const finance = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'demo-data/finance-demo.json'), 'utf8'));
  const research = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'demo-data/research-demo.json'), 'utf8'));

  assert.equal(JSON.stringify(finance), JSON.stringify(tama.TamaDemoData.finance));
  assert.equal(JSON.stringify(research), JSON.stringify(tama.TamaDemoData.research));
})();


(function scenarioCatalogCoversMajorDecisionStates() {
  const tama = loadBrowserModules();
  const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'demo-data/os-scenarios.json'), 'utf8'));
  const freshIso = new Date().toISOString();
  const staleIso = new Date(Date.now() - 45 * 86400000).toISOString();

  assert.equal(catalog.schema, 'tama-os-demo-scenarios-v1');
  assert.ok(catalog.scenarios.length >= 7, 'Scenario catalog should cover the major OS decision states.');

  const requiredIds = new Set([
    'ready_for_review',
    'tlkm_thesis_gap',
    'stale_finance_data',
    'missing_research_data',
    'emergency_fund_below_target',
    'monthly_spending_exceeds_income',
    'empty_browser',
  ]);
  catalog.scenarios.forEach((scenario) => requiredIds.delete(scenario.id));
  assert.deepEqual([...requiredIds], [], 'Scenario catalog is missing required demo states.');

  catalog.scenarios.forEach((scenario) => {
    const decision = decideScenario(tama, scenario, freshIso, staleIso);
    assert.equal(decision.decision_readiness.label, scenario.expected.readiness, `${scenario.id} readiness should match.`);
    assert.equal(decision.top_priority.title, scenario.expected.top_priority, `${scenario.id} top priority should match.`);
    if (scenario.expected.risk_detail_includes) {
      assert.ok(
        decision.all_key_risks.some((risk) => String(risk.detail).includes(scenario.expected.risk_detail_includes)),
        `${scenario.id} should mention ${scenario.expected.risk_detail_includes}.`
      );
    }
  });
})();


console.log('demo data smoke checks passed');
