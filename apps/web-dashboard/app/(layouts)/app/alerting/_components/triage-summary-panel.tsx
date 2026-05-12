'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AlertDeadLetterTriageAuditSummary, AlertDeadLetterTriageSummary } from './types';

export function TriageSummaryPanel({
  summary,
  auditSummary,
}: {
  summary: AlertDeadLetterTriageSummary | null;
  auditSummary: AlertDeadLetterTriageAuditSummary | null;
}) {
  return (
    <>
      {summary ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: 'Filtered Items', value: summary.total_items },
            { label: 'Overdue', value: summary.overdue_items + summary.critical_items },
            { label: 'Critical', value: summary.critical_items },
            { label: 'Acknowledged', value: summary.acknowledged_items },
            { label: 'Unassigned', value: summary.unassigned_items },
          ].map((item) => (
            <Card key={item.label}>
              <CardHeader className="pb-2">
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className="text-3xl">{item.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : null}
      {auditSummary ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Audit Entries', value: auditSummary.total_entries },
            { label: 'Ack / Unack', value: `${auditSummary.acknowledge_actions}/${auditSummary.unacknowledge_actions}` },
            { label: 'Assignments', value: auditSummary.assignment_actions },
            { label: 'Requeues', value: auditSummary.requeue_actions },
          ].map((item) => (
            <Card key={item.label}>
              <CardHeader className="pb-2">
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className="text-2xl">{item.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : null}
      {auditSummary ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Audit Breakdown</CardTitle>
              <CardDescription>Action pattern inside the currently filtered queue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {auditSummary.action_breakdown.length ? auditSummary.action_breakdown.slice(0, 6).map((entry) => (
                <div key={entry.action_type} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
                  <span>{entry.action_type}</span>
                  <span className="font-medium">{entry.count}</span>
                </div>
              )) : (
                <div className="rounded-xl border border-dashed px-4 py-4 text-sm text-muted-foreground">
                  No audit activity in the current filter set.
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Actors</CardTitle>
              <CardDescription>Who touched this queue most often in the filtered view.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {auditSummary.top_actors.length ? auditSummary.top_actors.map((entry) => (
                <div key={entry.actor} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
                  <span>{entry.actor}</span>
                  <span className="font-medium">{entry.action_count}</span>
                </div>
              )) : (
                <div className="rounded-xl border border-dashed px-4 py-4 text-sm text-muted-foreground">
                  No actor activity recorded yet.
                </div>
              )}
              {auditSummary.activity_last_7d.length ? (
                <div className="rounded-xl border px-3 py-3 text-xs text-muted-foreground">
                  Last 7d: {auditSummary.activity_last_7d.map((entry) => `${entry.date}:${entry.count}`).join(' · ')}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
