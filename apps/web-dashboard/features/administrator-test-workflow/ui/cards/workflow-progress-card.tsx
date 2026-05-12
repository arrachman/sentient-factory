'use client';

/**
 * Card SSE Progress Stream — real-time event list dari workflow via
 * `/api/ai/chat/progress/:requestId`. Punya header dengan current
 * label/timestamp + scrollable area dengan event timeline.
 */
import { RefObject } from 'react';
import { Waves } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatProgressTimestamp } from '../../model/constants';
import type { WorkflowProgressEvent } from '../../model/types';

export function WorkflowProgressCard({
  requestId,
  submitting,
  progressEvents,
  viewportRef,
}: {
  requestId: string | null;
  submitting: boolean;
  progressEvents: WorkflowProgressEvent[];
  viewportRef: RefObject<HTMLDivElement | null>;
}) {
  const latestProgress = progressEvents.length
    ? progressEvents[progressEvents.length - 1]
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Progress Stream</CardTitle>
            <CardDescription>
              Event real-time dari workflow berdasarkan `request_id`.
            </CardDescription>
          </div>
          <Badge variant="info" appearance="light">
            {requestId || '-'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ProgressHeader
          latest={latestProgress}
          submitting={submitting}
        />
        <ScrollArea
          className="h-[260px] rounded-xl border border-border bg-muted/20"
          viewportRef={viewportRef}
        >
          <ProgressEventList events={progressEvents} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ProgressHeader({
  latest,
  submitting,
}: {
  latest: WorkflowProgressEvent | null;
  submitting: boolean;
}) {
  return (
    <div className="mb-4 rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Current Status
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {latest?.label ||
              (submitting ? 'Workflow is running...' : 'Idle')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-muted-foreground">
            Updated At
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {formatProgressTimestamp(latest?.timestamp)}
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Overall Progress
          </span>
          <span className="text-xs font-medium text-sky-700">
            {latest?.progress ?? 0}%
          </span>
        </div>
        <Progress
          value={typeof latest?.progress === 'number' ? latest.progress : 0}
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-foreground">
        {latest?.summary || 'Belum ada progress summary.'}
      </p>
    </div>
  );
}

function ProgressEventList({
  events,
}: {
  events: WorkflowProgressEvent[];
}) {
  if (events.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Belum ada progress event.
      </div>
    );
  }
  return (
    <div className="space-y-3 p-4">
      {events.map((item, index) => (
        <div
          key={`${item.timestamp || 'ts'}-${index}`}
          className="rounded-lg border border-border bg-background p-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Waves className="size-4 text-sky-600" />
              <span className="text-sm font-medium">
                {item.label || item.event || 'event'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatProgressTimestamp(item.timestamp)}
            </span>
          </div>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-muted-foreground">
                {item.event || '-'}
              </span>
              <span className="text-xs font-medium text-sky-700">
                {item.progress ?? 0}%
              </span>
            </div>
            <Progress
              value={typeof item.progress === 'number' ? item.progress : 0}
            />
            <p className="text-sm leading-6 text-foreground">
              {item.summary || 'Tidak ada ringkasan.'}
            </p>
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
      ))}
    </div>
  );
}
