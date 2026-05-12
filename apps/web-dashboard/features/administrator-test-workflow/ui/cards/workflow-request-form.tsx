'use client';

/**
 * Left card di Test Workflow page — form input: prompt, schema key, preset
 * tabs, messages JSON, dan 4 switch options.
 */
import { FormEvent } from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch, SwitchWrapper } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { PRESET_PROMPTS } from '../../model/constants';

export function WorkflowRequestForm({
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
}: {
  prompt: string;
  setPrompt: (v: string) => void;
  schemaKey: string;
  setSchemaKey: (v: string) => void;
  messagesJson: string;
  setMessagesJson: (v: string) => void;
  fastMode: boolean;
  setFastMode: (v: boolean) => void;
  includeSchema: boolean;
  setIncludeSchema: (v: boolean) => void;
  includeSamples: boolean;
  setIncludeSamples: (v: boolean) => void;
  executeReadOnlyQuery: boolean;
  setExecuteReadOnlyQuery: (v: boolean) => void;
  onSubmit: (event?: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Card className="overflow-hidden border-sky-200/70">
      <CardHeader className="bg-linear-to-r from-sky-50 via-white to-cyan-50">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
            <Sparkles className="size-5" />
          </div>
          <div>
            <CardTitle>Workflow Request</CardTitle>
            <CardDescription>
              Konfigurasi payload untuk `/api/ai/test-workflow`.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <form
          className="space-y-5"
          onSubmit={(event) => void onSubmit(event)}
        >
          <div className="space-y-2">
            <Label htmlFor="workflow-prompt">Prompt</Label>
            <Textarea
              id="workflow-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
                onChange={(e) => setSchemaKey(e.target.value)}
                placeholder="all"
                variant="md"
              />
            </div>
            <PresetPromptPicker onPick={setPrompt} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workflow-messages">Messages JSON</Label>
            <Textarea
              id="workflow-messages"
              value={messagesJson}
              onChange={(e) => setMessagesJson(e.target.value)}
              rows={7}
              placeholder='[{"role":"user","content":"Context tambahan"}]'
            />
            <p className="text-xs text-muted-foreground">
              Format array message chat. Biarkan `[]` jika tidak dibutuhkan.
            </p>
          </div>

          <SwitchesRow
            fastMode={fastMode}
            setFastMode={setFastMode}
            includeSchema={includeSchema}
            setIncludeSchema={setIncludeSchema}
            includeSamples={includeSamples}
            setIncludeSamples={setIncludeSamples}
            executeReadOnlyQuery={executeReadOnlyQuery}
            setExecuteReadOnlyQuery={setExecuteReadOnlyQuery}
          />
        </form>
      </CardContent>
    </Card>
  );
}

function PresetPromptPicker({ onPick }: { onPick: (text: string) => void }) {
  return (
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
                  onClick={() => onPick(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function SwitchesRow({
  fastMode,
  setFastMode,
  includeSchema,
  setIncludeSchema,
  includeSamples,
  setIncludeSamples,
  executeReadOnlyQuery,
  setExecuteReadOnlyQuery,
}: {
  fastMode: boolean;
  setFastMode: (v: boolean) => void;
  includeSchema: boolean;
  setIncludeSchema: (v: boolean) => void;
  includeSamples: boolean;
  setIncludeSamples: (v: boolean) => void;
  executeReadOnlyQuery: boolean;
  setExecuteReadOnlyQuery: (v: boolean) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <SwitchCard
        title="Fast Mode"
        desc="Kurangi risiko timeout dengan mematikan schema dan sample rows saat testing cepat."
        checked={fastMode}
        onChange={(checked) => {
          setFastMode(checked);
          if (checked) {
            setIncludeSchema(false);
            setIncludeSamples(false);
          }
        }}
        fullWidth
      />
      <SwitchCard
        title="Include Schema"
        desc="Lampirkan semantic schema ke workflow."
        checked={includeSchema}
        onChange={setIncludeSchema}
      />
      <SwitchCard
        title="Include Samples"
        desc="Ambil sample rows bila schema diaktifkan."
        checked={includeSamples}
        onChange={setIncludeSamples}
      />
      <SwitchCard
        title="Execute Read-only Query"
        desc="Eksekusi suggested SQL read-only jika ada."
        checked={executeReadOnlyQuery}
        onChange={setExecuteReadOnlyQuery}
      />
    </div>
  );
}

function SwitchCard({
  title,
  desc,
  checked,
  onChange,
  fullWidth,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={
        'rounded-xl border border-border p-4' +
        (fullWidth ? ' md:col-span-3' : '')
      }
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
        <SwitchWrapper>
          <Switch checked={checked} onCheckedChange={onChange} />
        </SwitchWrapper>
      </div>
    </div>
  );
}
