'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Activity,
  AlertCircle,
  ArrowDown,
  Briefcase,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronUp,
  Code,
  Copy,
  EllipsisVertical,
  Euro,
  FileImage,
  FileSpreadsheet,
  FileText,
  LoaderCircle,
  Package,
  PanelLeft,
  Paperclip,
  Pencil,
  Pin,
  Plus,
  Search,
  SearchCode,
  Send,
  Trash2,
  TrendingUp,
  WandSparkles,
  X,
} from 'lucide-react';
import {
  OrderStatusCard,
  TimeseriesCard,
  TopAmountCard,
} from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardHeading,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  buildAttachmentContext,
  parsePromptAttachmentOffMainThread,
  type PromptAttachment,
} from './attachment-utils';

const aiModes = [
  {
    key: 'ask',
    title: 'Ask',
    subtitle: 'Chat with data dan root-cause analysis cepat.',
    icon: BrainCircuit,
  },
  {
    key: 'transform',
    title: 'Transform',
    subtitle: 'Text-to-dashboard dan instant dashboard generation.',
    icon: WandSparkles,
  },
  {
    key: 'monitor',
    title: 'Monitor',
    subtitle: 'Prediksi risiko, freshness, dan action tracker.',
    icon: Activity,
  },
] as const;

type AiModeKey = (typeof aiModes)[number]['key'];

type RunHistoryItem = {
  sessionId?: string | null;
  sessionKey?: string | null;
  promptId?: string | null;
  requestId?: string | null;
  prompt: string;
  mode: AiModeKey;
  confidence: number;
  time: string;
  pinned: boolean;
  result?: AiChatResult | null;
  table?: SelectedStreamTable | null;
  chart?: SelectedStreamChart | null;
  streamEntries?: WorkflowStreamEntry[];
  error?: string | null;
};

