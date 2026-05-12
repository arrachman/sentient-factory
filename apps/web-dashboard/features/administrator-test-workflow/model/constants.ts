/**
 * Konstanta UI untuk Administrator Test Workflow.
 *
 * - DEFAULT_PROMPT: prompt awal saat page load
 * - PRESET_PROMPTS: 4 kategori preset prompt yang bisa di-pick via Tabs
 */
export const DEFAULT_PROMPT =
  'Analisis kebutuhan dashboard piutang, jelaskan tabel yang relevan, risiko ambigu, dan berikan contoh SQL read-only jika diperlukan.';

export const DEFAULT_MESSAGES_JSON = '[]';

export const PRESET_PROMPTS = {
  general: [
    'Jelaskan workflow AI ini dalam satu paragraf singkat.',
    'Identifikasi domain bisnis, tabel, relasi, dan filter untuk laporan outstanding invoice.',
  ],
  finance: [
    'Analisis kebutuhan dashboard aging piutang dan usulkan query read-only yang aman.',
    'Jelaskan langkah analisis untuk dashboard arus kas dan risiko ambiguitas datanya.',
  ],
  sales: [
    'Petakan tabel dan filter untuk laporan penjualan per customer beserta contoh SQL read-only.',
    'Analisis kebutuhan dashboard performa salesman dan metrik yang perlu dijaga.',
  ],
  warehouse: [
    'Identifikasi tabel, relasi, dan filter untuk laporan mutasi stok gudang.',
    'Usulkan workflow analisis untuk monitoring delivery order yang overdue.',
  ],
} as const;

export const PROGRESS_EVENT_NAMES = [
  'started',
  'schema_selected',
  'analysis_started',
  'analysis_done',
  'draft_started',
  'draft_done',
  'review_started',
  'review_done',
  'completed',
  'failed',
] as const;

export function formatProgressTimestamp(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date);
}
