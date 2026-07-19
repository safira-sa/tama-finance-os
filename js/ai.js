(function (global) {
  'use strict';

  const DEFAULT_MODEL = 'gpt-5.6';
  const DEFAULT_QUESTION = 'What should I do next?';

  function asObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  }

  function compactSummary(summary) {
    const safeSummary = asObject(summary);
    return {
      storage_key: safeSummary.storage_key || null,
      last_updated: safeSummary.last_updated || null,
      counts: asObject(safeSummary.counts),
      active_position_tickers: Array.isArray(safeSummary.active_position_tickers) ? safeSummary.active_position_tickers.slice(0, 12) : undefined,
      active_thesis_tickers: Array.isArray(safeSummary.active_thesis_tickers) ? safeSummary.active_thesis_tickers.slice(0, 12) : undefined,
      decision_ready_thesis_tickers: Array.isArray(safeSummary.decision_ready_thesis_tickers) ? safeSummary.decision_ready_thesis_tickers.slice(0, 12) : undefined,
      financial_signals: asObject(safeSummary.financial_signals),
    };
  }

  function buildContext(snapshot, decision, question) {
    const safeSnapshot = asObject(snapshot);
    const safeDecision = asObject(decision);
    return {
      product: 'Tama OS local-first Financial Operating System',
      user_question: (question || DEFAULT_QUESTION).trim(),
      boundaries: [
        'Explain deterministic findings; do not perform new financial calculations.',
        'Do not claim to provide personalized financial advice.',
        'Do not say you changed, saved, imported, exported, or mutated user data.',
        'State assumptions and data gaps clearly.',
        'Give one to three concrete next actions.',
      ],
      decision_engine: {
        version: safeDecision.version || null,
        generated_at: safeDecision.generated_at || null,
        readiness: safeDecision.decision_readiness || safeDecision.financial_health || null,
        top_priority: safeDecision.top_priority || null,
        recommended_next_action: safeDecision.recommended_next_action || null,
        key_risks: Array.isArray(safeDecision.key_risks) ? safeDecision.key_risks.slice(0, 5) : [],
      },
      snapshot: {
        version: safeSnapshot.version || null,
        generated_at: safeSnapshot.generated_at || null,
        last_updated: safeSnapshot.last_updated || null,
        finance: {
          available: !!(safeSnapshot.finance && safeSnapshot.finance.available),
          error: safeSnapshot.finance ? safeSnapshot.finance.error || null : null,
          summary: compactSummary(safeSnapshot.finance && safeSnapshot.finance.summary),
        },
        research: {
          available: !!(safeSnapshot.research && safeSnapshot.research.available),
          error: safeSnapshot.research ? safeSnapshot.research.error || null : null,
          summary: compactSummary(safeSnapshot.research && safeSnapshot.research.summary),
        },
      },
    };
  }

  function buildPrompt(snapshot, decision, question) {
    const context = buildContext(snapshot, decision, question);
    return [
      'You are the Tama OS copilot. Explain the deterministic financial decision brief using only the structured context below.',
      'Be concise, practical, and explicit about assumptions. This is educational decision support, not financial advice.',
      '',
      JSON.stringify(context, null, 2),
    ].join('\n');
  }

  function buildRequestBody(snapshot, decision, question, model) {
    return {
      model: model || DEFAULT_MODEL,
      reasoning: { effort: 'low' },
      input: [
        {
          role: 'developer',
          content: 'You explain Tama OS deterministic financial recommendations. Never mutate data. Never imply you accessed data outside the supplied context. Keep the answer under 160 words.',
        },
        {
          role: 'user',
          content: buildPrompt(snapshot, decision, question),
        },
      ],
    };
  }

  function extractOutputText(response) {
    if (!response) return '';
    if (typeof response.output_text === 'string') return response.output_text.trim();
    if (!Array.isArray(response.output)) return '';
    return response.output
      .flatMap((item) => Array.isArray(item.content) ? item.content : [])
      .map((part) => part && (part.text || part.output_text || ''))
      .filter(Boolean)
      .join('\n')
      .trim();
  }

  function offlineExplanation(snapshot, decision, question) {
    const safeDecision = asObject(decision);
    const readiness = safeDecision.decision_readiness || safeDecision.financial_health || {};
    const risks = Array.isArray(safeDecision.key_risks) ? safeDecision.key_risks : [];
    const topPriority = asObject(safeDecision.top_priority);
    const lines = [
      `Local Copilot answer for “${(question || DEFAULT_QUESTION).trim()}”`,
      '',
      `Readiness: ${readiness.label || 'unknown'}.`,
      topPriority.title ? `Top priority: ${topPriority.title}.` : 'Top priority: review Today’s Brief.',
      topPriority.why ? `Why it matters: ${topPriority.why}` : null,
      `Next action: ${safeDecision.recommended_next_action || 'Refresh local data, then review Today’s Brief again.'}`,
    ].filter(Boolean);

    if (risks.length) {
      lines.push('', 'Key blockers:');
      risks.slice(0, 3).forEach((risk, index) => lines.push(`${index + 1}. ${risk.title} — ${risk.detail}`));
    } else {
      lines.push('', 'No immediate deterministic blockers were found. Keep Finance and Research updated before taking more risk.');
    }

    lines.push('', 'This works without an API key. GPT-5.6 is optional and only adds a more natural-language explanation of the same structured findings.');
    return lines.join('\n');
  }

  async function explain(options) {
    const settings = asObject(options);
    const apiKey = String(settings.apiKey || '').trim();
    const snapshot = settings.snapshot;
    const decision = settings.decision;
    const question = settings.question || DEFAULT_QUESTION;
    const prompt = buildPrompt(snapshot, decision, question);

    if (!apiKey) {
      return {
        mode: 'offline',
        prompt,
        text: offlineExplanation(snapshot, decision, question),
      };
    }

    const fetchImpl = settings.fetchImpl || global.fetch;
    if (typeof fetchImpl !== 'function') {
      throw new Error('Fetch API is not available in this browser. Use deterministic mode or a modern browser.');
    }

    const response = await fetchImpl('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(buildRequestBody(snapshot, decision, question, settings.model)),
    });

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = body && body.error && body.error.message ? body.error.message : `OpenAI request failed with status ${response.status}.`;
      throw new Error(message);
    }

    return {
      mode: 'api',
      prompt,
      text: extractOutputText(body) || 'The model returned no text. The deterministic brief remains available above.',
      raw: body,
    };
  }

  global.TamaAI = Object.freeze({
    DEFAULT_MODEL,
    DEFAULT_QUESTION,
    buildContext,
    buildPrompt,
    buildRequestBody,
    extractOutputText,
    offlineExplanation,
    explain,
  });
})(window);
