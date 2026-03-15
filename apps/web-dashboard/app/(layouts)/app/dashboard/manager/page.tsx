'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  ScanSearch,
  Send,
  Sparkles,
  Copy,
  WandSparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardHeading,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

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
  prompt: string;
  mode: AiModeKey;
  confidence: number;
  time: string;
  pinned: boolean;
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

type WorkflowEventName =
  | 'started'
  | 'schema_selected'
  | 'analysis_started'
  | 'analysis_done'
  | 'draft_started'
  | 'draft_done'
  | 'review_started'
  | 'review_done'
  | 'completed'
  | 'failed';

type RecommendedAction = {
  title: string;
  detail: string;
  status: 'Open' | 'In Progress' | 'Done';
};

type ActionStatus = RecommendedAction['status'];
type ModuleTabKey = 'finance' | 'inventory' | 'purchase' | 'sales' | 'analytics';
type ResultViewKey = 'table' | 'chart';

const RUN_HISTORY_STORAGE_KEY = 'manager-dashboard-ai-history';
const ACTION_STATUS_STORAGE_KEY = 'manager-dashboard-ai-action-status';
const ACTION_STATUS_FLOW: ActionStatus[] = ['Open', 'In Progress', 'Done'];
const moduleTabs: Array<{ key: ModuleTabKey; label: string }> = [
  { key: 'analytics', label: 'Data Analytics' },
  { key: 'finance', label: 'Finance' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'purchase', label: 'Purchase' },
  { key: 'sales', label: 'Sales' },
];

const schemaKeyByModule: Record<ModuleTabKey, string> = {
  analytics: 'all',
  finance: 'finance',
  inventory: 'inventory',
  purchase: 'purchasing',
  sales: 'sales',
};

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

const financeInsightLogs: AiInsightLog[] = [
  {
    id: 1,
    user_prompt: 'Tolong analisis komponen ARR bulan ini dan tampilkan perbandingannya dengan bulan lalu, khusus untuk segmen Enterprise.',
    steps: [
      {
        type: 'thought',
        content:
          'User wants an ARR analysis comparing the current month with the previous month, specifically filtered for the Enterprise segment. I need to query the gross new, expansion, contraction, and churned ARR from the monthly_arr_metrics table.',
      },
      {
        type: 'commentary',
        content:
          'Saya akan menarik data komponen ARR (Gross New, Expansion, Contraction, Churn) untuk bulan ini dan membandingkannya dengan bulan sebelumnya khusus pada pelanggan Enterprise.',
      },
      {
        type: 'read_query',
        target: 'finance_db.monthly_arr_metrics',
        description: 'Membaca skema tabel metrik ARR bulanan untuk memastikan ketersediaan kolom segmen pelanggan.',
      },
      {
        type: 'generate_query',
        query_string:
          "SELECT month, gross_new, expansion, contraction, churn FROM finance_db.monthly_arr_metrics WHERE customer_segment = 'Enterprise' AND month >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') ORDER BY month ASC;",
        description: 'Mengambil agregasi data komponen ARR untuk 2 bulan terakhir pada segmen Enterprise.',
        rows_affected: 2,
      },
      {
        type: 'chart_insight',
        chart_type: 'waterfall',
        title: 'Enterprise ARR Components (Current vs Previous Month)',
        description:
          'Visualisasi waterfall untuk menunjukkan penambahan dari Gross New dan Expansion, dikurangi Contraction dan Churn untuk memvisualisasikan Net New ARR.',
      },
      {
        type: 'ai_insight',
        finding:
          'Expansion ARR naik 15% dibandingkan bulan lalu, namun angka Churn juga terdeteksi meningkat tajam sebesar 8% pada pelanggan Enterprise.',
        recommendation:
          'Perlu dilakukan investigasi segera bersama tim Customer Success mengenai alasan tingginya churn pada segmen Enterprise agar Net New ARR bulan depan tidak negatif.',
      },
      {
        type: 'summary',
        content:
          'Analisis komponen ARR telah selesai dimuat. Secara keseluruhan, pertumbuhan pendapatan dari klien yang sudah ada (Expansion) sangat baik, namun lonjakan churn di segmen Enterprise menjadi anomali yang perlu ditindaklanjuti segera.',
      },
    ],
  },
  {
    id: 2,
    user_prompt: 'Berapa rasio biaya operasional terhadap pendapatan (Opex to Revenue Ratio) kuartal ini?',
    steps: [
      {
        type: 'thought',
        content:
          "Need to calculate the Opex to Revenue ratio for the current quarter. I'll need to sum all operational expenses and divide it by the total gross revenue for Q1.",
      },
      {
        type: 'commentary',
        content: 'Menghitung rasio Biaya Operasional (Opex) terhadap Pendapatan untuk kuartal berjalan.',
      },
      {
        type: 'read_query',
        target: 'finance_db.general_ledger',
        description: 'Memeriksa pemetaan akun (Chart of Accounts) untuk membedakan beban operasional dan pendapatan kotor.',
      },
      {
        type: 'generate_query',
        query_string:
          "SELECT SUM(CASE WHEN account_type = 'Opex' THEN amount ELSE 0 END) / SUM(CASE WHEN account_type = 'Revenue' THEN amount ELSE 0 END) AS opex_ratio FROM finance_db.general_ledger WHERE quarter = 'Q1_2026';",
        description: 'Menghitung rasio pembagian total Opex dengan total Revenue pada Kuartal 1.',
        rows_affected: 1,
      },
      {
        type: 'chart_insight',
        chart_type: 'gauge',
        title: 'Opex to Revenue Ratio (Q1 2026)',
        description: 'Gauge chart untuk menampilkan rasio Opex, dengan zona hijau di bawah 40%, kuning 40-60%, dan merah di atas 60%.',
      },
      {
        type: 'ai_insight',
        finding:
          'Rasio Opex terhadap Pendapatan saat ini berada di angka 42%, sedikit melebihi target ideal perusahaan yaitu 40%.',
        recommendation:
          'Disarankan untuk melakukan efisiensi pada pos pengeluaran marketing dan software subscription yang tidak terpakai (underutilized) untuk menekan angka rasio.',
      },
      {
        type: 'summary',
        content:
          'Data Rasio Opex terhadap Pendapatan telah divisualisasikan. Angkanya terpantau sedikit di atas batas ideal. Anda dapat melihat rincian pengeluaran operasional terbesar di tabel detail di bawah.',
      },
    ],
  },
];

