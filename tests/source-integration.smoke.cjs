const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function read(file) {
  return fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
}

function assertContains(source, needle, message) {
  assert.ok(source.includes(needle), message || `Expected source to include: ${needle}`);
}

(function tamaOsKeepsAppsIsolatedAndLoadsDecisionModulesInOrder() {
  const os = read('tama-os.html');
  assertContains(os, 'href="tama-finance.html"', 'Tama OS should link to Finance instead of merging its runtime.');
  assertContains(os, 'href="tama-research.html"', 'Tama OS should link to Research instead of merging its runtime.');
  assert.equal(os.includes('<iframe'), false, 'Tama OS should not iframe the standalone apps during this migration phase.');

  const storageIndex = os.indexOf('src="js/storage.js"');
  const stateIndex = os.indexOf('src="js/state.js"');
  const engineIndex = os.indexOf('src="js/decision-engine.js"');
  const aiIndex = os.indexOf('src="js/ai.js"');
  const demoIndex = os.indexOf('src="js/demo-data.js"');
  assert.ok(storageIndex > -1 && stateIndex > storageIndex && engineIndex > stateIndex && aiIndex > engineIndex && demoIndex > aiIndex, 'Shared modules must load in storage → state → decision-engine → ai → demo-data order.');
  assertContains(os, 'id="copilot-run"', 'Tama OS should expose the Milestone 5 copilot action.');
  assertContains(os, 'id="copilot-api-key"', 'Tama OS should keep the API key explicit and session-only.');
  assertContains(os, 'id="refresh-snapshot"', 'Tama OS should support refreshing the read-only local snapshot without a page reload.');
  assertContains(os, 'id="load-demo-brief"', 'Tama OS should expose a demo-data path for no-setup judging.');
  assertContains(os, 'Update Money Data', 'Tama OS should use action-centric Money Workspace labels.');
  assertContains(os, 'Fix Thesis Coverage', 'Tama OS should use action-centric Research Workspace labels.');
  assertContains(os, 'Explain Recommendation', 'Tama OS should frame Copilot as explanation, not app switching.');
})();

(function standaloneAppsExposeDecisionLoopWithoutChangingWritePaths() {
  const finance = read('tama-finance.html');
  const research = read('tama-research.html');

  assertContains(finance, 'href="tama-os.html"', 'Finance should provide a return path to the decision hub.');
  assertContains(finance, 'href="tama-research.html"', 'Finance should provide a path to thesis coverage.');
  assertContains(finance, 'Update money and positions here', 'Finance should explain its role in the decision loop.');

  assertContains(research, 'href="tama-os.html"', 'Research should provide a return path to the decision hub.');
  assertContains(research, 'href="tama-finance.html"', 'Research should provide a path to actual holdings and cash context.');
  assertContains(research, 'Keep thesis quality here', 'Research should explain its role in the decision loop.');
})();

console.log('source integration smoke checks passed');
