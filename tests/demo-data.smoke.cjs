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
    dump() {
      return { ...records };
    },
  };
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

(function demoJsonFilesMatchScriptPayloads() {
  const tama = loadBrowserModules();
  const finance = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'demo-data/finance-demo.json'), 'utf8'));
  const research = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'demo-data/research-demo.json'), 'utf8'));

  assert.equal(JSON.stringify(finance), JSON.stringify(tama.TamaDemoData.finance));
  assert.equal(JSON.stringify(research), JSON.stringify(tama.TamaDemoData.research));
})();

console.log('demo data smoke checks passed');