const promptLibrary: Array<{ label: string; value: string; mode: AiModeKey; logId: number }> = [
  {
    label: 'ARR Enterprise',
    value: financeInsightLogs[0].user_prompt,
    mode: 'transform',
    logId: 1,
  },
  {
    label: 'Opex Ratio',
    value: financeInsightLogs[1].user_prompt,
    mode: 'ask',
    logId: 2,
  },
];

const modeCopy = {
  ask: {
    title: 'AI Analyst Response',
    description: 'Jawaban natural language untuk analisis finance, rasio, dan anomali pendapatan.',
    insightTitle: 'Jawaban AI',
    insightSummary:
      'Rasio biaya operasional terhadap pendapatan kuartal ini berada sedikit di atas batas ideal. Dari dummy source `finance_db.general_ledger`, beban terbesar masih terkonsentrasi pada `account_type = Opex`, sementara pertumbuhan `Revenue` belum cukup cepat untuk menurunkan rasio secara natural.\n\nKesenjangan utamanya tidak datang dari satu pos tunggal, tetapi dari akumulasi biaya marketing, subscription software, dan overhead operasional yang tumbuh lebih cepat dibanding revenue run-rate.\n\nArea yang paling layak dicek lebih dulu adalah `amount`, `account_type`, `quarter`, dan mapping akun biaya yang underutilized.',
    insights: [
      'Opex to Revenue Ratio saat ini berada di 42%, di atas target internal 40%.',
      'Pos marketing dan software subscription menyumbang kenaikan biaya paling besar pada kuartal berjalan.',
      'Revenue masih tumbuh, tetapi belum cukup cepat untuk menutup lonjakan operating expense.',
    ],
    actions: [
      {
        title: 'Audit software subscriptions',
        detail: 'Review subscription dummy yang underutilized dan tandai service yang dapat dihentikan pada bulan berjalan.',
        status: 'Open',
      },
      {
        title: 'Review spend marketing',
        detail: 'Bandingkan spend marketing dummy terhadap pipeline conversion untuk menekan channel dengan ROI terendah.',
        status: 'In Progress',
      },
      {
        title: 'Reforecast revenue buffer',
        detail: 'Tambahkan scenario buffer pada forecast dummy agar rasio Opex dapat kembali ke bawah 40% pada kuartal berikutnya.',
        status: 'Done',
      },
    ],
    panelTitle: 'Finance analysis pattern',
    panelDescription: 'Pertanyaan ad hoc yang paling sering dibawa finance manager ke AI insight.',
  },
  transform: {
    title: 'Generated Dashboard Plan',
    description: 'Prompt finance diterjemahkan menjadi KPI ARR, komponen revenue, dan visual embedded insight.',
    insightTitle: 'Rencana Dashboard',
    insightSummary:
      'Sistem menyarankan komposisi dashboard ARR dengan blok `Net New ARR`, `Gross New`, `Expansion`, `Contraction`, dan `Churn`, plus perbandingan actual vs plan. Struktur ini cocok untuk review finance bulanan karena langsung menghubungkan sumber pertumbuhan, loss, dan gap terhadap target.',
    insights: [
      'Visual utama: waterfall ARR components dan summary card actual vs plan.',
      'Dimensi prioritas: customer segment, month, product line, dan revenue motion.',
      'Filter default: current month vs previous month, Enterprise segment.',
    ],
    actions: [
      {
        title: 'Publish ARR review dashboard',
        detail: 'Simpan hasil sebagai template dummy `ARR Monthly Review` dan bagikan ke finance leadership.',
        status: 'Open',
      },
      {
        title: 'Aktifkan drill-down ARR components',
        detail: 'Tambahkan drill-down dummy dari `Net New ARR` ke `gross_new`, `expansion`, `contraction`, dan `churn` per segment.',
        status: 'In Progress',
      },
      {
        title: 'Jadwalkan snapshot bulanan',
        detail: 'Jadwalkan snapshot dashboard dummy otomatis setiap awal bulan untuk finance review.',
        status: 'Done',
      },
    ],
    panelTitle: 'Finance dashboard blueprint',
    panelDescription: 'Blok dashboard yang dihasilkan dari prompt ARR finance.',
  },
  monitor: {
    title: 'Predictive Risk Brief',
    description: 'Pengawasan finance untuk risiko churn, contraction, dan tekanan efisiensi biaya.',
    insightTitle: 'Prioritas Hari Ini',
    insightSummary:
      'Prediksi menunjukkan tekanan terbesar bulan ini datang dari kombinasi kenaikan churn dan rasio Opex yang belum turun. Jika tidak dikoreksi, Net New ARR berisiko tertahan walaupun gross new dan expansion masih tumbuh positif.',
    insights: [
      'Kenaikan churn Enterprise menjadi sinyal risiko utama terhadap target ARR bulanan.',
      'Rasio Opex yang stabil di atas target mempersempit ruang perbaikan margin.',
      'Mitigasi tercepat adalah kombinasi retensi account besar dan efisiensi spend non-esensial.',
    ],
    actions: [
      {
        title: 'Escalate churn review',
        detail: 'Jadwalkan review dummy bersama Customer Success untuk akun Enterprise yang berisiko churn tinggi.',
        status: 'Open',
      },
      {
        title: 'Aktifkan alert spend variance',
        detail: 'Aktifkan alert dummy bila spend bulanan melewati batas variance yang disetujui finance.',
        status: 'In Progress',
      },
      {
        title: 'Distribusi finance control brief',
        detail: 'Kirim ringkasan tindakan dummy ke finance lead dan revenue ops untuk tindak lanjut mingguan.',
        status: 'Done',
      },
    ],
    panelTitle: 'Finance risk queue',
    panelDescription: 'Prioritas berbasis dampak revenue dan urgensi efisiensi.',
  },
} satisfies Record<
  AiModeKey,
  {
    title: string;
    description: string;
    insightTitle: string;
    insightSummary: string;
    insights: string[];
    actions: RecommendedAction[];
    panelTitle: string;
    panelDescription: string;
  }
