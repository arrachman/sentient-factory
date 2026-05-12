'use client';

/**
 * Card "Suggested SQL" — daftar SQL read-only yang dihasilkan workflow.
 * Tombol "Copy SQL" copy SQL pertama ke clipboard.
 */
import { Check, Copy, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import type { WorkflowApiPayload } from '../../model/types';

export function WorkflowSqlCard({
  response,
}: {
  response: WorkflowApiPayload | null;
}) {
  const responseData = response?.data;
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const queries = responseData?.suggested_queries ?? [];
  const firstSql = queries[0]?.sql || '';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Suggested SQL</CardTitle>
            <CardDescription>
              SQL read-only yang dihasilkan workflow, jika ada.
            </CardDescription>
          </div>
          <Badge
            variant={queries.length ? 'success' : 'secondary'}
            appearance="light"
          >
            {queries.length ? 'Valid extracted SQL' : 'No valid SQL found'}
          </Badge>
          <Button
            variant="outline"
            disabled={!firstSql}
            onClick={() => copyToClipboard(firstSql)}
          >
            {isCopied ? <Check /> : <Copy />}
            {isCopied ? 'Copied' : 'Copy SQL'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {queries.length ? (
          <div className="space-y-3">
            {queries.map((item, index) => (
              <div
                key={`${item.sql || 'sql'}-${index}`}
                className="rounded-xl border border-border bg-muted/20 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Database className="size-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.safety || 'read_only'}
                  </span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-5 text-foreground">
                  {item.sql}
                </pre>
                {item.rationale ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    {item.rationale}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            Belum ada suggested SQL.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
