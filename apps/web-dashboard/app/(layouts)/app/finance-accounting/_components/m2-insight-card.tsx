'use client';

/**
 * AI insight card — 3-column layout: Highlights / Anomalies / Recommendations.
 * Fallback insights di-render saat backend belum return apa-apa.
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  contextualizeInsightText,
  normalizeInsightConfidence,
  normalizeInsightText,
  type InsightItem,
} from './m2-utils';
import type { M2FeatureCopy } from './m2-feature-copy';

export type FallbackInsights = {
  insights: string[];
  anomalies: string[];
  recommendations: string[];
};

export function M2InsightCard({
  copy,
  feature,
  insights,
  anomalies,
  recommendations,
  insightModel,
  fallback,
}: {
  copy: M2FeatureCopy;
  feature: string;
  insights: InsightItem[];
  anomalies: InsightItem[];
  recommendations: InsightItem[];
  insightModel: { provider?: string; version?: string } | null;
  fallback: FallbackInsights;
}) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{copy.insightTitle}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {insightModel
            ? `${insightModel.provider ?? 'n/a'} • ${insightModel.version ?? 'n/a'}`
            : 'No model metadata'}
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3">
        <InsightColumn
          title={copy.insightHighlights}
          items={insights}
          fallbackItems={fallback.insights}
          emptyText={copy.emptyInsightText}
          feature={feature}
          keyPrefix="ins"
        />
        <InsightColumn
          title={copy.insightAnomalies}
          items={anomalies}
          fallbackItems={fallback.anomalies}
          emptyText={copy.emptyAnomalyText}
          feature={feature}
          keyPrefix="anom"
        />
        <InsightColumn
          title={copy.insightRecommendations}
          items={recommendations}
          fallbackItems={fallback.recommendations}
          emptyText={copy.emptyRecommendationText}
          feature={feature}
          keyPrefix="rec"
        />
      </CardContent>
    </Card>
  );
}

function InsightColumn({
  title,
  items,
  fallbackItems,
  emptyText,
  feature,
  keyPrefix,
}: {
  title: string;
  items: InsightItem[];
  fallbackItems: string[];
  emptyText: string;
  feature: string;
  keyPrefix: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.length === 0 && fallbackItems.length === 0 ? (
          <li>{emptyText}</li>
        ) : null}
        {items.map((item, idx) => (
          <li key={`${keyPrefix}-${idx}`}>
            -{' '}
            {contextualizeInsightText(normalizeInsightText(item), feature)}
            {normalizeInsightConfidence(item)
              ? ` (${normalizeInsightConfidence(item)})`
              : ''}
          </li>
        ))}
        {items.length === 0 &&
          fallbackItems.map((text, idx) => (
            <li key={`${keyPrefix}-fallback-${idx}`}>- {text}</li>
          ))}
      </ul>
    </div>
  );
}
