(function (global) {
  'use strict';

  const SNAPSHOT_VERSION = 'tama-os-snapshot-v1';
  const FINANCE_KEY = 'tama-v8';
  const RESEARCH_KEY = 'tama-research-v1';

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function asObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  }

  function latestDate(values) {
    const timestamps = values
      .filter(Boolean)
      .map((value) => Date.parse(value))
      .filter((value) => Number.isFinite(value));

    if (!timestamps.length) return null;
    return new Date(Math.max(...timestamps)).toISOString();
  }

  function summarizeFinance(state) {
    const safeState = asObject(state);
    const meta = asObject(safeState.meta);
    const bridge = asObject(safeState.bridge);
    const bridgeResearch = asObject(bridge.research);

    return {
      storage_key: FINANCE_KEY,
      schema_version: meta.schema_version || null,
      last_updated: latestDate([
        meta.last_saved_at,
        meta.last_backup_at,
        bridgeResearch.imported_at,
        bridgeResearch.generated_at,
        bridgeResearch.exported_at,
      ]),
      counts: {
        accounts: asArray(safeState.accounts).length,
        transactions: asArray(safeState.transactions).length,
        expenses: asArray(safeState.expenses).length,
        positions: asArray(safeState.positions).length,
        journal: asArray(safeState.journal).length,
        months: Object.keys(asObject(safeState.months)).length,
      },
    };
  }

  function summarizeResearch(state) {
    const safeState = asObject(state);
    const bridge = asObject(safeState.bridge);
    const bridgeFinance = asObject(bridge.finance);
    const bridgeContract = asObject(bridge.contract);

    return {
      storage_key: RESEARCH_KEY,
      schema_version: bridgeContract.schema || null,
      last_updated: latestDate([
        bridgeFinance.imported_at,
        bridgeFinance.generated_at,
        bridgeFinance.exported_at,
        bridgeContract.generated_at,
      ]),
      counts: {
        entries: asArray(safeState.entries).length,
        universe: asArray(safeState.universe).length,
        journal_import: asArray(safeState.journal_import).length,
      },
    };
  }

  function buildSnapshot(storage) {
    const storageAdapter = global.TamaStorage;
    const generatedAt = new Date().toISOString();
    const financeRead = storageAdapter.readJSON(storage, FINANCE_KEY);
    const researchRead = storageAdapter.readJSON(storage, RESEARCH_KEY);

    const finance = {
      available: financeRead.available && !financeRead.error && !!financeRead.value,
      error: financeRead.error,
      summary: financeRead.value ? summarizeFinance(financeRead.value) : null,
    };

    const research = {
      available: researchRead.available && !researchRead.error && !!researchRead.value,
      error: researchRead.error,
      summary: researchRead.value ? summarizeResearch(researchRead.value) : null,
    };

    return {
      version: SNAPSHOT_VERSION,
      generated_at: generatedAt,
      last_updated: latestDate([
        finance.summary && finance.summary.last_updated,
        research.summary && research.summary.last_updated,
        generatedAt,
      ]),
      finance,
      research,
    };
  }

  global.TamaState = Object.freeze({
    SNAPSHOT_VERSION,
    FINANCE_KEY,
    RESEARCH_KEY,
    buildSnapshot,
  });
})(window);