type HistorySessionItem = {
  id: string;
  session_key: string;
  user_id?: number | null;
  username?: string | null;
  channel: string;
  mode: AiModeKey;
  title?: string | null;
  status: string;
  started_at: string;
  ended_at?: string | null;
  last_prompt_at?: string | null;
  prompt_count: number;
  metadata?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type HistoryPromptItem = {
  id: string;
  session_id: string;
  request_id: string;
  turn_index: number;
  prompt_text: string;
  started_response?: string | null;
  explanation_response?: string | null;
  insight_response?: string | null;
  answer_text?: string | null;
  answer_json?: Record<string, unknown> | null;
  status: string;
  failure_type?: string | null;
  failure_message?: string | null;
  schema_key?: string | null;
  schema_source?: string | null;
  workflow_mode?: string | null;
  workflow_passes?: number | null;
  include_schema?: boolean;
  model?: string | null;
  provider?: string | null;
  data_source?: string | null;
  query_sql?: string | null;
  query_result?: AiChatResult['query_result'] | null;
  parsed_answer?: Record<string, unknown> | null;
  duration_ms?: number | null;
  prompt_created_at: string;
  completed_at?: string | null;
};

type HistoryPromptEventItem = {
  id: number;
  prompt_id: string;
  request_id: string;
  event_name: string;
  event_type?: 'chain_of_thought' | 'data' | 'insight' | 'explanation' | 'failed' | null;
  progress?: number | null;
  label?: string | null;
  response_text?: string | null;
  payload?: Record<string, unknown> | null;
  created_at: string;
};

type HistoryPromptDetail = {
  prompt: HistoryPromptItem;
  events: HistoryPromptEventItem[];
};

type StepType =
  | 'thought'
  | 'commentary'
  | 'read_query'
  | 'generate_query'
  | 'chart_insight'
  | 'ai_insight'
  | 'summary';

interface BaseStep {
  type: StepType;
}

interface ThoughtStep extends BaseStep {
  type: 'thought';
  content: string;
}

interface CommentaryStep extends BaseStep {
  type: 'commentary';
  content: string;
}

interface ReadQueryStep extends BaseStep {
  type: 'read_query';
  target: string;
  description?: string;
}

interface GenerateQueryStep extends BaseStep {
  type: 'generate_query';
  query_string: string;
  description: string;
  rows_affected?: number;
}

interface ChartInsightStep extends BaseStep {
  type: 'chart_insight';
  chart_type: string;
  title: string;
  description: string;
}

interface AiInsightSpecificStep extends BaseStep {
  type: 'ai_insight';
  finding: string;
  recommendation?: string;
}

interface SummaryStep extends BaseStep {
  type: 'summary';
  content: string;
}

type AiInsightStep =
  | ThoughtStep
  | CommentaryStep
  | ReadQueryStep
  | GenerateQueryStep
  | ChartInsightStep
  | AiInsightSpecificStep
  | SummaryStep;

interface AiInsightLog {
  id: number;
  user_prompt: string;
  steps: AiInsightStep[];
}

type AiSchemaTable = {
  schema: string;
  name: string;
  row_count_estimate?: number | null;
  primary_key: string[];
  columns: Array<{
    name: string;
    data_type: string;
    nullable: boolean;
  }>;
};

type AiChatResult = {
  request_id?: string;
  answer: string;
  model: string;
  provider: string;
  data_source?: string | null;
  execution_status?: 'SUCCESS' | 'PARTIAL_SUCCESS' | 'FAILED' | null;
  workflow_mode?: string;
  workflow_passes?: number;
  schema_key?: string;
  schema_source?: string;
  semantic_schema?: {
    tables: AiSchemaTable[];
  } | null;
  query_result?: {
    sql: string;
    row_count: number;
    columns: Array<{
      name: string;
    }>;
    rows: Array<Record<string, string | number | boolean | null>>;
  } | null;
  generated_queries?: Array<{
    id: string;
    name?: string | null;
    purpose: string;
    query: string;
    result_kind?: string | null;
  }>;
  query_results?: Array<{
    query_id: string;
    sql: string;
    success: boolean;
    error_message?: string | null;
    row_count: number;
    columns: Array<{
      name: string;
    }>;
    rows: Array<Record<string, string | number | boolean | null>>;
  }>;
  visualizations?: Array<{
    id: string;
    query_id: string;
    title: string;
    chart_type: 'table' | 'bar' | 'line' | 'pie' | 'stacked_bar';
    x_axis?: string | null;
    y_axis?: string[];
  }>;
  suggested_queries?: Array<{
    sql: string;
    rationale: string;
    safety: 'read_only';
  }>;
};

type WorkflowStepStatus = 'pending' | 'active' | 'done';

type WorkflowStep = {
  key: string;
  title: string;
  detail: string;
  status: WorkflowStepStatus;
};

type WorkflowStreamEntry = {
  id: string;
  event: string;
  receivedAt: string;
  payload: string;
  kind?: 'user' | 'event';
};

type WorkflowEventName =
  | 'started'
  | 'schema_selected'
  | 'query_execution_started'
  | 'query_execution_completed'
  | 'ai_insight_started'
  | 'ai_insight_completed'
  | 'analysis_started'
  | 'analysis_done'
  | 'draft_started'
  | 'draft_done'
  | 'review_started'
  | 'review_done'
  | 'completed'
  | 'failed';

type PromptAttachmentFile = {
  id: string;
  file: File;
};

type ResultViewKey = 'table' | 'chart';

const RUN_HISTORY_STORAGE_KEY = 'manager-dashboard-ai-history';
const RUN_HISTORY_LIMIT = 12;
const MIN_PANEL_WIDTH_PERCENT = 32;
const MAX_PANEL_WIDTH_PERCENT = 100;
const MIN_RIGHT_PANEL_WIDTH_PX = 300;
const SESSION_SIDEBAR_ROW_HEIGHT = 72;
const SESSION_SIDEBAR_OVERSCAN = 6;
function createManagerSessionKey() {
  if (typeof window === 'undefined') {
    return `mgr-${Date.now()}`;
  }

  return typeof window.crypto?.randomUUID === 'function'
    ? `mgr-${window.crypto.randomUUID()}`
    : `mgr-${Date.now()}`;
}

function formatAttachmentSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function clampAttachmentName(value: string, limit = 35) {
  const normalized = value.trim();
  if (normalized.length <= limit) {
    return normalized;
  }
  return `${normalized.slice(0, limit)}...`;
}

function getAttachmentIcon(attachment: PromptAttachment) {
  if (attachment.type.startsWith('image/')) {
    return FileImage;
  }
  if (
    attachment.type.includes('spreadsheet') ||
    ['xlsx', 'xls', 'xlsm', 'csv'].includes(attachment.extension)
  ) {
    return FileSpreadsheet;
  }
  return FileText;
}

function getAttachmentVisualKind(attachment: PromptAttachment) {
  if (attachment.type === 'application/pdf' || attachment.extension === 'pdf') {
    return 'pdf';
  }
  if (
    attachment.type.includes('spreadsheet') ||
    ['xlsx', 'xls', 'xlsm', 'csv'].includes(attachment.extension)
  ) {
    return 'sheet';
  }
  if (
    attachment.type.includes('presentation') ||
    ['ppt', 'pptx', 'key'].includes(attachment.extension)
  ) {
    return 'slide';
  }
  if (
    attachment.type.includes('word') ||
    ['doc', 'docx', 'rtf', 'odt'].includes(attachment.extension)
  ) {
    return 'doc';
  }
  return 'file';
}

function AttachmentFileTile({
  attachment,
  typeLabel,
}: {
  attachment: PromptAttachment;
  typeLabel: string;
}) {
  const kind = getAttachmentVisualKind(attachment);
  const styleByKind: Record<string, { body: string; fold: string; label: string; glyph: string }> = {
    pdf: {
      body: 'bg-[#f4f4f4] text-[#be3128] dark:bg-[#f3f4f6] dark:text-[#be3128]',
      fold: 'border-l-[#d8d8d8] border-t-[#d8d8d8]',
      label: 'bg-[#cf3e36] text-white',
      glyph: 'text-[#be3128]',
    },
    sheet: {
      body: 'bg-[#3e9a46] text-white dark:bg-[#3e9a46]',
      fold: 'border-l-[#74c474] border-t-[#74c474]',
      label: 'bg-[#2d7c35] text-white',
      glyph: 'text-white',
    },
    doc: {
      body: 'bg-[#3d77c3] text-white dark:bg-[#3d77c3]',
      fold: 'border-l-[#73a0db] border-t-[#73a0db]',
      label: 'bg-[#2358a8] text-white',
      glyph: 'text-white',
    },
    slide: {
      body: 'bg-[#f0b73f] text-white dark:bg-[#f0b73f]',
      fold: 'border-l-[#f6d47d] border-t-[#f6d47d]',
      label: 'bg-[#d99912] text-white',
      glyph: 'text-white',
    },
    file: {
      body: 'bg-[#64748b] text-white dark:bg-[#64748b]',
      fold: 'border-l-[#94a3b8] border-t-[#94a3b8]',
      label: 'bg-[#475569] text-white',
      glyph: 'text-white',
    },
  };
  const style = styleByKind[kind];

  const glyphByKind: Record<string, ReactNode> = {
    pdf: (
      <svg viewBox="0 0 28 28" aria-hidden="true" className={`size-6 ${style.glyph}`}>
        <path d="M8 21c3-7 5-11 6-15 1 3 2 6 4 9 2 3 4 5 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M6 18c3-2 8-2 14-1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
    sheet: (
      <svg viewBox="0 0 28 28" aria-hidden="true" className={`size-6 ${style.glyph}`}>
        <rect x="4.5" y="5" width="19" height="18" rx="1.8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M4.5 11.5h19M4.5 17h19M11 5v18M17.5 5v18" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    doc: (
      <svg viewBox="0 0 28 28" aria-hidden="true" className={`size-6 ${style.glyph}`}>
        <path d="M7 9.5h14M7 14h14M7 18.5h10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
    slide: (
      <svg viewBox="0 0 28 28" aria-hidden="true" className={`size-6 ${style.glyph}`}>
        <rect x="5.5" y="6" width="17" height="14" rx="1.8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 20v3M10 23h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    file: (
      <svg viewBox="0 0 28 28" aria-hidden="true" className={`size-6 ${style.glyph}`}>
        <path d="M8 9.5h12M8 14h12M8 18.5h8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <div className={`relative mt-0.5 h-11 w-9 shrink-0 overflow-hidden rounded-md shadow-sm ${style.body}`}>
      <div className={`absolute right-0 top-0 h-0 w-0 border-l-[12px] border-t-[12px] border-l-transparent ${style.fold}`} />
      <div className={`absolute left-1 top-1 rounded-[4px] px-1 py-[1px] text-[7px] font-bold uppercase tracking-[0.14em] ${style.label}`}>
        {typeLabel}
      </div>
      <div className="absolute inset-x-0 bottom-1 flex items-center justify-center">
        {glyphByKind[kind]}
      </div>
    </div>
  );
}

function revokeAttachmentPreviewUrl(attachment: PromptAttachment) {
  if (attachment.previewUrl) {
    URL.revokeObjectURL(attachment.previewUrl);
  }
}

function TableResultIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className={className}>
      <rect x="1.5" y="2" width="15" height="14" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
      <rect x="3.25" y="4" width="11.5" height="2.5" rx="1.25" fill="#2563eb" />
      <rect x="3.25" y="7.5" width="3.2" height="2.75" rx="0.8" fill="#34d399" />
      <rect x="7.4" y="7.5" width="3.2" height="2.75" rx="0.8" fill="#f59e0b" />
      <rect x="11.55" y="7.5" width="3.2" height="2.75" rx="0.8" fill="#fb7185" />
      <rect x="3.25" y="11.15" width="3.2" height="2.75" rx="0.8" fill="#22c55e" />
      <rect x="7.4" y="11.15" width="3.2" height="2.75" rx="0.8" fill="#38bdf8" />
      <rect x="11.55" y="11.15" width="3.2" height="2.75" rx="0.8" fill="#a78bfa" />
    </svg>
  );
}

function ChartResultIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className={className}>
      <rect x="1.5" y="1.5" width="15" height="15" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
      <path d="M4 12.5L6.9 9.6L9.1 11.2L13.7 6.6" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="4" cy="12.5" r="1.1" fill="#34d399" />
      <circle cx="6.9" cy="9.6" r="1.1" fill="#f59e0b" />
      <circle cx="9.1" cy="11.2" r="1.1" fill="#fb7185" />
      <circle cx="13.7" cy="6.6" r="1.1" fill="#8b5cf6" />
      <path d="M4 14.5H14" stroke="#cbd5e1" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

const resultViews: Array<{ key: ResultViewKey; label: string; icon: typeof TableResultIcon }> = [
  { key: 'table', label: 'Table', icon: TableResultIcon },
  { key: 'chart', label: 'Chart', icon: ChartResultIcon },
];

const promptSuggestions = [
  {
    label: 'Bandingkan pertumbuhan sales vs collection 3 bulan terakhir',
    description: 'Lihat apakah kenaikan penjualan diikuti perbaikan cash-in per bulan.',
    icon: TrendingUp,
  },
  {
    label: 'Deteksi customer berisiko dari aging piutang di atas 90 hari',
    description: 'Prioritaskan akun dengan nilai outstanding terbesar dan aging terlama.',
    icon: Euro,
  },
  {
    label: 'Forecast stok yang berpotensi habis dalam 14 hari ke depan',
    description: 'Gabungkan stok saat ini, outbound rate, dan buffer minimum gudang.',
    icon: Package,
  },
  {
    label: 'Margin purchase vs selling per kategori item bulan berjalan',
    description: 'Temukan kategori dengan tekanan margin dan potensi markup terendah.',
    icon: Briefcase,
  },
  {
    label: 'Cash outflow operasional terbesar minggu ini beserta penyebabnya',
    description: 'Kelompokkan pengeluaran terbesar agar cepat terlihat sumber pemborosan.',
    icon: Activity,
  },
  {
    label: 'Supplier dengan lead time paling lambat dan dampaknya ke stok',
    description: 'Tandai vendor yang berpotensi menyebabkan keterlambatan replenishment.',
    icon: WandSparkles,
  },
] as const;

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

function normalizePrompt(prompt: string) {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectMode(prompt: string): { mode: AiModeKey; confidence: number; reasons: string[] } {
  const normalized = normalizePrompt(prompt);
  const baseScores: Record<AiModeKey, number> = {
    ask: prompt.trim().endsWith('?') ? 1 : 0,
    transform: 0,
    monitor: 0,
  };
  const reasons: Record<AiModeKey, string[]> = {
    ask: [],
    transform: [],
    monitor: [],
  };

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
    if (right[1] !== left[1]) {
      return right[1] - left[1];
    }

    const tieBreaker: Record<AiModeKey, number> = {
      monitor: 3,
      transform: 2,
      ask: 1,
    };

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

function detectSchemaKey(prompt: string): string {
  const normalized = normalizePrompt(prompt);
  const domainSignals: Array<{ key: string; terms: string[] }> = [
    {
      key: 'finance',
      terms: [
        'kas',
        'bank',
        'payment',
        'receipt',
        'piutang',
        'hutang',
        'coa',
        'jurnal',
        'giro',
        'cash',
        'finance',
        'outstanding invoice',
        'aging',
      ],
    },
    {
      key: 'sales',
      terms: [
        'sales',
        'penjualan',
        'customer',
        'invoice',
        'so',
        'sales order',
        'quotation',
        'delivery',
        'retur',
        'voucher',
      ],
    },
    {
      key: 'purchase',
      terms: [
        'purchase',
        'pembelian',
        'supplier',
        'vendor',
        'po',
        'grn',
        'receipt invoice',
        'ap',
      ],
    },
    {
      key: 'inventory',
      terms: [
        'inventory',
        'stok',
        'stock',
        'gudang',
        'warehouse',
        'mutasi',
        'movement',
        'adjustment',
        'item',
      ],
    },
  ];

  const scored = domainSignals
    .map((domain) => ({
      key: domain.key,
      score: domain.terms.reduce(
        (total, term) => total + (normalized.includes(term) ? 1 : 0),
        0,
      ),
    }))
    .sort((left, right) => right.score - left.score);

  const winner = scored[0];
  if (!winner || winner.score <= 0) {
    return 'all';
  }

  const matchedDomains = scored.filter((item) => item.score > 0);
  if (matchedDomains.length >= 2) {
    return 'all';
  }

  const runnerUp = scored[1];
  if (runnerUp && runnerUp.score === winner.score && winner.score > 0) {
    return 'all';
  }

  return winner.key;
}

function buildWorkflowSteps(activeIndex: number): WorkflowStep[] {
  const steps = [
    {
      key: 'schema',
      title: 'Schema Routing',
      detail: 'Memilih semantic schema yang paling relevan untuk pertanyaan manager.',
    },
    {
      key: 'analysis',
      title: 'Analysis',
      detail: 'Mengurai intent bisnis, tabel inti, join, filter, dan potensi ambigu.',
    },
    {
      key: 'draft',
      title: 'Draft Answer',
      detail: 'Menyusun jawaban kerja awal dan kandidat SQL read-only bila perlu.',
    },
    {
      key: 'review',
      title: 'Review',
      detail: 'Memeriksa konsistensi schema, risiko halusinasi, dan kualitas jawaban.',
    },
    {
      key: 'final',
      title: 'Final Response',
      detail: 'Menghasilkan jawaban akhir yang ringkas, matang, dan aman untuk user.',
    },
  ];

  return steps.map((step, index) => ({
    ...step,
    status: index < activeIndex ? 'done' : index === activeIndex ? 'active' : 'pending',
  }));
}

function applyWorkflowEventToSteps(eventName: WorkflowEventName): WorkflowStep[] {
  if (eventName === 'started' || eventName === 'schema_selected') {
    return buildWorkflowSteps(0);
  }
  if (eventName === 'analysis_started' || eventName === 'analysis_done') {
    return buildWorkflowSteps(1);
  }
  if (eventName === 'draft_started' || eventName === 'draft_done') {
    return buildWorkflowSteps(2);
  }
  if (eventName === 'review_started' || eventName === 'review_done') {
    return buildWorkflowSteps(3);
  }
  if (eventName === 'completed') {
    return buildWorkflowSteps(5);
  }

  return buildWorkflowSteps(0);
}

function formatWorkflowStreamPayload(payload: WorkflowStreamPayload) {
  const nextPayload: Record<string, unknown> = {
    ...payload,
  };

  if (payload.data?.answer) {
    nextPayload.data = {
      ...payload.data,
      answer: `${payload.data.answer.slice(0, 240)}${payload.data.answer.length > 240 ? '…' : ''}`,
    };
  }

  return JSON.stringify(nextPayload, null, 2);
}

const APP_TIME_ZONE = 'Asia/Jakarta';

function createWorkflowStreamEntry(eventName: string, payload: string): WorkflowStreamEntry {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return {
    id: `${eventName}-${uniqueSuffix}`,
    event: eventName,
    receivedAt: new Date().toLocaleTimeString('id-ID', {
      timeZone: APP_TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    payload,
    kind: 'event',
  };
}

function createUserPromptEntry(prompt: string): WorkflowStreamEntry {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return {
    id: `user-${uniqueSuffix}`,
    event: 'user',
    receivedAt: new Date().toLocaleTimeString('id-ID', {
      timeZone: APP_TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    payload: prompt,
    kind: 'user',
  };
}

function createHistoryWorkflowEntry(
  eventName: string,
  payload: string,
  receivedAtIso?: string,
): WorkflowStreamEntry {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return {
    id: `${eventName}-${uniqueSuffix}`,
    event: eventName,
    receivedAt: receivedAtIso
      ? new Date(receivedAtIso).toLocaleTimeString('id-ID', {
          timeZone: APP_TIME_ZONE,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : new Date().toLocaleTimeString('id-ID', {
          timeZone: APP_TIME_ZONE,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
    payload,
    kind: eventName === 'user' ? 'user' : 'event',
  };
}

function extractWorkflowDisplayText(payload: string) {
  const display = getWorkflowStreamDisplayPayload(payload);
  return display.kind === 'none' ? '' : display.text.trim();
}

function normalizeCopiedText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function applyNormalizedClipboardCopy(
  event: React.ClipboardEvent<HTMLElement>,
  fallbackText: string,
) {
  const selectedText = window.getSelection?.()?.toString() ?? '';
  const normalizedText = normalizeCopiedText(selectedText || fallbackText);
  if (!normalizedText) {
    return;
  }
  event.preventDefault();
  event.clipboardData.setData('text/plain', normalizedText);
}

function formatPromptPreview(prompt: string, maxLength = 160) {
  const compact = prompt.replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLength) {
    return compact;
  }
  return `${compact.slice(0, maxLength - 1).trimEnd()}…`;
}

function formatSessionRelativeTime(value?: string | null) {
  if (!value) {
    return 'Belum ada update';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Waktu tidak valid';
  }

  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  const formatter = new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' });

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, 'minute');
  }
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, 'hour');
  }
  return formatter.format(diffDays, 'day');
}

function formatSessionAbsoluteTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString('id-ID', {
    timeZone: APP_TIME_ZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getHistorySessionStatusTone(status?: string | null) {
  switch ((status || '').toLowerCase()) {
    case 'completed':
    case 'success':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300';
    case 'running':
    case 'queued':
    case 'started':
      return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300';
    case 'failed':
    case 'error':
      return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300';
    default:
      return 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
  }
}

function getHistorySessionModeLabel(mode: AiModeKey) {
  const matched = aiModes.find((item) => item.key === mode);
  return matched?.title ?? mode;
}

function WordSafeSingleLineText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={className} title={text}>
      <span className="block truncate">{text.replace(/\s+/g, ' ').trim()}</span>
    </div>
  );
}

function upsertRunHistory(
  current: RunHistoryItem[],
  nextItem: RunHistoryItem,
) {
  return [
    nextItem,
    ...current.filter((item) => item.requestId !== nextItem.requestId && item.prompt !== nextItem.prompt),
  ]
    .sort((left, right) => Number(right.pinned) - Number(left.pinned))
    .slice(0, RUN_HISTORY_LIMIT);
}

function buildAiResultFromHistoryPrompt(prompt: HistoryPromptItem): AiChatResult {
  const failureText =
    prompt.status === 'failed' && prompt.failure_message
      ? `Workflow gagal: ${prompt.failure_message}`
      : null;
  return {
    request_id: prompt.request_id,
    answer:
      prompt.answer_text ||
      prompt.explanation_response ||
      failureText ||
      (prompt.answer_json ? JSON.stringify(prompt.answer_json) : ''),
    model: prompt.model || 'unknown',
    provider: prompt.provider || '',
    data_source: prompt.data_source || null,
    workflow_mode: prompt.workflow_mode || undefined,
    workflow_passes: prompt.workflow_passes || undefined,
    schema_key: prompt.schema_key || undefined,
    schema_source: prompt.schema_source || undefined,
    semantic_schema: null,
    query_result: prompt.query_result || null,
    suggested_queries: [],
  };
}

function extractAiResultFromPromptDetail(detail: HistoryPromptDetail): AiChatResult | null {
  for (let index = detail.events.length - 1; index >= 0; index -= 1) {
    const payloadData = detail.events[index]?.payload?.data;
    if (!payloadData || typeof payloadData !== 'object') {
      continue;
    }

    const candidate = payloadData as Partial<AiChatResult>;
    if (
      typeof candidate.answer === 'string' &&
      typeof candidate.model === 'string' &&
      typeof candidate.provider === 'string'
    ) {
      return candidate as AiChatResult;
    }
  }

  return null;
}

function buildRunHistoryFromPromptDetail(
  detail: HistoryPromptDetail,
  sessionKey: string | null,
  mode: AiModeKey = 'ask',
): RunHistoryItem {
  const { prompt, events } = detail;
  const aiResult = extractAiResultFromPromptDetail(detail) ?? buildAiResultFromHistoryPrompt(prompt);
  const dashboardBlocks = buildDashboardVisualizationBlocks(aiResult);
  const primaryDashboardBlock = dashboardBlocks[0] ?? null;
  const historyPayload = JSON.stringify({
    response: prompt.query_result?.rows ?? null,
  });
  const fallbackTable = prompt.query_result?.rows ? parseStreamDataTable(historyPayload) : null;
  const fallbackChart = prompt.query_result?.rows ? parseStreamDataChart(historyPayload) : null;
  const table = primaryDashboardBlock?.table ?? fallbackTable;
  const chart = primaryDashboardBlock?.chart ?? fallbackChart;

  const streamEntries: WorkflowStreamEntry[] = [
    createHistoryWorkflowEntry('user', prompt.prompt_text, prompt.prompt_created_at),
    ...events.map((event) =>
      createHistoryWorkflowEntry(
        event.event_name,
        JSON.stringify(
          {
            event: event.event_name,
            type: event.event_type,
            progress: event.progress,
            label: event.label,
            response: event.response_text ?? event.payload?.response ?? null,
            data: event.payload?.data ?? null,
            error: event.payload?.error ?? null,
          },
          null,
          2,
        ),
        event.created_at,
      ),
    ),
  ];

  if (streamEntries.length === 1 && prompt.started_response) {
    streamEntries.push(
      createHistoryWorkflowEntry('started', prompt.started_response, prompt.prompt_created_at),
    );
  }

  if (prompt.status === 'failed' && prompt.failure_message) {
    streamEntries.push(
      createHistoryWorkflowEntry(
        'failed',
        `Workflow gagal: ${prompt.failure_message}`,
        prompt.completed_at || prompt.prompt_created_at,
      ),
    );
  }

  return {
    sessionId: prompt.session_id,
    sessionKey,
    promptId: prompt.id,
    requestId: prompt.request_id,
    prompt: prompt.prompt_text,
    mode,
    confidence: 1,
    time: new Date(prompt.prompt_created_at).toLocaleTimeString('id-ID', {
      timeZone: APP_TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
    }),
    pinned: false,
    result: aiResult,
    table,
    chart,
    streamEntries,
    error: prompt.failure_message ?? null,
  };
}

function getWorkflowStreamDisplayPayload(payload: string): WorkflowStreamDisplayPayload {
  try {
    const parsed = JSON.parse(payload) as {
      event?: unknown;
      type?: unknown;
      response?: unknown;
      summary?: unknown;
      label?: unknown;
      error?: unknown;
      prompt_preview?: unknown;
      data?: unknown;
    };

    const dataAnswer =
      parsed.data &&
      typeof parsed.data === 'object' &&
      'answer' in parsed.data &&
      typeof (parsed.data as { answer?: unknown }).answer === 'string'
        ? ((parsed.data as { answer: string }).answer || '').trim()
        : '';

    const isDataPayload =
      Array.isArray(parsed.response) ||
      (parsed.response !== null && typeof parsed.response === 'object');

    if (parsed.event === 'query_execution_completed' && isDataPayload) {
      return {
        kind: 'data' as const,
        text: 'Hasil data siap ditampilkan sebagai tabel atau dashboard.',
      };
    }

    const resolvedText =
      (typeof parsed.response === 'string' && parsed.response.trim().length > 0
        ? parsed.response
        : typeof parsed.summary === 'string' && parsed.summary.trim().length > 0
          ? parsed.summary
          : typeof parsed.error === 'string' && parsed.error.trim().length > 0
            ? parsed.error
            : typeof parsed.prompt_preview === 'string' && parsed.prompt_preview.trim().length > 0
              ? parsed.prompt_preview
              : dataAnswer.length > 0
                ? dataAnswer
                : typeof parsed.label === 'string' && parsed.label.trim().length > 0
                  ? parsed.label
                  : '');

    if (resolvedText) {
      const isCompletedInsight =
        parsed.event === 'completed' &&
        dataAnswer.length > 0 &&
        typeof parsed.response !== 'object';

      const kind: WorkflowStreamDisplayPayload['kind'] =
        parsed.type === 'insight'
          ? 'insight'
          : parsed.type === 'explanation'
            ? 'explanation'
            : isCompletedInsight
              ? 'insight'
              : isDataPayload
                ? 'data'
                : 'raw';

      if (kind === 'raw' && !isDataPayload) {
        return {
          kind: 'raw',
          text: resolvedText,
        };
      }

      if (kind !== 'insight' && kind !== 'explanation' && !isDataPayload) {
        return {
          kind: 'none',
          text: '',
        };
      }

      return {
        kind,
        text: resolvedText,
      };
    }

    if (
      Array.isArray(parsed.response) ||
      (parsed.response && typeof parsed.response === 'object')
    ) {
      return {
        kind: 'data' as const,
        text:
          typeof parsed.response === 'object' &&
          parsed.response !== null &&
          'title' in parsed.response &&
          typeof parsed.response.title === 'string'
            ? parsed.response.title
            : Array.isArray(parsed.response)
              ? `Data result (${parsed.response.length} items)`
              : 'Data result',
      };
    }

    return {
      kind: 'none' as const,
      text: '',
    };
  } catch {
    return {
      kind: 'none' as const,
      text: '',
    };
  }
}

type WorkflowStreamPayload = {
  event?: WorkflowEventName;
  error?: string;
  label?: string;
  summary?: string;
  prompt_preview?: string;
  type?: 'chain_of_thought' | 'data' | 'insight' | 'explanation' | 'failed';
  response?: unknown;
  data?: AiChatResult;
};

type WorkflowStreamDisplayPayload =
  | { kind: 'none'; text: string }
  | { kind: 'data'; text: string }
  | { kind: 'insight'; text: string }
  | { kind: 'explanation'; text: string }
  | { kind: 'raw'; text: string };

type SelectedStreamTable = {
  title: string;
  columns: string[];
  rows: Array<Record<string, string>>;
};

type SelectedStreamChart = {
  title: string;
  labels: string[];
  values: number[];
  valueLabel: string;
};

type DashboardVisualizationBlock = {
  id: string;
  title: string;
  chartType: 'table' | 'bar' | 'line' | 'pie' | 'stacked_bar';
  table: SelectedStreamTable | null;
  chart: SelectedStreamChart | null;
};

type DashboardPinTarget = {
  dashboard_id: string;
  dashboard_key: string;
  dashboard_title: string;
  menu_id: string;
  menu_key: string;
  menu_title: string;
  route_path: string;
};

const DEFAULT_DASHBOARD_PIN_TARGETS: DashboardPinTarget[] = [
  {
    dashboard_id: '0',
    dashboard_key: 'warehouse-operations',
    dashboard_title: 'Warehouse Operations',
    menu_id: '',
    menu_key: 'logistic-dashboard-warehouse',
    menu_title: 'Custom Dashboard 1',
    route_path: '/app/dashboard/custom-db-1',
  },
];

function extractAiResultFromWorkflowPayload(payload: string): AiChatResult | null {
  try {
    const parsed = JSON.parse(payload) as WorkflowStreamPayload;
    if (!parsed.data || typeof parsed.data !== 'object') {
      return null;
    }

    const candidate = parsed.data as Partial<AiChatResult>;
    if (
      typeof candidate.answer === 'string' &&
      typeof candidate.model === 'string' &&
      typeof candidate.provider === 'string'
    ) {
      return candidate as AiChatResult;
    }

    return null;
  } catch {
    return null;
  }
}

function parseStreamDataTable(payload: string): SelectedStreamTable | null {
  try {
    const parsed = JSON.parse(payload) as { response?: unknown; data?: unknown };
    const source = parsed.response ?? parsed.data;

    if (Array.isArray(source)) {
      const isQueryExecutionArray =
        source.length > 0 &&
        source.every(
          (item) =>
            !!item &&
            typeof item === 'object' &&
            'query_id' in item &&
            'sql' in item &&
            'rows' in item,
        );

      if (isQueryExecutionArray) {
        return null;
      }

      const normalizedRows = source.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object');
      const columns = Array.from(
        new Set(normalizedRows.flatMap((row) => Object.keys(row))),
      );

      return {
        title: `Data result (${normalizedRows.length} items)`,
        columns,
        rows: normalizedRows.map((row) =>
          Object.fromEntries(columns.map((column) => [column, String(row[column] ?? '-')]))
        ),
      };
    }

    if (source && typeof source === 'object') {
      const record = source as Record<string, unknown>;

      if (Array.isArray(record.query_results) && Array.isArray(record.visualizations)) {
        return null;
      }

      if (Array.isArray(record.rows)) {
        const normalizedRows = record.rows.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object');
        const columns =
          Array.isArray(record.columns) && record.columns.length > 0
            ? record.columns.map((column) =>
                typeof column === 'string'
                  ? column
                  : column && typeof column === 'object' && 'name' in column
                    ? String(column.name)
                    : String(column),
              )
            : Array.from(new Set(normalizedRows.flatMap((row) => Object.keys(row))));

        return {
          title: typeof record.title === 'string' ? record.title : `Data result (${normalizedRows.length} rows)`,
          columns,
          rows: normalizedRows.map((row) =>
            Object.fromEntries(columns.map((column) => [column, String(row[column] ?? '-')]))
          ),
        };
      }

      const columns = Object.keys(record);
      return {
        title: typeof record.title === 'string' ? record.title : 'Data result',
        columns,
        rows: [
          Object.fromEntries(columns.map((column) => [column, String(record[column] ?? '-')])),
        ],
      };
    }

    return null;
  } catch {
    return null;
  }
}

function parseStreamDataChart(payload: string): SelectedStreamChart | null {
  const table = parseStreamDataTable(payload);
  if (!table || table.rows.length === 0 || table.columns.length === 0) {
    return null;
  }

  const numericColumns = table.columns.filter((column) =>
    table.rows.some((row) => Number.isFinite(Number(row[column]))),
  );

  if (numericColumns.length === 0) {
    return null;
  }

  const valueColumn = [...numericColumns].sort(
    (left, right) => scoreNumericChartColumn(right) - scoreNumericChartColumn(left),
  )[0];
  const labelCandidates = table.columns.filter((column) => column !== valueColumn);
  const labelColumn =
    [...labelCandidates].sort(
      (left, right) => scoreLabelChartColumn(right) - scoreLabelChartColumn(left),
    )[0] ?? null;

  const rows = table.rows
    .map((row, index) => ({
      label: labelColumn ? row[labelColumn] : `Row ${index + 1}`,
      value: Number(row[valueColumn]),
    }))
    .filter((item) => Number.isFinite(item.value))
    .slice(0, 8);

  if (rows.length === 0) {
    return null;
  }

  const hasMeaningfulNumericColumn = scoreNumericChartColumn(valueColumn) > 0;
  const hasNonZeroValue = rows.some((row) => row.value !== 0);
  const uniqueValues = new Set(rows.map((row) => row.value));

  if (!hasMeaningfulNumericColumn || !hasNonZeroValue || uniqueValues.size <= 1) {
    return buildFallbackCountChart(table);
  }

  const chartTitle = appendYearRangeToTitle(
    table.title,
    rows.flatMap((row) => [row.label]),
  );

  return {
    title: chartTitle,
    labels: rows.map((row) => row.label),
    values: rows.map((row) => row.value),
    valueLabel: formatColumnLabel(valueColumn),
  };
}

function buildFallbackCountChart(table: SelectedStreamTable): SelectedStreamChart | null {
  const dateColumn =
    table.columns.find((column) => /tanggal|date/i.test(column)) ?? null;
  if (dateColumn) {
    const counts = new Map<string, number>();
    table.rows.forEach((row) => {
      const label = row[dateColumn]?.trim();
      if (!label) {
        return;
      }
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });

    if (counts.size > 1) {
      const entries = Array.from(counts.entries())
        .sort((left, right) => left[0].localeCompare(right[0]))
        .slice(0, 8);
      const baseTitle = `${table.title} by ${formatColumnLabel(dateColumn)}`;

      return {
        title: appendYearRangeToTitle(
          baseTitle,
          entries.map(([label]) => label),
        ),
        labels: entries.map(([label]) => label),
        values: entries.map(([, value]) => value),
        valueLabel: 'Count',
      };
    }
  }

  const statusColumn =
    table.columns.find((column) => /status/i.test(column)) ?? null;
  if (statusColumn) {
    const counts = new Map<string, number>();
    table.rows.forEach((row) => {
      const label = row[statusColumn]?.trim();
      if (!label) {
        return;
      }
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });

    if (counts.size > 0) {
      const entries = Array.from(counts.entries()).slice(0, 8);
      return {
        title: appendYearRangeToTitle(
          `${table.title} by ${formatColumnLabel(statusColumn)}`,
          table.rows.flatMap((row) => Object.values(row)),
        ),
        labels: entries.map(([label]) => label),
        values: entries.map(([, value]) => value),
        valueLabel: 'Count',
      };
    }
  }

  return null;
}

function formatTableCellValue(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return value;
  }

  const numericValue = Number(normalized);
  if (!Number.isFinite(numericValue)) {
    return value;
  }

  const hasDecimal = normalized.includes('.');
  const fractionDigits = hasDecimal
    ? Math.min(2, (normalized.split('.')[1] || '').replace(/0+$/, '').length || 0)
    : 0;

  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

function appendYearRangeToTitle(title: string, values: Array<string | number>) {
  const years = Array.from(
    new Set(
      values
        .flatMap((value) => String(value).match(/\b(19|20)\d{2}\b/g) ?? [])
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
        .sort((left, right) => left - right),
    ),
  );

  if (years.length === 0) {
    return title;
  }

  const yearLabel =
    years.length === 1 ? String(years[0]) : `${years[0]}-${years[years.length - 1]}`;

  return `${title} · ${yearLabel}`;
}

function formatCompactNumber(value: number) {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '')}t`;
  }
  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}b`;
  }
  if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  }
  if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }

  return formatTableCellValue(String(value));
}

function getChartLabelInitials(label: string) {
  const parts = label
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return 'NA';
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
}

function formatColumnLabel(value: string) {
  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function isNumericLikeValue(value: unknown) {
  if (value == null) {
    return false;
  }

  const normalized = String(value).trim().replaceAll(',', '');
  if (!normalized) {
    return false;
  }

  return Number.isFinite(Number(normalized));
}

function isRightAlignedColumn(column: string, rows: Array<Record<string, string>>) {
  const normalized = column.toLowerCase();

  if (
    normalized.includes('total') ||
    normalized.includes('amount') ||
    normalized.includes('nominal') ||
    normalized.includes('saldo') ||
    normalized.includes('piutang') ||
    normalized.includes('harga') ||
    normalized.includes('revenue') ||
    normalized.includes('qty') ||
    normalized.includes('quantity') ||
    normalized.includes('count') ||
    normalized.includes('bulan') ||
    normalized.includes('month') ||
    normalized.includes('year')
  ) {
    return true;
  }

  const populatedValues = rows
    .map((row) => row[column])
    .filter((value) => String(value ?? '').trim().length > 0);

  if (populatedValues.length === 0) {
    return false;
  }

  return populatedValues.every((value) => isNumericLikeValue(value));
}

function isCodeLikeText(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return false;
  }

  return (
    normalized.startsWith('{') ||
    normalized.startsWith('[') ||
    /\bselect\b|\bfrom\b|\bwhere\b|\bjoin\b|\border by\b/i.test(normalized) ||
    normalized.includes('=>') ||
    normalized.includes('parsed.') ||
    normalized.includes('query')
  );
}

function renderInlineMarkdown(value: string) {
  const parts = value.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-slate-900 dark:text-slate-100">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function renderRichTextMarkdown(value: string) {
  const normalizedValue = value
    .replace(/(#{1,6}[^\n]*?)\s+(?=\d+\.\s)/g, '$1\n')
    .replace(/([^\n])\s+(?=\d+\.\s)/g, '$1\n');
  const lines = normalizedValue.split('\n');
  const blocks: ReactNode[] = [];
  let paragraphBuffer: string[] = [];
  let currentList:
    | { type: 'unordered'; items: Array<{ text: string; level: number }> }
    | { type: 'ordered'; items: Array<{ text: string; level: number; number: number }> }
    | null = null;

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) {
      return;
    }

    blocks.push(
      <p key={`paragraph-${blocks.length}`} className="whitespace-pre-wrap text-[13px] leading-6 text-slate-700 dark:text-slate-200">
        {renderInlineMarkdown(paragraphBuffer.join(' ').trim())}
      </p>,
    );
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (!currentList || currentList.items.length === 0) {
      return;
    }

    if (currentList.type === 'unordered') {
      blocks.push(
        <ul key={`list-${blocks.length}`} className="space-y-2">
          {currentList.items.map((item, index) => (
            <li
              key={`list-item-${index}`}
              className="flex items-start gap-3 text-[13px] leading-6 text-slate-700 dark:text-slate-200"
              style={{ paddingLeft: `${item.level * 16}px` }}
            >
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
              <span className="min-w-0">{renderInlineMarkdown(item.text)}</span>
            </li>
          ))}
        </ul>,
      );
    } else {
      blocks.push(
        <ol key={`list-${blocks.length}`} className="space-y-2">
          {currentList.items.map((item, index) => (
            <li
              key={`list-item-${index}`}
              className="flex items-start gap-3 text-[13px] leading-6 text-slate-700 dark:text-slate-200"
              style={{ paddingLeft: `${item.level * 16}px` }}
            >
              <span className="min-w-[1.5rem] shrink-0 text-right font-semibold text-slate-500 dark:text-slate-400">
                {item.number}.
              </span>
              <span className="min-w-0">{renderInlineMarkdown(item.text)}</span>
            </li>
          ))}
        </ol>,
      );
    }

    currentList = null;
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    const bulletMatch = line.match(/^(\s*)-\s+(.*)$/);
    const orderedMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      const headingText = headingMatch[2]?.trim() ?? '';

      blocks.push(
        <div
          key={`heading-${blocks.length}`}
          className={
            level >= 3
              ? 'pt-1 text-[15px] font-semibold leading-6 text-slate-800 dark:text-slate-100'
              : 'pt-1 text-base font-semibold leading-6 text-slate-900 dark:text-slate-50'
          }
        >
          {renderInlineMarkdown(headingText)}
        </div>,
      );
      return;
    }

    if (bulletMatch) {
      flushParagraph();
      const level = Math.floor((bulletMatch[1]?.length ?? 0) / 2);

      if (!currentList || currentList.type !== 'unordered') {
        flushList();
        currentList = { type: 'unordered', items: [] };
      }

      currentList.items.push({
        level,
        text: bulletMatch[2]?.trim() ?? '',
      });
      return;
    }

    if (orderedMatch) {
      flushParagraph();
      const level = Math.floor((orderedMatch[1]?.length ?? 0) / 2);

      if (!currentList || currentList.type !== 'ordered') {
        flushList();
        currentList = { type: 'ordered', items: [] };
      }

      currentList.items.push({
        level,
        number: Number(orderedMatch[2]),
        text: orderedMatch[3]?.trim() ?? '',
      });
      return;
    }

    flushList();
    paragraphBuffer.push(trimmed);
  });

  flushParagraph();
  flushList();

  return <div className="space-y-3">{blocks}</div>;
}

async function copyTextToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fallback below for non-secure origins or denied clipboard permissions.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

function buildTableFromQueryResult(
  queryResult: NonNullable<AiChatResult['query_result']> | NonNullable<NonNullable<AiChatResult['query_results']>[number]>,
  title: string,
): SelectedStreamTable | null {
  const columns = (queryResult.columns ?? []).map((column) => column.name);
  const rows = (queryResult.rows ?? []).map((row) =>
    Object.fromEntries(columns.map((column) => [column, String(row[column] ?? '-')]))
  );

  if (!columns.length || !rows.length) {
    return null;
  }

  return {
    title,
    columns,
    rows,
  };
}

function buildChartFromQueryResult(
  queryResult: NonNullable<AiChatResult['query_result']> | NonNullable<NonNullable<AiChatResult['query_results']>[number]>,
  title: string,
): SelectedStreamChart | null {
  const payload = JSON.stringify({
    response: {
      title,
      columns: queryResult.columns,
      rows: queryResult.rows,
    },
  });
  const chart = parseStreamDataChart(payload);
  if (!chart) {
    return null;
  }
  return {
    ...chart,
    title,
  };
}

function buildDashboardVisualizationBlocks(result: AiChatResult | null): DashboardVisualizationBlock[] {
  if (!result?.query_results?.length || !result.visualizations?.length) {
    return [];
  }

  const resultsById = new Map(result.query_results.map((item) => [item.query_id, item]));

  return result.visualizations.flatMap((visualization) => {
    const queryResult = resultsById.get(visualization.query_id);
    if (!queryResult?.success) {
      return [];
    }

    const table = buildTableFromQueryResult(queryResult, visualization.title);
    const chart = buildChartFromQueryResult(queryResult, visualization.title);

    return [
      {
        id: visualization.id,
        title: visualization.title,
        chartType: visualization.chart_type,
        table,
        chart,
      },
    ];
  });
}

function scoreNumericChartColumn(column: string) {
  const normalized = column.toLowerCase();
  let score = 0;

  if (normalized.includes('total')) score += 8;
  if (normalized.includes('amount')) score += 7;
  if (normalized.includes('value')) score += 7;
  if (normalized.includes('nominal')) score += 7;
  if (normalized.includes('piutang')) score += 9;
  if (normalized.includes('saldo')) score += 8;
  if (normalized.includes('qty')) score += 5;
  if (normalized.includes('count')) score += 4;
  if (normalized.includes('customer_id')) score -= 10;
  if (normalized.endsWith('_id')) score -= 8;
  if (normalized === 'id') score -= 10;

  return score;
}

function scoreLabelChartColumn(column: string) {
  const normalized = column.toLowerCase();
  let score = 0;

  if (normalized.includes('name')) score += 8;
  if (normalized.includes('customer')) score += 7;
  if (normalized.includes('code')) score += 5;
  if (normalized.includes('label')) score += 6;
  if (normalized.includes('title')) score += 6;
  if (normalized.endsWith('_id')) score -= 8;
  if (normalized === 'id') score -= 10;

  return score;
}

function limitChartEntries(labels: string[], values: number[], maxItems = 5) {
  const entries = labels
    .map((label, index) => ({
      label,
      value: values[index] ?? 0,
    }))
    .filter((entry) => Number.isFinite(entry.value))
    .sort((left, right) => right.value - left.value);

  const primaryEntries = entries.slice(0, maxItems);
  const remainingEntries = entries.slice(maxItems);

  if (remainingEntries.length === 0) {
    return primaryEntries;
  }

  return [
    ...primaryEntries,
    {
      label: 'Others',
      value: remainingEntries.reduce((sum, entry) => sum + entry.value, 0),
    },
  ];
}

export default function ManagerDashboardPage() {
  const params = useParams<{ sessionId?: string }>();
  const routeSessionId =
    params && typeof params.sessionId === 'string' && params.sessionId.trim().length > 0
      ? params.sessionId
      : null;
  const [activeSessionRouteId, setActiveSessionRouteId] = useState<string | null>(routeSessionId);
  const [resultView, setResultView] = useState<ResultViewKey>('chart');
  const [prompt, setPrompt] = useState<string>('');
  const [attachments, setAttachments] = useState<PromptAttachment[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<PromptAttachmentFile[]>([]);
  const [submittedAttachments, setSubmittedAttachments] = useState<PromptAttachment[]>([]);
  const [isPreparingAttachments, setIsPreparingAttachments] = useState(false);
  const [isDraggingAttachment, setIsDraggingAttachment] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'senti-1.0'>('senti-1.0');
  const [submittedPrompt, setSubmittedPrompt] = useState<string>('');
  const [submittedAt, setSubmittedAt] = useState<string>('Belum dijalankan');
  const [runHistory, setRunHistory] = useState<RunHistoryItem[]>([]);
  const [isRunningAi, setIsRunningAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AiChatResult | null>(null);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [workflowStreamEntries, setWorkflowStreamEntries] = useState<WorkflowStreamEntry[]>([]);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [copiedQueryIndex, setCopiedQueryIndex] = useState<number | null>(null);
  const [copiedPromptEntryId, setCopiedPromptEntryId] = useState<string | null>(null);
  const [selectedStreamTable, setSelectedStreamTable] = useState<SelectedStreamTable | null>(null);
  const [selectedStreamChart, setSelectedStreamChart] = useState<SelectedStreamChart | null>(null);
  const [selectedDashboardBlockId, setSelectedDashboardBlockId] = useState<string | null>(null);
  const [activeStreamDataEntryId, setActiveStreamDataEntryId] = useState<string | null>(null);
  const [expandedPrompts, setExpandedPrompts] = useState<Record<string, boolean>>({});
  const [currentSessionKey, setCurrentSessionKey] = useState<string | null>(null);
  const [historySessions, setHistorySessions] = useState<HistorySessionItem[]>([]);
  const [selectedHistorySessionId, setSelectedHistorySessionId] = useState<string | null>(null);
  const [isHistorySessionsLoading, setIsHistorySessionsLoading] = useState(false);
  const [isSessionSidebarExpanded, setIsSessionSidebarExpanded] = useState(true);
  const [isSessionSearchOpen, setIsSessionSearchOpen] = useState(false);
  const [sessionSearchQuery, setSessionSearchQuery] = useState('');
  const [isRestoringSession, setIsRestoringSession] = useState(false);
  const [deletingHistorySessionId, setDeletingHistorySessionId] = useState<string | null>(null);
  const [historySessionPendingDelete, setHistorySessionPendingDelete] = useState<HistorySessionItem | null>(null);
  const [historySessionPendingRename, setHistorySessionPendingRename] = useState<HistorySessionItem | null>(null);
  const [historySessionRenameTitle, setHistorySessionRenameTitle] = useState('');
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [pinTargets, setPinTargets] = useState<DashboardPinTarget[]>([]);
  const [selectedPinTargetKey, setSelectedPinTargetKey] = useState('');
  const [isPinTargetsLoading, setIsPinTargetsLoading] = useState(false);
  const [isPinningWidget, setIsPinningWidget] = useState(false);
  const [pinDialogError, setPinDialogError] = useState<string | null>(null);
  const [pinDialogSuccess, setPinDialogSuccess] = useState<string | null>(null);
  const [pinWidgetTitle, setPinWidgetTitle] = useState('');
  const [pinWidgetSpan, setPinWidgetSpan] = useState('lg:col-span-6');
  const [pinTargetTitle, setPinTargetTitle] = useState('');
  const [sessionSidebarViewportHeight, setSessionSidebarViewportHeight] = useState(0);
  const [sessionSidebarScrollTop, setSessionSidebarScrollTop] = useState(0);

  const navigateToSession = (sessionId: string | null) => {
    const nextPath = sessionId ? `/app/senti-ai/${sessionId}` : '/app/senti-ai';
    setActiveSessionRouteId(sessionId);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({ sessionId }, '', nextPath);
    }
  };
  const [isRenamingHistorySession, setIsRenamingHistorySession] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [splitLayoutWidth, setSplitLayoutWidth] = useState(0);
  const [isResizingPanels, setIsResizingPanels] = useState(false);
  const [showLeftPanelBottomButton, setShowLeftPanelBottomButton] = useState(false);
  const promptTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const leftPanelScrollRef = useRef<HTMLDivElement | null>(null);
  const splitLayoutRef = useRef<HTMLDivElement | null>(null);
  const splitHandleRef = useRef<HTMLDivElement | null>(null);
  const sessionSearchInputRef = useRef<HTMLInputElement | null>(null);
  const sessionSidebarScrollRef = useRef<HTMLDivElement | null>(null);
  const runHistoryPersistTimeoutRef = useRef<number | null>(null);
  const activeRequestIdRef = useRef<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const requestAbortControllerRef = useRef<AbortController | null>(null);
  const workflowStreamEntriesRef = useRef<WorkflowStreamEntry[]>([]);
  const selectedStreamTableRef = useRef<SelectedStreamTable | null>(null);
  const selectedStreamChartRef = useRef<SelectedStreamChart | null>(null);
  const activePromptDraftRef = useRef('');
  const attachmentsRef = useRef<PromptAttachment[]>([]);
  const skipNextRouteSessionRestoreRef = useRef(false);
  const hasSubmittedPrompt = submittedAt !== 'Belum dijalankan' && submittedPrompt.trim().length > 0;
  const isWelcomeState = workflowStreamEntries.length === 0 && !isRunningAi;
  const queryResultColumns = useMemo(() => aiResult?.query_result?.columns ?? [], [aiResult]);
  const queryResultRows = useMemo(() => aiResult?.query_result?.rows ?? [], [aiResult]);
  const dashboardVisualizationBlocks = useMemo(
    () => buildDashboardVisualizationBlocks(aiResult ?? null),
    [aiResult],
  );
  const isAttachmentAnswer = aiResult?.workflow_mode === 'attachment' || aiResult?.data_source === 'attachment_context';
  const activeDashboardBlock = useMemo(
    () =>
      dashboardVisualizationBlocks.find((item) => item.id === selectedDashboardBlockId) ??
      dashboardVisualizationBlocks[0] ??
      null,
    [dashboardVisualizationBlocks, selectedDashboardBlockId],
  );
  const previewStreamTable = activeDashboardBlock?.table ?? selectedStreamTable;
  const previewStreamChart = activeDashboardBlock?.chart ?? selectedStreamChart;
  const activePinQueryResult = useMemo(() => {
    if (aiResult?.query_results?.length && activeDashboardBlock?.id) {
      const visualization = aiResult.visualizations?.find((item) => item.id === activeDashboardBlock.id);
      if (!visualization) {
        return null;
      }
      return aiResult.query_results.find((item) => item.query_id === visualization.query_id && item.success) ?? null;
    }
    if (aiResult?.query_result?.sql && previewStreamTable) {
      return {
        query_id: 'primary',
        sql: aiResult.query_result.sql,
        success: true,
        error_message: null,
        row_count: aiResult.query_result.row_count,
        columns: aiResult.query_result.columns,
        rows: aiResult.query_result.rows,
      };
    }
    return null;
  }, [activeDashboardBlock?.id, aiResult, previewStreamTable]);
  const activePinWidgetTitle =
    activeDashboardBlock?.title ??
    previewStreamChart?.title ??
    previewStreamTable?.title ??
    'Pinned Widget';
  const canPinActiveWidget = Boolean(activePinQueryResult?.sql && (previewStreamChart || previewStreamTable));
  const normalizedQueryResultRows = useMemo(
    () =>
      queryResultRows.map((row) =>
        Object.fromEntries(
          queryResultColumns.map((column) => [column.name, String(row[column.name] ?? '')]),
        ) as Record<string, string>,
      ),
    [queryResultColumns, queryResultRows],
  );
  const selectedTableRightAlignedColumns = useMemo(
    () =>
      new Set(
        (previewStreamTable?.columns ?? []).filter((column) =>
          isRightAlignedColumn(column, previewStreamTable?.rows ?? []),
        ),
      ),
    [previewStreamTable],
  );
  const queryResultRightAlignedColumns = useMemo(
    () =>
      new Set(
        queryResultColumns
          .map((column) => column.name)
          .filter((column) => isRightAlignedColumn(column, normalizedQueryResultRows)),
      ),
    [normalizedQueryResultRows, queryResultColumns],
  );
  const limitedChartEntries = useMemo(
    () =>
      previewStreamChart
        ? limitChartEntries(previewStreamChart.labels, previewStreamChart.values, 5)
        : [],
    [previewStreamChart],
  );

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    workflowStreamEntriesRef.current = workflowStreamEntries;
  }, [workflowStreamEntries]);

  useEffect(() => {
    selectedStreamTableRef.current = selectedStreamTable;
  }, [selectedStreamTable]);

  useEffect(() => {
    selectedStreamChartRef.current = selectedStreamChart;
  }, [selectedStreamChart]);
  useEffect(() => {
    let cancelled = false;

    async function loadPinTargets() {
      setIsPinTargetsLoading(true);
      setPinDialogError(null);
      try {
        const response = await fetch('/api/dashboard/custom-db/pin-targets', { cache: 'no-store' });
        const payload = await response.json().catch(() => null);
        const targets =
          response.ok && payload?.success && Array.isArray(payload.data) && payload.data.length > 0
            ? (payload.data as DashboardPinTarget[])
            : DEFAULT_DASHBOARD_PIN_TARGETS;
        if (cancelled) {
          return;
        }
        setPinTargets(targets);
        setSelectedPinTargetKey((current) => current || targets[0]?.dashboard_key || '');
        setPinTargetTitle(targets[0]?.menu_title || targets[0]?.dashboard_title || '');
      } catch (error) {
        if (!cancelled) {
          setPinTargets(DEFAULT_DASHBOARD_PIN_TARGETS);
          setSelectedPinTargetKey((current) => current || DEFAULT_DASHBOARD_PIN_TARGETS[0]?.dashboard_key || '');
          setPinTargetTitle(
            DEFAULT_DASHBOARD_PIN_TARGETS[0]?.menu_title ||
              DEFAULT_DASHBOARD_PIN_TARGETS[0]?.dashboard_title ||
              '',
          );
          setPinDialogError(error instanceof Error ? error.message : 'Gagal memuat target dashboard.');
        }
      } finally {
        if (!cancelled) {
          setIsPinTargetsLoading(false);
        }
      }
    }

    void loadPinTargets();

    return () => {
      cancelled = true;
    };
  }, []);
  const managerChartData = useMemo(
    () =>
      previewStreamChart
        ? limitedChartEntries.map((entry) => ({
            date: entry.label.slice(0, 10),
            value: entry.value,
          }))
        : [],
    [limitedChartEntries, previewStreamChart],
  );
  const managerChartSeries = useMemo(
    () =>
      previewStreamChart
        ? [{ key: 'value', label: previewStreamChart.valueLabel, color: '#4f86f7' }]
        : [],
    [previewStreamChart],
  );
  const managerChartStatusItems = useMemo(
    () =>
      previewStreamChart
        ? limitedChartEntries.map((entry, index) => ({
            key: `${entry.label}-${index}`,
            label: entry.label.slice(0, 14),
            value: Math.max(0, Math.round(entry.value)),
            color: ['#4f86f7', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'][index % 8],
          }))
        : [],
    [limitedChartEntries, previewStreamChart],
  );
  const managerTopRows = useMemo(
    () =>
      previewStreamChart
        ? limitedChartEntries.map((entry, index) => ({
            initials: getChartLabelInitials(entry.label),
            name: entry.label,
            code: `${entry.label}-${index}`,
            amount: formatCompactNumber(entry.value),
          }))
        : [],
    [limitedChartEntries, previewStreamChart],
  );
  const hasChartPanel = Boolean(previewStreamChart || previewStreamTable);
  const rightPanelCollapseThresholdPercent = useMemo(() => {
    if (!hasChartPanel || splitLayoutWidth <= MIN_RIGHT_PANEL_WIDTH_PX) {
      return MAX_PANEL_WIDTH_PERCENT;
    }

    const threshold =
      ((splitLayoutWidth - MIN_RIGHT_PANEL_WIDTH_PX) / splitLayoutWidth) * 100;

    return Math.min(
      MAX_PANEL_WIDTH_PERCENT,
      Math.max(MIN_PANEL_WIDTH_PERCENT, threshold),
    );
  }, [hasChartPanel, splitLayoutWidth]);
  const isRightPanelCollapsed =
    hasChartPanel && leftPanelWidth >= rightPanelCollapseThresholdPercent;
  const normalizedSessionSearchQuery = sessionSearchQuery.trim().toLowerCase();
  const filteredHistorySessions = useMemo(
    () => {
      if (!normalizedSessionSearchQuery) {
        return historySessions;
      }

      const matchedSessionKeysFromPrompts = new Set(
        runHistory
          .filter((item) => item.prompt.toLowerCase().includes(normalizedSessionSearchQuery))
          .map((item) => item.sessionKey)
          .filter((value): value is string => Boolean(value)),
      );

      return historySessions.filter((session) => {
        const matchesTitle = (session.title || session.session_key)
          .toLowerCase()
          .includes(normalizedSessionSearchQuery);
        const matchesMetadata = [
          session.session_key,
          session.status,
          session.mode,
          session.username ?? '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSessionSearchQuery);
        const matchesPrompt = matchedSessionKeysFromPrompts.has(session.session_key);
        return matchesTitle || matchesMetadata || matchesPrompt;
      });
    },
    [historySessions, normalizedSessionSearchQuery, runHistory],
  );
  const sessionSidebarVisibleRange = useMemo(() => {
    if (filteredHistorySessions.length === 0) {
      return {
        topSpacerHeight: 0,
        bottomSpacerHeight: 0,
        items: [] as HistorySessionItem[],
      };
    }

    const viewportHeight = Math.max(sessionSidebarViewportHeight, SESSION_SIDEBAR_ROW_HEIGHT * 6);
    const visibleCount = Math.ceil(viewportHeight / SESSION_SIDEBAR_ROW_HEIGHT);
    const startIndex = Math.max(
      0,
      Math.floor(sessionSidebarScrollTop / SESSION_SIDEBAR_ROW_HEIGHT) - SESSION_SIDEBAR_OVERSCAN,
    );
    const endIndex = Math.min(
      filteredHistorySessions.length,
      startIndex + visibleCount + SESSION_SIDEBAR_OVERSCAN * 2,
    );

    return {
      topSpacerHeight: startIndex * SESSION_SIDEBAR_ROW_HEIGHT,
      bottomSpacerHeight:
        Math.max(0, filteredHistorySessions.length - endIndex) * SESSION_SIDEBAR_ROW_HEIGHT,
      items: filteredHistorySessions.slice(startIndex, endIndex),
    };
  }, [filteredHistorySessions, sessionSidebarScrollTop, sessionSidebarViewportHeight]);
  const activeHistorySession = useMemo(
    () =>
      historySessions.find((item) => item.id === activeSessionRouteId) ??
      historySessions.find((item) => item.id === selectedHistorySessionId) ??
      historySessions.find((item) => item.session_key === currentSessionKey) ??
      null,
    [activeSessionRouteId, currentSessionKey, historySessions, selectedHistorySessionId],
  );
  const leftPanelDesktopWidth = hasChartPanel
    ? `${leftPanelWidth}%`
    : '100%';
  const restoreRightPanelWidth = useCallback(() => {
    setLeftPanelWidth((current) =>
      current >= rightPanelCollapseThresholdPercent ? 58 : current,
    );
  }, [rightPanelCollapseThresholdPercent]);

  useEffect(() => {
    const container = sessionSidebarScrollRef.current;
    if (!container) {
      return;
    }

    const syncViewport = () => {
      setSessionSidebarViewportHeight(container.clientHeight);
      setSessionSidebarScrollTop(container.scrollTop);
    };

    syncViewport();

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(syncViewport);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [filteredHistorySessions.length, isSessionSidebarExpanded]);

  const clampPanelWidth = (value: number) => {
    if (value >= rightPanelCollapseThresholdPercent) {
      return MAX_PANEL_WIDTH_PERCENT;
    }

    return Math.min(
      MAX_PANEL_WIDTH_PERCENT,
      Math.max(MIN_PANEL_WIDTH_PERCENT, value),
    );
  };

  const startPanelResize = (
    event:
      | React.PointerEvent<HTMLDivElement>
      | React.MouseEvent<HTMLDivElement>,
  ) => {
    if (window.innerWidth < 1024 || !hasChartPanel) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if ('pointerId' in event) {
      splitHandleRef.current?.setPointerCapture?.(event.pointerId);
    }

    setIsResizingPanels(true);
  };

  const scrollLeftPanelToBottom = () => {
    const container = leftPanelScrollRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  };

  const syncLeftPanelBottomButton = () => {
    const container = leftPanelScrollRef.current;
    if (!container) {
      setShowLeftPanelBottomButton(false);
      return;
    }

    setShowLeftPanelBottomButton(container.scrollHeight - container.clientHeight > 24);
  };

  const cancelActiveRequest = () => {
    requestAbortControllerRef.current?.abort();
    requestAbortControllerRef.current = null;
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    activeRequestIdRef.current = null;
    setPrompt(activePromptDraftRef.current);
    setCurrentRequestId(null);
    setIsRunningAi(false);
    setWorkflowSteps(buildWorkflowSteps(0));
    setWorkflowStreamEntries((current) => [
      ...current,
      createWorkflowStreamEntry(
        'cancelled',
        JSON.stringify(
          {
            type: 'explanation',
            response: 'Request dibatalkan oleh user. Anda bisa mengirim prompt baru sekarang.',
          },
          null,
          2,
        ),
      ),
    ]);
    window.requestAnimationFrame(() => {
      promptTextareaRef.current?.focus();
      const length = activePromptDraftRef.current.length;
      promptTextareaRef.current?.setSelectionRange(length, length);
    });
  };

  const openPinDialog = () => {
    setPinDialogError(null);
    setPinDialogSuccess(null);
    setPinWidgetTitle(activePinWidgetTitle);
    setPinWidgetSpan('lg:col-span-6');
    const matchedTarget = pinTargets.find((item) => item.dashboard_key === selectedPinTargetKey) ?? pinTargets[0];
    setPinTargetTitle(matchedTarget?.menu_title || matchedTarget?.dashboard_title || '');
    setIsPinDialogOpen(true);
  };

  const handlePinActiveWidget = async () => {
    if (!activePinQueryResult?.sql || !selectedPinTargetKey || !pinWidgetTitle.trim()) {
      setPinDialogError('Widget aktif belum punya query SQL yang bisa di-pin.');
      return;
    }

    setIsPinningWidget(true);
    setPinDialogError(null);
    setPinDialogSuccess(null);

    try {
      const matchedTargetBeforePin = pinTargets.find((item) => item.dashboard_key === selectedPinTargetKey);
      const existingTargetTitle = matchedTargetBeforePin?.dashboard_title || matchedTargetBeforePin?.menu_title || '';

      if (pinTargetTitle.trim() && pinTargetTitle.trim() !== existingTargetTitle) {
        const renameResponse = await fetch(`/api/dashboard/custom-db/${selectedPinTargetKey}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: pinTargetTitle.trim(),
          }),
        });
        const renamePayload = await renameResponse.json().catch(() => null);
        if (!renameResponse.ok || !renamePayload?.success) {
          throw new Error(renamePayload?.message || 'Gagal rename dashboard target.');
        }
      }

      const response = await fetch('/api/dashboard/custom-db/pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dashboardKey: selectedPinTargetKey,
          title: pinWidgetTitle.trim(),
          description: `Pinned from Senti AI session${submittedPrompt ? `: ${formatPromptPreview(submittedPrompt, 96)}` : ''}`,
          widgetKind: resultView === 'chart' && previewStreamChart ? 'chart' : 'table',
          chartType:
            resultView === 'chart' &&
            activeDashboardBlock &&
            activeDashboardBlock.chartType !== 'table'
              ? activeDashboardBlock.chartType
              : null,
          spanClassName: pinWidgetSpan,
          sqlTemplate: activePinQueryResult.sql,
          outputColumns: activePinQueryResult.columns?.map((column) => column.name) ?? previewStreamTable?.columns ?? [],
          queryLabel: `${pinWidgetTitle.trim()} Query`,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Gagal pin widget ke dashboard.');
      }

      const matchedTarget = pinTargets.find((item) => item.dashboard_key === selectedPinTargetKey);
      if (pinTargetTitle.trim()) {
        setPinTargets((current) =>
          current.map((item) =>
            item.dashboard_key === selectedPinTargetKey
              ? {
                  ...item,
                  dashboard_title: pinTargetTitle.trim(),
                  menu_title: item.menu_title || pinTargetTitle.trim(),
                }
              : item,
          ),
        );
      }
      setPinDialogSuccess(
        matchedTarget?.route_path
          ? `Widget berhasil di-pin ke ${pinTargetTitle.trim() || matchedTarget.menu_title || matchedTarget.dashboard_title}.`
          : 'Widget berhasil di-pin ke dashboard.',
      );
    } catch (error) {
      setPinDialogError(error instanceof Error ? error.message : 'Gagal pin widget ke dashboard.');
    } finally {
      setIsPinningWidget(false);
    }
  };

  const handleSelectAttachments = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) {
        return;
      }

      setIsPreparingAttachments(true);
      try {
        const selectedFiles = Array.from(fileList).slice(0, 5).map((file) => ({
          id: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `att-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          file,
        }));
        const parsedFiles: PromptAttachment[] = [];
        for (let index = 0; index < selectedFiles.length; index += 1) {
          const entry = selectedFiles[index];
          parsedFiles.push(await parsePromptAttachmentOffMainThread(entry.file, entry.id));

          // Yield between files so large attachment batches do not monopolize the main thread.
          if (index < selectedFiles.length - 1) {
            await new Promise<void>((resolve) => {
              window.setTimeout(resolve, 0);
            });
          }
        }
        const validAttachmentIds = new Set(
          parsedFiles
            .filter((attachment) => attachment.status !== 'failed')
            .map((attachment) => attachment.id),
        );
        setAttachments((current) => {
          const nextMap = new Map(current.map((attachment) => [attachment.name, attachment]));
          parsedFiles.forEach((attachment) => {
            const existing = nextMap.get(attachment.name);
            if (existing && existing.previewUrl && existing.previewUrl !== attachment.previewUrl) {
              revokeAttachmentPreviewUrl(existing);
            }
            nextMap.set(attachment.name, attachment);
          });
          return Array.from(nextMap.values()).sort((left, right) => left.addedAt - right.addedAt);
        });
        setAttachmentFiles((current) => {
          const nextMap = new Map(current.map((entry) => [entry.file.name, entry]));
          selectedFiles.forEach((entry) => {
            if (validAttachmentIds.has(entry.id)) {
              nextMap.set(entry.file.name, entry);
            }
          });
          return Array.from(nextMap.values());
        });
      } finally {
        setIsPreparingAttachments(false);
        if (attachmentInputRef.current) {
          attachmentInputRef.current.value = '';
        }
      }
    },
    [],
  );

  const handlePasteAttachments = useCallback(
    async (items: DataTransferItemList | null) => {
      if (!items || items.length === 0) {
        return false;
      }

      const pastedFiles: File[] = [];
      Array.from(items).forEach((item, index) => {
        if (item.kind !== 'file') {
          return;
        }
        const file = item.getAsFile();
        if (!file) {
          return;
        }
        const fallbackExtension = file.type.startsWith('image/') ? 'png' : 'bin';
        const hasExplicitName = file.name && file.name !== 'image.png';
        const nextFile = hasExplicitName
          ? file
          : new File([file], `pasted-${Date.now()}-${index}.${fallbackExtension}`, {
              type: file.type || 'application/octet-stream',
              lastModified: Date.now(),
            });
        pastedFiles.push(nextFile);
      });

      if (pastedFiles.length === 0) {
        return false;
      }

      const dataTransfer = new DataTransfer();
      pastedFiles.forEach((file) => dataTransfer.items.add(file));
      await handleSelectAttachments(dataTransfer.files);
      return true;
    },
    [handleSelectAttachments],
  );

  const handleDropAttachments = useCallback(
    async (files: FileList | null) => {
      setIsDraggingAttachment(false);
      await handleSelectAttachments(files);
    },
    [handleSelectAttachments],
  );

  const removeAttachment = useCallback((attachmentId: string) => {
    setAttachments((current) => {
      const target = current.find((attachment) => attachment.id === attachmentId);
      if (target) {
        revokeAttachmentPreviewUrl(target);
      }
      return current.filter((attachment) => attachment.id !== attachmentId);
    });
    setAttachmentFiles((current) =>
      current.filter((attachment) => attachment.id !== attachmentId),
    );
  }, []);

  const clearAllAttachments = useCallback(() => {
    setAttachments((current) => {
      current.forEach((attachment) => revokeAttachmentPreviewUrl(attachment));
      return [];
    });
    setAttachmentFiles([]);
  }, []);

  const handleRunAtm = async () => {
    const runTime = new Date().toLocaleTimeString('id-ID', {
      timeZone: APP_TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
    });
    const nextPrompt = prompt;
    const nextAttachments = attachments.filter((attachment) => attachment.status !== 'failed');
    const nextAttachmentFiles = attachmentFiles;
    const attachmentContext = buildAttachmentContext(nextAttachments);
    activePromptDraftRef.current = nextPrompt;
    requestAbortControllerRef.current?.abort();
    requestAbortControllerRef.current = null;
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    activeRequestIdRef.current = null;
    setSubmittedPrompt(prompt);
    setSubmittedAt(runTime);
    setSubmittedAttachments(nextAttachments);
    setPrompt('');
    setAttachments([]);
    setAttachmentFiles([]);
    setAiError(null);
    setAiResult(null);
    setIsRunningAi(true);
    setWorkflowSteps(buildWorkflowSteps(0));
    setCurrentRequestId(null);
    setActiveStreamDataEntryId(null);
    setSelectedStreamTable(null);
    setSelectedStreamChart(null);
    setSelectedDashboardBlockId(null);
    setWorkflowStreamEntries((current) => [
      ...current,
      createUserPromptEntry(
        nextAttachments.length > 0
          ? `${nextPrompt}\n\n[Attachment: ${nextAttachments.map((attachment) => attachment.name).join(', ')}]`
          : nextPrompt,
      ),
    ]);
    const promptDetection = detectMode(prompt);
    const schemaKey = detectSchemaKey(prompt);
    const pinned = runHistory.find((item) => item.prompt === nextPrompt)?.pinned ?? false;
    const abortController = new AbortController();
    requestAbortControllerRef.current = abortController;

    try {
      const sessionKey =
        activeHistorySession?.session_key ??
        currentSessionKey ??
        createManagerSessionKey();
      if (currentSessionKey !== sessionKey) {
        setCurrentSessionKey(sessionKey);
      }
      const endpoint = '/api/ai/chat';
      const response =
        nextAttachmentFiles.length > 0
          ? await fetch(endpoint, {
              method: 'POST',
              signal: abortController.signal,
              body: (() => {
                const formData = new FormData();
                formData.append('question', nextPrompt);
                formData.append('include_schema', 'true');
                formData.append('include_samples', 'false');
                formData.append('execute_read_only_query', 'true');
                formData.append(
                  'response_mode',
                  promptDetection.mode === 'transform' ? 'dashboard' : 'single',
                );
                formData.append('schema_key', schemaKey);
                formData.append('session_key', sessionKey);
                formData.append('channel', 'manager_dashboard');
                formData.append('ui_mode', promptDetection.mode);
                nextAttachmentFiles.forEach((attachment) => {
                  formData.append('files', attachment.file, attachment.file.name);
                });
                return formData;
              })(),
            })
          : await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              signal: abortController.signal,
              body: JSON.stringify({
                question: nextPrompt,
                include_schema: true,
                include_samples: false,
                execute_read_only_query: true,
                response_mode: promptDetection.mode === 'transform' ? 'dashboard' : 'single',
                schema_key: schemaKey,
                attachments: nextAttachments.map((attachment) => ({
                  name: attachment.name,
                  media_type: attachment.type,
                  size_bytes: attachment.size,
                  extension: attachment.extension,
                  extraction_status: attachment.status,
                  content: attachment.content,
                  preview: attachment.preview,
                  warning: attachment.warning,
                  metadata: attachment.metadata,
                })),
                attachment_context: attachmentContext,
                session_key: sessionKey,
                channel: 'manager_dashboard',
                ui_mode: promptDetection.mode,
              }),
            });

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string; data?: { request_id?: string; status?: string } }
        | null;

      if (!response.ok || !payload?.success || !payload.data?.request_id) {
        throw new Error(payload?.message || 'AI engine tidak mengembalikan respons yang valid.');
      }

      const nextRequestId = payload.data.request_id || response.headers.get('x-request-id');
      requestAbortControllerRef.current = null;
      activeRequestIdRef.current = nextRequestId;
      setCurrentRequestId(nextRequestId);
      setRunHistory((current) =>
        upsertRunHistory(current, {
          requestId: nextRequestId,
          sessionKey,
          prompt: nextPrompt,
          mode: promptDetection.mode,
          confidence: promptDetection.confidence,
          time: runTime,
          pinned,
          result: null,
          table: null,
          chart: null,
          streamEntries: [],
          error: null,
        }),
      );
      void refreshHistoryAfterRun(sessionKey);
    } catch (error) {
      console.log("FR: error", error);
      requestAbortControllerRef.current = null;
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      setAttachments(nextAttachments);
      setAttachmentFiles(nextAttachmentFiles);
      setSubmittedAttachments(nextAttachments);
      setAiError(error instanceof Error ? error.message : 'Gagal menghubungi AI engine.');
      setAiResult(null);
      setWorkflowSteps(buildWorkflowSteps(0));
      setIsRunningAi(false);
    }
  };

  const displaySchemaTables = aiResult?.semantic_schema?.tables?.slice(0, 4) ?? [];
  const displayQueries = aiResult?.suggested_queries?.slice(0, 3) ?? [];
  const applyWorkflowEvent = (eventName: WorkflowEventName) => {
    setWorkflowSteps(applyWorkflowEventToSteps(eventName));

    if (eventName === 'completed' || eventName === 'failed') {
      setIsRunningAi(false);
    }
  };

  const togglePinnedRun = (promptToToggle: string) => {
    setRunHistory((current) =>
      [...current]
        .map((item) =>
          item.prompt === promptToToggle
            ? { ...item, pinned: !item.pinned }
            : item,
        )
        .sort((left, right) => Number(right.pinned) - Number(left.pinned)),
    );
  };

  const clearRunHistory = () => {
    setRunHistory([]);
  };

  const startNewSession = () => {
    setPrompt('');
    setAttachments((current) => {
      current.forEach((attachment) => revokeAttachmentPreviewUrl(attachment));
      return [];
    });
    setAttachmentFiles([]);
    setSubmittedAttachments([]);
    setSubmittedPrompt('');
    setSubmittedAt('Belum dijalankan');
    setAiError(null);
    setAiResult(null);
    setWorkflowSteps(buildWorkflowSteps(0));
    setWorkflowStreamEntries([]);
    setSelectedStreamTable(null);
    setSelectedStreamChart(null);
    setSelectedDashboardBlockId(null);
    setCurrentRequestId(null);
    setCurrentSessionKey(null);
    setSelectedHistorySessionId(null);
    setIsRestoringSession(false);
    setResultView('chart');
    navigateToSession(null);
    window.requestAnimationFrame(() => {
      promptTextareaRef.current?.focus();
    });
  };

  const startRenameHistorySession = (session: HistorySessionItem) => {
    setHistorySessionPendingRename(session);
    setHistorySessionRenameTitle(session.title || session.session_key);
  };

  const cancelRenameHistorySession = () => {
    if (isRenamingHistorySession) {
      return;
    }

    setHistorySessionPendingRename(null);
    setHistorySessionRenameTitle('');
  };

  const togglePromptExpanded = useCallback((key: string) => {
    setExpandedPrompts((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }, []);

  const fetchHistorySessions = async (preferredSessionKey?: string | null) => {
    setIsHistorySessionsLoading(true);
    try {
      const response = await fetch('/api/ai/history/sessions?channel=manager_dashboard&limit=20', {
        cache: 'no-store',
      });
      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; data?: HistorySessionItem[] }
        | null;
      if (!response.ok || !payload?.success || !Array.isArray(payload.data)) {
        throw new Error('Failed to load history sessions.');
      }

      const sessions = payload.data;
      setHistorySessions(sessions);
      const preferredSessionId =
        (preferredSessionKey
          ? sessions.find((item) => item.session_key === preferredSessionKey)?.id
          : null) ?? null;

      setSelectedHistorySessionId((current) =>
        preferredSessionId ?? current ?? sessions[0]?.id ?? null,
      );
      return sessions;
    } catch {
      setHistorySessions([]);
      return [];
    } finally {
      setIsHistorySessionsLoading(false);
    }
  };

  const handleDeleteHistorySession = async (sessionId: string) => {
    setDeletingHistorySessionId(sessionId);
    try {
      const response = await fetch(`/api/ai/history/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean }
        | null;
      if (!response.ok || !payload?.success) {
        throw new Error('Failed to delete history session.');
      }

      setHistorySessions((current) => {
        const next = current.filter((item) => item.id !== sessionId);
        setSelectedHistorySessionId((selected) =>
          selected === sessionId ? (next[0]?.id ?? null) : selected,
        );
        const deletedSession = current.find((item) => item.id === sessionId);
        if (deletedSession?.session_key && deletedSession.session_key === currentSessionKey) {
          setCurrentSessionKey(null);
        }
        return next;
      });
      if (activeSessionRouteId === sessionId) {
        navigateToSession(null);
      }
      setHistorySessionPendingDelete(null);
    } catch {
      return;
    } finally {
      setDeletingHistorySessionId(null);
    }
  };

  const handleRenameHistorySession = async (session: HistorySessionItem) => {
    const nextTitle = historySessionRenameTitle.trim();
    if (!nextTitle || nextTitle === (session.title || session.session_key)) {
      cancelRenameHistorySession();
      return;
    }

    setIsRenamingHistorySession(true);
    try {
      const response = await fetch(`/api/ai/history/sessions/${session.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: nextTitle,
        }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; data?: HistorySessionItem }
        | null;

      if (!response.ok || !payload?.success) {
        throw new Error('Failed to rename history session.');
      }

      setHistorySessions((current) =>
        current.map((item) =>
          item.id === session.id
            ? { ...item, title: nextTitle }
            : item,
        ),
      );
      setHistorySessionPendingRename(null);
      setHistorySessionRenameTitle('');
    } catch {
      return;
    } finally {
      setIsRenamingHistorySession(false);
    }
  };

  const refreshHistoryAfterRun = async (sessionKeyOverride?: string | null) => {
    const sessionKey = sessionKeyOverride ?? currentSessionKey;
    if (!sessionKey) {
      return;
    }
    const sessions = await fetchHistorySessions(sessionKey);
    const currentSession =
      sessions.find((item) => item.session_key === sessionKey) ??
      sessions[0];

    if (currentSession?.id) {
      skipNextRouteSessionRestoreRef.current = true;
      navigateToSession(currentSession.id);
    }
  };

  const handleSelectHistorySession = (session: HistorySessionItem) => {
    setIsRestoringSession(true);
    setSelectedHistorySessionId(session.id);
    navigateToSession(session.id);
  };

  const handleOpenHistoryRun = (item: RunHistoryItem, closeDialog = true) => {
    if (item.sessionKey) {
      setCurrentSessionKey(item.sessionKey);
    }
    if (item.sessionId) {
      navigateToSession(item.sessionId);
    }
    setSubmittedPrompt(item.prompt);
    setSubmittedAt(item.time);
    setAiResult(item.result ?? null);
    setAiError(item.error ?? null);
    setWorkflowStreamEntries(item.streamEntries ?? []);
    setSelectedStreamTable(item.table ?? null);
    setSelectedStreamChart(item.chart ?? null);
    setCurrentRequestId(item.requestId ?? null);
    setSubmittedAttachments([]);
    if (item.table || item.chart) {
      restoreRightPanelWidth();
    }
    setResultView(item.chart ? 'chart' : 'table');
      console.log("FR: false 2");
    setIsRunningAi(false);
    setIsRestoringSession(false);
    void closeDialog;
  };

  const handleCopyQuery = async (sql: string, index: number) => {
    try {
      const copied = await copyTextToClipboard(sql);
      if (!copied) {
        throw new Error('Copy failed');
      }
      setCopiedQueryIndex(index);
      window.setTimeout(() => {
        setCopiedQueryIndex((current) => (current === index ? null : current));
      }, 1800);
    } catch {
      setCopiedQueryIndex(null);
    }
  };

  const handleCopyPromptEntry = useCallback(async (entryId: string, promptValue: string) => {
    try {
      const copied = await copyTextToClipboard(normalizeCopiedText(promptValue));
      if (!copied) {
        throw new Error('Copy failed');
      }
      setCopiedPromptEntryId(entryId);
      window.setTimeout(() => {
        setCopiedPromptEntryId((current) => (current === entryId ? null : current));
      }, 1800);
    } catch {
      setCopiedPromptEntryId(null);
    }
  }, []);

  const handleOpenStreamDataTable = useCallback((entryId: string, payload: string) => {
    if (activeStreamDataEntryId === entryId) {
      setActiveStreamDataEntryId(null);
      setSelectedStreamTable(null);
      setSelectedStreamChart(null);
      setSelectedDashboardBlockId(null);
      return;
    }

    const payloadResult = extractAiResultFromWorkflowPayload(payload);
    const payloadDashboardBlocks = buildDashboardVisualizationBlocks(payloadResult);
    const primaryDashboardBlock =
      payloadDashboardBlocks.find((block) => block.chart) ??
      payloadDashboardBlocks[0] ??
      null;

    if (primaryDashboardBlock) {
      setActiveStreamDataEntryId(entryId);
      setSelectedDashboardBlockId(primaryDashboardBlock.id);
      setSelectedStreamTable(primaryDashboardBlock.table);
      setSelectedStreamChart(primaryDashboardBlock.chart);
      if (primaryDashboardBlock.table || primaryDashboardBlock.chart) {
        restoreRightPanelWidth();
      }
      setResultView(primaryDashboardBlock.chart ? 'chart' : 'table');
      return;
    }

    const nextTable = parseStreamDataTable(payload);
    const nextChart = parseStreamDataChart(payload);
    if (!nextTable) {
      return;
    }

    setActiveStreamDataEntryId(entryId);
    setSelectedDashboardBlockId(null);
    setSelectedStreamTable(nextTable);
    setSelectedStreamChart(nextChart);
    if (nextTable || nextChart) {
      restoreRightPanelWidth();
    }
    setResultView(nextChart ? 'chart' : 'table');
  }, [activeStreamDataEntryId, restoreRightPanelWidth]);

  const handlePromptKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') {
      if (!isRunningAi) {
        return;
      }

      event.preventDefault();
      cancelActiveRequest();
      return;
    }

    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (isRunningAi || isPreparingAttachments || !prompt.trim()) {
      return;
    }

    console.log("FR: handleRunAtm 1");
    void handleRunAtm();
  };

  const handlePromptPaste = useCallback(
    async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const consumed = await handlePasteAttachments(event.clipboardData?.items ?? null);
      if (consumed) {
        event.preventDefault();
      }
    },
    [handlePasteAttachments],
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(RUN_HISTORY_STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as RunHistoryItem[];
      if (Array.isArray(parsed)) {
        setRunHistory(parsed.slice(0, RUN_HISTORY_LIMIT));
      }
    } catch {
      window.localStorage.removeItem(RUN_HISTORY_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (runHistoryPersistTimeoutRef.current !== null) {
      window.clearTimeout(runHistoryPersistTimeoutRef.current);
    }

    runHistoryPersistTimeoutRef.current = window.setTimeout(() => {
      window.localStorage.setItem(RUN_HISTORY_STORAGE_KEY, JSON.stringify(runHistory));
      runHistoryPersistTimeoutRef.current = null;
    }, 180);

    return () => {
      if (runHistoryPersistTimeoutRef.current !== null) {
        window.clearTimeout(runHistoryPersistTimeoutRef.current);
        runHistoryPersistTimeoutRef.current = null;
      }
    };
  }, [runHistory]);

  useEffect(() => {
    void fetchHistorySessions();
  }, []);

  useEffect(() => {
    if (!isSessionSearchOpen || !isSessionSidebarExpanded) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      sessionSearchInputRef.current?.focus();
      sessionSearchInputRef.current?.select();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isSessionSearchOpen, isSessionSidebarExpanded]);

  useEffect(() => {
    if (isSessionSearchOpen) {
      return;
    }

    setSessionSearchQuery('');
  }, [isSessionSearchOpen]);

  useEffect(() => {
    setActiveSessionRouteId(routeSessionId);
  }, [routeSessionId]);

  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(/^\/app\/senti-ai\/([^/]+)$/);
      setActiveSessionRouteId(match?.[1] ?? null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!activeSessionRouteId) {
      return;
    }

    setSelectedHistorySessionId(activeSessionRouteId);
  }, [activeSessionRouteId, historySessions]);

  useEffect(() => {
    if (!activeSessionRouteId) {
      setIsRestoringSession(false);
      return;
    }

    const selectedSessionSnapshot = historySessions.find((item) => item.id === activeSessionRouteId);
    if (
      skipNextRouteSessionRestoreRef.current &&
      selectedSessionSnapshot?.session_key &&
      selectedSessionSnapshot.session_key === currentSessionKey
    ) {
      skipNextRouteSessionRestoreRef.current = false;
      setIsRestoringSession(false);
      return;
    }
    let cancelled = false;
    setIsRestoringSession(true);

    const loadSessionFromRoute = async () => {
      try {
        const promptsResponse = await fetch(`/api/ai/history/sessions/${activeSessionRouteId}/prompts`, {
          cache: 'no-store',
        });
        const promptsPayload = (await promptsResponse.json().catch(() => null)) as
          | { success?: boolean; data?: HistoryPromptItem[] }
          | null;

        if (!promptsResponse.ok || !promptsPayload?.success || !Array.isArray(promptsPayload.data) || promptsPayload.data.length === 0) {
          return;
        }

        if (cancelled) {
          return;
        }

        const latestPrompt = promptsPayload.data[promptsPayload.data.length - 1];
        const detailResponse = await fetch(`/api/ai/history/prompts/${latestPrompt.id}`, {
          cache: 'no-store',
        });
        const detailPayload = (await detailResponse.json().catch(() => null)) as
          | { success?: boolean; data?: HistoryPromptDetail }
          | null;

        if (!detailResponse.ok || !detailPayload?.success || !detailPayload.data?.prompt || cancelled) {
          return;
        }

        handleOpenHistoryRun(
          buildRunHistoryFromPromptDetail(
            detailPayload.data,
            selectedSessionSnapshot?.session_key || null,
            selectedSessionSnapshot?.mode || 'ask',
          ),
          false,
        );
      } finally {
        if (!cancelled) {
          setIsRestoringSession(false);
        }
      }
    };
    void loadSessionFromRoute();

    return () => {
      cancelled = true;
    };
  }, [activeSessionRouteId, currentSessionKey, historySessions]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      promptTextareaRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach((attachment) => revokeAttachmentPreviewUrl(attachment));
    };
  }, []);

  useEffect(() => {
    const textarea = promptTextareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [prompt]);

  useEffect(() => {
    if (!currentRequestId) {
      return;
    }

    const eventSource = new EventSource(`/api/ai/chat/progress/${currentRequestId}`);
    eventSourceRef.current = eventSource;
    activeRequestIdRef.current = currentRequestId;

    const handleWorkflowEvent = (event: MessageEvent<string>) => {
      if (activeRequestIdRef.current !== currentRequestId) {
        return;
      }

      const rawEventName = event.type || 'message';
      const rawPayload = event.data;

      let payload: WorkflowStreamPayload | null = null;

      try {
        payload = JSON.parse(rawPayload) as WorkflowStreamPayload;
      } catch {
        return;
      }

      const nextLiveTable = parseStreamDataTable(rawPayload);
      const nextLiveChart = parseStreamDataChart(rawPayload);
      const streamEntry = createWorkflowStreamEntry(
        rawEventName,
        payload ? formatWorkflowStreamPayload(payload) : rawPayload,
      );
      const nextStreamEntries = [...workflowStreamEntriesRef.current, streamEntry];

      workflowStreamEntriesRef.current = nextStreamEntries;
      setWorkflowStreamEntries(nextStreamEntries);

      if (nextLiveTable) {
        selectedStreamTableRef.current = nextLiveTable;
        selectedStreamChartRef.current = nextLiveChart;
        setSelectedStreamTable(nextLiveTable);
        setSelectedStreamChart(nextLiveChart);
        if (nextLiveTable || nextLiveChart) {
          restoreRightPanelWidth();
        }
        setResultView(nextLiveChart ? 'chart' : 'table');
      }

      const eventName = payload.event ?? (rawEventName as WorkflowEventName);

      if (
        eventName !== 'started' &&
        eventName !== 'schema_selected' &&
        eventName !== 'query_execution_started' &&
        eventName !== 'query_execution_completed' &&
        eventName !== 'ai_insight_started' &&
        eventName !== 'ai_insight_completed' &&
        eventName !== 'analysis_started' &&
        eventName !== 'analysis_done' &&
        eventName !== 'draft_started' &&
        eventName !== 'draft_done' &&
        eventName !== 'review_started' &&
        eventName !== 'review_done' &&
        eventName !== 'completed' &&
        eventName !== 'failed'
      ) {
        return;
      }

      applyWorkflowEvent(eventName);

      if (eventName === 'completed' && payload.data) {
        setAiResult(payload.data);
        setAiError(null);
        const nextTable = nextLiveTable ?? selectedStreamTableRef.current;
        const nextChart = nextLiveTable ? nextLiveChart : selectedStreamChartRef.current;

        if (nextTable) {
          selectedStreamTableRef.current = nextTable;
          selectedStreamChartRef.current = nextChart;
          setSelectedStreamTable(nextTable);
          setSelectedStreamChart(nextChart);
          if (nextTable || nextChart) {
            restoreRightPanelWidth();
          }
        }

        setRunHistory((current) => {
          const existing = current.find((item) => item.requestId === currentRequestId);
          if (!existing) {
            return current;
          }

          return upsertRunHistory(current, {
            ...existing,
            result: payload.data,
            table: nextTable ?? existing.table ?? null,
            chart: nextTable ? nextChart : (existing.chart ?? null),
            streamEntries: nextStreamEntries,
            error: null,
          });
        });
        window.requestAnimationFrame(() => {
          scrollLeftPanelToBottom();
        });
      }

      if (eventName === 'failed') {
        setAiError(typeof payload.error === 'string' ? payload.error : 'Workflow failed.');
        setAiResult(null);
        setRunHistory((current) => {
          const existing = current.find((item) => item.requestId === currentRequestId);
          if (!existing) {
            return current;
          }

          return upsertRunHistory(current, {
            ...existing,
            error: typeof payload.error === 'string' ? payload.error : 'Workflow failed.',
            streamEntries: nextStreamEntries,
          });
        });
      }

      if (eventName === 'completed' || eventName === 'failed') {
        eventSource.close();
        if (eventSourceRef.current === eventSource) {
          eventSourceRef.current = null;
        }
      }
    };

    const eventNames: WorkflowEventName[] = [
      'started',
      'schema_selected',
      'query_execution_started',
      'query_execution_completed',
      'ai_insight_started',
      'ai_insight_completed',
      'analysis_started',
      'analysis_done',
      'draft_started',
      'draft_done',
      'review_started',
      'review_done',
      'completed',
      'failed',
    ];

    eventNames.forEach((eventName) => eventSource.addEventListener(eventName, handleWorkflowEvent as EventListener));
    eventSource.onerror = () => {
      if (activeRequestIdRef.current !== currentRequestId) {
        return;
      }

      setWorkflowStreamEntries((current) => [
        ...current,
        createWorkflowStreamEntry(
          'error',
          JSON.stringify(
            {
              message: 'Event stream connection closed unexpectedly.',
              request_id: currentRequestId,
            },
            null,
            2,
          ),
        ),
      ]);
      eventSource.close();
      if (eventSourceRef.current === eventSource) {
        eventSourceRef.current = null;
      }

      setIsRunningAi(false);
    };

    return () => {
      eventNames.forEach((eventName) => eventSource.removeEventListener(eventName, handleWorkflowEvent as EventListener));
      eventSource.close();
      if (eventSourceRef.current === eventSource) {
        eventSourceRef.current = null;
      }
    };
  }, [currentRequestId]);

  useEffect(() => {
    if (!dashboardVisualizationBlocks.length) {
      setSelectedDashboardBlockId(null);
      return;
    }

    setSelectedDashboardBlockId((current) =>
      current && dashboardVisualizationBlocks.some((item) => item.id === current)
        ? current
        : dashboardVisualizationBlocks[0]?.id ?? null,
    );
  }, [dashboardVisualizationBlocks]);

  useLayoutEffect(() => {
    if (!isRunningAi) {
      syncLeftPanelBottomButton();
      return;
    }

    const container = leftPanelScrollRef.current;
    if (!container) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      scrollLeftPanelToBottom();
      syncLeftPanelBottomButton();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isRunningAi, workflowStreamEntries]);

  useEffect(() => {
    const container = leftPanelScrollRef.current;
    if (!container) {
      setShowLeftPanelBottomButton(false);
      return;
    }

    syncLeftPanelBottomButton();

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(() => {
        syncLeftPanelBottomButton();
      });
    });

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        syncLeftPanelBottomButton();
      });
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    resizeObserver.observe(container);

    const handleWindowResize = () => {
      window.requestAnimationFrame(() => {
        syncLeftPanelBottomButton();
      });
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    const container = splitLayoutRef.current;
    if (!container) {
      return;
    }

    const syncSplitLayoutWidth = () => {
      setSplitLayoutWidth(container.getBoundingClientRect().width);
    };

    syncSplitLayoutWidth();

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(syncSplitLayoutWidth);
    });

    resizeObserver.observe(container);
    window.addEventListener('resize', syncSplitLayoutWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', syncSplitLayoutWidth);
    };
  }, []);

  useEffect(() => {
    if (!isResizingPanels) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const container = splitLayoutRef.current;
      if (!container) {
        return;
      }

      const bounds = container.getBoundingClientRect();
      if (bounds.width <= 0) {
        return;
      }

      const widthPercentage = ((event.clientX - bounds.left) / bounds.width) * 100;
      setLeftPanelWidth(clampPanelWidth(widthPercentage));
    };

    const stopResizing = () => {
      setIsResizingPanels(false);
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopResizing);
    window.addEventListener('pointercancel', stopResizing);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopResizing);
      window.removeEventListener('pointercancel', stopResizing);
    };
  }, [isResizingPanels]);

  const renderedWorkflowEntries = useMemo(
    () =>
      workflowStreamEntries.map((entry, index) => (
        <div key={entry.id}>
          {entry.kind === 'user' ? (
            <div className="mx-auto mt-5 flex w-full max-w-[900px] justify-end">
              {(() => {
                const expanded = expandedPrompts[entry.id] ?? false;
                const preview = expanded ? entry.payload : formatPromptPreview(entry.payload, 220);
                const isLongPrompt = formatPromptPreview(entry.payload, 220) !== entry.payload;

                return (
                  <div className="group flex w-fit items-start gap-2">
                    <button
                      type="button"
                      onClick={() => void handleCopyPromptEntry(entry.id, entry.payload)}
                      className={`mt-1 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-[#7E8299] shadow-[0px_0px_20px_0px_rgba(76,87,125,0.04)] transition hover:border-sky-200 hover:text-[#009EF7] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-sky-500/40 dark:hover:text-sky-300 ${
                        copiedPromptEntryId === entry.id
                          ? 'opacity-100'
                          : 'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100'
                      }`}
                      aria-label="Copy prompt"
                      title={copiedPromptEntryId === entry.id ? 'Copied' : 'Copy prompt'}
                    >
                      {copiedPromptEntryId === entry.id ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </button>
                    <div
                      className="w-full rounded-[12px_12px_0px_12px] bg-[#009EF7] px-4 py-3 text-[15px] font-normal leading-6 text-white shadow-[0px_10px_24px_-12px_rgba(0,158,247,0.55)] dark:bg-[#1B84FF] dark:shadow-[0px_10px_24px_-12px_rgba(27,132,255,0.45)]"
                      onCopy={(event) => {
                        applyNormalizedClipboardCopy(event, preview);
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>{preview}</div>
                        {isLongPrompt ? (
                          <button
                            type="button"
                            onClick={() => togglePromptExpanded(entry.id)}
                            className="cursor-pointer rounded-lg p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
                            aria-label={expanded ? 'Collapse prompt' : 'Expand prompt'}
                          >
                            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (() => {
              if (entry.event === 'completed') {
                const hasPriorInsight = workflowStreamEntries
                  .slice(0, index)
                  .some((candidate) => {
                    if (candidate.kind !== 'event' || candidate.event !== 'ai_insight_completed') {
                      return false;
                    }
                    return extractWorkflowDisplayText(candidate.payload) === extractWorkflowDisplayText(entry.payload);
                  });

                if (hasPriorInsight) {
                  return null;
                }
              }

              const display = getWorkflowStreamDisplayPayload(entry.payload);

              if (display.kind === 'none') {
                return null;
              }
              return (
                <div className="mx-auto mt-4 w-full max-w-[820px] lg:max-w-[860px]">
                  {display.kind === 'data' ? (
                    (() => {
                      const isActiveDataEntry = activeStreamDataEntryId === entry.id;

                      return (
                        <div className="overflow-hidden rounded-xl border border-[#E4E6EF] bg-white shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_0_18px_0_rgba(2,6,23,0.28)]">
                          <div className="border-s-4 border-[#009EF7] px-5 py-5">
                            <div className="flex items-center justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium text-[#3F4254] dark:text-slate-100">
                                  {display.text}
                                </div>
                              </div>
                              <button
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => handleOpenStreamDataTable(entry.id, entry.payload)}
                                className="shrink-0 cursor-pointer text-sm font-medium text-[#009EF7] transition hover:text-[#1B84FF] dark:text-indigo-300 dark:hover:text-indigo-200"
                              >
                                {isActiveDataEntry ? (
                                  <span className="inline-flex items-center gap-1">
                                    <X className="size-3.5" />
                                    Tutup hasil
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1">
                                    <ArrowRight className="size-3.5" />
                                    Lihat tabel / dashboard
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : display.kind === 'insight' ? (
                    <div
                      className="overflow-hidden rounded-xl border border-[#E4E6EF] bg-white shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_0_18px_0_rgba(2,6,23,0.28)]"
                      onCopy={(event) => {
                        applyNormalizedClipboardCopy(event, display.text);
                      }}
                    >
                      <div className="border-s-4 border-[#009EF7] bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fbff_100%)] px-3 py-3 dark:bg-[linear-gradient(180deg,_rgba(2,6,23,0.94)_0%,_rgba(15,23,42,0.92)_100%)]">
                        <div className="text-[15px] leading-8 text-[#3F4254] dark:text-slate-100">
                          {renderRichTextMarkdown(display.text)}
                        </div>
                      </div>
                    </div>
                  ) : display.kind === 'explanation' ? (
                    <div
                      className="overflow-hidden rounded-xl border border-[#E4E6EF] bg-white shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_0_18px_0_rgba(2,6,23,0.28)]"
                      onCopy={(event) => {
                        applyNormalizedClipboardCopy(event, display.text);
                      }}
                    >
                      <div className="border-s-4 border-[#FFA800] bg-[linear-gradient(180deg,_#ffffff_0%,_#fffaf3_100%)] px-3 py-3 dark:bg-[linear-gradient(180deg,_rgba(2,6,23,0.94)_0%,_rgba(30,20,5,0.9)_100%)]">
                        <div className="text-[15px] leading-8 text-[#3F4254] dark:text-slate-100">
                          {renderRichTextMarkdown(display.text)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <pre
                      onCopy={(event) => {
                        applyNormalizedClipboardCopy(event, display.text);
                      }}
                      className={`overflow-x-auto whitespace-pre-wrap break-words rounded-xl border px-4 py-4 text-[13px] font-normal leading-6 text-[#3F4254] shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] dark:text-slate-300 dark:shadow-[0_0_18px_0_rgba(2,6,23,0.28)] ${
                        isCodeLikeText(display.text)
                          ? 'border-[#E4E6EF] bg-slate-900 font-mono text-[12px] text-slate-100 dark:border-slate-800 dark:bg-slate-950'
                          : 'border-[#E4E6EF] bg-white dark:border-slate-800 dark:bg-slate-950'
                      }`}
                    >
                      {display.text}
                    </pre>
                  )}
                </div>
              );
            })()}
        </div>
      )),
    [
      activeStreamDataEntryId,
      copiedPromptEntryId,
      expandedPrompts,
      handleCopyPromptEntry,
      handleOpenStreamDataTable,
      togglePromptExpanded,
      workflowStreamEntries,
    ],
  );

  const isAwaitingFirstVisibleAiResponse = useMemo(
    () => {
      if (!isRunningAi || workflowStreamEntries.length === 0) {
        return false;
      }

      const lastUserEntryIndex = [...workflowStreamEntries]
        .map((entry, index) => ({ entry, index }))
        .reverse()
        .find((item) => item.entry.kind === 'user')?.index;

      if (lastUserEntryIndex === undefined) {
        return false;
      }

      const activeRunEntries = workflowStreamEntries.slice(lastUserEntryIndex);
      const hasUserPrompt = activeRunEntries.some((entry) => entry.kind === 'user');
      const hasVisibleAiEntry = activeRunEntries.some((entry) => {
        if (entry.kind !== 'event') {
          return false;
        }
        const display = getWorkflowStreamDisplayPayload(entry.payload);
        return display.kind === 'data' || display.kind === 'insight';
      });

      return hasUserPrompt && !hasVisibleAiEntry;
    },
    [isRunningAi, workflowStreamEntries],
  );

  return (
    <div
      className="w-full space-y-3 bg-[#F5F8FA] px-6 py-4 dark:bg-[linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]"
      style={{ fontFamily: '"Plus Jakarta Sans", "Inter", ui-sans-serif, system-ui, sans-serif' }}
    >
      <div
        className={`grid gap-3 ${
          isRestoringSession ? '' : 'transition-[grid-template-columns] duration-300 ease-out'
        } ${
          isSessionSidebarExpanded
            ? 'xl:grid-cols-[320px_minmax(0,1fr)]'
            : 'xl:grid-cols-[64px_minmax(0,1fr)]'
        }`}
      >
        <aside className="min-h-0">
          <div className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_35px_-30px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_20px_42px_-34px_rgba(2,6,23,0.95)] xl:sticky xl:top-4 xl:h-[calc(100dvh-8rem)] ${
            isRestoringSession ? '' : 'transition-all duration-300 ease-out'
          }`}>
            <div className="flex h-full flex-col">
              <div
                className={`border-b border-slate-200 px-4 py-4 dark:border-slate-800 ${
                  isRestoringSession ? '' : 'transition-all duration-300 ease-out'
                } ${
                  isSessionSidebarExpanded ? '' : 'px-2 py-3'
                }`}
              >
                <div className="space-y-3">
                  <div className={`flex ${isSessionSidebarExpanded ? 'items-center justify-between gap-2' : 'flex-col items-center gap-2'}`}>
                    <button
                      type="button"
                      onClick={() => setIsSessionSidebarExpanded((current) => !current)}
                      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100 ${
                        isSessionSidebarExpanded ? 'size-10' : 'size-11'
                      }`}
                      aria-label={isSessionSidebarExpanded ? 'Collapse sessions sidebar' : 'Expand sessions sidebar'}
                      title={isSessionSidebarExpanded ? 'Collapse' : 'Expand'}
                    >
                      <PanelLeft className={isSessionSidebarExpanded ? 'size-5' : 'size-6'} />
                    </button>
                    <div className={`flex ${isSessionSidebarExpanded ? 'items-center gap-1' : 'flex-col items-center gap-2'}`}>
                      <button
                        type="button"
                        onClick={startNewSession}
                        className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                        aria-label="Start new session"
                        title="New chat"
                      >
                        <Plus className="size-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!isSessionSidebarExpanded) {
                            setIsSessionSidebarExpanded(true);
                            setIsSessionSearchOpen(true);
                            return;
                          }
                          setIsSessionSearchOpen((current) => !current);
                        }}
                        className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                        aria-label="Toggle session search"
                        title="Search sessions"
                      >
                        <Search className="size-5" />
                      </button>
                    </div>
                  </div>
                  <div
                    className={`overflow-hidden ${
                      isRestoringSession ? '' : 'transition-all duration-300 ease-out'
                    } ${
                      isSessionSidebarExpanded
                        ? 'max-h-20 max-w-[220px] opacity-100 translate-x-0'
                        : 'max-h-0 max-w-0 opacity-0 -translate-x-2'
                    }`}
                  >
                    <div>
                      <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">Sessions</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Riwayat percakapan dikelompokkan per session.
                      </div>
                    </div>
                  </div>
                  {isSessionSidebarExpanded && isSessionSearchOpen ? (
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        ref={sessionSearchInputRef}
                        value={sessionSearchQuery}
                        onChange={(event) => setSessionSearchQuery(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Escape') {
                            event.preventDefault();
                            setIsSessionSearchOpen(false);
                          }
                        }}
                        placeholder="Search title or prompt"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-10 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                      />
                      {sessionSearchQuery.trim().length > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSessionSearchQuery('');
                            window.requestAnimationFrame(() => {
                              sessionSearchInputRef.current?.focus();
                            });
                          }}
                          className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                          aria-label="Clear search"
                          title="Clear search"
                        >
                          <X className="size-4" />
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
              <div
                ref={sessionSidebarScrollRef}
                onScroll={(event) => {
                  setSessionSidebarScrollTop(event.currentTarget.scrollTop);
                }}
                className={`flex-1 overflow-y-auto ${isSessionSidebarExpanded ? 'p-4' : 'p-2'}`}
              >
                <div
                  className={`space-y-2 ${
                    isRestoringSession ? '' : 'transition-all duration-300 ease-out'
                  } ${
                    isSessionSidebarExpanded
                      ? 'pointer-events-auto opacity-100 translate-y-0'
                      : 'pointer-events-none opacity-0 translate-y-2'
                  }`}
                >
                  {isHistorySessionsLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} className="h-14 rounded-lg" />
                    ))
                  ) : filteredHistorySessions.length > 0 ? (
                    <>
                      {sessionSidebarVisibleRange.topSpacerHeight > 0 ? (
                        <div style={{ height: sessionSidebarVisibleRange.topSpacerHeight }} aria-hidden="true" />
                      ) : null}
                      {sessionSidebarVisibleRange.items.map((session) => (
                      <div
                        key={session.id}
                        className={`group rounded-xl border px-3 py-3 transition ${
                          selectedHistorySessionId === session.id
                            ? 'border-sky-200 bg-sky-50/80 text-sky-950 shadow-[0_12px_24px_-20px_rgba(14,165,233,0.9)] dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-50'
                            : 'border-slate-200/80 bg-white/80 text-slate-700 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-950/70'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectHistorySession(session)}
                            className="min-h-8 min-w-0 flex-1 cursor-pointer text-left"
                          >
                            <WordSafeSingleLineText
                              text={session.title || session.session_key}
                              className="block overflow-hidden whitespace-nowrap leading-normal text-[15px] font-semibold"
                            />
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                                aria-label="Session actions"
                                title="Session actions"
                              >
                                <EllipsisVertical className="size-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => startRenameHistorySession(session)}>
                                <Pencil className="mr-2 size-4" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setHistorySessionPendingDelete(session)}
                                disabled={deletingHistorySessionId === session.id}
                                className="text-rose-600 focus:text-rose-600 dark:text-rose-300 dark:focus:text-rose-300"
                              >
                                <Trash2 className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      ))}
                      {sessionSidebarVisibleRange.bottomSpacerHeight > 0 ? (
                        <div style={{ height: sessionSidebarVisibleRange.bottomSpacerHeight }} aria-hidden="true" />
                      ) : null}
                    </>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                      {normalizedSessionSearchQuery ? 'Tidak ada session yang cocok.' : 'Belum ada history session.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
      <div className="overflow-hidden rounded-2xl bg-transparent lg:flex lg:h-[calc(100dvh-8rem)] lg:flex-col">
        <div
          ref={splitLayoutRef}
          className="relative flex min-h-0 flex-1 flex-col gap-0 lg:flex-row"
          style={{ ['--left-panel-width' as string]: `${leftPanelWidth}%` }}
        >
        <div
          className={`flex min-h-0 min-w-0 w-full flex-col border-b border-slate-200/80 bg-transparent dark:border-slate-800/80 lg:min-h-0 ${
            isRestoringSession ? '' : 'transition-[width] duration-500 ease-out'
          } ${
            hasChartPanel
              ? 'lg:flex-none lg:shrink-0 lg:border-b-0 lg:border-r'
              : 'flex-1 lg:border-b-0 lg:w-full'
          }`}
          style={hasChartPanel ? { width: leftPanelDesktopWidth } : undefined}
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <div ref={leftPanelScrollRef} className="flex min-h-0 flex-1 flex-col overflow-auto p-3 pb-4">

              <div className="mx-auto flex w-full max-w-[900px] flex-1 flex-col space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-sky-400 text-white shadow-[0_12px_24px_-12px_rgba(59,130,246,0.9)] dark:shadow-[0_16px_28px_-16px_rgba(56,189,248,0.55)]">
                      ∞
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Senti Agent</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Factory intelligence workspace</div>
                    </div>
                  </div>
                </div>
                    <Dialog
                      open={Boolean(historySessionPendingRename)}
                      onOpenChange={(open) => {
                        if (!open && !isRenamingHistorySession) {
                          cancelRenameHistorySession();
                        }
                      }}
                    >
                      <DialogContent className="max-w-md rounded-xl border-0 p-0 shadow-[0px_0px_30px_0px_rgba(76,87,125,0.18)]">
                        <DialogHeader className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                          <DialogTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Rename Session
                          </DialogTitle>
                        </DialogHeader>
                        <DialogBody className="space-y-4 px-5 py-4">
                          <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            Ubah nama session untuk memudahkan pencarian dan pengelompokan prompt.
                          </div>
                          <input
                            value={historySessionRenameTitle}
                            onChange={(event) => setHistorySessionRenameTitle(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' && historySessionPendingRename) {
                                event.preventDefault();
                                void handleRenameHistorySession(historySessionPendingRename);
                              }
                              if (event.key === 'Escape') {
                                event.preventDefault();
                                cancelRenameHistorySession();
                              }
                            }}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#009EF7] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            placeholder="Session name"
                            autoFocus
                          />
                        </DialogBody>
                        <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={cancelRenameHistorySession}
                            disabled={isRenamingHistorySession}
                            className="rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                          >
                            Batal
                          </Button>
                          <Button
                            type="button"
                            onClick={() =>
                              historySessionPendingRename
                                ? void handleRenameHistorySession(historySessionPendingRename)
                                : undefined
                            }
                            disabled={!historySessionPendingRename || !historySessionRenameTitle.trim() || isRenamingHistorySession}
                            className="rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                          >
                            {isRenamingHistorySession ? 'Submitting...' : 'Submit'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={Boolean(historySessionPendingDelete)}
                      onOpenChange={(open) => {
                        if (!open && !deletingHistorySessionId) {
                          setHistorySessionPendingDelete(null);
                        }
                      }}
                    >
                      <DialogContent className="max-w-md rounded-xl border-0 p-0 shadow-[0px_0px_30px_0px_rgba(76,87,125,0.18)]">
                        <DialogHeader className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                          <DialogTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Hapus Session
                          </DialogTitle>
                        </DialogHeader>
                        <DialogBody className="px-5 py-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {historySessionPendingDelete ? (
                            <>
                              Session <span className="font-semibold text-slate-900 dark:text-slate-100">{formatPromptPreview(historySessionPendingDelete.title || historySessionPendingDelete.session_key, 56)}</span> akan dihapus dari history.
                              Tindakan ini juga menghapus semua prompt di dalam session tersebut.
                            </>
                          ) : null}
                        </DialogBody>
                        <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setHistorySessionPendingDelete(null)}
                            disabled={Boolean(deletingHistorySessionId)}
                            className="rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                          >
                            Batal
                          </Button>
                          <Button
                            type="button"
                            onClick={() =>
                              historySessionPendingDelete
                                ? void handleDeleteHistorySession(historySessionPendingDelete.id)
                                : undefined
                            }
                            disabled={!historySessionPendingDelete || Boolean(deletingHistorySessionId)}
                            className="rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                          >
                            Hapus
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                {isRunningAi && workflowStreamEntries.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center py-6 text-sm text-slate-500 dark:text-slate-400">
                    Menunggu event pertama dari SSE stream...
                  </div>
                ) : (
                  <div className={isWelcomeState ? 'flex flex-1 items-center justify-center' : 'space-y-5'}>
                    {isWelcomeState ? (
                      <div className="relative mx-auto flex w-full max-w-[780px] flex-col items-center justify-center px-4 py-7 text-center lg:-translate-y-14">
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <BrainCircuit className="size-56 text-[#009EF7] opacity-[0.05] dark:opacity-[0.07]" strokeWidth={1.1} />
                        </div>
                        <div className="relative z-10 max-w-3xl">
                          <div className="mx-auto inline-flex items-center rounded-full border border-sky-100 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#009EF7] shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] backdrop-blur dark:border-sky-500/20 dark:bg-slate-950/70 dark:text-sky-300">
                            Advanced Prompt Studio
                          </div>
                          <h2 className="text-[28px] font-semibold tracking-tight text-[#181C32] dark:text-slate-100">
                            Ask anything to start your analysis.
                          </h2>
                          <p className="mt-3 text-sm text-[#7E8299] dark:text-slate-400">
                            Sentient Factory siap membantu analisis finance, warehouse, purchase, dan sales dari satu workspace.
                          </p>
                        </div>
                        <div className="relative z-10 mt-5 grid w-full max-w-[780px] gap-2 md:grid-cols-2 xl:grid-cols-3">
                          {promptSuggestions.map((suggestion) => (
                            <button
                              key={suggestion.label}
                              type="button"
                              onClick={() => {
                                setPrompt(suggestion.label);
                                window.requestAnimationFrame(() => {
                                  promptTextareaRef.current?.focus();
                                });
                              }}
                              className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] transition hover:-translate-y-0.5 hover:border-[#009EF7] hover:bg-[#F1FAFF] dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-500/40 dark:hover:bg-slate-900"
                            >
                              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#F1FAFF] text-[#009EF7] dark:bg-sky-500/10 dark:text-sky-300">
                                <suggestion.icon className="size-3.5" />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                                  {suggestion.label}
                                </span>
                                <span className="mt-1 block text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                                  {suggestion.description}
                                </span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="max-w-xl text-right text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                          {hasSubmittedPrompt ? '' : 'Ask anything to start your analysis.'}
                        </h2>
                        {!hasSubmittedPrompt ? (
                          <div className="grid gap-3 md:grid-cols-2">
                            {promptSuggestions.map((suggestion) => (
                              <button
                                key={suggestion.label}
                                type="button"
                                onClick={() => {
                                  setPrompt(suggestion.label);
                                  window.requestAnimationFrame(() => {
                                    promptTextareaRef.current?.focus();
                                  });
                                }}
                                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-600 shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] transition hover:-translate-y-0.5 hover:border-[#009EF7] hover:bg-[#F1FAFF] hover:text-[#009EF7] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-sky-500/40 dark:hover:bg-slate-900 dark:hover:text-sky-300"
                              >
                                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F1FAFF] text-[#009EF7] dark:bg-sky-500/10 dark:text-sky-300">
                                  <suggestion.icon className="size-4" />
                                </span>
                                <span>{suggestion.label}</span>
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </>
                    )}
                    {submittedAttachments.length > 0 ? (
                      <div className="mx-auto w-full max-w-[820px] lg:max-w-[860px]">
                        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_35px_-30px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_20px_42px_-34px_rgba(2,6,23,0.95)]">
                          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-4 py-3 dark:border-slate-800/80">
                            <div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                Attachment Context
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                File yang ikut diproses bersama prompt ini.
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                                {submittedAttachments.length} file
                              </span>
                              {isAttachmentAnswer ? (
                                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                                  OCR processed
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <div className="space-y-3 px-4 py-4">
                            {submittedAttachments.map((attachment) => {
                              const AttachmentIcon = getAttachmentIcon(attachment);
                              return (
                                <div
                                  key={attachment.id}
                                  className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/60"
                                >
                                  <div className="flex items-start gap-3">
                                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                                      <AttachmentIcon className="size-4" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                          {attachment.name}
                                        </div>
                                        <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                                          {attachment.status}
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                                          {formatAttachmentSize(attachment.size)}
                                        </span>
                                      </div>
                                      <div className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                                        {attachment.preview}
                                      </div>
                                      {attachment.warning ? (
                                        <div className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                                          {attachment.warning}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {renderedWorkflowEntries}
                    {isRunningAi ? (
                      <div className="mx-auto mt-3 flex w-full max-w-[820px] items-center gap-2 px-1 text-sm text-slate-500 lg:max-w-[860px] dark:text-slate-400">
                        <LoaderCircle className="size-4 animate-spin text-[#009EF7]" />
                        <span>Senti sedang memproses jawaban...</span>
                      </div>
                    ) : null}
                  </div>
                )}

              </div>

            {showLeftPanelBottomButton ? (
              <div className="px-3 py-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={scrollLeftPanelToBottom}
                  className="ml-auto flex gap-2 rounded-xl px-3 text-xs text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                >
                  <ArrowDown className="size-4" />
                  Bottom
                </Button>
              </div>
            ) : null}

          </div>
        </div>

        <div
          ref={splitHandleRef}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
          aria-valuemin={MIN_PANEL_WIDTH_PERCENT}
          aria-valuemax={MAX_PANEL_WIDTH_PERCENT}
          aria-valuenow={Math.round(leftPanelWidth)}
          onPointerDown={startPanelResize}
          onMouseDown={startPanelResize}
          className={`group absolute inset-y-0 z-20 hidden w-5 cursor-col-resize touch-none select-none items-center justify-center bg-transparent lg:flex ${
            isRestoringSession ? '' : 'transition-all duration-500 ease-out'
          } ${
            hasChartPanel ? 'lg:opacity-100' : 'lg:pointer-events-none lg:opacity-0'
          }`}
          style={
            hasChartPanel
              ? {
                  left: isRightPanelCollapsed
                    ? 'calc(100% - 0.625rem)'
                    : `calc(${leftPanelWidth}% - 0.625rem)`,
                }
              : undefined
          }
        >
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-8 -translate-x-1/2" />
          <div className="pointer-events-none flex h-full w-full items-center justify-center">
            <div className="h-full w-px bg-slate-200 transition group-hover:w-0.5 group-hover:bg-[#009EF7] dark:bg-slate-800 dark:group-hover:bg-sky-400" />
          </div>
        </div>

        <div
          className={`min-w-0 overflow-auto bg-transparent ${
            isRestoringSession ? '' : 'transition-all duration-500 ease-out'
          } ${
            hasChartPanel && !isRightPanelCollapsed
              ? 'flex-1 translate-x-0 opacity-100 p-3'
              : 'max-lg:hidden lg:max-w-0 lg:flex-none lg:translate-x-4 lg:overflow-hidden lg:opacity-0 lg:p-0 lg:pointer-events-none'
          }`}
        >
          <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1 rounded-xl bg-transparent p-0.5">
              {resultViews.map((view) => (
                <button
                  key={view.key}
                  type="button"
                  onClick={() => setResultView(view.key)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs transition ${
                    resultView === view.key
                      ? 'bg-[#009EF7] font-medium text-white shadow-[0px_8px_20px_-8px_rgba(0,158,247,0.55)]'
                      : 'text-[#7E8299] hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <view.icon className={`size-4 shrink-0 ${resultView === view.key ? 'opacity-100' : 'opacity-85'}`} />
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          <Card className="min-h-[420px] rounded-xl border border-slate-100 bg-white shadow-[0px_0px_20px_0px_rgba(76,87,125,0.06)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_0_24px_0_rgba(2,6,23,0.45)]">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardHeading>
                  <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {resultView === 'chart'
                      ? (previewStreamChart?.title ?? 'Chart Preview')
                      : (previewStreamTable?.title ?? 'Table Preview')}
                  </CardTitle>
                </CardHeading>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={openPinDialog}
                  disabled={!canPinActiveWidget}
                  className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  <Pin className="size-3.5" />
                  Pin Dashboard
                </Button>
              </div>
              {dashboardVisualizationBlocks.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {dashboardVisualizationBlocks.map((block) => (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => setSelectedDashboardBlockId(block.id)}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs transition ${
                        activeDashboardBlock?.id === block.id
                          ? 'bg-[#009EF7] font-medium text-white shadow-[0px_8px_20px_-8px_rgba(0,158,247,0.55)]'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      {block.title}
                    </button>
                  ))}
                </div>
              ) : null}
            </CardHeader>
            <CardContent>
              {resultView === 'chart' && (!hasSubmittedPrompt || !previewStreamChart) ? (
                <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fbfd_100%)] px-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[linear-gradient(180deg,_rgba(2,6,23,0.98)_0%,_rgba(15,23,42,0.92)_100%)] dark:text-slate-400">
                  <div className="pointer-events-none absolute inset-x-0 top-8 flex justify-center opacity-90">
                    <div className="relative h-40 w-56">
                      <div className="absolute inset-x-8 bottom-4 h-20 rounded-[24px] bg-slate-100 shadow-[0_24px_40px_-32px_rgba(76,87,125,0.35)] dark:bg-slate-900" />
                      <div className="absolute left-8 top-8 h-24 w-16 rounded-2xl bg-white shadow-[0px_0px_20px_0px_rgba(76,87,125,0.08)] dark:bg-slate-950" />
                      <div className="absolute right-8 top-0 h-28 w-28 rounded-[28px] bg-white shadow-[0px_0px_20px_0px_rgba(76,87,125,0.08)] dark:bg-slate-950" />
                      <div className="absolute left-12 top-12 h-14 w-8 rounded-full bg-sky-100 dark:bg-sky-500/10" />
                      <div className="absolute left-[7.25rem] top-[2.9rem] h-10 w-16 rounded-full bg-slate-100 dark:bg-slate-900" />
                      <div className="absolute right-[2.75rem] top-8 h-16 w-3 rounded-full bg-sky-300 dark:bg-sky-400/40" />
                      <div className="absolute right-[4rem] top-12 h-12 w-3 rounded-full bg-sky-200 dark:bg-sky-500/25" />
                      <div className="absolute right-[5.25rem] top-[4.4rem] h-8 w-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                      <div className="absolute right-10 top-[2.3rem] h-6 w-16 rounded-full border border-dashed border-sky-200 dark:border-sky-500/20" />
                    </div>
                  </div>
                  <div className="relative max-w-md space-y-3">
                    <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {hasSubmittedPrompt
                        ? activeDashboardBlock?.title
                          ? `Chart tidak tersedia untuk ${activeDashboardBlock.title}`
                          : 'Chart tidak tersedia'
                        : 'Preview your metrics visually'}
                    </div>
                    <div>
                      {hasSubmittedPrompt
                        ? previewStreamTable
                          ? 'Blok yang sedang dipilih hanya mendukung tabel dan tidak memiliki visual chart.'
                          : 'Belum ada data chart dari stream untuk ditampilkan.'
                        : 'Jalankan analisis atau buka data stream untuk mengubah hasil menjadi visual yang siap dipresentasikan.'}
                    </div>
                  </div>
                </div>
              ) : null}

              {hasSubmittedPrompt && previewStreamChart && resultView === 'chart' ? (
                <div className="space-y-4">
                  <TimeseriesCard
                    title={previewStreamChart.title}
                    subtitle="Stream preview"
                    data={managerChartData}
                    series={managerChartSeries}
                    variant="area"
                    chartHeightClass="h-[300px]"
                    cardClassName="border-border/80"
                    legendAlign="start"
                    metricValue={formatCompactNumber(previewStreamChart.values.reduce((sum, value) => sum + value, 0))}
                    metricDelta={previewStreamChart.values.length}
                    metricDeltaLabel={previewStreamChart.valueLabel}
                    yAxisTickFormatter={formatCompactNumber}
                  />
                  <OrderStatusCard
                    title="Distribution"
                    subtitle={previewStreamChart.valueLabel}
                    items={managerChartStatusItems}
                    valueFormatter={formatCompactNumber}
                  />
                  <TopAmountCard
                    title="Top Breakdown"
                    subtitle={previewStreamChart.title}
                    rows={managerTopRows}
                  />
                </div>
              ) : null}

              {hasSubmittedPrompt && resultView === 'table' ? (
                <div className="space-y-3">
                  {previewStreamTable ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_35px_-30px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_20px_42px_-34px_rgba(2,6,23,0.95)]">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200/70 text-[13px] dark:divide-slate-800/80">
                          <thead className="bg-slate-50/90 dark:bg-slate-900/90">
                            <tr>
                              {previewStreamTable.columns.map((column) => {
                                const alignRight = selectedTableRightAlignedColumns.has(column);

                                return (
                                  <th
                                    key={column}
                                    className={`whitespace-nowrap px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 ${
                                      alignRight ? 'text-right tabular-nums' : 'text-left'
                                    }`}
                                  >
                                    {formatColumnLabel(column)}
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/70">
                            {previewStreamTable.rows.map((row, rowIndex) => (
                              <tr key={`stream-row-${rowIndex}`} className="bg-white transition hover:bg-slate-50/80 dark:bg-slate-950 dark:hover:bg-slate-900/80">
                                {previewStreamTable.columns.map((column) => {
                                  const alignRight = selectedTableRightAlignedColumns.has(column);

                                  return (
                                    <td
                                      key={`${rowIndex}-${column}`}
                                      className={`whitespace-nowrap px-3 py-2 font-normal text-slate-700 dark:text-slate-200 ${
                                        alignRight ? 'text-right tabular-nums' : 'text-left'
                                      }`}
                                    >
                                      {formatTableCellValue(row[column] ?? '-')}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : queryResultColumns.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_35px_-30px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_20px_42px_-34px_rgba(2,6,23,0.95)]">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200/70 text-[13px] dark:divide-slate-800/80">
                          <thead className="bg-slate-50/90 dark:bg-slate-900/90">
                            <tr>
                              {queryResultColumns.map((column) => {
                                const alignRight = queryResultRightAlignedColumns.has(column.name);

                                return (
                                  <th
                                    key={column.name}
                                    className={`whitespace-nowrap px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 ${
                                      alignRight ? 'text-right tabular-nums' : 'text-left'
                                    }`}
                                  >
                                    {formatColumnLabel(column.name)}
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/70">
                            {queryResultRows.map((row, rowIndex) => (
                              <tr key={`query-row-${rowIndex}`} className="bg-white transition hover:bg-slate-50/80 dark:bg-slate-950 dark:hover:bg-slate-900/80">
                                {queryResultColumns.map((column) => {
                                  const alignRight = queryResultRightAlignedColumns.has(column.name);
                                  return (
                                    <td
                                      key={`${rowIndex}-${column.name}`}
                                      className={`whitespace-nowrap px-3 py-2 font-normal text-slate-700 dark:text-slate-200 ${
                                        alignRight ? 'text-right tabular-nums' : 'text-left'
                                      }`}
                                    >
                                      {formatTableCellValue(String(row[column.name] ?? '-'))}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
                      Belum ada data tabel untuk ditampilkan.
                    </div>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>
          <Dialog
            open={isPinDialogOpen}
            onOpenChange={(open) => {
              if (!isPinningWidget) {
                setIsPinDialogOpen(open);
                if (!open) {
                  setPinDialogError(null);
                  setPinDialogSuccess(null);
                }
              }
            }}
          >
            <DialogContent className="max-w-lg rounded-xl border-0 p-0 shadow-[0px_0px_30px_0px_rgba(76,87,125,0.18)]">
              <DialogHeader className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <DialogTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Pin Widget Ke Dashboard
                </DialogTitle>
              </DialogHeader>
              <DialogBody className="space-y-4 px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Widget
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                    {activePinWidgetTitle}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Judul Widget
                  </div>
                  <input
                    value={pinWidgetTitle}
                    onChange={(event) => setPinWidgetTitle(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-[#009EF7] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Masukkan judul widget"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Target Menu Dashboard
                  </div>
                  <Select
                    value={selectedPinTargetKey}
                    onValueChange={(value) => {
                      setSelectedPinTargetKey(value);
                      const matched = pinTargets.find((item) => item.dashboard_key === value);
                      setPinTargetTitle(matched?.menu_title || matched?.dashboard_title || '');
                    }}
                    disabled={isPinTargetsLoading}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950">
                      <SelectValue placeholder={isPinTargetsLoading ? 'Memuat menu dashboard...' : 'Pilih target menu'} />
                    </SelectTrigger>
                    <SelectContent>
                      {pinTargets.map((target) => (
                        <SelectItem key={target.dashboard_key} value={target.dashboard_key}>
                          {target.menu_title || target.dashboard_title} {target.route_path ? `(${target.route_path})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Nama Dashboard Target
                  </div>
                  <input
                    value={pinTargetTitle}
                    onChange={(event) => setPinTargetTitle(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-[#009EF7] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Masukkan nama dashboard target"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Layout Widget
                  </div>
                  <Select value={pinWidgetSpan} onValueChange={setPinWidgetSpan}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lg:col-span-4">Small</SelectItem>
                      <SelectItem value="lg:col-span-6">Medium</SelectItem>
                      <SelectItem value="lg:col-span-8">Large</SelectItem>
                      <SelectItem value="lg:col-span-12">Full Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {pinDialogError ? (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                    {pinDialogError}
                  </div>
                ) : null}
                {pinDialogSuccess ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                    {pinDialogSuccess}
                  </div>
                ) : null}
              </DialogBody>
              <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsPinDialogOpen(false)}
                  disabled={isPinningWidget}
                  className="rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={() => void handlePinActiveWidget()}
                  disabled={!canPinActiveWidget || !selectedPinTargetKey || isPinningWidget}
                  className="rounded-lg bg-[#009EF7] text-white hover:bg-[#07a5ff] disabled:opacity-50"
                >
                  {isPinningWidget ? 'Menyimpan...' : 'Pin Widget'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>
        </div>

        <div className="sticky bottom-0 z-10 border-t border-slate-200/80 bg-[#F5F8FA]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F5F8FA]/90 dark:border-slate-800/80 dark:bg-slate-950/90 dark:supports-[backdrop-filter]:bg-slate-950/80">
          <div className="relative flex min-h-[118px] w-full flex-col justify-end bg-transparent px-3 py-3">
            <div
              className={`mx-auto mt-auto w-full max-w-[780px] rounded-[1.2rem] border bg-white px-4 pt-3.5 shadow-[0px_0px_20px_0px_rgba(76,87,125,0.05)] transition focus-within:border-[#009EF7] focus-within:shadow-[0px_0px_20px_0px_rgba(0,158,247,0.10)] dark:bg-[#171c26] dark:shadow-[0_0_24px_0_rgba(2,6,23,0.5)] dark:focus-within:border-sky-500/50 ${
                isDraggingAttachment
                  ? 'border-[#009EF7] bg-[#F1FAFF] shadow-[0px_0px_20px_0px_rgba(0,158,247,0.10)] dark:border-sky-500 dark:bg-slate-900'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDraggingAttachment(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (!isDraggingAttachment) {
                  setIsDraggingAttachment(true);
                }
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                const currentTarget = event.currentTarget;
                const relatedTarget = event.relatedTarget;
                if (!relatedTarget || !(relatedTarget instanceof Node) || !currentTarget.contains(relatedTarget)) {
                  setIsDraggingAttachment(false);
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                void handleDropAttachments(event.dataTransfer?.files ?? null);
              }}
            >
              <input
                ref={attachmentInputRef}
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.xlsx,.xls,.xlsm,.csv,.doc,.docx,.txt,.json,.md,.xml,.html,.png,.jpg,.jpeg,.webp,.gif,.bmp"
                onChange={(event) => {
                  void handleSelectAttachments(event.target.files);
                }}
              />
              <Textarea
                ref={promptTextareaRef}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={handlePromptKeyDown}
                onPaste={(event) => {
                  void handlePromptPaste(event);
                }}
                className="min-h-[50px] resize-none overflow-hidden !border-0 !bg-transparent px-0 py-0 text-[15px] font-normal leading-relaxed text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:ring-0 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="Ask anything about finance, warehouse, purchase and sales"
              />

              {isDraggingAttachment ? (
                <div className="mt-3 rounded-2xl border border-dashed border-[#009EF7] bg-[#F1FAFF] px-4 py-3 text-sm font-medium text-[#009EF7] dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-300">
                  Lepas file di sini untuk menambah attachment ke prompt.
                </div>
              ) : null}

              {attachments.length > 0 ? (
                <div className="mt-3 overflow-x-auto pb-1">
                  <div className="flex min-w-max gap-2">
                  {attachments.map((attachment) => {
                    const isImageAttachment = attachment.type.startsWith('image/');
                    const isInvalidAttachment = attachment.status === 'failed';
                    const attachmentTypeLabel = attachment.extension
                      ? attachment.extension.toUpperCase()
                      : attachment.type || 'FILE';
                    return (
                      <div
                        key={attachment.id}
                        className={`group relative rounded-2xl border px-3 py-2 text-xs ${
                          isInvalidAttachment
                            ? 'border-rose-300 bg-rose-700 text-white dark:border-rose-500/50 dark:bg-rose-800'
                            : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300'
                        } ${
                          isInvalidAttachment
                            ? 'w-fit max-w-[280px]'
                            : isImageAttachment
                            ? 'w-[104px]'
                            : 'flex w-fit max-w-[320px] items-start gap-2'
                        }`}
                      >
                        {isInvalidAttachment ? (
                          <div className="min-w-0 pr-8">
                            <div className="truncate font-semibold text-white">
                              {clampAttachmentName(attachment.name)}
                            </div>
                            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-50/95">
                              <AlertCircle className="size-3.5 shrink-0" />
                              <span className="truncate">
                                {attachment.warning || attachment.preview || 'File tidak sesuai aturan dan tidak akan dimasukkan ke prompt.'}
                              </span>
                            </div>
                          </div>
                        ) : isImageAttachment ? (
                          <>
                            <div className="overflow-hidden rounded-xl ring-1 ring-slate-200 dark:ring-slate-800">
                              <Image
                                src={attachment.previewUrl ?? ''}
                                alt={attachment.name}
                                width={80}
                                height={52}
                                unoptimized
                                className={`h-[52px] w-full object-cover ${
                                  isInvalidAttachment ? 'opacity-70' : ''
                                }`}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <AttachmentFileTile attachment={attachment} typeLabel={attachmentTypeLabel} />
                            <div className="min-w-0 flex-1">
                              <div className="truncate pr-8 font-semibold text-slate-700 dark:text-slate-100">
                                {clampAttachmentName(attachment.name)}
                              </div>
                              <div className="mt-0.5 truncate text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                                {attachmentTypeLabel}
                              </div>
                            </div>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment.id)}
                          className={`absolute z-10 cursor-pointer rounded-full border p-1.5 opacity-0 shadow-sm transition group-hover:opacity-100 ${
                            isInvalidAttachment
                              ? 'right-2 top-2 border-rose-200/50 bg-white/15 text-white hover:bg-white/25 hover:text-white dark:border-rose-200/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
                              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100'
                          } ${
                            isImageAttachment || isInvalidAttachment ? 'right-2 top-2' : 'right-3 top-1.5'
                          }`}
                          aria-label={`Remove ${attachment.name}`}
                        >
                          <X className="size-4.5" />
                        </button>
                      </div>
                    );
                  })}
                  </div>
                </div>
              ) : null}

              <div className="mt-2.5 flex items-center justify-between gap-3 pb-3.5 text-slate-500 dark:text-slate-400">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => attachmentInputRef.current?.click()}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Paperclip className="size-3.5" />
                    {isPreparingAttachments ? 'Reading file...' : 'Attachment'}
                  </button>
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <SearchCode className="size-3.5" />
                    MyERPPlus
                  </button>
                  <div className="flex items-center gap-2 text-xs">
                    {!isRunningAi ? <span>Paste image/file dengan Ctrl+V atau drag file ke composer.</span> : null}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={selectedModel}
                    onValueChange={(value) => setSelectedModel(value as 'senti-1.0')}
                  >
                    <SelectTrigger className="h-9 min-w-[84px] rounded-full border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="senti-1.0">Senti 1.0</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    className={`h-9 min-w-9 rounded-full px-3 transition ${
                      isRunningAi
                        ? 'min-w-[100px] gap-2 bg-slate-900 text-white shadow-[0px_10px_24px_-12px_rgba(15,23,42,0.45)] hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
                        : prompt.trim()
                          ? 'bg-[#009EF7] text-white shadow-[0px_8px_20px_-8px_rgba(0,158,247,0.55)] hover:bg-[#07a5ff] dark:hover:bg-[#3b97ff]'
                          : 'bg-slate-200 text-slate-500 shadow-sm hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-800'
                    } disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500`}
                    onClick={() => {
                      if (isRunningAi) {
                        cancelActiveRequest();
                        return;
                      }

                      console.log("FR: handleRunAtm 2");
                      void handleRunAtm();
                    }}
                    disabled={!isRunningAi && (!prompt.trim() || isPreparingAttachments)}
                    aria-label={isRunningAi ? 'Cancel AI request' : 'Send prompt'}
                    title={isRunningAi ? 'Cancel request' : 'Send'}
                  >
                    {isRunningAi ? (
                      <>
                        <span className="relative inline-flex items-center justify-center">
                          <LoaderCircle className="size-4 animate-spin" />
                          <X className="absolute size-3.5" />
                        </span>
                        <span className="text-xs font-semibold">Stop</span>
                      </>
                    ) : (
                      <Send className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    </div>

  );
}
