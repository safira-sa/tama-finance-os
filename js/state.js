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

  function asNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
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
    const positions = asArray(safeState.positions);
    const accounts = asArray(safeState.accounts);
    const config = asObject(safeState.config);
    const investment = asObject(safeState.inv);
    const openPositions = positions.filter((position) => {
      const status = String(position && (position.status || position.trade_status) || 'open').toLowerCase();
      return status !== 'closed';
    });
    const transactionBaseAmount = (transaction, key) => asNumber(transaction && (transaction[key] ?? transaction[key.replace('_base', '')]));
    const linkedExpenseIds = new Set(asArray(safeState.transactions)
      .filter((transaction) => transaction && !transaction.voided)
      .map((transaction) => transaction.linked_expense_id)
      .filter((id) => id !== null && id !== undefined));
    const accountNetChanges = new Map();
    asArray(safeState.transactions).filter((transaction) => transaction && !transaction.voided).forEach((transaction) => {
      if (transaction.type === 'Transfer' && transaction.to_account_id !== null && transaction.to_account_id !== undefined) {
        const outgoing = Math.abs(transactionBaseAmount(transaction, 'amount_base')) + Math.max(0, transactionBaseAmount(transaction, 'transfer_fee_base'));
        accountNetChanges.set(transaction.account_id, (accountNetChanges.get(transaction.account_id) || 0) - outgoing);
        accountNetChanges.set(transaction.to_account_id, (accountNetChanges.get(transaction.to_account_id) || 0) + transactionBaseAmount(transaction, 'to_amount_base'));
        return;
      }
      if (transaction.account_id !== null && transaction.account_id !== undefined) {
        accountNetChanges.set(transaction.account_id, (accountNetChanges.get(transaction.account_id) || 0) + transactionBaseAmount(transaction, 'amount_base'));
      }
    });
    asArray(safeState.expenses)
      .filter((expense) => expense && !expense.voided && !linkedExpenseIds.has(expense.id) && expense.account_id !== null && expense.account_id !== undefined)
      .forEach((expense) => accountNetChanges.set(expense.account_id, (accountNetChanges.get(expense.account_id) || 0) - Math.abs(asNumber(expense.amt_base ?? expense.amt ?? expense.amount))));
    const accountBuckets = (account) => {
      const buckets = asArray(account && account.buckets).filter(Boolean);
      return buckets.length ? buckets : (account && account.bucket ? [account.bucket] : []);
    };
    const investmentTypes = new Set(['rdpu', 'rd_campuran', 'saham']);
    const accountValue = (account) => {
      const initial = asNumber(account && (account.initial_balance_base ?? account.initial_balance));
      const balance = initial + (accountNetChanges.get(account && account.id) || 0);
      return account && investmentTypes.has(account.type) && account.market_value !== null && account.market_value !== undefined
        ? asNumber(account.market_value_base ?? account.market_value)
        : balance;
    };
    const bucketValue = (account, bucket) => {
      const buckets = accountBuckets(account);
      return buckets.includes(bucket) ? accountValue(account) / buckets.length : 0;
    };
    const emergencyAccounts = accounts.filter((account) => accountBuckets(account).includes('Emergency Fund'));
    const investmentAccounts = accounts.filter((account) => accountBuckets(account).includes('Investment'));
    const monthlyKeys = Object.keys(asObject(safeState.months)).sort();
    const latestMonthKey = monthlyKeys[monthlyKeys.length - 1] || null;
    const latestMonth = latestMonthKey ? asObject(safeState.months[latestMonthKey]) : null;
    const monthlyExpenses = latestMonthKey
      ? asArray(safeState.expenses)
        .filter((expense) => expense && !expense.voided && !linkedExpenseIds.has(expense.id) && (expense.month_key === latestMonthKey || String(expense.date || '').startsWith(latestMonthKey)))
        .reduce((total, expense) => total + Math.abs(asNumber(expense.amt ?? expense.amount ?? expense.amt_base)), 0)
      : null;
    const essentialMonthlyExpense = Math.min(1500000, Math.max(1000000, asNumber(config.parent_tax || 1000000))) +
      asNumber(config.internet || 200000) + asNumber(config.transport_buf || 100000);
    const emergencyFundValue = emergencyAccounts.reduce((total, account) => total + bucketValue(account, 'Emergency Fund'), 0);
    const investmentAccountValue = investmentAccounts.reduce((total, account) => total + bucketValue(account, 'Investment'), 0);
    const deployedInvestment = openPositions.reduce((total, position) => total +
      (asNumber(position.lots) * 100 * asNumber(position.avgbuy ?? position.avg_price ?? position.entry_price)), 0);

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
        positions: positions.length,
        open_positions: openPositions.length,
        journal: asArray(safeState.journal).length,
        months: Object.keys(asObject(safeState.months)).length,
      },
      active_position_tickers: [...new Set(openPositions
        .map((position) => String(position && position.ticker || '').trim().toUpperCase())
        .filter(Boolean))],
      financial_signals: {
        emergency_fund: emergencyAccounts.length ? {
          available: emergencyFundValue,
          floor_target: essentialMonthlyExpense * 6,
          months_covered: essentialMonthlyExpense ? emergencyFundValue / essentialMonthlyExpense : null,
        } : null,
        investment_cash: investmentAccounts.length ? {
          available: Math.max(0, investmentAccountValue - deployedInvestment),
          minimum: asNumber(investment.cash_min || 0),
        } : null,
        monthly: latestMonth ? {
          month_key: latestMonthKey,
          income: asNumber(latestMonth.salary) +
            asArray(latestMonth.overtimes).filter((item) => item && item.confirmed).reduce((total, item) => total + asNumber(item.net), 0) +
            asArray(latestMonth.windfalls).filter((item) => item && item.confirmed).reduce((total, item) => total + asNumber(item.net), 0) +
            asArray(latestMonth.sidejobs).filter((item) => item && item.confirmed).reduce((total, item) => total + asNumber(item.net), 0),
          expenses: monthlyExpenses,
        } : null,
      },
    };
  }

  function summarizeResearch(state) {
    const safeState = asObject(state);
    const meta = asObject(safeState.meta);
    const bridge = asObject(safeState.bridge);
    const bridgeFinance = asObject(bridge.finance);
    const bridgeContract = asObject(bridge.contract);

    const activeEntries = asArray(safeState.entries)
      .filter((entry) => !['dismissed', 'expired'].includes(String(entry && entry.status || '').toLowerCase()));
    const decisionReadyEntries = activeEntries.filter((entry) => {
      const thesisStatus = String(entry && (entry.thesis_status || entry.lifecycle_status) || 'intact').toLowerCase();
      const thesis = String(entry && (entry.thesis || entry.notes) || '').trim();
      return thesisStatus === 'intact' && thesis.length > 0;
    });

    return {
      storage_key: RESEARCH_KEY,
      schema_version: bridgeContract.schema || null,
      last_updated: latestDate([
        meta.last_saved_at,
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
      active_thesis_tickers: [...new Set(activeEntries
        .map((entry) => String(entry && entry.ticker || '').trim().toUpperCase())
        .filter(Boolean))],
      decision_ready_thesis_tickers: [...new Set(decisionReadyEntries
        .map((entry) => String(entry && entry.ticker || '').trim().toUpperCase())
        .filter(Boolean))],
    };
  }

  function buildSnapshot(storage) {
    const storageAdapter = global.TamaStorage;
    const generatedAt = new Date().toISOString();
    if (!storageAdapter || typeof storageAdapter.readJSON !== 'function') {
      throw new Error('TamaStorage must be loaded before TamaState.');
    }
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
