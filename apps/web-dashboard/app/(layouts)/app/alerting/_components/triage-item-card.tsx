'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AlertDeadLetterTriageRecord } from './types';
import { moduleLabelFromKey, statusBadgeClass } from './utils';

export function TriageItemCard({
  item,
  savingId,
  onUpdate,
  onRequeue,
  showDetailLink = true,
}: {
  item: AlertDeadLetterTriageRecord;
  savingId: number | null;
  onUpdate: (
    deliveryId: number,
    next: { triageStatus: string; assignedTo?: string; note?: string; acknowledge?: boolean; unacknowledge?: boolean },
  ) => Promise<void>;
  onRequeue: (deliveryId: number) => Promise<void>;
  showDetailLink?: boolean;
}) {
  return (
    <div className="rounded-xl border px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-medium">{item.event_title || `Delivery #${item.delivery_id}`}</div>
          <div className="text-xs text-muted-foreground">
            {item.rule_name || '-'} · {moduleLabelFromKey(item.module_key || '')} · {item.channel_type} · {item.target_value}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={statusBadgeClass(item.delivery_status)}>{item.delivery_status}</Badge>
          <Badge variant="outline" className={statusBadgeClass(item.triage_status)}>{item.triage_status}</Badge>
          <Badge variant="outline" className={statusBadgeClass(item.sla_status)}>{item.sla_status}</Badge>
          {item.acknowledged_at ? <Badge variant="outline">acknowledged</Badge> : null}
          {showDetailLink ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/app/alerting/triage/${item.delivery_id}`}>View Detail</Link>
            </Button>
          ) : null}
        </div>
      </div>
      <div className="mt-3 text-xs text-amber-600 dark:text-amber-400">
        {item.dead_letter_reason || item.error_message || 'No failure reason recorded.'}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Retry: {item.retry_count}/{item.max_retries} · Dead Lettered At: {item.dead_lettered_at ? item.dead_lettered_at.replace('T', ' ').slice(0, 19) : '-'}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Age: {item.age_minutes}m · SLA Due: {item.sla_due_at ? item.sla_due_at.replace('T', ' ').slice(0, 19) : '-'} · Escalation: {item.escalation_level}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Escalated: {item.escalation_count} time(s) · Last Escalated: {item.last_escalated_at ? item.last_escalated_at.replace('T', ' ').slice(0, 19) : '-'} · Last Level: {item.last_escalation_level || '-'}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Acknowledged: {item.acknowledged_at ? item.acknowledged_at.replace('T', ' ').slice(0, 19) : '-'}
        {item.acknowledged_by ? ` · by ${item.acknowledged_by}` : ''}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Stage: {item.current_stage_index !== null ? `${item.current_stage_index + 1}/${item.stage_count}` : item.stage_count ? `Pending 1/${item.stage_count}` : 'No policy stage'}
        {item.current_stage_priority !== null ? ` · Current Priority ${item.current_stage_priority}` : ''}
        {item.is_final_stage ? ' · Final stage reached' : ''}
        {item.repeating_final_stage ? ' · Reminder mode' : ''}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Next Stage: {item.has_next_stage && item.next_stage_index !== null ? `${item.next_stage_index + 1}/${item.stage_count}` : 'None'}
        {item.next_stage_priority !== null ? ` · Priority ${item.next_stage_priority}` : ''}
      </div>
      {item.next_stage_targets.length ? (
        <div className="mt-1 text-xs text-muted-foreground">
          Next Targets: {item.next_stage_targets.map((target) => `${target.target_type}:${target.target_ref}`).join(', ')}
        </div>
      ) : null}
      {item.escalation_timeline.length ? (
        <div className="mt-3 rounded-xl border border-dashed px-3 py-3">
          <div className="text-xs font-medium text-slate-900 dark:text-slate-100">Escalation Timeline</div>
          <div className="mt-2 space-y-2">
            {item.escalation_timeline.map((entry) => (
              <div key={entry.escalation_delivery_id} className="text-xs text-muted-foreground">
                <span className="font-medium text-slate-900 dark:text-slate-100">Stage {entry.stage_index + 1}</span>
                {entry.stage_priority ? ` · Priority ${entry.stage_priority}` : ''}
                {entry.repeating_final_stage ? ' · Reminder' : ''}
                {` · ${entry.channel_type}:${entry.target_value} · ${entry.delivery_status}`}
                {entry.routing_source ? ` · ${entry.routing_source}` : ''}
                {entry.requested_at ? ` · ${entry.requested_at.replace('T', ' ').slice(0, 19)}` : ''}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {item.triage_audit_timeline.length ? (
        <div className="mt-3 rounded-xl border border-dashed px-3 py-3">
          <div className="text-xs font-medium text-slate-900 dark:text-slate-100">Triage Audit Trail</div>
          <div className="mt-2 space-y-2">
            {item.triage_audit_timeline.map((entry) => (
              <div key={entry.audit_id} className="text-xs text-muted-foreground">
                <span className="font-medium text-slate-900 dark:text-slate-100">{entry.action_type}</span>
                {entry.previous_triage_status || entry.next_triage_status
                  ? ` · ${entry.previous_triage_status || '-'} -> ${entry.next_triage_status || '-'}`
                  : ''}
                {entry.created_by ? ` · ${entry.created_by}` : ''}
                {entry.created_at ? ` · ${entry.created_at.replace('T', ' ').slice(0, 19)}` : ''}
                {entry.next_assigned_to ? ` · assignee ${entry.next_assigned_to}` : ''}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="space-y-2">
          <div className="text-sm font-medium">Assignee</div>
          <Input
            defaultValue={item.assigned_to || ''}
            onBlur={(event) => {
              const nextValue = event.currentTarget.value.trim();
              if (nextValue === (item.assigned_to || '')) return;
              void onUpdate(item.delivery_id, {
                triageStatus: item.triage_status,
                assignedTo: nextValue,
                note: item.note || '',
              });
            }}
            placeholder="ops engineer"
          />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Triage Status</div>
          <Select
            value={item.triage_status}
            onValueChange={(value) => {
              void onUpdate(item.delivery_id, {
                triageStatus: value,
                assignedTo: item.assigned_to || '',
                note: item.note || '',
              });
            }}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="requeued">Requeued</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground">
            Explicit `Acknowledge` pauses escalation reminders. `Investigating` is now workflow status only.
          </div>
        </div>
        <div className="flex items-end">
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={savingId === item.delivery_id}
              onClick={() =>
                void onUpdate(item.delivery_id, {
                  triageStatus: item.triage_status,
                  assignedTo: item.assigned_to || '',
                  note: item.note || '',
                  acknowledge: !item.acknowledged_at,
                  unacknowledge: Boolean(item.acknowledged_at),
                })
              }
            >
              {savingId === item.delivery_id ? 'Processing...' : item.acknowledged_at ? 'Unacknowledge' : 'Acknowledge'}
            </Button>
            <Button
              variant="outline"
              disabled={savingId === item.delivery_id || !['failed', 'dead-lettered'].includes(item.delivery_status)}
              onClick={() => void onRequeue(item.delivery_id)}
            >
              {savingId === item.delivery_id ? 'Processing...' : 'Requeue Delivery'}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="text-sm font-medium">Note</div>
        <Textarea
          defaultValue={item.note || ''}
          onBlur={(event) => {
            const nextValue = event.currentTarget.value.trim();
            if (nextValue === (item.note || '')) return;
            void onUpdate(item.delivery_id, {
              triageStatus: item.triage_status,
              assignedTo: item.assigned_to || '',
              note: nextValue,
            });
          }}
          placeholder="Provider rejected delivery due to invalid session or target."
        />
      </div>
    </div>
  );
}
