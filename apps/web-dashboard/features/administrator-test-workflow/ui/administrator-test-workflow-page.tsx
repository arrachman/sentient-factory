'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, Check, Copy, Database, Play, RefreshCw, Sparkles, TerminalSquare, Waves } from 'lucide-react';
import { toast } from 'sonner';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch, SwitchWrapper } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

type WorkflowApiPayload = {
  success?: boolean;
  message?: string;
  detail?: unknown;
  data?: {
    request_id?: string | null;
    answer?: string;
    model?: string;
    provider?: string;
    data_source?: string | null;
    workflow_mode?: string | null;
    workflow_passes?: number | null;
    schema_key?: string | null;
    schema_source?: string | null;
    suggested_queries?: Array<{ sql?: string; rationale?: string; safety?: string }>;
    query_result?: {
      sql?: string;
      row_count?: number;
      rows?: Array<Record<string, unknown>>;
    } | null;
  };
};

type WorkflowProgressEvent = {
  event?: string;
  request_id?: string;
  timestamp?: string;
  error?: string;
  data?: WorkflowApiPayload['data'];
  label?: string;
  summary?: string;
  progress?: number;
  [key: string]: unknown;
};

type WorkflowRequestSnapshot = {
  prompt: string;
  schemaKey: string;
  messagesJson: string;
  includeSchema: boolean;
  includeSamples: boolean;
  executeReadOnlyQuery: boolean;
  fastMode: boolean;
};

const DEFAULT_PROMPT =
  'Analisis kebutuhan dashboard piutang, jelaskan tabel yang relevan, risiko ambigu, dan berikan contoh SQL read-only jika diperlukan.';

const DEFAULT_MESSAGES_JSON = '[]';

const PRESET_PROMPTS = {
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

function formatProgressTimestamp(value?: string) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date);
}

