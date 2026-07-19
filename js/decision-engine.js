(function (global) {
  'use strict';

  function count(summary, key) {
    return summary && summary.counts && Number.isFinite(summary.counts[key]) ? summary.counts[key] : 0;
  }

  function totalFinanceRecords(summary) {
    return count(summary, 'accounts') +
      count(summary, 'transactions') +
      count(summary, 'expenses') +
      count(summary, 'positions') +
      count(summary, 'journal') +
      count(summary, 'months');
  }

  function totalResearchRecords(summary) {
    return count(summary, 'entries') + count(summary, 'universe') + count(summary, 'journal_import');
  }

  function ageInDays(value, now) {
    const timestamp = Date.parse(value || '');
    if (!Number.isFinite(timestamp)) return null;
    return Math.max(0, Math.floor((now - timestamp) / 86400000));
  }

  function list(summary, key) {
    return summary && Array.isArray(summary[key]) ? summary[key] : [];
  }

  function financialSignals(summary) {
    return summary && summary.financial_signals && typeof summary.financial_signals === 'object'
      ? summary.financial_signals
      : {};
  }

  function addRisk(risks, title, detail, action, severity) {
    risks.push({
      title,
      detail,
      action,
      severity: severity || 'medium',
    });
  }

  function prioritizeRisks(risks) {
    const severityRank = { high: 0, medium: 1, low: 2 };
    return [...risks].sort((left, right) => (severityRank[left.severity] ?? 1) - (severityRank[right.severity] ?? 1));
  }

  function readinessFromRisks(risks, financeAvailable, researchAvailable) {
    if (!financeAvailable && !researchAvailable) {
      return { label: 'Needs data', score: 35 };
    }

    if (risks.some((risk) => risk.severity === 'high')) {
      return { label: 'Attention needed', score: 62 };
    }

    if (risks.length) {
      return { label: 'Review recommended', score: 74 };
    }

    return { label: 'Ready for review', score: 86 };
  }

  function defaultPriority(financeAvailable, researchAvailable) {
    if (!financeAvailable) {
      return {
        title: 'Open Tama Finance and save your baseline',
        why: 'The OS cannot brief financial state until Finance data exists in the current browser.',
      };
    }

    if (!researchAvailable) {
      return {
        title: 'Open Research Desk and add your watchlist',
        why: 'Research context is missing, so investment thesis coverage cannot be reviewed yet.',
      };
    }

    return {
      title: 'Review Today’s Brief before making changes',
      why: 'Finance and Research data are available for a local deterministic briefing.',
    };
  }

  function analyze(snapshot) {
    const financeAvailable = !!(snapshot && snapshot.finance && snapshot.finance.available);
    const researchAvailable = !!(snapshot && snapshot.research && snapshot.research.available);
    const financeSummary = financeAvailable ? snapshot.finance.summary : null;
    const researchSummary = researchAvailable ? snapshot.research.summary : null;
    const risks = [];
    const now = Date.now();

    if (!financeAvailable) {
      addRisk(
        risks,
        'Finance data missing',
        'Tama OS cannot assess financial state until the Finance app has saved local data.',
        'Open Tama Finance and confirm your accounts, transactions, or positions.',
        'high'
      );
    }

    if (financeAvailable && count(financeSummary, 'transactions') >= 50 && count(financeSummary, 'months') === 0) {
      addRisk(
        risks,
        'Financial records require review',
        'A high volume of transactions exists without any monthly summary to anchor the history.',
        'Create a monthly summary before making a new investment decision.',
        'high'
      );
    }

    if (financeAvailable) {
      const signals = financialSignals(financeSummary);
      const emergencyFund = signals.emergency_fund;
      const investmentCash = signals.investment_cash;
      const monthly = signals.monthly;

      if (emergencyFund && emergencyFund.available < emergencyFund.floor_target) {
        addRisk(
          risks,
          'Emergency fund below target',
          `Reported emergency funds cover ${emergencyFund.months_covered.toFixed(1)} months, below the 6-month floor.`,
          'Top up the emergency fund before increasing investment exposure.',
          'high'
        );
      }

      if (investmentCash && investmentCash.minimum > 0 && investmentCash.available < investmentCash.minimum) {
        addRisk(
          risks,
          'Investment cash buffer below minimum',
          'Reported investment cash is below the minimum buffer configured in Finance.',
          'Restore the investment cash buffer before opening another position.',
          'high'
        );
      }

      if (monthly && monthly.income > 0 && monthly.expenses !== null && monthly.expenses > monthly.income) {
        addRisk(
          risks,
          'Monthly spending exceeds recorded income',
          `Recorded expenses for ${monthly.month_key} exceed recorded income.`,
          'Review current-month spending before committing new capital.',
          'high'
        );
      }
    }

    if (!researchAvailable) {
      addRisk(
        risks,
        'Research data missing',
        'Tama OS cannot compare investment activity with research thesis coverage yet.',
        'Open Research Desk and add at least one watchlist or thesis entry.',
        'medium'
      );
    }

    if (financeAvailable && totalFinanceRecords(financeSummary) === 0) {
      addRisk(
        risks,
        'Finance file is empty',
        'The Finance storage key exists, but it does not contain records useful for a brief yet.',
        'Add accounts, a transaction, or a monthly entry in Tama Finance.',
        'high'
      );
    }

    if (researchAvailable && totalResearchRecords(researchSummary) === 0) {
      addRisk(
        risks,
        'Research file is empty',
        'The Research storage key exists, but no entries or universe records were found.',
        'Add a research idea or universe record in Tama Research Desk.',
        'medium'
      );
    }

    const positionTickers = list(financeSummary, 'active_position_tickers');
    const thesisTickers = new Set(list(researchSummary, 'decision_ready_thesis_tickers'));
    const uncoveredTickers = positionTickers.filter((ticker) => !thesisTickers.has(ticker));
    if (financeAvailable && researchAvailable && uncoveredTickers.length > 0) {
      addRisk(
        risks,
        'Holdings without thesis coverage',
        `${uncoveredTickers.join(', ')} ${uncoveredTickers.length === 1 ? 'has' : 'have'} no decision-ready Research thesis.`,
        'Create research before increasing exposure.',
        'high'
      );
    }

    if (financeAvailable && count(financeSummary, 'months') === 0 && count(financeSummary, 'transactions') === 0 && count(financeSummary, 'expenses') === 0) {
      addRisk(
        risks,
        'Monthly activity not recorded',
        'No month, transaction, or expense records were detected for financial context.',
        'Record the current month or latest financial event in Tama Finance.',
        'medium'
      );
    }

    [
      ['Finance', financeAvailable && financeSummary],
      ['Research', researchAvailable && researchSummary],
    ].forEach(([name, summary]) => {
      if (!summary) return;
      const age = ageInDays(summary.last_updated, now);
      if (age === null) {
        addRisk(risks, `${name} freshness unknown`, `${name} has data but no reliable saved timestamp.`, `Save ${name} once before relying on this brief.`, 'medium');
      } else if (age > 30) {
        addRisk(risks, `${name} data is stale`, `${name} was last saved ${age} days ago.`, `Review and save ${name} before making a new decision.`, 'high');
      }
    });

    const prioritizedRisks = prioritizeRisks(risks);
    const readiness = readinessFromRisks(prioritizedRisks, financeAvailable, researchAvailable);
    const priorityRisk = prioritizedRisks[0] || null;
    const fallback = defaultPriority(financeAvailable, researchAvailable);
    const topPriority = priorityRisk
      ? { title: priorityRisk.title, why: priorityRisk.detail }
      : fallback;
    const recommendedNextAction = priorityRisk
      ? priorityRisk.action
      : 'Use Finance and Research normally, then refresh Tama OS before the next decision.';

    return {
      version: 'tama-decision-engine-v1',
      snapshot_version: snapshot ? snapshot.version : null,
      generated_at: snapshot ? snapshot.generated_at : null,
      decision_readiness: readiness,
      // Backward compatibility for existing callers.
      financial_health: readiness,
      top_priority: topPriority,
      all_key_risks: prioritizedRisks,
      key_risks: prioritizedRisks.slice(0, 3),
      recommended_next_action: recommendedNextAction,
    };
  }

  global.TamaDecisionEngine = Object.freeze({
    analyze,
  });
})(window);
