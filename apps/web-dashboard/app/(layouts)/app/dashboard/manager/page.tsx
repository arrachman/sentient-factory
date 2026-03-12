'use client';

import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  ChartColumn,
  CircleAlert,
  Clock3,
  LayoutDashboard,
  RefreshCcw,
  ScanSearch,
  Send,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import {
  KpiGrid,
  TimeseriesCard,
  TopAmountCard,
  WarehouseAlertCard,
  type KpiCard,
  type TimeseriesDatum,
  type TimeseriesSeries,
  type TopAmountRow,
} from '@/components/dashboard';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
  answer: string;
  model: string;
  provider: string;
  semantic_schema?: {
    tables: AiSchemaTable[];
  } | null;
  suggested_queries?: Array<{
    sql: string;
    rationale: string;
    safety: 'read_only';
  }>;
};

type RecommendedAction = {
  title: string;
  detail: string;
  status: 'Open' | 'In Progress' | 'Done';
};

type ActionStatus = RecommendedAction['status'];

const RUN_HISTORY_STORAGE_KEY = 'manager-dashboard-ai-history';
const ACTION_STATUS_STORAGE_KEY = 'manager-dashboard-ai-action-status';
const ACTION_STATUS_FLOW: ActionStatus[] = ['Open', 'In Progress', 'Done'];

const promptLibrary = [
  {
    label: 'Kenapa SLA turun?',
    value: 'Apa penyebab utama outbound delay minggu ini?',
    mode: 'ask' as const,
  },
  {
    label: 'Buat dashboard SLA',
    value: 'Buat dashboard SLA outbound per jam dengan top penyebab delay.',
    mode: 'transform' as const,
  },
  {
    label: 'Risiko hari ini',
    value: 'Prioritaskan action dengan dampak operasional tertinggi hari ini.',
    mode: 'monitor' as const,
  },
  {
    label: 'Stockout 7 hari',
    value: 'SKU mana yang paling berisiko stockout dalam 7 hari ke depan?',
    mode: 'ask' as const,
  },
  {
    label: 'Dashboard stok kritis',
    value: 'Buat dashboard stok kritis per gudang dan prediksi habis 7 hari.',
    mode: 'transform' as const,
  },
  {
    label: 'Bottleneck picking',
    value: 'Tampilkan risiko bottleneck picking untuk 48 jam ke depan.',
    mode: 'monitor' as const,
  },
] as const;

