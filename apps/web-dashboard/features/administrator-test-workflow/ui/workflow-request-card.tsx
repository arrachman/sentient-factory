'use client';

import { FormEvent } from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch, SwitchWrapper } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

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

type WorkflowRequestCardProps = {
  prompt: string;
  setPrompt: (value: string) => void;
  schemaKey: string;
  setSchemaKey: (value: string) => void;
  messagesJson: string;
  setMessagesJson: (value: string) => void;
  fastMode: boolean;
  setFastMode: (value: boolean) => void;
  includeSchema: boolean;
  setIncludeSchema: (value: boolean) => void;
  includeSamples: boolean;
  setIncludeSamples: (value: boolean) => void;
  executeReadOnlyQuery: boolean;
  setExecuteReadOnlyQuery: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function WorkflowRequestCard({
  prompt,
  setPrompt,
  schemaKey,
  setSchemaKey,
  messagesJson,
  setMessagesJson,
  fastMode,
  setFastMode,
  includeSchema,
  setIncludeSchema,
  includeSamples,
  setIncludeSamples,
  executeReadOnlyQuery,
  setExecuteReadOnlyQuery,
  onSubmit,
}: WorkflowRequestCardProps) {
  return (
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
        <form className="space-y-5" onSubmit={onSubmit}>
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
  );
}