export default function AdministratorTestWorkflowPage() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [schemaKey, setSchemaKey] = useState('all');
  const [messagesJson, setMessagesJson] = useState(DEFAULT_MESSAGES_JSON);
  const [includeSchema, setIncludeSchema] = useState(false);
  const [includeSamples, setIncludeSamples] = useState(false);
  const [executeReadOnlyQuery, setExecuteReadOnlyQuery] = useState(false);
  const [fastMode, setFastMode] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<WorkflowApiPayload | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [progressEvents, setProgressEvents] = useState<WorkflowProgressEvent[]>([]);
  const [lastRequest, setLastRequest] = useState<WorkflowRequestSnapshot | null>(null);
  const progressSourceRef = useRef<EventSource | null>(null);
  const progressViewportRef = useRef<HTMLDivElement | null>(null);
  const { isCopied: isRawCopied, copyToClipboard: copyRaw } = useCopyToClipboard();
  const { isCopied: isSqlCopied, copyToClipboard: copySql } = useCopyToClipboard();

  useEffect(() => {
    if (!requestId) {
      return undefined;
    }

    const eventSource = new EventSource(`/api/ai/chat/progress/${requestId}`);
    progressSourceRef.current = eventSource;

    const pushEvent = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as WorkflowProgressEvent;
        setProgressEvents((current) => [...current, payload]);
        if (payload.event === 'completed' && payload.data) {
          setResponse({
            success: true,
            data: payload.data,
          });
          setResponseStatus(200);
          setSubmitting(false);
          toast.success('Workflow result diterima dari progress stream.');
          eventSource.close();
        }
        if (payload.event === 'failed') {
          setResponse({
            success: false,
            message: typeof payload.error === 'string' ? payload.error : 'Workflow failed.',
          });
          setResponseStatus(502);
          setSubmitting(false);
          toast.error(typeof payload.error === 'string' ? payload.error : 'Workflow failed.');
          eventSource.close();
        }
      } catch {
        // Ignore malformed SSE payloads.
      }
    };

    const eventNames = [
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
    ];

    eventNames.forEach((name) => eventSource.addEventListener(name, pushEvent as EventListener));
    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventNames.forEach((name) => eventSource.removeEventListener(name, pushEvent as EventListener));
      eventSource.close();
      if (progressSourceRef.current === eventSource) {
        progressSourceRef.current = null;
      }
    };
  }, [requestId]);

  useEffect(() => {
    const viewport = progressViewportRef.current;
    if (!viewport) {
      return;
    }
    viewport.scrollTop = viewport.scrollHeight;
  }, [progressEvents]);

  const runWorkflow = async (snapshot: WorkflowRequestSnapshot) => {
    const { prompt, schemaKey, messagesJson, includeSchema, includeSamples, executeReadOnlyQuery } = snapshot;

    if (!prompt.trim()) {
      toast.error('Prompt wajib diisi.');
      return;
    }

    let parsedMessages: unknown[] = [];
    try {
      const parsed = JSON.parse(messagesJson);
      if (!Array.isArray(parsed)) {
        throw new Error('Messages harus berupa array JSON.');
      }
      parsedMessages = parsed;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Messages JSON tidak valid.');
      return;
    }

    setSubmitting(true);
    setResponse(null);
    setResponseStatus(null);
    setProgressEvents([]);
    setLastRequest(snapshot);

    const nextRequestId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `workflow-${Date.now()}`;
    setRequestId(nextRequestId);

    try {
      const httpResponse = await fetch('/api/ai/test-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-request-id': nextRequestId,
        },
        body: JSON.stringify({
          prompt,
          messages: parsedMessages,
          include_schema: includeSchema,
          include_samples: includeSamples,
          execute_read_only_query: executeReadOnlyQuery,
          schema_key: schemaKey.trim() || undefined,
        }),
      });

      const payload = (await httpResponse.json().catch(() => null)) as WorkflowApiPayload | null;

      if (!httpResponse.ok || !payload?.success) {
        throw new Error(payload?.message || 'Workflow test request gagal.');
      }

      setResponseStatus(httpResponse.status);
      toast.success('Workflow request berhasil dikirim. Menunggu hasil dari progress stream.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Workflow test request gagal.';
      toast.error(message);
      setSubmitting(false);
      progressSourceRef.current?.close();
    }
  };

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    await runWorkflow({
      prompt,
      schemaKey,
      messagesJson,
      includeSchema,
      includeSamples,
      executeReadOnlyQuery,
      fastMode,
    });
  };

  const handleReplayLastRequest = async () => {
    if (!lastRequest) {
      toast.error('Belum ada request yang bisa diulang.');
      return;
    }

    setPrompt(lastRequest.prompt);
    setSchemaKey(lastRequest.schemaKey);
    setMessagesJson(lastRequest.messagesJson);
    setIncludeSchema(lastRequest.includeSchema);
    setIncludeSamples(lastRequest.includeSamples);
    setExecuteReadOnlyQuery(lastRequest.executeReadOnlyQuery);
    setFastMode(lastRequest.fastMode);

    await runWorkflow(lastRequest);
  };

  const handleReset = () => {
    setPrompt(DEFAULT_PROMPT);
    setSchemaKey('all');
    setMessagesJson(DEFAULT_MESSAGES_JSON);
    setIncludeSchema(false);
    setIncludeSamples(false);
    setExecuteReadOnlyQuery(false);
    setFastMode(true);
    setResponse(null);
    setResponseStatus(null);
    setRequestId(null);
    setProgressEvents([]);
    progressSourceRef.current?.close();
  };

  const responseData = response?.data;
  const rawResponseText = JSON.stringify(response, null, 2);
  const latestProgress = progressEvents.length ? progressEvents[progressEvents.length - 1] : null;

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Test Workflow</ToolbarPageTitle>
          <ToolbarDescription>
            Uji endpoint workflow AI dengan prompt, schema, sample rows, dan opsi query read-only.
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? <RefreshCw className="animate-spin" /> : <Play />}
            {submitting ? 'Running...' : 'Run Workflow'}
          </Button>
          <Button variant="outline" onClick={() => void handleReplayLastRequest()} disabled={submitting || !lastRequest}>
            <Play />
            Replay Last Request
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={submitting}>
            <RefreshCw />
            Reset
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="overflow-hidden border-sky-200/70">
          <CardHeader className="bg-linear-to-r from-sky-50 via-white to-cyan-50">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <Sparkles className="size-5" />
              </div>
              <div>
                <CardTitle>Workflow Request</CardTitle>
                <CardDescription>Konfigurasi payload untuk `/api/ai/test-workflow`.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
              <div className="space-y-2">
                <Label htmlFor="workflow-prompt">Prompt</Label>
                <Textarea
                  id="workflow-prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  rows={8}
                  placeholder="Tulis prompt untuk menguji workflow AI..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="workflow-schema-key">Schema Key</Label>
                  <Input
                    id="workflow-schema-key"
                    value={schemaKey}
                    onChange={(event) => setSchemaKey(event.target.value)}
                    placeholder="all"
                    variant="md"
                  />
                </div>
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
                  <p className="text-xs font-medium text-foreground">Preset Prompt</p>
                  <Tabs defaultValue="general" className="mt-3">
                    <TabsList variant="line" size="sm">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="finance">Finance</TabsTrigger>
                      <TabsTrigger value="sales">Sales</TabsTrigger>
                      <TabsTrigger value="warehouse">Warehouse</TabsTrigger>
                    </TabsList>
                    {Object.entries(PRESET_PROMPTS).map(([key, items]) => (
                      <TabsContent key={key} value={key} className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {items.map((item) => (
                            <button
                              key={item}
                              type="button"
                              className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs text-sky-700 transition hover:bg-sky-100"
                              onClick={() => setPrompt(item)}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workflow-messages">Messages JSON</Label>
                <Textarea
                  id="workflow-messages"
                  value={messagesJson}
                  onChange={(event) => setMessagesJson(event.target.value)}
                  rows={7}
                  placeholder='[{"role":"user","content":"Context tambahan"}]'
                />
                <p className="text-xs text-muted-foreground">
                  Format array message chat. Biarkan `[]` jika tidak dibutuhkan.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-border p-4 md:col-span-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Fast Mode</p>
                      <p className="text-xs text-muted-foreground">
                        Kurangi risiko timeout dengan mematikan schema dan sample rows saat testing cepat.
                      </p>
                    </div>
                    <SwitchWrapper>
                      <Switch
                        checked={fastMode}
                        onCheckedChange={(checked) => {
                          setFastMode(checked);
                          if (checked) {
                            setIncludeSchema(false);
                            setIncludeSamples(false);
                          }
                        }}
                      />
                    </SwitchWrapper>
                  </div>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Include Schema</p>
                      <p className="text-xs text-muted-foreground">Lampirkan semantic schema ke workflow.</p>
                    </div>
                    <SwitchWrapper>
                      <Switch checked={includeSchema} onCheckedChange={setIncludeSchema} />
                    </SwitchWrapper>
                  </div>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Include Samples</p>
                      <p className="text-xs text-muted-foreground">Ambil sample rows bila schema diaktifkan.</p>
                    </div>
                    <SwitchWrapper>
                      <Switch checked={includeSamples} onCheckedChange={setIncludeSamples} />
                    </SwitchWrapper>
                  </div>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Execute Read-only Query</p>
                      <p className="text-xs text-muted-foreground">Eksekusi suggested SQL read-only jika ada.</p>
                    </div>
                    <SwitchWrapper>
                      <Switch checked={executeReadOnlyQuery} onCheckedChange={setExecuteReadOnlyQuery} />
                    </SwitchWrapper>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="overflow-hidden border-amber-200/70">
            <CardHeader className="bg-linear-to-r from-amber-50 via-white to-orange-50">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Bot className="size-5" />
                </div>
                <div>
                  <CardTitle>Workflow Response</CardTitle>
                  <CardDescription>Ringkasan jawaban, metadata model, dan status workflow.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={response?.success ? 'success' : 'secondary'} appearance="light">
                  HTTP {responseStatus ?? '-'}
                </Badge>
                <Badge variant="info" appearance="light">
                  Mode {responseData?.workflow_mode || '-'}
                </Badge>
                <Badge variant="warning" appearance="light">
                  Passes {responseData?.workflow_passes ?? '-'}
                </Badge>
                <Badge variant="outline">{responseData?.schema_key || schemaKey || '-'}</Badge>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-xs font-medium text-muted-foreground">Answer</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
                  {responseData?.answer || 'Belum ada response.'}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border p-4">
                  <p className="text-xs font-medium text-muted-foreground">Model</p>
                  <p className="mt-1 text-sm font-medium">{responseData?.model || '-'}</p>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <p className="text-xs font-medium text-muted-foreground">Provider</p>
                  <p className="mt-1 break-all text-sm font-medium">{responseData?.provider || '-'}</p>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <p className="text-xs font-medium text-muted-foreground">Request ID</p>
                  <p className="mt-1 break-all text-sm font-medium">{responseData?.request_id || '-'}</p>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <p className="text-xs font-medium text-muted-foreground">Data Source</p>
                  <p className="mt-1 text-sm font-medium">{responseData?.data_source || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Progress Stream</CardTitle>
                  <CardDescription>Event real-time dari workflow berdasarkan `request_id`.</CardDescription>
                </div>
                <Badge variant="info" appearance="light">
                  {requestId || '-'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Current Status</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {latestProgress?.label || (submitting ? 'Workflow is running...' : 'Idle')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-muted-foreground">Updated At</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {formatProgressTimestamp(latestProgress?.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-muted-foreground">Overall Progress</span>
                    <span className="text-xs font-medium text-sky-700">{latestProgress?.progress ?? 0}%</span>
                  </div>
                  <Progress value={typeof latestProgress?.progress === 'number' ? latestProgress.progress : 0} />
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground">
                  {latestProgress?.summary || 'Belum ada progress summary.'}
                </p>
              </div>
              <ScrollArea
                className="h-[260px] rounded-xl border border-border bg-muted/20"
                viewportRef={progressViewportRef}
              >
                <div className="space-y-3 p-4">
                  {progressEvents.length ? (
                    progressEvents.map((item, index) => (
                      <div key={`${item.timestamp || 'ts'}-${index}`} className="rounded-lg border border-border bg-background p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Waves className="size-4 text-sky-600" />
                            <span className="text-sm font-medium">{item.label || item.event || 'event'}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatProgressTimestamp(item.timestamp)}</span>
                        </div>
                        <div className="mt-3 space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-medium text-muted-foreground">{item.event || '-'}</span>
                            <span className="text-xs font-medium text-sky-700">{item.progress ?? 0}%</span>
                          </div>
                          <Progress value={typeof item.progress === 'number' ? item.progress : 0} />
                          <p className="text-sm leading-6 text-foreground">{item.summary || 'Tidak ada ringkasan.'}</p>
                          <details className="rounded-md border border-dashed border-border p-3">
                            <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                              Raw event JSON
                            </summary>
                            <pre className="mt-2 whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
                              {JSON.stringify(item, null, 2)}
                            </pre>
                          </details>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground">Belum ada progress event.</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Suggested SQL</CardTitle>
                  <CardDescription>SQL read-only yang dihasilkan workflow, jika ada.</CardDescription>
                </div>
                <Badge
                  variant={responseData?.suggested_queries?.length ? 'success' : 'secondary'}
                  appearance="light"
                >
                  {responseData?.suggested_queries?.length ? 'Valid extracted SQL' : 'No valid SQL found'}
                </Badge>
                <Button
                  variant="outline"
                  disabled={!responseData?.suggested_queries?.[0]?.sql}
                  onClick={() => copySql(responseData?.suggested_queries?.[0]?.sql || '')}
                >
                  {isSqlCopied ? <Check /> : <Copy />}
                  {isSqlCopied ? 'Copied' : 'Copy SQL'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {responseData?.suggested_queries?.length ? (
                <div className="space-y-3">
                  {responseData.suggested_queries.map((item, index) => (
                    <div key={`${item.sql || 'sql'}-${index}`} className="rounded-xl border border-border bg-muted/20 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Database className="size-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {item.safety || 'read_only'}
                        </span>
                      </div>
                      <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-5 text-foreground">
                        {item.sql}
                      </pre>
                      {item.rationale ? <p className="mt-3 text-xs text-muted-foreground">{item.rationale}</p> : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  Belum ada suggested SQL.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Raw Response</CardTitle>
                  <CardDescription>Payload lengkap dari endpoint workflow.</CardDescription>
                </div>
                <Button variant="outline" disabled={!response} onClick={() => copyRaw(rawResponseText)}>
                  {isRawCopied ? <Check /> : <Copy />}
                  {isRawCopied ? 'Copied' : 'Copy JSON'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-slate-950 p-4 text-slate-100">
                <div className="mb-3 flex items-center gap-2 text-slate-300">
                  <TerminalSquare className="size-4" />
                  <span className="text-xs">JSON</span>
                </div>
                <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap text-xs leading-5">
                  {rawResponseText || 'null'}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