const modeCopy = {
  ask: {
    title: 'AI Analyst Response',
    description: 'Jawaban natural language untuk diagnosis cepat dan keputusan harian manager.',
    insightTitle: 'Jawaban AI',
    insightSummary:
      'Risiko tertinggi saat ini ada pada tiga SKU cold-storage dengan laju outbound naik 18% selama 5 hari terakhir, sementara replenishment inbound terlambat rata-rata 11 jam. Akar masalah terbesar berasal dari putaway malam yang tidak selesai penuh dan ketimpangan distribusi stok antar gudang.',
    insights: [
      'WH Bekasi dan WH Surabaya menyumbang 74% potensi stockout 7 hari.',
      'Shift malam memiliki backlog putaway 26 pallet di zona frozen.',
      'SKU seasoning mix memiliki coverage 4,8 hari dengan demand volatility tertinggi.',
    ],
    actions: [
      {
        title: 'Transfer order seasoning mix',
        detail: 'Buat transfer order dummy `TO-WH-0326-014` untuk memindahkan 120 box Seasoning Mix dari WH Medan ke WH Bekasi sebelum pukul 16:00.',
        status: 'Open',
      },
      {
        title: 'Shift reinforcement frozen',
        detail: 'Assign dummy shift plan `SHIFT-FRZ-EXTRA-02` untuk menambah 1 team lead dan 2 picker di zona frozen selama 3 hari ke depan.',
        status: 'In Progress',
      },
      {
        title: 'Urgent receiving PO bahan baku',
        detail: 'Ubah prioritas PO dummy `PO-RM-240311-09` menjadi `urgent receiving` agar bahan seasoning dan packaging masuk gelombang receiving pagi.',
        status: 'Done',
      },
    ],
    panelTitle: 'Analysis pattern',
    panelDescription: 'Pertanyaan ad hoc yang paling sering dibawa manager ke AI.',
  },
  transform: {
    title: 'Generated Dashboard Plan',
    description: 'Intent dashboard diterjemahkan menjadi KPI, dimensi, visual, dan publish checklist.',
    insightTitle: 'Rencana Dashboard',
    insightSummary:
      'Sistem menyarankan komposisi dashboard 6 blok: KPI SLA, heatmap per jam, top delay reason, warehouse exception list, tren 14 hari, dan panel rekomendasi aksi. Struktur ini cocok untuk rapat operasional pagi karena langsung menghubungkan status, penyebab, dan tindakan.',
    insights: [
      'Visual utama: timeseries SLA dan panel top exceptions.',
      'Dimensi prioritas: warehouse, shift, delay reason, carrier, dan customer segment.',
      'Filter default: last 14 days, active warehouses, outbound orders only.',
    ],
    actions: [
      {
        title: 'Publish template dashboard',
        detail: 'Simpan hasil sebagai template dummy `Outbound SLA Morning Review` dan bagikan ke role supervisor outbound.',
        status: 'Open',
      },
      {
        title: 'Aktifkan drill-down KPI',
        detail: 'Tambahkan aksi drill-down dummy dari KPI `Delay Rate` ke daftar order overdue dan alasan keterlambatan per shift.',
        status: 'In Progress',
      },
      {
        title: 'Jadwalkan snapshot harian',
        detail: 'Jadwalkan snapshot dashboard dummy otomatis setiap pukul 07:00 dengan penerima email `ops.manager@dummy.local`.',
        status: 'Done',
      },
    ],
    panelTitle: 'Dashboard blueprint',
    panelDescription: 'Blok dashboard yang dihasilkan dari prompt.',
  },
  monitor: {
    title: 'Predictive Risk Brief',
    description: 'Pengawasan berkelanjutan untuk alert, freshness, dan prioritas tindakan.',
    insightTitle: 'Prioritas Hari Ini',
    insightSummary:
      'Prediksi menunjukkan potensi bottleneck picking meningkat pada shift siang karena volume retail order diperkirakan naik 22%, sementara kapasitas picker aktif hanya tumbuh 8%. Jika dibiarkan, SLA outbound hari ini berpotensi turun ke 91,8% dari target 96%.',
    insights: [
      'Kemungkinan SLA breach tertinggi terjadi pukul 13:00-16:00.',
      'Dataset stock movement masih fresh 9 menit, dataset shift capacity fresh 18 menit.',
      'Simulasi terbaik adalah memindahkan 4 picker dari replenishment ke outbound wave-2.',
    ],
    actions: [
      {
        title: 'Reschedule replenishment',
        detail: 'Pindahkan replenishment non-kritis batch dummy `REP-240311-C` ke shift malam agar kapasitas siang fokus ke outbound wave-2.',
        status: 'Open',
      },
      {
        title: 'Aktifkan queue alert',
        detail: 'Aktifkan alert dummy `ALERT-PICK-QUEUE-180` yang mengirim notifikasi jika antrean picking melebihi 180 line item.',
        status: 'In Progress',
      },
      {
        title: 'Distribusi ringkasan tindakan',
        detail: 'Kirim ringkasan tindakan dummy ke supervisor outbound dan planner melalui channel `Ops Daily Control Tower` sebelum pukul 12:30.',
        status: 'Done',
      },
    ],
    panelTitle: 'Risk queue',
    panelDescription: 'Prioritas berbasis dampak dan urgensi operasional.',
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

const managerKpis: KpiCard[] = [
  { title: 'Decision Latency', subtitle: 'Hari ini', value: '11 menit', delta: -24, deltaLabel: 'vs minggu lalu', status: 'good' },
  { title: 'AI Insight Accepted', subtitle: '7 hari', value: '68%', delta: 12, deltaLabel: 'vs minggu lalu', status: 'good' },
  { title: 'Critical Risk Open', subtitle: 'Live', value: '7', delta: 2, deltaLabel: 'vs kemarin', status: 'warn' },
  { title: 'Data Freshness SLA', subtitle: 'Lintas domain', value: '96.4%', delta: 3, deltaLabel: 'vs kemarin', status: 'good' },
];

const cockpitSeries: TimeseriesSeries[] = [
  { key: 'questions', label: 'Ask', color: '#2563EB' },
  { key: 'dashboards', label: 'Transform', color: '#14B8A6' },
  { key: 'actions', label: 'Monitor', color: '#F59E0B' },
];

const cockpitData: TimeseriesDatum[] = [
  { date: '04/03', questions: 18, dashboards: 4, actions: 9 },
  { date: '05/03', questions: 21, dashboards: 5, actions: 11 },
  { date: '06/03', questions: 17, dashboards: 3, actions: 8 },
  { date: '07/03', questions: 24, dashboards: 6, actions: 13 },
  { date: '08/03', questions: 19, dashboards: 5, actions: 10 },
  { date: '09/03', questions: 27, dashboards: 7, actions: 14 },
  { date: '10/03', questions: 23, dashboards: 6, actions: 12 },
];

const topThemes: TopAmountRow[] = [
  { initials: 'OD', name: 'Outbound Delay', code: '26 pertanyaan', amount: '39% dari semua analisis' },
  { initials: 'SR', name: 'Stockout Risk', code: '18 pertanyaan', amount: '27% dari semua analisis' },
  { initials: 'WF', name: 'Workforce Load', code: '13 pertanyaan', amount: '19% dari semua analisis' },
  { initials: 'DQ', name: 'Data Quality', code: '6 pertanyaan', amount: '9% dari semua analisis' },
];

const managerAlerts = [
  {
    title: 'Predictive bottleneck',
    warehouse: 'Outbound wave-2',
    detail: 'Model mendeteksi risiko backlog 22% lebih tinggi pada shift siang jika kapasitas picker tidak ditambah.',
    severity: 'critical' as const,
  },
  {
    title: 'Freshness risk',
    warehouse: 'Inbound receiving mart',
    detail: 'Refresh terakhir 47 menit lalu. Dampak utama ada pada dashboard stockout risk dan replenishment urgency.',
    severity: 'warning' as const,
  },
  {
    title: 'Instant dashboard ready',
    warehouse: 'Supervisor outbound',
    detail: 'Template dashboard SLA per jam siap dipublikasikan ke tim operasional pagi ini.',
    severity: 'info' as const,
  },
];

const modeSignals: Record<AiModeKey, Array<{ term: string; weight: number }>> = {
  ask: [
    { term: 'apa', weight: 1 },
    { term: 'kenapa', weight: 3 },
    { term: 'mengapa', weight: 3 },
    { term: 'penyebab', weight: 3 },
    { term: 'berapa', weight: 2 },
    { term: 'mana', weight: 2 },
    { term: 'analisis', weight: 2 },
    { term: 'ringkas', weight: 2 },
    { term: 'jelaskan', weight: 3 },
    { term: 'akar masalah', weight: 4 },
    { term: 'stockout', weight: 2 },
    { term: 'delay', weight: 2 },
    { term: 'produktifitas', weight: 2 },
    { term: 'produktivitas', weight: 2 },
  ],
  transform: [
    { term: 'buat', weight: 2 },
    { term: 'dashboard', weight: 5 },
    { term: 'grafik', weight: 3 },
    { term: 'chart', weight: 3 },
    { term: 'visual', weight: 3 },
    { term: 'template', weight: 3 },
    { term: 'layout', weight: 3 },
    { term: 'tampilan', weight: 2 },
    { term: 'kpi', weight: 2 },
    { term: 'heatmap', weight: 4 },
    { term: 'drill-down', weight: 3 },
    { term: 'publish', weight: 2 },
  ],
  monitor: [
    { term: 'risiko', weight: 4 },
    { term: 'alert', weight: 4 },
    { term: 'monitor', weight: 4 },
    { term: 'prioritas', weight: 3 },
    { term: 'freshness', weight: 4 },
    { term: 'bottleneck', weight: 4 },
    { term: 'warning', weight: 3 },
    { term: 'urgent', weight: 3 },
    { term: 'hari ini', weight: 2 },
    { term: '48 jam', weight: 2 },
    { term: 'prediksi', weight: 4 },
    { term: 'prediktif', weight: 4 },
    { term: 'pantau', weight: 3 },
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

  if (normalized.includes('buat') && normalized.includes('dashboard')) {
    baseScores.transform += 4;
    reasons.transform.push('buat+dashboard');
  }

  if ((normalized.includes('risiko') || normalized.includes('alert')) && normalized.includes('hari ini')) {
    baseScores.monitor += 3;
    reasons.monitor.push('risiko/alert+hari ini');
  }

  if ((normalized.includes('kenapa') || normalized.includes('mengapa')) && normalized.includes('delay')) {
    baseScores.ask += 3;
    reasons.ask.push('kenapa+delay');
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

export default function ManagerDashboardPage() {
  const [prompt, setPrompt] = useState<string>(promptLibrary[0].value);
  const [submittedPrompt, setSubmittedPrompt] = useState<string>(promptLibrary[0].value);
  const [submittedAt, setSubmittedAt] = useState<string>('Belum dijalankan');
  const [runHistory, setRunHistory] = useState<RunHistoryItem[]>([]);
  const [actionStatusOverrides, setActionStatusOverrides] = useState<Record<string, ActionStatus>>({});
  const [isRunningAi, setIsRunningAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AiChatResult | null>(null);
  const deferredPrompt = useDeferredValue(prompt);
  const isPreviewUpdating = prompt !== deferredPrompt;
  const detection = useMemo(() => detectMode(deferredPrompt), [deferredPrompt]);
  const detectedMode = detection.mode;
  const content = useMemo(() => modeCopy[detectedMode], [detectedMode]);
  const submittedDetection = useMemo(() => detectMode(submittedPrompt), [submittedPrompt]);
  const submittedContent = useMemo(() => modeCopy[submittedDetection.mode], [submittedDetection]);
  const detectedMeta = aiModes.find((mode) => mode.key === detectedMode) ?? aiModes[0];
  const DetectedIcon = detectedMeta.icon;
  const displayContent = submittedAt === 'Belum dijalankan' ? content : submittedContent;

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
    setSubmittedPrompt(deferredPrompt);
    setSubmittedAt(runTime);
    setAiError(null);
    setIsRunningAi(true);
    setRunHistory((current) => [
      {
        prompt: deferredPrompt,
        mode: detection.mode,
        confidence: detection.confidence,
        time: runTime,
        pinned: current.find((item) => item.prompt === deferredPrompt)?.pinned ?? false,
      },
      ...current.filter((item) => item.prompt !== deferredPrompt),
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
          question: deferredPrompt,
          include_schema: true,
          include_samples: false,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string; data?: AiChatResult }
        | null;

      if (!response.ok || !payload?.success || !payload.data) {
        throw new Error(payload?.message || 'AI engine tidak mengembalikan respons yang valid.');
      }

      const result = payload.data;
      startTransition(() => {
        setAiResult(result ?? null);
      });
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Gagal menghubungi AI engine.');
      setAiResult(null);
    } finally {
      setIsRunningAi(false);
    }
  };

  const displaySchemaTables = aiResult?.semantic_schema?.tables?.slice(0, 4) ?? [];
  const displayQueries = aiResult?.suggested_queries?.slice(0, 3) ?? [];

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

  return (
    <div className="container space-y-7 pb-10">
      <Toolbar>
        <ToolbarHeading>
          <div className="flex items-center gap-3">
            <ToolbarPageTitle>Dashboard Manager</ToolbarPageTitle>
            <Badge variant="primary" appearance="light">Dashboard AI</Badge>
            <Badge variant="success" appearance="light">Single Input</Badge>
          </div>
          <ToolbarDescription>
            Manager cukup menulis kebutuhan dalam satu input. Sistem akan otomatis memahami apakah permintaan tersebut berupa analisis data, pembuatan dashboard, atau pemantauan risiko.
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="ghost" className="gap-2 border border-border/80 bg-background hover:bg-muted/60">
            <RefreshCcw className="size-4" />
            Refresh Signals
          </Button>
        </ToolbarActions>
      </Toolbar>

      <KpiGrid cards={managerKpis} />

      <Card className="overflow-hidden border-border/70 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_28%),linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(242,247,255,0.94))]">
        <CardContent className="space-y-6 p-6 lg:p-7">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <div className="space-y-3">
                <Badge variant="info" appearance="light" className="gap-1.5">
                  <Sparkles className="size-3.5" />
                  AI Analytics Teammate
                </Badge>
                <div className="space-y-2">
                  <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-mono lg:text-3xl">
                    Satu command bar untuk tanya data, minta dashboard, dan memantau risiko.
                  </h2>
                  <p className="max-w-3xl text-sm text-secondary-foreground lg:text-base">
                    UI ini sengaja dibuat tanpa kategori utama. User tinggal mengetik, lalu sistem mengarahkan output ke mode yang paling relevan.
                  </p>
                </div>
              </div>

              <Card className="border-border/70 bg-background/90">
                <CardHeader>
                  <CardHeading>
                    <CardTitle>AI Command Bar</CardTitle>
                    <CardDescription>Tulis kebutuhan manager dengan bahasa biasa. Intent akan terdeteksi otomatis.</CardDescription>
                  </CardHeading>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {promptLibrary.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setPrompt(item.value)}
                        className={`rounded-full border px-3 py-2 text-xs transition ${
                          prompt === item.value
                            ? 'border-primary bg-primary/8 text-primary'
                            : 'border-border bg-background text-secondary-foreground hover:border-primary/30 hover:text-primary'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <Textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    className="min-h-32 resize-none border-border/80 bg-background"
                    placeholder="Contoh: buat dashboard SLA outbound per jam, atau apa risiko terbesar hari ini?"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-secondary-foreground">
                      <Badge variant="primary" appearance="light" className="gap-1.5">
                        <DetectedIcon className="size-3.5" />
                        Detected: {detectedMeta.title}
                      </Badge>
                      <Badge variant="success" appearance="light">Confidence {detection.confidence.toFixed(2)}</Badge>
                      <Badge variant="secondary" appearance="light">Freshness 9 menit</Badge>
                      {detection.reasons.length > 0 ? (
                        <Badge variant="info" appearance="light">Signal: {detection.reasons.join(', ')}</Badge>
                      ) : null}
                      {isPreviewUpdating ? (
                        <Badge variant="warning" appearance="light">Updating preview...</Badge>
                      ) : null}
                    </div>
                    <Button className="gap-2" onClick={() => void handleRunAtm()} disabled={isRunningAi || !deferredPrompt.trim()}>
                      <Send className="size-4" />
                      {isRunningAi ? 'Menjalankan...' : 'Jalankan AI'}
                    </Button>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-muted/30 p-3 text-xs text-secondary-foreground">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="success" appearance="light">Last Run</Badge>
                      <span>{submittedAt}</span>
                      {submittedAt !== 'Belum dijalankan' ? <span className="font-medium text-mono">Prompt finalized</span> : <span>Belum ada hasil final</span>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-mono">Recent Runs</div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-secondary-foreground">Simpan 5 prompt terakhir</div>
                        {runHistory.length > 0 ? (
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-7 border border-border/80 px-2 text-xs"
                            onClick={clearRunHistory}
                          >
                            Clear History
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    {runHistory.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border p-3 text-xs text-secondary-foreground">
                        Belum ada riwayat run. Klik `Jalankan AI` untuk menyimpan hasil.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {runHistory.map((item) => (
                          <div
                            key={`${item.time}-${item.prompt}`}
                            className="w-full rounded-2xl border border-border/80 bg-background px-3 py-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <Badge variant="primary" appearance="light">{item.mode}</Badge>
                                {item.pinned ? <Badge variant="warning" appearance="light">Pinned</Badge> : null}
                                <span className="text-secondary-foreground">{item.time}</span>
                                <span className="text-secondary-foreground">Confidence {item.confidence.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    togglePinnedRun(item.prompt);
                                  }}
                                  className="text-xs font-medium text-secondary-foreground hover:text-primary"
                                >
                                  {item.pinned ? 'Unpin' : 'Pin'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPrompt(item.prompt)}
                                  className="text-xs font-medium text-primary"
                                >
                                  Load
                                </button>
                              </div>
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm text-mono">{item.prompt}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-3 md:grid-cols-3">
                {aiModes.map((mode) => {
                  const Icon = mode.icon;
                  const active = detectedMode === mode.key;

                  return (
                    <div
                      key={mode.key}
                      className={`rounded-2xl border p-4 ${
                        active
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border/70 bg-background/80'
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
                          <Icon className="size-5" />
                        </span>
                        {active ? <Badge variant="primary" appearance="light">Detected</Badge> : null}
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-sm font-semibold text-mono">{mode.title}</div>
                        <p className="text-xs leading-5 text-secondary-foreground">{mode.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Card className="border-border/70 bg-slate-950 text-white shadow-sm">
              <CardHeader className={`border-white/10 transition-opacity ${isPreviewUpdating ? 'opacity-75' : 'opacity-100'}`}>
                <CardHeading>
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-white">{displayContent.title}</CardTitle>
                    <Badge variant={submittedAt === 'Belum dijalankan' ? 'warning' : 'success'} appearance="light">
                      {submittedAt === 'Belum dijalankan' ? 'Live Preview' : 'Final Result'}
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-300">{displayContent.description}</CardDescription>
                </CardHeading>
              </CardHeader>
              <CardContent className={`space-y-5 transition-all ${isPreviewUpdating ? 'translate-y-0.5 opacity-80' : 'translate-y-0 opacity-100'}`}>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                  <Badge variant="success">Fresh</Badge>
                  <Badge variant="info">Explainable</Badge>
                  <Badge variant="warning">Priority Action</Badge>
                </div>

                {submittedAt !== 'Belum dijalankan' ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
                    <div className="mb-1 font-semibold text-white">Prompt final</div>
                    <p>{submittedPrompt}</p>
                  </div>
                ) : null}

                {aiError ? (
                  <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-xs text-rose-100">
                    <div className="mb-1 font-semibold">AI engine error</div>
                    <p>{aiError}</p>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <ScanSearch className="size-4 text-cyan-300" />
                    {displayContent.insightTitle}
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{aiResult?.answer ?? displayContent.insightSummary}</p>
                  {aiResult ? (
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <Badge variant="secondary">Model {aiResult.model}</Badge>
                      <Badge variant="secondary">Provider active</Badge>
                      <span className="max-w-full truncate">{aiResult.provider}</span>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Key Insights</div>
                  {(aiResult?.answer
                    ? aiResult.answer
                        .split('\n')
                        .map((item) => item.trim())
                        .filter((item) => item.length > 0)
                        .slice(0, 4)
                    : displayContent.insights).map((item) => (
                    <div key={item} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <ChartColumn className="mt-0.5 size-4 shrink-0 text-cyan-300" />
                      <p className="text-sm leading-6 text-slate-200">{item}</p>
                    </div>
                  ))}
                </div>

                {displayQueries.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Suggested Queries</div>
                    {displayQueries.map((item) => (
                      <div key={item.sql} className="rounded-xl border border-sky-400/20 bg-sky-400/10 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant="info" appearance="light">{item.safety}</Badge>
                          <span className="text-[11px] text-sky-100/80">{item.rationale}</span>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-sky-50">{item.sql}</pre>
                      </div>
                    ))}
                  </div>
                ) : null}

                {displaySchemaTables.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Semantic Schema Snapshot</div>
                    <div className="grid gap-3">
                      {displaySchemaTables.map((table) => (
                        <div key={`${table.schema}.${table.name}`} className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-white">{table.schema}.{table.name}</p>
                            {table.primary_key.length > 0 ? <Badge variant="warning">PK {table.primary_key.join(', ')}</Badge> : null}
                            {typeof table.row_count_estimate === 'number' ? <Badge variant="secondary">~{table.row_count_estimate} rows</Badge> : null}
                          </div>
                          <p className="mt-2 text-xs leading-6 text-slate-300">
                            {table.columns.slice(0, 6).map((column) => `${column.name}:${column.data_type}`).join(' | ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Recommended Actions</div>
                  {displayContent.actions.map((item) => {
                    const currentStatus = getActionStatus(
                      submittedAt === 'Belum dijalankan' ? detectedMode : submittedDetection.mode,
                      item.title,
                      item.status,
                    );

                    return (
                    <div key={item.title} className="flex items-start justify-between gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-emerald-50">{item.title}</p>
                          <button
                            type="button"
                            onClick={() =>
                              cycleActionStatus(
                                submittedAt === 'Belum dijalankan' ? detectedMode : submittedDetection.mode,
                                item.title,
                                currentStatus,
                              )
                            }
                          >
                            <Badge
                              variant={
                                currentStatus === 'Done'
                                  ? 'success'
                                  : currentStatus === 'In Progress'
                                    ? 'warning'
                                    : 'secondary'
                              }
                              appearance="light"
                              className="cursor-pointer"
                            >
                              {currentStatus}
                            </Badge>
                          </button>
                        </div>
                        <p className="text-sm leading-6 text-emerald-100/90">{item.detail}</p>
                        <p className="text-[11px] text-emerald-100/70">Klik badge status untuk mengubah progres aksi.</p>
                      </div>
                      <ArrowRight className="mt-1 size-4 shrink-0 text-emerald-200" />
                    </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <TimeseriesCard
          title="Dashboard AI usage trend"
          subtitle="Volume analisis manager selama 7 hari terakhir"
          data={cockpitData}
          series={cockpitSeries}
        />
        <TopAmountCard
          title="Top analysis themes"
          subtitle="Topik yang paling sering dianalisis manager"
          rows={topThemes}
        />
      </div>

      {detectedMode === 'transform' ? (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardHeading>
                <CardTitle>{content.panelTitle}</CardTitle>
                <CardDescription>{content.panelDescription}</CardDescription>
              </CardHeading>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  'KPI strip: SLA, delay rate, order at risk, backlog',
                  'Heatmap outbound per jam dan per warehouse',
                  'Top delay reasons dan exception order table',
                  'Action panel untuk supervisor dan planner',
                ].map((item, index) => (
                  <div key={item} className="rounded-2xl border border-dashed border-border p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-mono">
                      <LayoutDashboard className="size-4 text-primary" />
                      Block {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-secondary-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardHeading>
                <CardTitle>Publish checklist</CardTitle>
                <CardDescription>Guardrail sebelum dashboard dibagikan ke tim.</CardDescription>
              </CardHeading>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                ['Metric mapping', 'Semua KPI sudah terhubung ke definisi operasional.'],
                ['Filter defaults', 'Last 14 days, active WH, outbound orders.'],
                ['Drill-down', 'KPI dapat ditelusuri sampai level order dan shift.'],
                ['Audience', 'Template ditargetkan untuk supervisor outbound.'],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-xl border border-border p-3">
                  <div className="text-sm font-medium text-mono">{title}</div>
                  <p className="mt-1 text-sm text-secondary-foreground">{desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {detectedMode === 'monitor' ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <CardHeader>
              <CardHeading>
                <CardTitle>{content.panelTitle}</CardTitle>
                <CardDescription>{content.panelDescription}</CardDescription>
              </CardHeading>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                ['SLA breach', 'High', 'Prediksi turun ke 91,8% pada shift siang.', 'critical'],
                ['Stockout', 'Medium', '2 SKU bumbu kritis habis dalam 5 hari.', 'warning'],
                ['Freshness drift', 'Medium', 'Receiving mart terlambat 47 menit.', 'warning'],
                ['Labor imbalance', 'High', 'Outbound wave-2 kekurangan 4 picker.', 'critical'],
              ].map(([title, level, desc, tone]) => (
                <div key={title} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-mono">{title}</div>
                    <Badge variant={tone === 'critical' ? 'destructive' : 'warning'} appearance="light">{level}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-secondary-foreground">{desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <WarehouseAlertCard title="Manager alerts" subtitle="Alert operasional, freshness, dan publishing" rows={managerAlerts} />
            <Card>
              <CardHeader>
                <CardHeading>
                  <CardTitle>Operational cadence</CardTitle>
                  <CardDescription>Waktu respons harian untuk loop analisis ke tindakan.</CardDescription>
                </CardHeading>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                {[
                  { title: 'Detect', value: '09 menit', icon: Clock3 },
                  { title: 'Explain', value: '04 menit', icon: BrainCircuit },
                  { title: 'Act', value: '11 menit', icon: CircleAlert },
                ].map((item) => {
                  const CurrentIcon = item.icon;

                  return (
                    <div key={item.title} className="rounded-2xl border border-border p-4">
                      <CurrentIcon className="mb-3 size-5 text-primary" />
                      <div className="text-sm font-medium text-secondary-foreground">{item.title}</div>
                      <div className="mt-1 text-2xl font-semibold text-mono">{item.value}</div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}

      {detectedMode === 'ask' ? (
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle>{content.panelTitle}</CardTitle>
              <CardDescription>{content.panelDescription}</CardDescription>
            </CardHeading>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {[
              'Kenapa overtime shift malam naik minggu ini?',
              'Gudang mana yang paling sering menjadi sumber delay?',
              'Apa faktor utama yang mendorong stockout risk tertinggi?',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-mono">
                  <BrainCircuit className="size-4 text-primary" />
                  Suggested ask
                </div>
                <p className="text-sm leading-6 text-secondary-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
