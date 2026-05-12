'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AlertSeverity } from '../_lib/mock-data';
import type {
  AlertRuleDetailRecord,
  AlertTemplateRecord,
  BusinessMetricOption,
  SavedQueryOption,
  SystemMetricOption,
} from './types';
import { normalizeTemplateChannel } from './utils';
import { Shell } from './_shared';

export function CreateAlertRulePageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sourceTypeFromQuery = searchParams.get('sourceType');
  const ruleId = searchParams.get('ruleId');
  const templateIdFromQuery = searchParams.get('templateId');
  const dashboardKey = searchParams.get('dashboardKey');
  const widgetId = searchParams.get('widgetId');
  const widgetTitle = searchParams.get('widgetTitle');
  const [selectedSourceType, setSelectedSourceType] = useState(sourceTypeFromQuery || 'dashboard-widget');
  const [selectedModule, setSelectedModule] = useState('sales');
  const [templates, setTemplates] = useState<AlertTemplateRecord[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templateIdFromQuery || '');
  const [templateActionMessage, setTemplateActionMessage] = useState('');
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetricOption[]>([]);
  const [businessMetricsLoading, setBusinessMetricsLoading] = useState(false);
  const [businessMetricsError, setBusinessMetricsError] = useState('');
  const [selectedBusinessMetricKey, setSelectedBusinessMetricKey] = useState('');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetricOption[]>([]);
  const [systemMetricsLoading, setSystemMetricsLoading] = useState(false);
  const [systemMetricsError, setSystemMetricsError] = useState('');
  const [selectedSystemMetricKey, setSelectedSystemMetricKey] = useState('');
  const [savedQueries, setSavedQueries] = useState<SavedQueryOption[]>([]);
  const [savedQueriesLoading, setSavedQueriesLoading] = useState(false);
  const [savedQueriesError, setSavedQueriesError] = useState('');
  const [selectedSavedQueryPromptId, setSelectedSavedQueryPromptId] = useState('');
  const [manualFrom, setManualFrom] = useState('public.obt_sales_receivable');
  const [manualSelect, setManualSelect] = useState('invoice_amount');
  const [manualFilterKey, setManualFilterKey] = useState('branch');
  const [manualFilterValue, setManualFilterValue] = useState('Surabaya');
  const [aiPrompt, setAiPrompt] = useState('Show overdue receivable total above 200 million by branch.');
  const [selectedConditionMappingKey, setSelectedConditionMappingKey] = useState('');
  const [ruleName, setRuleName] = useState(widgetTitle || '');
  const [conditionSummary, setConditionSummary] = useState('');
  const [severity, setSeverity] = useState<AlertSeverity>('critical');
  const [scheduleValue, setScheduleValue] = useState('15m');
  const [primaryChannel, setPrimaryChannel] = useState<'wa-group' | 'wa-personal' | 'email'>('wa-group');
  const [recipientText, setRecipientText] = useState('Ops Alert Group');
  const [messageTemplate, setMessageTemplate] = useState('[Critical] Daily sales dropped more than 20% versus yesterday. Please review branch performance and top customer contribution.');
  const [saveError, setSaveError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [ruleDetailLoading, setRuleDetailLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setTemplatesLoading(true);
    setTemplatesError('');
    fetch('/api/alerting/templates', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
          throw new Error(payload?.message || 'Failed to load alert templates.');
        }
        if (cancelled) return;
        setTemplates(payload.data as AlertTemplateRecord[]);
      })
      .catch((error) => {
        if (cancelled) return;
        setTemplates([]);
        setTemplatesError(error instanceof Error ? error.message : 'Failed to load alert templates.');
      })
      .finally(() => {
        if (!cancelled) setTemplatesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (selectedSourceType !== 'business-metric') return;
    let cancelled = false;
    setBusinessMetricsLoading(true);
    setBusinessMetricsError('');
    fetch(`/api/alerting/metric-builder-context?module=${encodeURIComponent(selectedModule)}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) throw new Error(payload?.message || 'Failed to load business metrics.');
        if (cancelled) return;
        const metrics = payload.data as BusinessMetricOption[];
        setBusinessMetrics(metrics);
        const nextMetricKey = metrics.some((item) => item.metric_key === selectedBusinessMetricKey)
          ? selectedBusinessMetricKey
          : (metrics[0]?.metric_key || '');
        setSelectedBusinessMetricKey(nextMetricKey);
        const nextMetric = metrics.find((item) => item.metric_key === nextMetricKey) || metrics[0] || null;
        const nextCondition = nextMetric?.condition_mappings.find((item) => item.ui_condition_key === selectedConditionMappingKey)
          || nextMetric?.condition_mappings.find((item) => item.is_default)
          || nextMetric?.condition_mappings[0]
          || null;
        setSelectedConditionMappingKey(nextCondition?.ui_condition_key || '');
      })
      .catch((error) => {
        if (cancelled) return;
        setBusinessMetrics([]);
        setSelectedBusinessMetricKey('');
        setSelectedConditionMappingKey('');
        setBusinessMetricsError(error instanceof Error ? error.message : 'Failed to load business metrics.');
      })
      .finally(() => { if (!cancelled) setBusinessMetricsLoading(false); });
    return () => { cancelled = true; };
  }, [selectedSourceType, selectedModule, selectedBusinessMetricKey, selectedConditionMappingKey]);

  useEffect(() => {
    if (selectedSourceType !== 'business-metric') return;
    const nextMetric = businessMetrics.find((item) => item.metric_key === selectedBusinessMetricKey) || null;
    const nextCondition = nextMetric?.condition_mappings.find((item) => item.ui_condition_key === selectedConditionMappingKey)
      || nextMetric?.condition_mappings.find((item) => item.is_default)
      || nextMetric?.condition_mappings[0]
      || null;
    if ((nextCondition?.ui_condition_key || '') !== selectedConditionMappingKey) {
      setSelectedConditionMappingKey(nextCondition?.ui_condition_key || '');
    }
  }, [selectedSourceType, businessMetrics, selectedBusinessMetricKey, selectedConditionMappingKey]);

  useEffect(() => {
    if (selectedSourceType !== 'system-metric') return;
    let cancelled = false;
    setSystemMetricsLoading(true);
    setSystemMetricsError('');
    fetch(`/api/alerting/system-metrics?module=${encodeURIComponent(selectedModule)}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) throw new Error(payload?.message || 'Failed to load system metrics.');
        if (cancelled) return;
        const metrics = payload.data as SystemMetricOption[];
        setSystemMetrics(metrics);
        setSelectedSystemMetricKey((current) => current && metrics.some((item) => item.metric_key === current) ? current : (metrics[0]?.metric_key || ''));
      })
      .catch((error) => {
        if (cancelled) return;
        setSystemMetrics([]);
        setSelectedSystemMetricKey('');
        setSystemMetricsError(error instanceof Error ? error.message : 'Failed to load system metrics.');
      })
      .finally(() => { if (!cancelled) setSystemMetricsLoading(false); });
    return () => { cancelled = true; };
  }, [selectedSourceType, selectedModule]);

  useEffect(() => {
    if (selectedSourceType !== 'saved-query') return;
    let cancelled = false;
    setSavedQueriesLoading(true);
    setSavedQueriesError('');
    fetch('/api/alerting/saved-queries?channel=manager_dashboard&limit=12', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) throw new Error(payload?.message || 'Failed to load saved queries.');
        if (cancelled) return;
        const queries = payload.data as SavedQueryOption[];
        setSavedQueries(queries);
        setSelectedSavedQueryPromptId((current) => current && queries.some((item) => item.prompt_id == current) ? current : (queries[0]?.prompt_id || ''));
      })
      .catch((error) => {
        if (cancelled) return;
        setSavedQueries([]);
        setSelectedSavedQueryPromptId('');
        setSavedQueriesError(error instanceof Error ? error.message : 'Failed to load saved queries.');
      })
      .finally(() => { if (!cancelled) setSavedQueriesLoading(false); });
    return () => { cancelled = true; };
  }, [selectedSourceType]);

  const selectedBusinessMetric = businessMetrics.find((item) => item.metric_key === selectedBusinessMetricKey) || null;
  const selectedSystemMetric = systemMetrics.find((item) => item.metric_key === selectedSystemMetricKey) || null;
  const selectedSavedQuery = savedQueries.find((item) => item.prompt_id === selectedSavedQueryPromptId) || null;
  const selectableTemplates = templates.filter((item) => item.is_active);
  const selectedTemplate = templates.find((item) => String(item.template_id) === selectedTemplateId) || null;
  const selectedConditionMapping = selectedBusinessMetric?.condition_mappings.find((item) => item.ui_condition_key === selectedConditionMappingKey)
    || selectedBusinessMetric?.condition_mappings.find((item) => item.is_default)
    || selectedBusinessMetric?.condition_mappings[0]
    || null;
  const templateSourceWarning = selectedTemplate?.source_ref
    ? selectedTemplate.source_type === 'business-metric' && !businessMetricsLoading && selectedSourceType === 'business-metric' && businessMetrics.length > 0 && !businessMetrics.some((item) => item.metric_key === selectedTemplate.source_ref)
      ? `Template source "${selectedTemplate.source_ref}" is not available in the current business metric registry.`
      : selectedTemplate.source_type === 'system-metric' && !systemMetricsLoading && selectedSourceType === 'system-metric' && systemMetrics.length > 0 && !systemMetrics.some((item) => item.metric_key === selectedTemplate.source_ref)
        ? `Template source "${selectedTemplate.source_ref}" is not available in the current system metric registry.`
        : selectedTemplate.source_type === 'saved-query' && !savedQueriesLoading && selectedSourceType === 'saved-query' && savedQueries.length > 0 && !savedQueries.some((item) => item.prompt_id === selectedTemplate.source_ref)
          ? `Template source "${selectedTemplate.source_ref}" is not available in the saved query registry.`
          : ''
    : '';

  function applyTemplateDefaults(template: AlertTemplateRecord, mode: 'create' | 'edit') {
    const nextPrimaryChannel = normalizeTemplateChannel(template.recommended_channels[0]) || 'wa-group';
    setTemplateLoading(true);
    setTemplateActionMessage('');
    try {
      if (mode === 'create' && !widgetId) {
        setSelectedModule(template.module_key || 'sales');
        if (template.source_type) setSelectedSourceType(template.source_type);
        if (template.source_type === 'business-metric') {
          setSelectedBusinessMetricKey(template.source_ref || '');
        } else if (template.source_type === 'system-metric') {
          setSelectedSystemMetricKey(template.source_ref || '');
        } else if (template.source_type === 'saved-query') {
          setSelectedSavedQueryPromptId(template.source_ref || '');
        } else if (template.source_type === 'manual-rule-source') {
          setManualFrom(template.source_ref || 'public.obt_sales_receivable');
        } else if (template.source_type === 'ai-query') {
          setAiPrompt(template.source_ref || aiPrompt);
        }
      }

      setSeverity(template.severity || 'critical');
      setScheduleValue(template.schedule_value || '15m');
      setConditionSummary(template.condition_summary || '');
      setMessageTemplate(template.message_template || '');
      setPrimaryChannel(nextPrimaryChannel);
      setRecipientText((template.default_recipients || []).join(', '));
      setTemplateActionMessage(
        mode === 'edit'
          ? `Applied defaults from template "${template.name}" without changing source identity.`
          : `Template "${template.name}" loaded into the rule form.`,
      );
    } finally {
      setTemplateLoading(false);
    }
  }

  useEffect(() => {
    if (!ruleId) return;
    let cancelled = false;
    setRuleDetailLoading(true);
    setSaveError('');
    fetch(`/api/alerting/rules/${ruleId}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !payload?.data) {
          throw new Error(payload?.message || 'Failed to load alert rule detail.');
        }
        if (cancelled) return;
        const detail = payload.data as AlertRuleDetailRecord;
        setSelectedSourceType(detail.source_type || 'dashboard-widget');
        setSelectedModule(detail.module_key || 'sales');
        setRuleName(detail.rule_name || '');
        setConditionSummary(detail.condition_summary || '');
        setSeverity((detail.severity as AlertSeverity) || 'critical');
        setScheduleValue(detail.schedule_value || '15m');
        setPrimaryChannel((detail.primary_channel as 'wa-group' | 'wa-personal' | 'email') || 'wa-group');
        setMessageTemplate(detail.message_template || '');
        setRecipientText(detail.recipients.map((item) => item.target_label).join(', '));
        setSelectedBusinessMetricKey(detail.source_type === 'business-metric' ? (detail.source_ref || '') : '');
        setSelectedSystemMetricKey(detail.source_type === 'system-metric' ? (detail.source_ref || '') : '');
        setSelectedSavedQueryPromptId(detail.source_type === 'saved-query' ? (detail.source_ref || '') : '');
        setSelectedConditionMappingKey(detail.condition_mapping_key || '');
        setManualFrom(String(detail.source_context?.manualFrom || 'public.obt_sales_receivable'));
        setManualSelect(String(detail.source_context?.manualSelect || 'invoice_amount'));
        setManualFilterKey(String(detail.source_context?.manualFilterKey || 'branch'));
        setManualFilterValue(String(detail.source_context?.manualFilterValue || 'Surabaya'));
        setAiPrompt(String(detail.source_context?.aiPrompt || ''));
      })
      .catch((error) => {
        if (cancelled) return;
        setSaveError(error instanceof Error ? error.message : 'Failed to load alert rule detail.');
      })
      .finally(() => {
        if (!cancelled) setRuleDetailLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ruleId]);

  useEffect(() => {
    if (!templateIdFromQuery || !selectedTemplate) return;
    if (ruleId) {
      setTemplateActionMessage(`Template "${selectedTemplate.name}" is ready. Use "Apply Template Defaults" to merge it into the existing rule.`);
      return;
    }
    applyTemplateDefaults(selectedTemplate, 'create');
  }, [templateIdFromQuery, selectedTemplate, ruleId]);

  useEffect(() => {
    if (!selectedTemplate || !selectedTemplateId) return;
    if (selectedTemplateId === templateIdFromQuery) return;
    if (ruleId) {
      setTemplateActionMessage(`Template "${selectedTemplate.name}" selected. Apply defaults explicitly to keep the existing rule baseline intact.`);
      return;
    }
    applyTemplateDefaults(selectedTemplate, 'create');
  }, [selectedTemplateId, selectedTemplate, ruleId, templateIdFromQuery]);

  useEffect(() => {
    if (ruleName.trim()) return;
    if (widgetTitle) {
      setRuleName(`Alert for ${widgetTitle}`);
      return;
    }
    if (selectedBusinessMetric?.label) {
      setRuleName(`${selectedBusinessMetric.label} Alert`);
      return;
    }
    if (selectedSystemMetric?.label) {
      setRuleName(`${selectedSystemMetric.label} Alert`);
      return;
    }
    if (selectedSavedQuery?.title) {
      setRuleName(`${selectedSavedQuery.title} Alert`);
    }
  }, [ruleName, widgetTitle, selectedBusinessMetric, selectedSystemMetric, selectedSavedQuery]);

  useEffect(() => {
    if (conditionSummary.trim()) return;
    if (selectedConditionMapping?.example_condition) {
      setConditionSummary(selectedConditionMapping.example_condition);
    } else {
      setConditionSummary('Trigger when the selected metric matches the configured condition.');
    }
  }, [selectedConditionMapping, conditionSummary]);

  async function handleSaveRule() {
    setSaveError('');
    setSaveLoading(true);
    try {
      const recipients = recipientText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => ({
          channel_type: primaryChannel,
          target_label: item,
          target_value:
            primaryChannel === 'email'
              ? item.includes('@')
                ? item
                : item.toLowerCase().replace(/\s+/g, '.') + '@fr-labs.my.id'
              : primaryChannel === 'wa-group'
                ? item.toLowerCase().replace(/\s+/g, '-')
                : item,
        }));

      const payload = {
        ruleName: ruleName.trim() || 'Untitled Alert Rule',
        moduleKey: selectedModule,
        sourceType: selectedSourceType,
        sourceRef:
          selectedSourceType === 'business-metric'
            ? selectedBusinessMetric?.metric_key
            : selectedSourceType === 'system-metric'
              ? selectedSystemMetric?.metric_key
              : selectedSourceType === 'saved-query'
                ? selectedSavedQuery?.prompt_id
                : selectedSourceType === 'dashboard-widget'
                  ? widgetId
                  : selectedSourceType === 'manual-rule-source'
                    ? manualFrom
                    : aiPrompt,
        metricId: selectedBusinessMetric?.metric_id ?? null,
        systemMetricRef: selectedSourceType === 'system-metric' ? selectedSystemMetric?.metric_key : selectedBusinessMetric?.system_metric_ref,
        semanticRef: selectedBusinessMetric?.semantic_ref ?? null,
        conditionMappingId: selectedConditionMapping?.mapping_id ?? null,
        conditionMappingKey: selectedConditionMapping?.ui_condition_key ?? null,
        conditionOperatorKey: selectedConditionMapping?.operator_key ?? null,
        comparisonType: selectedBusinessMetric?.comparison_type ?? null,
        valueType: selectedBusinessMetric?.value_type ?? selectedSystemMetric?.value_type ?? null,
        scheduleType: 'preset',
        scheduleValue,
        severity,
        primaryChannel,
        conditionSummary,
        conditionConfig: selectedConditionMapping?.input_config ?? {},
        sourceContext: {
          dashboardKey,
          widgetId,
          widgetTitle,
          manualFrom,
          manualSelect,
          manualFilterKey,
          manualFilterValue,
          savedQueryPromptId: selectedSavedQuery?.prompt_id ?? null,
          aiPrompt: selectedSourceType === 'ai-query' ? aiPrompt : null,
        },
        messageTemplate,
        recipients,
      };

      const response = await fetch(ruleId ? `/api/alerting/rules/${ruleId}` : '/api/alerting/rules', {
        method: ruleId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to save alert rule.');
      }
      router.push('/app/alerting/rules');
      router.refresh();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save alert rule.');
    } finally {
      setSaveLoading(false);
    }
  }

  return (
    <Shell
      title="Create Alert Rule"
      description={ruleId ? 'Edit an existing alert rule and persist updates to the alerting domain.' : 'Wizard-style form for alert rule setup with business metric registry as the first live source.'}
      actions={
        <Button asChild variant="outline">
          <Link href="/app/alerting/rules">Back to Rules</Link>
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_420px]">
        {widgetId ? (
          <Card className="xl:col-span-2 border-amber-200 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle>Alert Source Context</CardTitle>
              <CardDescription>This rule was started from a pinned dashboard widget.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm md:grid-cols-4">
              <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Source Type</div><div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{sourceTypeFromQuery ?? 'dashboard-widget'}</div></div>
              <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Dashboard</div><div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{dashboardKey ?? '-'}</div></div>
              <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Widget ID</div><div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{widgetId}</div></div>
              <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Widget Title</div><div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{widgetTitle ?? '-'}</div></div>
            </CardContent>
          </Card>
        ) : null}
        <div className="space-y-6">
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
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={templateLoading}
                      onClick={() => applyTemplateDefaults(selectedTemplate, 'edit')}
                    >
                      {templateLoading ? 'Applying...' : 'Apply Template Defaults'}
                    </Button>
                  ) : null}
                </div>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId} disabled={templatesLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder={templatesLoading ? 'Loading templates...' : 'Select template'} />
                  </SelectTrigger>
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
                    <Select
                      value={selectedBusinessMetricKey}
                      onValueChange={setSelectedBusinessMetricKey}
                      disabled={businessMetricsLoading || businessMetrics.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={businessMetricsLoading ? 'Loading business metrics...' : 'Select business metric'} />
                      </SelectTrigger>
                      <SelectContent>
                        {businessMetrics.map((metric) => (
                          <SelectItem key={metric.metric_key} value={metric.metric_key}>
                            {metric.label}
                          </SelectItem>
                        ))}
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
                      {selectedBusinessMetric.business_definition ? (
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{selectedBusinessMetric.business_definition}</p>
                      ) : null}
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
                    </div>
                  ) : null}
                </>
              ) : null}

              {selectedSourceType == 'system-metric' ? (
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
                    <Select
                      value={selectedSavedQueryPromptId}
                      onValueChange={setSelectedSavedQueryPromptId}
                      disabled={savedQueriesLoading || savedQueries.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={savedQueriesLoading ? 'Loading saved queries...' : 'Select saved query'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {savedQueries.map((item) => (
                          <SelectItem key={item.prompt_id} value={item.prompt_id}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {savedQueriesError ? (
                      <div className="text-sm text-rose-600 dark:text-rose-400">{savedQueriesError}</div>
                    ) : null}
                    {!savedQueriesLoading && !savedQueriesError && savedQueries.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        No saved AI queries with SQL were found in the current history. Save a Senti AI result with SQL first, then reuse it here.
                      </div>
                    ) : null}
                  </div>
                  {selectedSavedQuery ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:col-span-2 dark:border-slate-800 dark:bg-slate-950/50">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Session</div>
                          <div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                            {selectedSavedQuery.session_id}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Mode</div>
                          <div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                            {selectedSavedQuery.mode || '-'}
                          </div>
                        </div>
                      </div>
                      {selectedSavedQuery.prompt ? (
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                          {selectedSavedQuery.prompt}
                        </p>
                      ) : null}
                      <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-100">
                        {selectedSavedQuery.query_sql}
                      </pre>
                    </div>
                  ) : null}
                </>
              ) : null}

              {selectedSourceType == 'manual-rule-source' ? (
                <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
                  <div className="space-y-2"><div className="text-sm font-medium">From</div><Input value={manualFrom} onChange={(event) => setManualFrom(event.target.value)} /></div>
                  <div className="space-y-2"><div className="text-sm font-medium">Select</div><Input value={manualSelect} onChange={(event) => setManualSelect(event.target.value)} /></div>
                  <div className="space-y-2"><div className="text-sm font-medium">Key Filter</div><Input value={manualFilterKey} onChange={(event) => setManualFilterKey(event.target.value)} /></div>
                  <div className="space-y-2"><div className="text-sm font-medium">Value Filter</div><Input value={manualFilterValue} onChange={(event) => setManualFilterValue(event.target.value)} /></div>
                </div>
              ) : null}

              {selectedSourceType == 'ai-query' ? (
                <div className="space-y-2 md:col-span-2">
                  <div className="text-sm font-medium">AI Prompt</div>
                  <Textarea value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} />
                  <p className="text-xs text-slate-500 dark:text-slate-400">This source will generate a query from prompt and save it as the rule source in the next phase.</p>
                </div>
              ) : null}

              {selectedSourceType == 'dashboard-widget' ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-4 text-sm text-slate-500 md:col-span-2 dark:border-slate-800 dark:text-slate-400">
                  Dashboard Widget source keeps the rule tied to a pinned dashboard widget.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Condition</CardTitle>
              <CardDescription>Condition choices are derived from semantic ref, comparison type, and value type.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Condition Type</div>
                <Select
                  value={selectedConditionMapping?.ui_condition_key || selectedConditionMappingKey}
                  onValueChange={setSelectedConditionMappingKey}
                  disabled={selectedSourceType !== 'business-metric' || !selectedBusinessMetric || selectedBusinessMetric.condition_mappings.length === 0}
                >
                  <SelectTrigger><SelectValue placeholder="Select condition type" /></SelectTrigger>
                  <SelectContent>
                    {selectedBusinessMetric?.condition_mappings.map((mapping) => (
                      <SelectItem key={mapping.mapping_id} value={mapping.ui_condition_key}>
                        {mapping.ui_condition_label}
                      </SelectItem>
                    )) || [
                      <SelectItem key="threshold" value="threshold">Threshold Exceeded</SelectItem>,
                      <SelectItem key="trend-anomaly" value="trend-anomaly">Trend Anomaly</SelectItem>,
                    ]}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Severity</div>
                <Select value={severity} onValueChange={(value) => setSeverity(value as AlertSeverity)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedBusinessMetric && selectedConditionMapping ? (
                <>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 md:col-span-2 dark:border-slate-800 dark:bg-slate-950/40">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Operator</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedConditionMapping.operator_label}</div></div>
                      <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Input Config</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{JSON.stringify(selectedConditionMapping.input_config)}</div></div>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <div className="text-sm font-medium">Condition Summary</div>
                    <Input value={conditionSummary} onChange={(event) => setConditionSummary(event.target.value)} />
                  </div>
                </>
              ) : (
                <div className="space-y-2 md:col-span-2">
                  <div className="text-sm font-medium">Condition Summary</div>
                  <Input value={conditionSummary} onChange={(event) => setConditionSummary(event.target.value)} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Schedule & Delivery</CardTitle>
              <CardDescription>Preset schedules keep the first version simple and user friendly.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Schedule</div>
                <Select value={scheduleValue} onValueChange={setScheduleValue}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15m">Every 15 minutes</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily 08:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Primary Channel</div>
                <Select value={primaryChannel} onValueChange={(value) => setPrimaryChannel(value as 'wa-group' | 'wa-personal' | 'email')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wa-group">WhatsApp Group</SelectItem>
                    <SelectItem value="wa-personal">WhatsApp Personal</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>4. Notify Who</CardTitle>
              <CardDescription>Recipient targets will be stored into `alert_rule_recipient`.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Rule Name</div>
                <Input value={ruleName} onChange={(event) => setRuleName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Recipients</div>
                <Input value={recipientText} onChange={(event) => setRecipientText(event.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Message Template</div>
                <Textarea value={messageTemplate} onChange={(event) => setMessageTemplate(event.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
             <CardTitle>5. Preview & Save</CardTitle>
              <CardDescription>The save action now persists into the real alert rule tables in PostgreSQL.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Summary: Monitor selected source, run {scheduleValue}, send to {primaryChannel}, severity {severity}.</p>
              {ruleDetailLoading ? <div className="text-sm text-muted-foreground">Loading rule detail...</div> : null}
              {saveError ? <div className="text-sm text-rose-600 dark:text-rose-400">{saveError}</div> : null}
              <Button className="w-full" onClick={handleSaveRule} disabled={saveLoading || !ruleName.trim()}>
                {saveLoading ? 'Saving...' : ruleId ? 'Save Changes' : 'Save Rule'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

