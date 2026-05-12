'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  BellRing,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Filter,
  Mail,
  MessageCircleMore,
  MessageSquareMore,
  Plus,
  Settings2,
  ShieldAlert,
  Siren,
  TriangleAlert,
} from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';
import {
  alertEvents,
  alertRules,
  alertSummary,
  getAlertById,
  notificationLogs,
  type AlertSeverity,
  type AlertStatus,
  type NotificationChannel,
} from '../_lib/mock-data';
import {
  moduleOptions,
  internalUserOptions,
  type AlertAnalyticsPayload,
  type AlertDeadLetterTriageAuditSummary,
  type AlertDeadLetterTriageFilterContext,
  type AlertDeadLetterTriagePolicy,
  type AlertDeadLetterTriageRecord,
  type AlertDeadLetterTriageSummary,
  type AlertDeliveryLogRecord,
  type AlertDeliveryObservabilityPayload,
  type AlertDeliveryStatusPayload,
  type AlertDeliveryStatusRecord,
  type AlertEscalationPolicyRecord,
  type AlertEventRecord,
  type AlertOpsPayload,
  type AlertRuleDetailRecord,
  type AlertRuleRecord,
  type AlertRuntimeSettingRecord,
  type AlertTemplateRecord,
  type AlertTriageSavedViewRecord,
  type BaileysPairingPayload,
  type BusinessMetricGoal,
  type BusinessMetricOption,
  type InternalUserOption,
  type MetricConditionMapping,
  type ModuleOption,
  type PersistedAlertChannelRecord,
  type SavedQueryOption,
  type SystemMetricOption,
} from './types';
import {
  alertStatusFromInsightStatus,
  formatDimensions,
  moduleLabelFromKey,
  normalizeTemplateChannel,
  severityBadgeClass,
  severityFromAnomalyLevel,
  statusBadgeClass,
  summaryIcon,
} from './utils';
import { DetailRow, SettingRow, Shell } from './_shared';

