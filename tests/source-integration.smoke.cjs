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
  assertContains(os, 'assets/tama-shell.css', 'Tama OS should load the shared visual shell stylesheet.');
  assertContains(os, 'Tama OS workspace map', 'Tama OS should display the shared workspace map.');
  assertContains(os, 'Decision Hub', 'Tama OS should expose unified Decision Hub language.');
  assertContains(os, 'Money Workspace', 'Tama OS should expose unified Money Workspace language.');
  assertContains(os, 'Research Workspace', 'Tama OS should expose unified Research Workspace language.');
  assertContains(os, 'Explain Recommendation', 'Tama OS should frame Copilot as explanation, not app switching.');
})();

(function standaloneAppsExposeDecisionLoopWithoutChangingWritePaths() {
  const finance = read('tama-finance.html');
  const research = read('tama-research.html');

  assertContains(finance, 'href="tama-os.html"', 'Finance should provide a return path to the decision hub.');
  assertContains(finance, 'href="tama-research.html"', 'Finance should provide a path to thesis coverage.');
  assertContains(finance, 'assets/tama-shell.css', 'Finance should load the shared visual shell stylesheet.');
  assertContains(finance, 'Money Workspace map', 'Finance should display the shared workspace map.');
  assertContains(finance, 'Money Workspace', 'Finance should use unified Money Workspace language.');
  assertContains(finance, 'Research Workspace', 'Finance should link to the unified Research Workspace label.');
  assertContains(finance, 'secondary-actions', 'Finance should move import/export/config noise into secondary actions.');
  assertContains(finance, 'Update money and positions here', 'Finance should explain its role in the decision loop.');

  assertContains(research, 'href="tama-os.html"', 'Research should provide a return path to the decision hub.');
  assertContains(research, 'href="tama-finance.html"', 'Research should provide a path to actual holdings and cash context.');
  assertContains(research, 'assets/tama-shell.css', 'Research should load the shared visual shell stylesheet.');
  assertContains(research, 'Research Workspace map', 'Research should display the shared workspace map.');
  assertContains(research, 'Research Workspace', 'Research should use unified Research Workspace language.');
  assertContains(research, 'Money Workspace', 'Research should link to the unified Money Workspace label.');
  assertContains(research, 'secondary-actions', 'Research should move import/export noise into secondary actions.');
  assertContains(research, 'Keep thesis quality here', 'Research should explain its role in the decision loop.');
})();

console.log('source integration smoke checks passed');
