import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AlertSeverity } from '../_lib/mock-data';
import type {
  AlertRuleDetailRecord,
  AlertTemplateRecord,
  BusinessMetricOption,
  SavedQueryOption,
  SystemMetricOption,
} from './types';
import { normalizeTemplateChannel } from './utils';

export function useCreateAlertRuleState() {
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
        if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) throw new Error(payload?.message || 'Failed to load alert templates.');
        if (cancelled) return;
        setTemplates(payload.data as AlertTemplateRecord[]);
      })
      .catch((error) => { if (cancelled) return; setTemplates([]); setTemplatesError(error instanceof Error ? error.message : 'Failed to load alert templates.'); })
      .finally(() => { if (!cancelled) setTemplatesLoading(false); });
    return () => { cancelled = true; };
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
        const nextMetricKey = metrics.some((item) => item.metric_key === selectedBusinessMetricKey) ? selectedBusinessMetricKey : (metrics[0]?.metric_key || '');
        setSelectedBusinessMetricKey(nextMetricKey);
        const nextMetric = metrics.find((item) => item.metric_key === nextMetricKey) || metrics[0] || null;
        const nextCondition = nextMetric?.condition_mappings.find((item) => item.ui_condition_key === selectedConditionMappingKey) || nextMetric?.condition_mappings.find((item) => item.is_default) || nextMetric?.condition_mappings[0] || null;
        setSelectedConditionMappingKey(nextCondition?.ui_condition_key || '');
      })
      .catch((error) => { if (cancelled) return; setBusinessMetrics([]); setSelectedBusinessMetricKey(''); setSelectedConditionMappingKey(''); setBusinessMetricsError(error instanceof Error ? error.message : 'Failed to load business metrics.'); })
      .finally(() => { if (!cancelled) setBusinessMetricsLoading(false); });
    return () => { cancelled = true; };
  }, [selectedSourceType, selectedModule, selectedBusinessMetricKey, selectedConditionMappingKey]);

  useEffect(() => {
    if (selectedSourceType !== 'business-metric') return;
    const nextMetric = businessMetrics.find((item) => item.metric_key === selectedBusinessMetricKey) || null;
    const nextCondition = nextMetric?.condition_mappings.find((item) => item.ui_condition_key === selectedConditionMappingKey) || nextMetric?.condition_mappings.find((item) => item.is_default) || nextMetric?.condition_mappings[0] || null;
    if ((nextCondition?.ui_condition_key || '') !== selectedConditionMappingKey) setSelectedConditionMappingKey(nextCondition?.ui_condition_key || '');
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
      .catch((error) => { if (cancelled) return; setSystemMetrics([]); setSelectedSystemMetricKey(''); setSystemMetricsError(error instanceof Error ? error.message : 'Failed to load system metrics.'); })
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
      .catch((error) => { if (cancelled) return; setSavedQueries([]); setSelectedSavedQueryPromptId(''); setSavedQueriesError(error instanceof Error ? error.message : 'Failed to load saved queries.'); })
      .finally(() => { if (!cancelled) setSavedQueriesLoading(false); });
    return () => { cancelled = true; };
  }, [selectedSourceType]);

  const selectedBusinessMetric = businessMetrics.find((item) => item.metric_key === selectedBusinessMetricKey) || null;
  const selectedSystemMetric = systemMetrics.find((item) => item.metric_key === selectedSystemMetricKey) || null;
  const selectedSavedQuery = savedQueries.find((item) => item.prompt_id === selectedSavedQueryPromptId) || null;
  const selectableTemplates = templates.filter((item) => item.is_active);
  const selectedTemplate = templates.find((item) => String(item.template_id) === selectedTemplateId) || null;
  const selectedConditionMapping = selectedBusinessMetric?.condition_mappings.find((item) => item.ui_condition_key === selectedConditionMappingKey) || selectedBusinessMetric?.condition_mappings.find((item) => item.is_default) || selectedBusinessMetric?.condition_mappings[0] || null;
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
        if (template.source_type === 'business-metric') setSelectedBusinessMetricKey(template.source_ref || '');
        else if (template.source_type === 'system-metric') setSelectedSystemMetricKey(template.source_ref || '');
        else if (template.source_type === 'saved-query') setSelectedSavedQueryPromptId(template.source_ref || '');
        else if (template.source_type === 'manual-rule-source') setManualFrom(template.source_ref || 'public.obt_sales_receivable');
        else if (template.source_type === 'ai-query') setAiPrompt(template.source_ref || aiPrompt);
      }
      setSeverity(template.severity || 'critical');
      setScheduleValue(template.schedule_value || '15m');
      setConditionSummary(template.condition_summary || '');
      setMessageTemplate(template.message_template || '');
      setPrimaryChannel(nextPrimaryChannel);
      setRecipientText((template.default_recipients || []).join(', '));
      setTemplateActionMessage(mode === 'edit' ? `Applied defaults from template "${template.name}" without changing source identity.` : `Template "${template.name}" loaded into the rule form.`);
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
        if (!response.ok || !payload?.success || !payload?.data) throw new Error(payload?.message || 'Failed to load alert rule detail.');
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
      .catch((error) => { if (cancelled) return; setSaveError(error instanceof Error ? error.message : 'Failed to load alert rule detail.'); })
      .finally(() => { if (!cancelled) setRuleDetailLoading(false); });
    return () => { cancelled = true; };
  }, [ruleId]);

  useEffect(() => {
    if (!templateIdFromQuery || !selectedTemplate) return;
    if (ruleId) { setTemplateActionMessage(`Template "${selectedTemplate.name}" is ready. Use "Apply Template Defaults" to merge it into the existing rule.`); return; }
    applyTemplateDefaults(selectedTemplate, 'create');
  }, [templateIdFromQuery, selectedTemplate, ruleId]);

  useEffect(() => {
    if (!selectedTemplate || !selectedTemplateId) return;
    if (selectedTemplateId === templateIdFromQuery) return;
    if (ruleId) { setTemplateActionMessage(`Template "${selectedTemplate.name}" selected. Apply defaults explicitly to keep the existing rule baseline intact.`); return; }
    applyTemplateDefaults(selectedTemplate, 'create');
  }, [selectedTemplateId, selectedTemplate, ruleId, templateIdFromQuery]);

  useEffect(() => {
    if (ruleName.trim()) return;
    if (widgetTitle) { setRuleName(`Alert for ${widgetTitle}`); return; }
    if (selectedBusinessMetric?.label) { setRuleName(`${selectedBusinessMetric.label} Alert`); return; }
    if (selectedSystemMetric?.label) { setRuleName(`${selectedSystemMetric.label} Alert`); return; }
    if (selectedSavedQuery?.title) setRuleName(`${selectedSavedQuery.title} Alert`);
  }, [ruleName, widgetTitle, selectedBusinessMetric, selectedSystemMetric, selectedSavedQuery]);

  useEffect(() => {
    if (conditionSummary.trim()) return;
    setConditionSummary(selectedConditionMapping?.example_condition || 'Trigger when the selected metric matches the configured condition.');
  }, [selectedConditionMapping, conditionSummary]);

  async function handleSaveRule() {
    setSaveError('');
    setSaveLoading(true);
    try {
      const recipients = recipientText.split(',').map((item) => item.trim()).filter(Boolean).map((item) => ({
        channel_type: primaryChannel,
        target_label: item,
        target_value: primaryChannel === 'email' ? (item.includes('@') ? item : item.toLowerCase().replace(/\s+/g, '.') + '@fr-labs.my.id') : primaryChannel === 'wa-group' ? item.toLowerCase().replace(/\s+/g, '-') : item,
      }));
      const body = {
        ruleName: ruleName.trim() || 'Untitled Alert Rule',
        moduleKey: selectedModule,
        sourceType: selectedSourceType,
        sourceRef: selectedSourceType === 'business-metric' ? selectedBusinessMetric?.metric_key : selectedSourceType === 'system-metric' ? selectedSystemMetric?.metric_key : selectedSourceType === 'saved-query' ? selectedSavedQuery?.prompt_id : selectedSourceType === 'dashboard-widget' ? widgetId : selectedSourceType === 'manual-rule-source' ? manualFrom : aiPrompt,
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
        sourceContext: { dashboardKey, widgetId, widgetTitle, manualFrom, manualSelect, manualFilterKey, manualFilterValue, savedQueryPromptId: selectedSavedQuery?.prompt_id ?? null, aiPrompt: selectedSourceType === 'ai-query' ? aiPrompt : null },
        messageTemplate,
        recipients,
      };
      const response = await fetch(ruleId ? `/api/alerting/rules/${ruleId}` : '/api/alerting/rules', { method: ruleId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error(result?.message || 'Failed to save alert rule.');
      router.push('/app/alerting/rules');
      router.refresh();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save alert rule.');
    } finally {
      setSaveLoading(false);
    }
  }

  return {
    ruleId, widgetId, widgetTitle, dashboardKey, sourceTypeFromQuery,
    selectedSourceType, setSelectedSourceType,
    selectedModule, setSelectedModule,
    templates, templatesLoading, templatesError,
    selectedTemplateId, setSelectedTemplateId,
    templateActionMessage, templateLoading,
    selectedTemplate, selectableTemplates, templateSourceWarning,
    businessMetrics, businessMetricsLoading, businessMetricsError,
    selectedBusinessMetricKey, setSelectedBusinessMetricKey,
    selectedBusinessMetric,
    selectedConditionMappingKey, setSelectedConditionMappingKey,
    selectedConditionMapping,
    systemMetrics, systemMetricsLoading, systemMetricsError,
    selectedSystemMetricKey, setSelectedSystemMetricKey,
    selectedSystemMetric,
    savedQueries, savedQueriesLoading, savedQueriesError,
    selectedSavedQueryPromptId, setSelectedSavedQueryPromptId,
    selectedSavedQuery,
    manualFrom, setManualFrom,
    manualSelect, setManualSelect,
    manualFilterKey, setManualFilterKey,
    manualFilterValue, setManualFilterValue,
    aiPrompt, setAiPrompt,
    ruleName, setRuleName,
    conditionSummary, setConditionSummary,
    severity, setSeverity,
    scheduleValue, setScheduleValue,
    primaryChannel, setPrimaryChannel,
    recipientText, setRecipientText,
    messageTemplate, setMessageTemplate,
    saveError, saveLoading, ruleDetailLoading,
    applyTemplateDefaults, handleSaveRule,
  };
}
