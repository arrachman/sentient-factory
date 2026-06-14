'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  contextualizeInsightText,
  normalizeInsightConfidence,
  normalizeInsightText,
} from './m2-types';
import type { InsightItem, InsightTermMap } from './m2-types';

type InsightGroup = {
  label: string;
  items: InsightItem[];
  fallback: string[];
  empty: string;
  prefix: string;
};

type M2InsightPanelProps = {
  insightTitle: string;
  insightModel: { provider?: string; version?: string } | null;
  groups: InsightGroup[];
  insightTermMap?: InsightTermMap;
};

export function M2InsightPanel({
  insightTitle,
  insightModel,
  groups,
  insightTermMap,
}: M2InsightPanelProps) {
  const contextualize = (text: string) =>
    insightTermMap ? contextualizeInsightText(text, insightTermMap) : text;

  return (
    <Card className="mt-4">
      <CardHeader>
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          {insightTitle}
        </h3>
        <p className="text-xs text-muted-foreground">
          {insightModel
            ? `${insightModel.provider ?? 'n/a'} • ${insightModel.version ?? 'n/a'}`
            : 'No model metadata'}
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3">
        {groups.map(({ label, items, fallback, empty, prefix }) => (
          <div key={prefix}>
            <p className="mb-2 text-sm font-semibold">{label}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {items.length === 0 && fallback.length === 0 ? (
                <li>{empty}</li>
              ) : null}
              {items.map((item, idx) => (
                <li key={`${prefix}-${idx}`}>
                  - {contextualize(normalizeInsightText(item))}
                  {normalizeInsightConfidence(item)
                    ? ` (${normalizeInsightConfidence(item)})`
                    : ''}
                </li>
              ))}
              {items.length === 0 &&
                fallback.map((text, idx) => (
                  <li key={`${prefix}-fallback-${idx}`}>- {text}</li>
                ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
