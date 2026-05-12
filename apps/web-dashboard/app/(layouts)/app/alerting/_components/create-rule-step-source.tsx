'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AlertTemplateRecord, BusinessMetricOption, SavedQueryOption, SystemMetricOption } from './types';
import { normalizeTemplateChannel } from './utils';

type Props = {
  ruleId: string | null;
  selectedSourceType: string;
  setSelectedSourceType: (v: string) => void;
  selectedModule: string;
  setSelectedModule: (v: string) => void;
  templates: AlertTemplateRecord[];
  templatesLoading: boolean;
  templatesError: string;
  selectedTemplateId: string;
  setSelectedTemplateId: (v: string) => void;
  templateActionMessage: string;
  templateLoading: boolean;
  selectedTemplate: AlertTemplateRecord | null;
  selectableTemplates: AlertTemplateRecord[];
  templateSourceWarning: string;
  applyTemplateDefaults: (template: AlertTemplateRecord, mode: 'create' | 'edit') => void;
  businessMetrics: BusinessMetricOption[];
  businessMetricsLoading: boolean;
  businessMetricsError: string;
  selectedBusinessMetricKey: string;
  setSelectedBusinessMetricKey: (v: string) => void;
  selectedBusinessMetric: BusinessMetricOption | null;
  selectedConditionMappingKey: string;
  setSelectedConditionMappingKey: (v: string) => void;
  systemMetrics: SystemMetricOption[];
  systemMetricsLoading: boolean;
  systemMetricsError: string;
  selectedSystemMetricKey: string;
  setSelectedSystemMetricKey: (v: string) => void;
  selectedSystemMetric: SystemMetricOption | null;
  savedQueries: SavedQueryOption[];
  savedQueriesLoading: boolean;
  savedQueriesError: string;
  selectedSavedQueryPromptId: string;
  setSelectedSavedQueryPromptId: (v: string) => void;
  selectedSavedQuery: SavedQueryOption | null;
  manualFrom: string;
  setManualFrom: (v: string) => void;
  manualSelect: string;
  setManualSelect: (v: string) => void;
  manualFilterKey: string;
  setManualFilterKey: (v: string) => void;
  manualFilterValue: string;
  setManualFilterValue: (v: string) => void;
  aiPrompt: string;
  setAiPrompt: (v: string) => void;
};

