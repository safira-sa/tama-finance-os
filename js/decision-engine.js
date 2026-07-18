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

  function addRisk(risks, title, detail, action, severity) {
    risks.push({
      title,
      detail,
      action,
      severity: severity || 'medium',
    });
  }

  function healthFromRisks(risks, financeAvailable, researchAvailable) {
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

    if (!financeAvailable) {
      addRisk(
        risks,
        'Finance data missing',
        'Tama OS cannot assess financial state until the Finance app has saved local data.',
        'Open Tama Finance and confirm your accounts, transactions, or positions.',
        'high'
      );
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

    if (financeAvailable && researchAvailable && count(financeSummary, 'positions') > 0 && count(researchSummary, 'entries') === 0) {
      addRisk(
        risks,
        'Position thesis coverage missing',
        'Finance has open investment records, but Research has no thesis entries to support review.',
        'Create or update research thesis entries for current holdings before adding risk.',
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

    const health = healthFromRisks(risks, financeAvailable, researchAvailable);
    const priorityRisk = risks[0] || null;
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
      financial_health: health,
      top_priority: topPriority,
      key_risks: risks.slice(0, 3),
      recommended_next_action: recommendedNextAction,
    };
  }

  global.TamaDecisionEngine = Object.freeze({
    analyze,
  });
})(window);