>;

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

function getStepTone(stepType: StepType) {
  const tones: Record<StepType, { badge: string; card: string }> = {
    thought: {
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      card: 'bg-slate-50/80',
    },
    commentary: {
      badge: 'bg-sky-100 text-sky-700 border-sky-200',
      card: 'bg-sky-50/70',
    },
    read_query: {
      badge: 'bg-violet-100 text-violet-700 border-violet-200',
      card: 'bg-violet-50/70',
    },
    generate_query: {
      badge: 'bg-amber-100 text-amber-700 border-amber-200',
      card: 'bg-amber-50/70',
    },
    chart_insight: {
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      card: 'bg-emerald-50/70',
    },
    ai_insight: {
      badge: 'bg-rose-100 text-rose-700 border-rose-200',
      card: 'bg-rose-50/70',
    },
    summary: {
      badge: 'bg-zinc-100 text-zinc-700 border-zinc-200',
      card: 'bg-zinc-50/80',
    },
  };

  return tones[stepType];
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return parts.filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`strong-${index}`} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={`code-${index}`} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.95em] text-foreground">
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

function renderMarkdownBlocks(markdown: string): ReactNode[] {
  const normalized = markdown.replace(/\r\n/g, '\n').trim();

  if (!normalized) {
    return [];
  }

  const blocks = normalized.split(/\n\n+/);

  return blocks.map((block, blockIndex) => {
    const trimmed = block.trim();
    const lines = trimmed.split('\n').map((line) => line.trim()).filter(Boolean);

    const fencedCodeMatch = trimmed.match(/^```(?:\w+)?\n([\s\S]*?)\n```$/);
    if (fencedCodeMatch) {
      return (
        <pre
          key={`codeblock-${blockIndex}`}
          className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs leading-6 text-slate-100"
        >
          <code>{fencedCodeMatch[1]}</code>
        </pre>
      );
    }

    if (lines.length === 1 && /^#{1,3}\s/.test(lines[0])) {
      const headingText = lines[0].replace(/^#{1,3}\s/, '');
      const headingLevel = (lines[0].match(/^#{1,3}/)?.[0].length ?? 1);
      const headingClassName =
        headingLevel === 1
          ? 'text-base font-semibold text-foreground'
          : headingLevel === 2
            ? 'text-sm font-semibold text-foreground'
            : 'text-xs font-semibold uppercase tracking-[0.14em] text-foreground/75';

      return (
        <p key={`heading-${blockIndex}`} className={headingClassName}>
          {renderInlineMarkdown(headingText)}
        </p>
      );
    }

    if (lines.every((line) => line.startsWith('> '))) {
      return (
        <blockquote
          key={`blockquote-${blockIndex}`}
          className="rounded-r-xl border-l-4 border-sky-200 bg-sky-50/60 px-3 py-2 text-sm leading-6 text-foreground/85"
        >
          {lines.map((line, lineIndex) => (
            <p key={`blockquote-line-${blockIndex}-${lineIndex}`}>
              {renderInlineMarkdown(line.slice(2).trim())}
            </p>
          ))}
        </blockquote>
      );
    }

    if (lines.every((line) => line.startsWith('- '))) {
      return (
        <ul key={`list-${blockIndex}`} className="space-y-2 pl-5 text-sm leading-6 text-foreground/85 list-disc">
          {lines.map((line, lineIndex) => (
            <li key={`list-item-${blockIndex}-${lineIndex}`}>{renderInlineMarkdown(line.slice(2).trim())}</li>
          ))}
        </ul>
      );
    }

    if (lines.every((line) => /^\d+\.\s/.test(line))) {
      return (
        <ol key={`ordered-list-${blockIndex}`} className="space-y-2 pl-5 text-sm leading-6 text-foreground/85 list-decimal">
          {lines.map((line, lineIndex) => (
            <li key={`ordered-list-item-${blockIndex}-${lineIndex}`}>{renderInlineMarkdown(line.replace(/^\d+\.\s/, ''))}</li>
          ))}
        </ol>
      );
    }

    return (
      <p key={`paragraph-${blockIndex}`} className="text-sm leading-6 text-foreground/85">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });
}

function getAiWorkflowWebSocketUrl(requestId: string) {
  if (typeof window === 'undefined') {
    return '';
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname;
  return `${protocol}//${host}:8001/api/chat/progress/ws/${requestId}`;
}

export default function ManagerDashboardPage() {
  const [activeModule, setActiveModule] = useState<ModuleTabKey>('finance');
  const [resultView, setResultView] = useState<ResultViewKey>('chart');
  const [prompt, setPrompt] = useState<string>(promptLibrary[0].value);
  const [submittedPrompt, setSubmittedPrompt] = useState<string>(promptLibrary[0].value);
  const [submittedAt, setSubmittedAt] = useState<string>('Belum dijalankan');
  const [runHistory, setRunHistory] = useState<RunHistoryItem[]>([]);
  const [actionStatusOverrides, setActionStatusOverrides] = useState<Record<string, ActionStatus>>({});
  const [isRunningAi, setIsRunningAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AiChatResult | null>(null);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [showPrimaryInsightDetail, setShowPrimaryInsightDetail] = useState(false);
  const [showSecondaryInsightDetail, setShowSecondaryInsightDetail] = useState(false);
  const [copiedQueryIndex, setCopiedQueryIndex] = useState<number | null>(null);
  const detection = useMemo(() => detectMode(prompt), [prompt]);
  const detectedMode = detection.mode;
  const content = useMemo(() => modeCopy[detectedMode], [detectedMode]);
  const submittedDetection = useMemo(() => detectMode(submittedPrompt), [submittedPrompt]);
  const submittedContent = useMemo(() => modeCopy[submittedDetection.mode], [submittedDetection]);
  const displayContent = submittedAt === 'Belum dijalankan' ? content : submittedContent;
  const activeInsightLog = useMemo(
    () => financeInsightLogs.find((log) => log.user_prompt === (submittedAt === 'Belum dijalankan' ? prompt : submittedPrompt)) ?? financeInsightLogs[0],
    [prompt, submittedAt, submittedPrompt],
  );
  const activeChartStep = activeInsightLog.steps.find((step): step is ChartInsightStep => step.type === 'chart_insight');
  const activeInsightStep = activeInsightLog.steps.find((step): step is AiInsightSpecificStep => step.type === 'ai_insight');
  const activeSummaryStep = activeInsightLog.steps.find((step): step is SummaryStep => step.type === 'summary');
  const activeReadTargets = activeInsightLog.steps.filter((step): step is ReadQueryStep => step.type === 'read_query');
  const activeGenerateQuerySteps = activeInsightLog.steps.filter((step): step is GenerateQueryStep => step.type === 'generate_query');
  const activeChartSeries = useMemo(() => {
    if (activeInsightLog.id === 1) {
      return {
        title: activeChartStep?.title ?? 'Enterprise ARR Components (Current vs Previous Month)',
        legend: ['Current Month', 'Previous Month'],
        pointsA: [2.6, 3.1, 3.3, 3.8, 4.2, 4.4, 4.7, 5.0],
        pointsB: [2.9, 3.0, 3.2, 3.6, 3.9, 4.1, 4.3, 4.6],
      };
    }

    return {
      title: activeChartStep?.title ?? 'Opex to Revenue Ratio (Q1 2026)',
      legend: ['Actual Ratio', 'Target Ratio'],
      pointsA: [44, 43, 42, 41, 43, 42, 42, 41],
      pointsB: [40, 40, 40, 40, 40, 40, 40, 40],
    };
  }, [activeChartStep, activeInsightLog.id]);

  const getActionStatus = (mode: AiModeKey, title: string, fallback: ActionStatus) =>
    actionStatusOverrides[`${mode}:${title}`] ?? fallback;

  const cycleActionStatus = (mode: AiModeKey, title: string, currentStatus: ActionStatus) => {
    const currentIndex = ACTION_STATUS_FLOW.indexOf(currentStatus);
    const nextStatus = ACTION_STATUS_FLOW[(currentIndex + 1) % ACTION_STATUS_FLOW.length];

    setActionStatusOverrides((current) => ({
      ...current,
      [`${mode}:${title}`]: nextStatus,
    }));
  };

  const handleRunAtm = async () => {
    const runTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setSubmittedPrompt(prompt);
    setSubmittedAt(runTime);
    setAiError(null);
    setAiResult(null);
    setIsRunningAi(true);
    setWorkflowSteps(buildWorkflowSteps(0));
    setCurrentRequestId(null);
    setRunHistory((current) => [
      {
        prompt,
        mode: detection.mode,
        confidence: detection.confidence,
        time: runTime,
        pinned: current.find((item) => item.prompt === prompt)?.pinned ?? false,
      },
      ...current.filter((item) => item.prompt !== prompt),
    ]
      .sort((left, right) => Number(right.pinned) - Number(left.pinned))
      .slice(0, 5));

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: prompt,
          include_schema: true,
          include_samples: false,
          execute_read_only_query: false,
          schema_key: schemaKeyByModule[activeModule],
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string; data?: AiChatResult }
        | null;

      if (!response.ok || !payload?.success || !payload.data) {
        throw new Error(payload?.message || 'AI engine tidak mengembalikan respons yang valid.');
      }

      const result = payload.data;
      const responseRequestId = payload.data.request_id || response.headers.get('x-request-id');

      setAiResult(result ?? null);
      if (responseRequestId) {
        setCurrentRequestId(responseRequestId);
      } else {
        setWorkflowSteps(buildWorkflowSteps(5));
        setIsRunningAi(false);
      }
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Gagal menghubungi AI engine.');
      setAiResult(null);
      setWorkflowSteps(buildWorkflowSteps(0));
      setIsRunningAi(false);
    }
  };

  const displaySchemaTables = aiResult?.semantic_schema?.tables?.slice(0, 4) ?? [];
  const displayQueries = aiResult?.suggested_queries?.slice(0, 3) ?? [];
  const queryResultColumns = aiResult?.query_result?.columns ?? [];
  const queryResultRows = aiResult?.query_result?.rows ?? [];
  const renderedAnswer = aiResult?.answer ? renderMarkdownBlocks(aiResult.answer) : null;
  const answerHighlights = aiResult?.answer
    ? aiResult.answer
        .split('\n')
        .map((item) => item.replace(/[*`#-]/g, '').trim())
        .filter((item) => item.length > 0)
        .slice(0, 3)
    : displayContent.insights.slice(0, 3);
  const chartSeries = activeChartSeries;
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

  const handleCopyQuery = async (sql: string, index: number) => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopiedQueryIndex(index);
      window.setTimeout(() => {
        setCopiedQueryIndex((current) => (current === index ? null : current));
      }, 1800);
    } catch {
      setCopiedQueryIndex(null);
    }
  };

  useEffect(() => {
    const stored = window.localStorage.getItem(RUN_HISTORY_STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as RunHistoryItem[];
      if (Array.isArray(parsed)) {
        setRunHistory(parsed.slice(0, 5));
      }
    } catch {
      window.localStorage.removeItem(RUN_HISTORY_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(RUN_HISTORY_STORAGE_KEY, JSON.stringify(runHistory));
  }, [runHistory]);

  useEffect(() => {
    const stored = window.localStorage.getItem(ACTION_STATUS_STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Record<string, ActionStatus>;
      if (parsed && typeof parsed === 'object') {
        setActionStatusOverrides(parsed);
      }
    } catch {
      window.localStorage.removeItem(ACTION_STATUS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ACTION_STATUS_STORAGE_KEY, JSON.stringify(actionStatusOverrides));
  }, [actionStatusOverrides]);

  useEffect(() => {
    if (!currentRequestId) {
      return;
    }

    const socket = new WebSocket(getAiWorkflowWebSocketUrl(currentRequestId));

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { event?: WorkflowEventName };
        const eventName = payload.event;
        if (!eventName) {
          return;
        }

        applyWorkflowEvent(eventName);

        if (eventName === 'completed' || eventName === 'failed') {
          socket.close();
        }
      } catch {
        socket.close();
        setIsRunningAi(false);
      }
    };

    socket.onerror = () => {
      socket.close();
      setIsRunningAi(false);
    };

    return () => {
      socket.close();
    };
  }, [currentRequestId]);

  return (
    <div className="container space-y-3 pb-8">
      <div className="flex flex-wrap overflow-hidden rounded-t-2xl border border-b-0 border-border/80 bg-muted/40">
        {moduleTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveModule(tab.key)}
            className={`border-r border-border/80 px-4 py-2 text-xs transition cursor-pointer ${
              activeModule === tab.key ? 'bg-background font-semibold text-primary' : 'text-secondary-foreground hover:bg-background/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-0 overflow-hidden rounded-b-2xl border border-border/80 bg-background lg:grid-cols-[0.96fr_1.04fr]">
        <div className="border-r border-border/80">
          <div className="space-y-3 p-3">
            <div className="space-y-2">
              <h2 className="max-w-xl text-l font-semibold tracking-tight text-mono">
                {submittedPrompt}
              </h2>
            </div>

            <div className="space-y-2 rounded-2xl border border-border/80 bg-muted/20 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-mono">
                <span className="inline-flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-fuchsia-500 via-violet-500 to-sky-500 text-white shadow-sm">
                  ∞
                </span>
                Sentient {moduleTabs.find((tab) => tab.key === activeModule)?.label.split(' ')[0] ?? 'Data'} agent
              </div>
              {renderedAnswer && renderedAnswer.length > 0 ? renderedAnswer : (
                <p className="whitespace-pre-wrap text-sm leading-6 text-foreground/85">{activeSummaryStep?.content ?? displayContent.insightSummary}</p>
              )}

              {!aiResult?.answer ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowPrimaryInsightDetail((current) => !current)}
                    className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-border/80 bg-background px-3 py-2 text-left transition hover:bg-background/90"
                  >
                    <div className="flex items-center gap-2">
                      <ChartResultIcon className="size-5 shrink-0" />
                      <span className="text-sm font-medium text-foreground">{activeChartStep?.title ?? 'Net new ARR (Actual vs Plan)'}</span>
                    </div>
                    <span className="text-xs font-medium text-secondary-foreground">{showPrimaryInsightDetail ? 'Hide' : 'View'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSecondaryInsightDetail((current) => !current)}
                    className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-border/80 bg-background px-3 py-2 text-left transition hover:bg-background/90"
                  >
                    <div className="flex items-center gap-2">
                      <ChartResultIcon className="size-5 shrink-0" />
                      <span className="text-sm font-medium text-foreground">ARR components (gross new, expansion, losses)</span>
                    </div>
                    <span className="text-xs font-medium text-secondary-foreground">{showSecondaryInsightDetail ? 'Hide' : 'View'}</span>
                  </button>
                </div>
              ) : null}

              {!aiResult?.answer ? (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {activeReadTargets.map((step) => step.target).slice(0, 4).map((field) => (
                    <span
                      key={field}
                      className="inline-flex items-center rounded-full border border-border/70 bg-background px-2.5 py-1 text-[10px] font-medium text-secondary-foreground"
                    >
                      {field}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowPrimaryInsightDetail((current) => !current)}
                    className="inline-flex cursor-pointer items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-sky-700 transition hover:bg-sky-100"
                  >
                    {showPrimaryInsightDetail ? 'Hide' : 'View'}
                  </button>
                </div>
              ) : null}

              {!aiResult?.answer && showPrimaryInsightDetail ? (
                <div className="rounded-xl border border-border/70 bg-background/80 p-3 text-xs text-secondary-foreground">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="rounded-lg border border-border/60 bg-muted/40 p-2">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/70">chart_insight</div>
                      <div className="mt-1 text-sm font-semibold text-foreground">Gross New + Expansion</div>
                      <div className="mt-1 leading-5">{activeChartStep?.description ?? 'Visualisasi komponen ARR untuk membandingkan actual vs plan.'}</div>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-muted/40 p-2">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/70">ai_insight</div>
                      <div className="mt-1 text-sm font-semibold text-foreground">Key finding</div>
                      <div className="mt-1 leading-5">{activeInsightStep?.finding ?? 'Belum ada temuan utama.'}</div>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-muted/40 p-2">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/70">recommendation</div>
                      <div className="mt-1 text-sm font-semibold text-foreground">Recommended action</div>
                      <div className="mt-1 leading-5">{activeInsightStep?.recommendation ?? 'Belum ada rekomendasi tambahan.'}</div>
                    </div>
                  </div>
                </div>
              ) : null}

              {!aiResult?.answer && showSecondaryInsightDetail ? (
                <div className="rounded-xl border border-border/70 bg-background/80 p-3 text-xs text-secondary-foreground">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="rounded-lg border border-border/60 bg-muted/40 p-2">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/70">gross_new</div>
                      <div className="mt-1 text-sm font-semibold text-foreground">Primary acquisition</div>
                      <div className="mt-1 leading-5">Komponen revenue baru yang masuk dari pelanggan baru pada periode berjalan.</div>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-muted/40 p-2">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/70">expansion</div>
                      <div className="mt-1 text-sm font-semibold text-foreground">Upsell growth</div>
                      <div className="mt-1 leading-5">Pendapatan tambahan dari account existing yang meningkatkan kontrak atau seat count.</div>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-muted/40 p-2">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/70">losses</div>
                      <div className="mt-1 text-sm font-semibold text-foreground">Contraction + churn</div>
                      <div className="mt-1 leading-5">Komponen pengurang ARR yang paling perlu dimonitor untuk menjaga net new ARR tetap positif.</div>
                    </div>
                  </div>
                </div>
              ) : null}

              {answerHighlights.map((item) => (
                <p key={item} className="text-xs leading-6 text-secondary-foreground">
                  {item}
                </p>
              ))}
            </div>

            <div className="relative rounded-2xl border border-border/80 bg-background p-3 shadow-sm">
              <div className="pointer-events-none absolute left-3 bottom-3">
                <span className="inline-flex items-center rounded-full border border-border/80 bg-muted/80 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-secondary-foreground/80">
                  MyERPPlus
                </span>
              </div>
              <div className="pointer-events-none absolute right-3 bottom-3 flex justify-end">
                <Button
                  size="icon"
                  className="pointer-events-auto rounded-full shadow-sm"
                  onClick={() => void handleRunAtm()}
                  disabled={isRunningAi || !prompt.trim()}
                  aria-label={isRunningAi ? 'Running AI request' : 'Send prompt'}
                  title={isRunningAi ? 'Running...' : 'Send'}
                >
                  <Send className="size-4 text-emerald-500" />
                </Button>
              </div>

              <div className="border-t border-border/70 pt-3">
                <Textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  className="min-h-16 resize-none border-0 bg-transparent px-1 pb-12 pr-12 text-xs shadow-none focus-visible:ring-0"
                  placeholder="Ask anything about ARR, churn, opex ratio, expansion, or finance variance."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 bg-muted/20 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex rounded-xl border border-border/80 bg-background p-1">
              {resultViews.map((view) => (
                <button
                  key={view.key}
                  type="button"
                  onClick={() => setResultView(view.key)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition ${
                    resultView === view.key ? 'bg-muted font-medium text-foreground' : 'text-secondary-foreground hover:bg-muted/60'
                  }`}
                >
                  <view.icon className={`size-4 shrink-0 ${resultView === view.key ? 'opacity-100' : 'opacity-85'}`} />
                  {view.label}
                </button>
              ))}
            </div>
            <Button variant="ghost" className="gap-2 border border-border/80 bg-background text-xs">
              <Sparkles className="size-4 text-amber-500" />
              Pin to dashboard
            </Button>
          </div>

          <Card className="min-h-[260px] border-border/80 bg-background">
            <CardHeader>
              <CardHeading>
                <CardTitle className="text-sm">{chartSeries.title}</CardTitle>
              </CardHeading>
            </CardHeader>
            <CardContent>
              {resultView === 'chart' ? (
                <div className="space-y-3">
                  <svg viewBox="0 0 640 280" className="h-[180px] w-full overflow-visible rounded-xl bg-muted/20">
                    {[0, 1, 2, 3, 4].map((line) => (
                      <line key={line} x1="40" y1={40 + line * 48} x2="610" y2={40 + line * 48} stroke="#d4d4d8" strokeDasharray="4 6" />
                    ))}
                    {chartSeries.pointsA.map((_, index) => (
                      <text key={`x-${index}`} x={55 + index * 78} y="260" fontSize="12" fill="#71717a">
                        Wk {index + 1}
                      </text>
                    ))}
                    <polyline
                      fill="none"
                      stroke="#4f86f7"
                      strokeWidth="3"
                      points={chartSeries.pointsA.map((value, index) => `${55 + index * 78},${225 - value * 3.2}`).join(' ')}
                    />
                    <polyline
                      fill="none"
                      stroke="#55a44e"
                      strokeWidth="3"
                      points={chartSeries.pointsB.map((value, index) => `${55 + index * 78},${225 - value * 3.2}`).join(' ')}
                    />
                  </svg>
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-secondary-foreground">
                    <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-[#4f86f7]" />{chartSeries.legend[0]}</div>
                    <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-[#55a44e]" />{chartSeries.legend[1]}</div>
                  </div>
                </div>
              ) : null}

              {resultView === 'table' ? (
                <div className="space-y-3">
                  {aiResult?.query_result ? (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Live Query Result</div>
                            <div className="mt-1 text-sm font-semibold text-emerald-950">
                              Source: {aiResult.data_source ?? 'myerpplus'}
                            </div>
                          </div>
                          <span className="rounded-full border border-emerald-300 bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                            {aiResult.query_result.row_count} rows
                          </span>
                        </div>
                        <pre className="mt-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs leading-6 text-slate-100">
                          <code>{aiResult.query_result.sql}</code>
                        </pre>
                      </div>

                      {queryResultColumns.length > 0 ? (
                        <div className="overflow-hidden rounded-xl border border-border/80 bg-background">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border/70 text-xs">
                              <thead className="bg-muted/50">
                                <tr>
                                  {queryResultColumns.map((column) => (
                                    <th
                                      key={column.name}
                                      className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-[0.12em] text-secondary-foreground"
                                    >
                                      {column.name}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/60">
                                {queryResultRows.map((row, rowIndex) => (
                                  <tr key={`query-row-${rowIndex}`} className="bg-background">
                                    {queryResultColumns.map((column) => (
                                      <td key={`${rowIndex}-${column.name}`} className="whitespace-nowrap px-3 py-2 text-foreground">
                                        {String(row[column.name] ?? '-')}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {displayQueries.length > 0 ? (
                    <div className="space-y-3">
                      {displayQueries.map((query, index) => (
                        <div key={`${query.sql}-${index}`} className="rounded-xl border border-border/80 bg-background p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary-foreground">Example Query {index + 1}</div>
                            <div className="flex items-center gap-2">
                              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                                {query.safety.replace('_', ' ')}
                              </span>
                              <button
                                type="button"
                                onClick={() => void handleCopyQuery(query.sql, index)}
                                className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-muted/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary-foreground transition hover:bg-muted"
                              >
                                <Copy className="size-3.5" />
                                {copiedQueryIndex === index ? 'Copied' : 'Copy SQL'}
                              </button>
                            </div>
                          </div>
                          <p className="mt-2 text-xs leading-5 text-secondary-foreground">{query.rationale}</p>
                          <pre className="mt-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs leading-6 text-slate-100">
                            <code>{query.sql}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {displaySchemaTables.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {displaySchemaTables.map((table) => (
                        <div key={`${table.schema}.${table.name}`} className="rounded-xl border border-border/80 bg-background p-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary-foreground">Schema Table</div>
                          <div className="mt-1 text-sm font-semibold text-foreground">{table.schema}.{table.name}</div>
                          <p className="mt-2 text-xs leading-5 text-secondary-foreground">
                            PK: {table.primary_key.join(', ') || '-'}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-secondary-foreground">
                            Kolom: {table.columns.slice(0, 5).map((column) => column.name).join(', ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {activeInsightLog.steps.map((step, index) => (
                    <div key={`${activeInsightLog.id}-${index}-${step.type}`} className={`rounded-xl border border-border/80 p-3 ${getStepTone(step.type).card}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getStepTone(step.type).badge}`}>
                          {step.type}
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.14em] text-secondary-foreground">step {index + 1}</div>
                      </div>
                      <div className="mt-2 text-xs leading-6 text-secondary-foreground">
                        {'content' in step ? step.content : null}
                        {'target' in step ? `${step.target}${step.description ? ` - ${step.description}` : ''}` : null}
                        {'query_string' in step ? `${step.description} Query: ${step.query_string}` : null}
                        {'chart_type' in step ? `${step.title} - ${step.description}` : null}
                        {'finding' in step ? `${step.finding}${step.recommendation ? ` Recommendation: ${step.recommendation}` : ''}` : null}
                      </div>
                    </div>
                  ))}

                  {activeGenerateQuerySteps.length > 0 ? (
                    <div className="rounded-xl border border-border/80 bg-slate-950 p-3 text-slate-100">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Generated Query</div>
                      <pre className="whitespace-pre-wrap break-words text-xs leading-6">{activeGenerateQuerySteps[0].query_string}</pre>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
