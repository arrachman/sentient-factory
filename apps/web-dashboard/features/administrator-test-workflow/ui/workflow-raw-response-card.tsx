'use client';

import { Check, Copy, TerminalSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { WorkflowApiPayload } from '@/features/administrator-test-workflow/hooks/use-administrator-test-workflow-state';

type WorkflowRawResponseCardProps = {
  response: WorkflowApiPayload | null;
  rawResponseText: string;
  isRawCopied: boolean;
  onCopyRaw: (text: string) => void;
};

export function WorkflowRawResponseCard({
  response,
  rawResponseText,
  isRawCopied,
  onCopyRaw,
}: WorkflowRawResponseCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Raw Response</CardTitle>
            <CardDescription>Payload lengkap dari endpoint workflow.</CardDescription>
          </div>
          <Button variant="outline" disabled={!response} onClick={() => onCopyRaw(rawResponseText)}>
            {isRawCopied ? <Check /> : <Copy />}
            {isRawCopied ? 'Copied' : 'Copy JSON'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl bg-slate-950 p-4 text-slate-100">
          <div className="mb-3 flex items-center gap-2 text-slate-300">
            <TerminalSquare className="size-4" />
            <span className="text-xs">JSON</span>
          </div>
          <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap text-xs leading-5">
            {rawResponseText || 'null'}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
