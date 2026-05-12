import type { AiModeKey } from './_types';

const modeSignals: Record<AiModeKey, Array<{ term: string; weight: number }>> = {
  ask: [
    { term: 'apa', weight: 1 },
    { term: 'berapa', weight: 2 },
    { term: 'mana', weight: 2 },
    { term: 'analisis', weight: 2 },
    { term: 'ringkas', weight: 2 },
    { term: 'jelaskan', weight: 3 },
    { term: 'rasio', weight: 4 },
    { term: 'opex', weight: 5 },
    { term: 'revenue', weight: 4 },
    { term: 'pendapatan', weight: 3 },
    { term: 'quarter', weight: 2 },
    { term: 'kuartal', weight: 2 },
  ],
  transform: [
    { term: 'dashboard', weight: 5 },
    { term: 'grafik', weight: 3 },
    { term: 'chart', weight: 3 },
    { term: 'visual', weight: 3 },
    { term: 'arr', weight: 5 },
    { term: 'gross new', weight: 4 },
    { term: 'expansion', weight: 4 },
    { term: 'contraction', weight: 4 },
    { term: 'churn', weight: 4 },
    { term: 'actual vs plan', weight: 5 },
    { term: 'drill-down', weight: 3 },
    { term: 'publish', weight: 2 },
  ],
  monitor: [
    { term: 'risiko', weight: 4 },
    { term: 'alert', weight: 4 },
    { term: 'monitor', weight: 4 },
    { term: 'prioritas', weight: 3 },
    { term: 'warning', weight: 3 },
    { term: 'urgent', weight: 3 },
    { term: 'prediksi', weight: 4 },
    { term: 'prediktif', weight: 4 },
    { term: 'pantau', weight: 3 },
    { term: 'churn', weight: 4 },
    { term: 'losses', weight: 4 },
    { term: 'loss', weight: 3 },
    { term: 'variance', weight: 3 },
  ],
};

export function normalizePrompt(prompt: string) {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function detectMode(prompt: string): { mode: AiModeKey; confidence: number; reasons: string[] } {
  const normalized = normalizePrompt(prompt);
  const baseScores: Record<AiModeKey, number> = {
    ask: prompt.trim().endsWith('?') ? 1 : 0,
    transform: 0,
    monitor: 0,
  };
  const reasons: Record<AiModeKey, string[]> = { ask: [], transform: [], monitor: [] };

  (Object.keys(modeSignals) as AiModeKey[]).forEach((mode) => {
    modeSignals[mode].forEach((signal) => {
      if (normalized.includes(signal.term)) {
        baseScores[mode] += signal.weight;
        reasons[mode].push(signal.term);
      }
    });
  });

  if (normalized.includes('arr') && (normalized.includes('components') || normalized.includes('actual vs plan'))) {
    baseScores.transform += 5;
    reasons.transform.push('arr+components/plan');
  }
  if (normalized.includes('opex') && normalized.includes('revenue')) {
    baseScores.ask += 4;
    reasons.ask.push('opex+revenue');
  }
  if (normalized.includes('buat') && normalized.includes('dashboard')) {
    baseScores.transform += 4;
    reasons.transform.push('buat+dashboard');
  }
  if ((normalized.includes('risiko') || normalized.includes('alert')) && (normalized.includes('churn') || normalized.includes('variance'))) {
    baseScores.monitor += 3;
    reasons.monitor.push('risiko/alert+finance');
  }

  const ranking = (Object.entries(baseScores) as Array<[AiModeKey, number]>).sort((left, right) => {
    if (right[1] !== left[1]) return right[1] - left[1];
    const tieBreaker: Record<AiModeKey, number> = { monitor: 3, transform: 2, ask: 1 };
    return tieBreaker[right[0]] - tieBreaker[left[0]];
  });

  const [winner, winnerScore] = ranking[0];
  const runnerUpScore = ranking[1]?.[1] ?? 0;
  const totalScore = Math.max(winnerScore + runnerUpScore, 1);

  return {
    mode: winner,
    confidence: Math.min(0.98, Math.max(0.55, winnerScore / totalScore)),
    reasons: reasons[winner].slice(0, 3),
  };
}

export function detectSchemaKey(prompt: string): string {
  const normalized = normalizePrompt(prompt);
  const domainSignals: Array<{ key: string; terms: string[] }> = [
    { key: 'finance', terms: ['kas', 'bank', 'payment', 'receipt', 'piutang', 'hutang', 'coa', 'jurnal', 'giro', 'cash', 'finance', 'outstanding invoice', 'aging'] },
    { key: 'sales', terms: ['sales', 'penjualan', 'customer', 'invoice', 'so', 'sales order', 'quotation', 'delivery', 'retur', 'voucher'] },
    { key: 'purchase', terms: ['purchase', 'pembelian', 'supplier', 'vendor', 'po', 'grn', 'receipt invoice', 'ap'] },
    { key: 'inventory', terms: ['inventory', 'stok', 'stock', 'gudang', 'warehouse', 'mutasi', 'movement', 'adjustment', 'item'] },
  ];

  const scored = domainSignals
    .map((domain) => ({ key: domain.key, score: domain.terms.reduce((total, term) => total + (normalized.includes(term) ? 1 : 0), 0) }))
    .sort((left, right) => right.score - left.score);

  const winner = scored[0];
  if (!winner || winner.score <= 0) return 'all';
  if (scored.filter((item) => item.score > 0).length >= 2) return 'all';
  const runnerUp = scored[1];
  if (runnerUp && runnerUp.score === winner.score && winner.score > 0) return 'all';
  return winner.key;
}