export function CreateRuleStepSource({
  ruleId, selectedSourceType, setSelectedSourceType, selectedModule, setSelectedModule,
  templates, templatesLoading, templatesError, selectedTemplateId, setSelectedTemplateId,
  templateActionMessage, templateLoading, selectedTemplate, selectableTemplates, templateSourceWarning,
  applyTemplateDefaults, businessMetrics, businessMetricsLoading, businessMetricsError,
  selectedBusinessMetricKey, setSelectedBusinessMetricKey, selectedBusinessMetric,
  selectedConditionMappingKey, setSelectedConditionMappingKey, systemMetrics, systemMetricsLoading,
  systemMetricsError, selectedSystemMetricKey, setSelectedSystemMetricKey, selectedSystemMetric,
  savedQueries, savedQueriesLoading, savedQueriesError, selectedSavedQueryPromptId,
  setSelectedSavedQueryPromptId, selectedSavedQuery, manualFrom, setManualFrom,
  manualSelect, setManualSelect, manualFilterKey, setManualFilterKey,
  manualFilterValue, setManualFilterValue, aiPrompt, setAiPrompt,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>1. What to Monitor</CardTitle>
        <CardDescription>Select the source and target metric.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium">Template</div>
            {ruleId && selectedTemplate ? (
              <Button size="sm" variant="outline" disabled={templateLoading} onClick={() => applyTemplateDefaults(selectedTemplate, 'edit')}>
                {templateLoading ? 'Applying...' : 'Apply Template Defaults'}
              </Button>
            ) : null}
          </div>
          <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId} disabled={templatesLoading}>
            <SelectTrigger><SelectValue placeholder={templatesLoading ? 'Loading templates...' : 'Select template'} /></SelectTrigger>
            <SelectContent>
              {selectableTemplates.map((template) => (
                <SelectItem key={template.template_id} value={String(template.template_id)}>
                  {template.name}{template.is_default ? ' (Default)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {templatesError ? <div className="text-sm text-rose-600 dark:text-rose-400">{templatesError}</div> : null}
          {selectedTemplate ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
              <div className="font-medium text-slate-900 dark:text-slate-100">{selectedTemplate.name}</div>
              <div className="mt-1">Schedule: {selectedTemplate.schedule_value || '-'} · Primary Channel: {normalizeTemplateChannel(selectedTemplate.recommended_channels[0]) || '-'}</div>
              <div className="mt-1">Recipients Default: {selectedTemplate.default_recipients.join(', ') || '-'}</div>
            </div>
          ) : null}
          {templateSourceWarning ? <div className="text-sm text-amber-600 dark:text-amber-400">{templateSourceWarning}</div> : null}
          {templateActionMessage ? <div className="text-sm text-muted-foreground">{templateActionMessage}</div> : null}
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Source Type</div>
          <Select value={selectedSourceType} onValueChange={setSelectedSourceType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dashboard-widget">Dashboard Widget</SelectItem>
              <SelectItem value="manual-rule-source">Manual Rule Builder</SelectItem>
              <SelectItem value="business-metric">Business Metric</SelectItem>
              <SelectItem value="saved-query">Saved Query</SelectItem>
              <SelectItem value="ai-query">AI Query</SelectItem>
              <SelectItem value="system-metric">System Metric</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Module</div>
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
              <SelectItem value="purchasing">Purchasing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedSourceType === 'business-metric' ? (
          <>
            <div className="space-y-2 md:col-span-2">
              <div className="text-sm font-medium">Business Metric</div>
              <Select value={selectedBusinessMetricKey} onValueChange={setSelectedBusinessMetricKey} disabled={businessMetricsLoading || businessMetrics.length === 0}>
                <SelectTrigger><SelectValue placeholder={businessMetricsLoading ? 'Loading business metrics...' : 'Select business metric'} /></SelectTrigger>
                <SelectContent>
                  {businessMetrics.map((metric) => <SelectItem key={metric.metric_key} value={metric.metric_key}>{metric.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {businessMetricsError ? <div className="text-sm text-rose-600 dark:text-rose-400">{businessMetricsError}</div> : null}
            </div>
            {selectedBusinessMetric ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:col-span-2 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Metric Key</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedBusinessMetric.metric_key}</div></div>
                  <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Comparison Type</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedBusinessMetric.comparison_type || '-'}</div></div>
                  <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Semantic</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedBusinessMetric.semantic_label || selectedBusinessMetric.semantic_ref || '-'}</div></div>
                  <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">System Metric</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedBusinessMetric.system_metric_label || selectedBusinessMetric.system_metric_ref || '-'}</div></div>
                </div>
                {selectedBusinessMetric.business_definition ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{selectedBusinessMetric.business_definition}</p> : null}
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Metric Context</div>
                    <div className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <div><span className="font-medium text-slate-900 dark:text-slate-100">Dimensions:</span> {selectedBusinessMetric.supported_dimensions.join(', ') || '-'}</div>
                      <div><span className="font-medium text-slate-900 dark:text-slate-100">Value Type:</span> {selectedBusinessMetric.value_type}{selectedBusinessMetric.unit ? ` · ${selectedBusinessMetric.unit}` : ''}</div>
                      <div><span className="font-medium text-slate-900 dark:text-slate-100">Default Filters:</span> {JSON.stringify(selectedBusinessMetric.default_filters)}</div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Business Goal</div>
                    {selectedBusinessMetric.goals[0] ? (
                      <div className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <div><span className="font-medium text-slate-900 dark:text-slate-100">Stakeholder:</span> {selectedBusinessMetric.goals[0].stakeholder_role}</div>
                        <div><span className="font-medium text-slate-900 dark:text-slate-100">Goal:</span> {selectedBusinessMetric.goals[0].goal_statement}</div>
                        {selectedBusinessMetric.goals[0].business_question ? <div><span className="font-medium text-slate-900 dark:text-slate-100">Question:</span> {selectedBusinessMetric.goals[0].business_question}</div> : null}
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">No business goal has been registered for this metric yet.</div>
                    )}
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-medium">Condition Mapping</div>
                  <Select value={selectedConditionMappingKey} onValueChange={setSelectedConditionMappingKey} disabled={selectedBusinessMetric.condition_mappings.length === 0}>
                    <SelectTrigger><SelectValue placeholder="Select condition mapping" /></SelectTrigger>
                    <SelectContent>
                      {selectedBusinessMetric.condition_mappings.map((mapping) => <SelectItem key={mapping.mapping_id} value={mapping.ui_condition_key}>{mapping.ui_condition_label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : null}
          </>
        ) : null}

        {selectedSourceType === 'system-metric' ? (
          <>
            <div className="space-y-2 md:col-span-2">
              <div className="text-sm font-medium">System Metric</div>
              <Select value={selectedSystemMetricKey} onValueChange={setSelectedSystemMetricKey} disabled={systemMetricsLoading || systemMetrics.length === 0}>
                <SelectTrigger><SelectValue placeholder={systemMetricsLoading ? 'Loading system metrics...' : 'Select system metric'} /></SelectTrigger>
                <SelectContent>{systemMetrics.map((metric) => <SelectItem key={metric.metric_key} value={metric.metric_key}>{metric.label}</SelectItem>)}</SelectContent>
              </Select>
              {systemMetricsError ? <div className="text-sm text-rose-600 dark:text-rose-400">{systemMetricsError}</div> : null}
            </div>
            {selectedSystemMetric ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:col-span-2 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="grid gap-3 md:grid-cols-2">
                  <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Metric Key</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedSystemMetric.metric_key}</div></div>
                  <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Aggregation</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedSystemMetric.aggregation_type || '-'}</div></div>
                  <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Source Table</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedSystemMetric.source_table || '-'}</div></div>
                  <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Dimensions</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedSystemMetric.supported_dimensions.join(', ') || '-'}</div></div>
                </div>
                {selectedSystemMetric.description ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{selectedSystemMetric.description}</p> : null}
              </div>
            ) : null}
          </>
        ) : null}

        {selectedSourceType === 'saved-query' ? (
          <>
            <div className="space-y-2 md:col-span-2">
              <div className="text-sm font-medium">Saved Query</div>
              <Select value={selectedSavedQueryPromptId} onValueChange={setSelectedSavedQueryPromptId} disabled={savedQueriesLoading || savedQueries.length === 0}>
                <SelectTrigger><SelectValue placeholder={savedQueriesLoading ? 'Loading saved queries...' : 'Select saved query'} /></SelectTrigger>
                <SelectContent>
                  {savedQueries.map((item) => <SelectItem key={item.prompt_id} value={item.prompt_id}>{item.title}</SelectItem>)}
                </SelectContent>
              </Select>
              {savedQueriesError ? <div className="text-sm text-rose-600 dark:text-rose-400">{savedQueriesError}</div> : null}
              {!savedQueriesLoading && !savedQueriesError && savedQueries.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  No saved AI queries with SQL were found. Save a Senti AI result with SQL first, then reuse it here.
                </div>
              ) : null}
            </div>
            {selectedSavedQuery ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:col-span-2 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="grid gap-3 md:grid-cols-2">
                  <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Session</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedSavedQuery.session_id}</div></div>
                  <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Mode</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedSavedQuery.mode || '-'}</div></div>
                </div>
                {selectedSavedQuery.prompt ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{selectedSavedQuery.prompt}</p> : null}
                <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-100">{selectedSavedQuery.query_sql}</pre>
              </div>
            ) : null}
          </>
        ) : null}

        {selectedSourceType === 'manual-rule-source' ? (
          <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
            <div className="space-y-2"><div className="text-sm font-medium">From</div><Input value={manualFrom} onChange={(e) => setManualFrom(e.target.value)} /></div>
            <div className="space-y-2"><div className="text-sm font-medium">Select</div><Input value={manualSelect} onChange={(e) => setManualSelect(e.target.value)} /></div>
            <div className="space-y-2"><div className="text-sm font-medium">Key Filter</div><Input value={manualFilterKey} onChange={(e) => setManualFilterKey(e.target.value)} /></div>
            <div className="space-y-2"><div className="text-sm font-medium">Value Filter</div><Input value={manualFilterValue} onChange={(e) => setManualFilterValue(e.target.value)} /></div>
          </div>
        ) : null}

        {selectedSourceType === 'ai-query' ? (
          <div className="space-y-2 md:col-span-2">
            <div className="text-sm font-medium">AI Prompt</div>
            <Textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
            <p className="text-xs text-slate-500 dark:text-slate-400">This source will generate a query from prompt and save it as the rule source in the next phase.</p>
          </div>
        ) : null}

        {selectedSourceType === 'dashboard-widget' ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-4 text-sm text-slate-500 md:col-span-2 dark:border-slate-800 dark:text-slate-400">
            Dashboard Widget source keeps the rule tied to a pinned dashboard widget.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
