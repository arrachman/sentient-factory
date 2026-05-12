'use client';

import { Waves } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { WorkflowProgressEvent } from '@/features/administrator-test-workflow/hooks/use-administrator-test-workflow-state';

function formatProgressTimestamp(value?: string) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date);
}

type WorkflowProgressCardProps = {
  requestId: string | null;
  submitting: boolean;
  progressEvents: WorkflowProgressEvent[];
  latestProgress: WorkflowProgressEvent | null;
  progressViewportRef: React.RefObject<HTMLDivElement | null>;
};

export function WorkflowProgressCard({
  requestId,
  submitting,
  progressEvents,
  latestProgress,
  progressViewportRef,
}: WorkflowProgressCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Progress Stream</CardTitle>
            <CardDescription>Event real-time dari workflow berdasarkan `request_id`.</CardDescription>
          </div>
          <Badge variant="info" appearance="light">
            {requestId || '-'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Current Status</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {latestProgress?.label || (submitting ? 'Workflow is running...' : 'Idle')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground">Updated At</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {formatProgressTimestamp(latestProgress?.timestamp)}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-muted-foreground">Overall Progress</span>
              <span className="text-xs font-medium text-sky-700">{latestProgress?.progress ?? 0}%</span>
            </div>
            <Progress value={typeof latestProgress?.progress === 'number' ? latestProgress.progress : 0} />
          </div>
          <p className="mt-3 text-sm leading-6 text-foreground">
            {latestProgress?.summary || 'Belum ada progress summary.'}
          </p>
        </div>
        <ScrollArea
          className="h-[260px] rounded-xl border border-border bg-muted/20"
          viewportRef={progressViewportRef}
        >
          <div className="space-y-3 p-4">
            {progressEvents.length ? (
              progressEvents.map((item, index) => (
                <div
                  key={`${item.timestamp || 'ts'}-${index}`}
                  className="rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Waves className="size-4 text-sky-600" />
                      <span className="text-sm font-medium">{item.label || item.event || 'event'}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatProgressTimestamp(item.timestamp)}</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-muted-foreground">{item.event || '-'}</span>
                      <span className="text-xs font-medium text-sky-700">{item.progress ?? 0}%</span>
                    </div>
                    <Progress value={typeof item.progress === 'number' ? item.progress : 0} />
                    <p className="text-sm leading-6 text-foreground">{item.summary || 'Tidak ada ringkasan.'}</p>
                    <details className="rounded-md border border-dashed border-border p-3">
                      <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                        Raw event JSON
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-muted-foreground">Belum ada progress event.</div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
