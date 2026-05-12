import {
  fmtCompactNumber,
  fmtNumber,
} from '@/app/(layouts)/app/model/logistic-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * 5 KPI cards: Total Rows, Total Metric, Avg, Min, Max.
 */
export function OverviewKpiCards({
  totalRows,
  totalMetric,
  avgMetric,
  minMetric,
  maxMetric,
}: {
  totalRows: unknown;
  totalMetric: unknown;
  avgMetric: unknown;
  minMetric: unknown;
  maxMetric: unknown;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <Card>
        <CardHeader>
          <CardTitle>Total Rows</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{fmtNumber(totalRows, 0)}</p>
        </CardContent>
      </Card>
      <KpiCardCompact label="Total Metric" value={totalMetric} />
      <KpiCardCompact label="Avg Metric" value={avgMetric} />
      <KpiCardCompact label="Min Metric" value={minMetric} />
      <KpiCardCompact label="Max Metric" value={maxMetric} />
    </div>
  );
}

function KpiCardCompact({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{fmtCompactNumber(value, 2)}</p>
        <p className="text-xs text-muted-foreground">{String(value)}</p>
      </CardContent>
    </Card>
  );
}
