(function (global) {
  'use strict';

  const FINANCE_KEY = 'tama-v8';
  const RESEARCH_KEY = 'tama-research-v1';
  const BACKUP_KEY = 'tama-os-demo-backup-v1';
  const generatedAt = '2026-07-19T09:00:00.000Z';

  const finance = Object.freeze({
    meta: { schema_version: 9, last_saved_at: generatedAt, demo_persona: 'build-week-thesis-gap' },
    config: {
      salary: 8500000,
      salary_template: 8500000,
      parent_tax: 1000000,
      internet: 250000,
      transport_buf: 250000,
      sinking_funds: [{ id: 1, name: 'Laptop replacement', target: 15000000, base_monthly: 500000, initial_balance: 2500000, priority: 1 }],
    },
    inv: { ihsg: 'cautious', cash_min: 3000000, cash_max: 7000000, swing_pct: 60, pos_base: 2500000, pos_ceil: 4000000, maxloss_pct: 8 },
    accounts: [
      { id: 1, name: 'Payroll Cash', institution: 'Demo Bank', type: 'debit', bucket: 'ME', initial_balance: 3200000 },
      { id: 2, name: 'Emergency RDPU', institution: 'Demo Asset', type: 'rdpu', bucket: 'Emergency Fund', initial_balance: 11000000 },
      { id: 3, name: 'Investment Cash', institution: 'Demo Broker', type: 'saham', bucket: 'Investment', initial_balance: 7000000 },
    ],
    months: {
      '2026-07': {
        salary: 8500000,
        explicit_salary: true,
        overtimes: [{ id: 101, net: 750000, confirmed: true, notes: 'Demo overtime' }],
        windfalls: [],
        sidejobs: [],
        closed: false,
      },
    },
    expenses: [
      { id: 201, month_key: '2026-07', date: '2026-07-05', account_id: 1, cat: 'Allowance', amt: 1200000, amt_base: 1200000, desc: 'Food and daily spend' },
      { id: 202, month_key: '2026-07', date: '2026-07-09', account_id: 1, cat: 'Transport', amt: 450000, amt_base: 450000, desc: 'Commuting' },
    ],
    transactions: [
      { id: 301, date: '2026-07-01', type: 'Income', account_id: 1, amount: 8500000, amount_base: 8500000, notes: 'Salary', month_key: '2026-07' },
      { id: 302, date: '2026-07-05', type: 'Expense', account_id: 1, amount: -1200000, amount_base: -1200000, notes: 'Food and daily spend', linked_expense_id: 201, month_key: '2026-07' },
      { id: 303, date: '2026-07-09', type: 'Expense', account_id: 1, amount: -450000, amount_base: -450000, notes: 'Commuting', linked_expense_id: 202, month_key: '2026-07' },
    ],
    positions: [
      { id: 401, ticker: 'BBCA', status: 'open', lots: 10, avgbuy: 9400, notes: 'Covered by intact research thesis' },
      { id: 402, ticker: 'TLKM', status: 'open', lots: 20, avgbuy: 3100, notes: 'Intentional demo gap: no decision-ready thesis' },
    ],
    journal: [{ id: 501, date: '2026-07-18', type: 'review', ticker: 'BBCA', notes: 'Demo journal: thesis checked before adding risk.' }],
  });

  const research = Object.freeze({
    meta: { last_saved_at: generatedAt, demo_persona: 'build-week-thesis-gap' },
    entries: [
      {
        id: 601,
        ticker: 'BBCA',
        market: 'IDX',
        sector: 'Banking',
        status: 'watching',
        thesis_status: 'intact',
        thesis: 'High-quality bank compounder; add only if valuation and risk budget remain disciplined.',
        notes: 'Decision-ready demo thesis for existing BBCA holding.',
        date_added: '2026-07-10',
        next_check: '2026-07-25',
        score: 78,
      },
      {
        id: 602,
        ticker: 'ASII',
        market: 'IDX',
        sector: 'Industrial',
        status: 'expired',
        thesis_status: 'invalid',
        thesis: 'Old cyclical setup expired; kept as stale-demo example only.',
        notes: 'Stale research example for demo discussion.',
        date_added: '2026-05-01',
        next_check: '2026-05-20',
        score: 42,
      },
    ],
    universe: [
      { id: 701, ticker: 'BBCA', company: 'Bank Central Asia', market: 'IDX', sector: 'Banking', tier: 'tier1', notes: 'Core quality watchlist' },
      { id: 702, ticker: 'TLKM', company: 'Telkom Indonesia', market: 'IDX', sector: 'Telecom', tier: 'tier2', notes: 'Needs thesis before adding risk' },
    ],
    journal_import: [],
  });

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function install(storage) {
    if (!storage || typeof storage.setItem !== 'function' || typeof storage.getItem !== 'function') {
      throw new Error('LocalStorage is not available for demo data.');
    }

    const backup = {
      created_at: new Date().toISOString(),
      previous: {
        [FINANCE_KEY]: storage.getItem(FINANCE_KEY),
        [RESEARCH_KEY]: storage.getItem(RESEARCH_KEY),
      },
    };

    storage.setItem(BACKUP_KEY, JSON.stringify(backup));
    storage.setItem(FINANCE_KEY, JSON.stringify(clone(finance)));
    storage.setItem(RESEARCH_KEY, JSON.stringify(clone(research)));

    return {
      backup_key: BACKUP_KEY,
      finance_key: FINANCE_KEY,
      research_key: RESEARCH_KEY,
      generated_at: generatedAt,
    };
  }

  global.TamaDemoData = Object.freeze({
    FINANCE_KEY,
    RESEARCH_KEY,
    BACKUP_KEY,
    finance,
    research,
    install,
  });
})(window);
