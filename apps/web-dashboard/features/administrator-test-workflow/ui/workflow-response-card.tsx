'use client';

import { Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { WorkflowApiPayload } from '@/features/administrator-test-workflow/hooks/use-administrator-test-workflow-state';

type WorkflowResponseCardProps = {
  response: WorkflowApiPayload | null;
  responseStatus: number | null;
  schemaKey: string;
};

export function WorkflowResponseCard({ response, responseStatus, schemaKey }: WorkflowResponseCardProps) {
  const responseData = response?.data;

  return (
    <Card className="overflow-hidden border-amber-200/70">
      <CardHeader className="bg-linear-to-r from-amber-50 via-white to-orange-50">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Bot className="size-5" />
          </div>
          <div>
            <CardTitle>Workflow Response</CardTitle>
            <CardDescription>Ringkasan jawaban, metadata model, dan status workflow.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant={response?.success ? 'success' : 'secondary'} appearance="light">
            HTTP {responseStatus ?? '-'}
          </Badge>
          <Badge variant="info" appearance="light">
            Mode {responseData?.workflow_mode || '-'}
          </Badge>
          <Badge variant="warning" appearance="light">
            Passes {responseData?.workflow_passes ?? '-'}
          </Badge>
          <Badge variant="outline">{responseData?.schema_key || schemaKey || '-'}</Badge>
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <p className="text-xs font-medium text-muted-foreground">Answer</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
            {responseData?.answer || 'Belum ada response.'}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground">Model</p>
            <p className="mt-1 text-sm font-medium">{responseData?.model || '-'}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground">Provider</p>
            <p className="mt-1 break-all text-sm font-medium">{responseData?.provider || '-'}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground">Request ID</p>
            <p className="mt-1 break-all text-sm font-medium">{responseData?.request_id || '-'}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground">Data Source</p>
            <p className="mt-1 text-sm font-medium">{responseData?.data_source || '-'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
