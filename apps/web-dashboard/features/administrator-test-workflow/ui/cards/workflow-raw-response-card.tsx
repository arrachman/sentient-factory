'use client';

/**
 * Card "Raw Response" — payload JSON lengkap dari workflow endpoint.
 * Tombol Copy JSON copy raw response stringify ke clipboard.
 */
import { Check, Copy, TerminalSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import type { WorkflowApiPayload } from '../../model/types';

export function WorkflowRawResponseCard({
  response,
}: {
  response: WorkflowApiPayload | null;
}) {
  const rawResponseText = JSON.stringify(response, null, 2);
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Raw Response</CardTitle>
            <CardDescription>
              Payload lengkap dari endpoint workflow.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            disabled={!response}
            onClick={() => copyToClipboard(rawResponseText)}
          >
            {isCopied ? <Check /> : <Copy />}
            {isCopied ? 'Copied' : 'Copy JSON'}
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