export function AlertTemplatesPageView() {
  const [templates, setTemplates] = useState<AlertTemplateRecord[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState('');
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [templateSaveLoading, setTemplateSaveLoading] = useState(false);
  const [templateDeleteLoadingId, setTemplateDeleteLoadingId] = useState<number | null>(null);
  const [templateToggleLoadingId, setTemplateToggleLoadingId] = useState<number | null>(null);
  const [templatePendingDelete, setTemplatePendingDelete] = useState<AlertTemplateRecord | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateModule, setTemplateModule] = useState('sales');
  const [templateSeverity, setTemplateSeverity] = useState<AlertSeverity>('critical');
  const [templateChannels, setTemplateChannels] = useState('wa-group, email');
  const [templateDefaultRecipients, setTemplateDefaultRecipients] = useState('Ops Alert Group, Sales Manager');
  const [templateSchedule, setTemplateSchedule] = useState('15m');
  const [templateCondition, setTemplateCondition] = useState('');
  const [templateMessage, setTemplateMessage] = useState('');
  const [templateSourceType, setTemplateSourceType] = useState('business-metric');
  const [templateSourceRef, setTemplateSourceRef] = useState('');
  const [templateIsDefault, setTemplateIsDefault] = useState(false);

  const loadTemplates = async () => {
    setTemplatesLoading(true);
    setTemplatesError('');
    try {
      const response = await fetch('/api/alerting/templates', { cache: 'no-store' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to load alert templates.');
      }
      setTemplates(payload.data as AlertTemplateRecord[]);
    } catch (error) {
      setTemplates([]);
      setTemplatesError(error instanceof Error ? error.message : 'Failed to load alert templates.');
    } finally {
      setTemplatesLoading(false);
    }
  };

  useEffect(() => {
    void loadTemplates();
  }, []);

  const resetTemplateForm = () => {
    setEditingTemplateId(null);
    setTemplateName('');
    setTemplateDescription('');
    setTemplateModule('sales');
    setTemplateSeverity('critical');
    setTemplateChannels('wa-group, email');
    setTemplateDefaultRecipients('Ops Alert Group, Sales Manager');
    setTemplateSchedule('15m');
    setTemplateCondition('');
    setTemplateMessage('');
    setTemplateSourceType('business-metric');
    setTemplateSourceRef('');
    setTemplateIsDefault(false);
  };

  const handleEditTemplate = (template: AlertTemplateRecord) => {
    setEditingTemplateId(template.template_id);
    setTemplateName(template.name);
    setTemplateDescription(template.description || '');
    setTemplateModule(template.module_key);
    setTemplateSeverity(template.severity);
    setTemplateChannels(template.recommended_channels.join(', '));
    setTemplateDefaultRecipients(template.default_recipients.join(', '));
    setTemplateSchedule(template.schedule_value || '');
    setTemplateCondition(template.condition_summary || '');
    setTemplateMessage(template.message_template || '');
    setTemplateSourceType(template.source_type || 'business-metric');
    setTemplateSourceRef(template.source_ref || '');
    setTemplateIsDefault(template.is_default);
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim() || !templateModule.trim()) return;
    setTemplateSaveLoading(true);
    setTemplatesError('');
    try {
      const recommendedChannels = templateChannels
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      const defaultRecipients = templateDefaultRecipients
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      const response = await fetch(
        editingTemplateId ? `/api/alerting/templates/${editingTemplateId}` : '/api/alerting/templates',
        {
          method: editingTemplateId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: templateName.trim(),
            description: templateDescription.trim(),
            moduleKey: templateModule,
            severity: templateSeverity,
            recommendedChannels,
            defaultRecipients,
            sourceType: templateSourceType.trim() || null,
            sourceRef: templateSourceRef.trim() || null,
            scheduleValue: templateSchedule.trim() || null,
            conditionSummary: templateCondition.trim() || null,
            messageTemplate: templateMessage.trim() || null,
            isDefault: templateIsDefault,
          }),
        },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || `Failed to ${editingTemplateId ? 'update' : 'create'} alert template.`);
      }
      setTemplates(payload.data as AlertTemplateRecord[]);
      resetTemplateForm();
    } catch (error) {
      setTemplatesError(error instanceof Error ? error.message : `Failed to ${editingTemplateId ? 'update' : 'create'} alert template.`);
    } finally {
      setTemplateSaveLoading(false);
    }
  };

  const handleDeleteTemplate = async (template: AlertTemplateRecord) => {
    setTemplateDeleteLoadingId(template.template_id);
    setTemplatesError('');
    try {
      const response = await fetch(`/api/alerting/templates/${template.template_id}`, {
        method: 'DELETE',
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to delete alert template.');
      }
      setTemplates(payload.data as AlertTemplateRecord[]);
      if (editingTemplateId === template.template_id) {
        resetTemplateForm();
      }
    } catch (error) {
      setTemplatesError(error instanceof Error ? error.message : 'Failed to delete alert template.');
    } finally {
      setTemplateDeleteLoadingId(null);
    }
  };

  const handleToggleTemplateState = async (template: AlertTemplateRecord) => {
    setTemplateToggleLoadingId(template.template_id);
    setTemplatesError('');
    try {
      const response = await fetch(`/api/alerting/templates/${template.template_id}/state`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !template.is_active }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to update alert template state.');
      }
      setTemplates(payload.data as AlertTemplateRecord[]);
    } catch (error) {
      setTemplatesError(error instanceof Error ? error.message : 'Failed to update alert template state.');
    } finally {
      setTemplateToggleLoadingId(null);
    }
  };

  return (
    <Shell title="Alert Templates" description="Preset templates make rule creation faster for business users.">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templatesError ? <div className="md:col-span-2 xl:col-span-3 text-sm text-rose-600 dark:text-rose-400">{templatesError}</div> : null}
          {templates.map((template) => (
            <Card key={template.template_id} className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={severityBadgeClass(template.severity)}>{template.severity}</Badge>
                  {template.is_default ? <Badge variant="outline">Default</Badge> : null}
                </div>
                <div className="text-xs text-muted-foreground">Module: {moduleLabelFromKey(template.module_key)}</div>
                <div className="text-xs text-muted-foreground">Recommended: {template.recommended_channels.join(', ') || '-'}</div>
                <div className="text-xs text-muted-foreground">Default Recipients: {template.default_recipients.join(', ') || '-'}</div>
                <div className="text-xs text-muted-foreground">State: {template.is_active ? 'Active' : 'Inactive'}</div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" asChild disabled={!template.is_active}>
                    <Link href={`/app/alerting/rules/create?templateId=${encodeURIComponent(String(template.template_id))}`}>
                      Use Template
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/app/alerting/templates/${template.template_id}`}>View</Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEditTemplate(template)}>Edit</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={templateToggleLoadingId === template.template_id}
                    onClick={() => handleToggleTemplateState(template)}
                  >
                    {templateToggleLoadingId === template.template_id
                      ? 'Saving...'
                      : template.is_active ? 'Deactivate' : 'Reactivate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={templateDeleteLoadingId === template.template_id}
                    onClick={() => setTemplatePendingDelete(template)}
                  >
                    {templateDeleteLoadingId === template.template_id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {templatesLoading ? <div className="md:col-span-2 xl:col-span-3 text-sm text-muted-foreground">Loading templates...</div> : null}
          {!templatesLoading && !templates.length ? (
            <div className="md:col-span-2 xl:col-span-3 rounded-xl border border-dashed px-4 py-8 text-sm text-muted-foreground">
              No alert templates have been created yet.
            </div>
          ) : null}
        </div>
        <Card className="h-fit border-slate-200">
          <CardHeader>
            <CardTitle>{editingTemplateId ? 'Edit Alert Template' : 'Create Alert Template'}</CardTitle>
            <CardDescription>Persist reusable presets for faster rule creation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Template Name</div>
              <Input value={templateName} onChange={(event) => setTemplateName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Description</div>
              <Textarea value={templateDescription} onChange={(event) => setTemplateDescription(event.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Module</div>
                <Select value={templateModule} onValueChange={setTemplateModule}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="purchasing">Purchasing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Severity</div>
                <Select value={templateSeverity} onValueChange={(value) => setTemplateSeverity(value as AlertSeverity)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Source Type</div>
                <Input value={templateSourceType} onChange={(event) => setTemplateSourceType(event.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Source Ref</div>
                <Input value={templateSourceRef} onChange={(event) => setTemplateSourceRef(event.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Recommended Channels</div>
              <Input value={templateChannels} onChange={(event) => setTemplateChannels(event.target.value)} placeholder="wa-group, email" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Default Recipients</div>
              <Input value={templateDefaultRecipients} onChange={(event) => setTemplateDefaultRecipients(event.target.value)} placeholder="Ops Alert Group, Sales Manager" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Schedule</div>
              <Input value={templateSchedule} onChange={(event) => setTemplateSchedule(event.target.value)} placeholder="15m / hourly / daily" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Condition Summary</div>
              <Input value={templateCondition} onChange={(event) => setTemplateCondition(event.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Message Template</div>
              <Textarea value={templateMessage} onChange={(event) => setTemplateMessage(event.target.value)} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
              <div>
                <div className="text-sm font-medium">Default Template For Module</div>
                <div className="text-xs text-muted-foreground">Only one active default template is kept per module.</div>
              </div>
              <Switch checked={templateIsDefault} onCheckedChange={setTemplateIsDefault} />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSaveTemplate} disabled={templateSaveLoading || !templateName.trim()}>
                {templateSaveLoading ? 'Saving...' : editingTemplateId ? 'Save Template' : 'Create Template'}
              </Button>
              {editingTemplateId ? (
                <Button variant="outline" onClick={resetTemplateForm} disabled={templateSaveLoading}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={Boolean(templatePendingDelete)} onOpenChange={(open) => { if (!open) setTemplatePendingDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Alert Template</AlertDialogTitle>
            <AlertDialogDescription>
              {templatePendingDelete
                ? `This will deactivate template "${templatePendingDelete.name}" and hide it from the active template list.`
                : 'This action will deactivate the selected template.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={templateDeleteLoadingId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!templatePendingDelete || templateDeleteLoadingId !== null}
              onClick={(event) => {
                event.preventDefault();
                if (!templatePendingDelete) return;
                void handleDeleteTemplate(templatePendingDelete).then(() => setTemplatePendingDelete(null));
              }}
            >
              {templateDeleteLoadingId !== null ? 'Deleting...' : 'Delete Template'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  );
}

