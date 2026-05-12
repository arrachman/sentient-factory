'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AlertOpsPayload } from './types';

export function OpsTriageSection({ triage }: { triage: AlertOpsPayload['triage'] }) {
  return (
    <>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Triage SLA</CardTitle>
            <CardDescription>
              Warning after {triage.policy.warning_after_minutes} minutes, critical after {triage.policy.critical_after_minutes} minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-4">
            <div className="rounded-xl border px-4 py-3">
              <div className="text-xs text-muted-foreground">Open</div>
              <div className="text-2xl font-semibold">{triage.summary.open_items}</div>
            </div>
            <div className="rounded-xl border px-4 py-3">
              <div className="text-xs text-muted-foreground">Investigating</div>
              <div className="text-2xl font-semibold">{triage.summary.investigating_items}</div>
            </div>
            <div className="rounded-xl border px-4 py-3">
              <div className="text-xs text-muted-foreground">Overdue</div>
              <div className="text-2xl font-semibold text-amber-700">{triage.summary.overdue_items}</div>
            </div>
            <div className="rounded-xl border px-4 py-3">
              <div className="text-xs text-muted-foreground">Critical</div>
              <div className="text-2xl font-semibold text-rose-700">{triage.summary.critical_items}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stage Progression</CardTitle>
            <CardDescription>Operational visibility of escalation progress across configured stages.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border px-4 py-3">
              <div className="text-xs text-muted-foreground">Staged Items</div>
              <div className="text-2xl font-semibold">{triage.summary.staged_items}</div>
            </div>
            <div className="rounded-xl border px-4 py-3">
              <div className="text-xs text-muted-foreground">Pending Next Stage</div>
              <div className="text-2xl font-semibold text-amber-700">{triage.summary.pending_next_stage_items}</div>
            </div>
            <div className="rounded-xl border px-4 py-3">
              <div className="text-xs text-muted-foreground">Final Stage</div>
              <div className="text-2xl font-semibold text-slate-700">{triage.summary.final_stage_items}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {triage.audit_summary ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Triage Audit Activity</CardTitle>
              <CardDescription>Operational actions taken on dead-letter triage items.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Total Entries</div>
                <div className="text-2xl font-semibold">{triage.audit_summary.total_entries}</div>
              </div>
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Ack / Unack</div>
                <div className="text-2xl font-semibold">
                  {triage.audit_summary.acknowledge_actions}/{triage.audit_summary.unacknowledge_actions}
                </div>
              </div>
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Assignments</div>
                <div className="text-2xl font-semibold">{triage.audit_summary.assignment_actions}</div>
              </div>
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Latest Action</div>
                <div className="text-sm font-medium">
                  {triage.audit_summary.latest_action_at
                    ? triage.audit_summary.latest_action_at.replace('T', ' ').slice(0, 19)
                    : '-'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit Breakdown</CardTitle>
              <CardDescription>Top triage actions and operators over the recent filtered set.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">By Action</div>
                {triage.audit_summary.action_breakdown.slice(0, 5).map((entry) => (
                  <div key={entry.action_type} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
                    <span>{entry.action_type}</span>
                    <span className="font-medium">{entry.count}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Top Actors</div>
                {triage.audit_summary.top_actors.length ? triage.audit_summary.top_actors.map((entry) => (
                  <div key={entry.actor} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
                    <span>{entry.actor}</span>
                    <span className="font-medium">{entry.action_count}</span>
                  </div>
                )) : (
                  <div className="rounded-xl border border-dashed px-3 py-3 text-sm text-muted-foreground">
                    No triage actors recorded yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
