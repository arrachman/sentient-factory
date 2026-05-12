'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AlertSeverity } from '../_lib/mock-data';
import { Shell } from './_shared';
import { useCreateAlertRuleState } from './use-create-alert-rule-state';
import { CreateRuleStepSource } from './create-rule-step-source';

export function CreateAlertRulePageView() {
  const state = useCreateAlertRuleState();
  const {
    ruleId, widgetId, widgetTitle, dashboardKey, sourceTypeFromQuery,
    selectedConditionMapping, selectedBusinessMetric,
    severity, setSeverity, conditionSummary, setConditionSummary,
    selectedConditionMappingKey, setSelectedConditionMappingKey,
    selectedSourceType,
    scheduleValue, setScheduleValue, primaryChannel, setPrimaryChannel,
    ruleName, setRuleName, recipientText, setRecipientText,
    messageTemplate, setMessageTemplate,
    saveError, saveLoading, ruleDetailLoading, handleSaveRule,
  } = state;

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
          <CreateRuleStepSource
            ruleId={ruleId}
            selectedSourceType={state.selectedSourceType}
            setSelectedSourceType={state.setSelectedSourceType}
            selectedModule={state.selectedModule}
            setSelectedModule={state.setSelectedModule}
            templates={state.templates}
            templatesLoading={state.templatesLoading}
            templatesError={state.templatesError}
            selectedTemplateId={state.selectedTemplateId}
            setSelectedTemplateId={state.setSelectedTemplateId}
            templateActionMessage={state.templateActionMessage}
            templateLoading={state.templateLoading}
            selectedTemplate={state.selectedTemplate}
            selectableTemplates={state.selectableTemplates}
            templateSourceWarning={state.templateSourceWarning}
            applyTemplateDefaults={state.applyTemplateDefaults}
            businessMetrics={state.businessMetrics}
            businessMetricsLoading={state.businessMetricsLoading}
            businessMetricsError={state.businessMetricsError}
            selectedBusinessMetricKey={state.selectedBusinessMetricKey}
            setSelectedBusinessMetricKey={state.setSelectedBusinessMetricKey}
            selectedBusinessMetric={state.selectedBusinessMetric}
            selectedConditionMappingKey={state.selectedConditionMappingKey}
            setSelectedConditionMappingKey={state.setSelectedConditionMappingKey}
            systemMetrics={state.systemMetrics}
            systemMetricsLoading={state.systemMetricsLoading}
            systemMetricsError={state.systemMetricsError}
            selectedSystemMetricKey={state.selectedSystemMetricKey}
            setSelectedSystemMetricKey={state.setSelectedSystemMetricKey}
            selectedSystemMetric={state.selectedSystemMetric}
            savedQueries={state.savedQueries}
            savedQueriesLoading={state.savedQueriesLoading}
            savedQueriesError={state.savedQueriesError}
            selectedSavedQueryPromptId={state.selectedSavedQueryPromptId}
            setSelectedSavedQueryPromptId={state.setSelectedSavedQueryPromptId}
            selectedSavedQuery={state.selectedSavedQuery}
            manualFrom={state.manualFrom}
            setManualFrom={state.setManualFrom}
            manualSelect={state.manualSelect}
            setManualSelect={state.setManualSelect}
            manualFilterKey={state.manualFilterKey}
            setManualFilterKey={state.setManualFilterKey}
            manualFilterValue={state.manualFilterValue}
            setManualFilterValue={state.setManualFilterValue}
            aiPrompt={state.aiPrompt}
            setAiPrompt={state.setAiPrompt}
          />

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
                      <SelectItem key={mapping.mapping_id} value={mapping.ui_condition_key}>{mapping.ui_condition_label}</SelectItem>
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
                    <Input value={conditionSummary} onChange={(e) => setConditionSummary(e.target.value)} />
                  </div>
                </>
              ) : (
                <div className="space-y-2 md:col-span-2">
                  <div className="text-sm font-medium">Condition Summary</div>
                  <Input value={conditionSummary} onChange={(e) => setConditionSummary(e.target.value)} />
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
                <Input value={ruleName} onChange={(e) => setRuleName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Recipients</div>
                <Input value={recipientText} onChange={(e) => setRecipientText(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Message Template</div>
                <Textarea value={messageTemplate} onChange={(e) => setMessageTemplate(e.target.value)} />
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
