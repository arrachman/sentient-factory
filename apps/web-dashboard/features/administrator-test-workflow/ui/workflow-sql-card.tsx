'use client';

import { Check, Copy, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { WorkflowApiPayload } from '@/features/administrator-test-workflow/hooks/use-administrator-test-workflow-state';

type WorkflowSqlCardProps = {
  responseData: WorkflowApiPayload['data'] | undefined;
  isSqlCopied: boolean;
  onCopySql: (text: string) => void;
};

export function WorkflowSqlCard({ responseData, isSqlCopied, onCopySql }: WorkflowSqlCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Suggested SQL</CardTitle>
            <CardDescription>SQL read-only yang dihasilkan workflow, jika ada.</CardDescription>
          </div>
          <Badge
            variant={responseData?.suggested_queries?.length ? 'success' : 'secondary'}
            appearance="light"
          >
            {responseData?.suggested_queries?.length ? 'Valid extracted SQL' : 'No valid SQL found'}
          </Badge>
          <Button
            variant="outline"
            disabled={!responseData?.suggested_queries?.[0]?.sql}
            onClick={() => onCopySql(responseData?.suggested_queries?.[0]?.sql || '')}
          >
            {isSqlCopied ? <Check /> : <Copy />}
            {isSqlCopied ? 'Copied' : 'Copy SQL'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {responseData?.suggested_queries?.length ? (
          <div className="space-y-3">
            {responseData.suggested_queries.map((item, index) => (
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
                  <p className="mt-3 text-xs text-muted-foreground">{item.rationale}</p>
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
