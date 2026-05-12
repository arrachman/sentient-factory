'use client';

/**
 * 5 chart card untuk dashboard m2_*: trend (LineChart), cashflow (BarChart),
 * source (BarChart), branch (BarChart), status (list).
 */
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fmt, fmtMoneyCompact } from './m2-utils';
import type { M2FeatureCopy } from './m2-feature-copy';

export type TrendChartRow = {
  period: string;
  debit: number;
  kredit: number;
  net: number;
  budget: number;
  realization: number;
};

export type CashflowChartRow = {
  period: string;
  cashIn: number;
  cashOut: number;
  allocation: number;
  realization: number;
};

export type SourceBreakdownRow = { label: string; value: number };
export type BranchChartRow = { cabang: string; movement: number };

export function M2TrendCharts({
  copy,
  trendData,
  cashflowData,
  isBudgetFeature,
}: {
  copy: M2FeatureCopy;
  trendData: TrendChartRow[];
  cashflowData: CashflowChartRow[];
  isBudgetFeature: boolean;
}) {
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{copy.trendTitle}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis
                tickFormatter={(value) => fmtMoneyCompact(value, 1)}
                width={96}
              />
              <Tooltip formatter={(value) => fmtMoneyCompact(value, 2)} />
              <Line
                dataKey={isBudgetFeature ? 'budget' : 'debit'}
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey={isBudgetFeature ? 'realization' : 'kredit'}
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.flowTitle}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashflowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis
                tickFormatter={(value) => fmtMoneyCompact(value, 1)}
                width={96}
              />
              <Tooltip formatter={(value) => fmtMoneyCompact(value, 2)} />
              <Bar
                dataKey={isBudgetFeature ? 'allocation' : 'cashIn'}
                fill="#16a34a"
              />
              <Bar
                dataKey={isBudgetFeature ? 'realization' : 'cashOut'}
                fill="#ef4444"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export function M2BreakdownRow({
  copy,
  sourceData,
  branchData,
  status,
}: {
  copy: M2FeatureCopy;
  sourceData: SourceBreakdownRow[];
  branchData: BranchChartRow[];
  status: Record<string, unknown>[];
}) {
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>{copy.sourceTitle}</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis
                tickFormatter={(value) => fmtMoneyCompact(value, 1)}
                width={96}
              />
              <Tooltip formatter={(value) => fmtMoneyCompact(value, 2)} />
              <Bar dataKey="value" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.branchTitle}</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cabang" />
              <YAxis
                tickFormatter={(value) => fmtMoneyCompact(value, 1)}
                width={96}
              />
              <Tooltip formatter={(value) => fmtMoneyCompact(value, 2)} />
              <Bar dataKey="movement" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{copy.statusTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {status.slice(0, 6).map((row, index) => (
            <div
              key={`${row.status_label}-${index}`}
              className="flex items-center justify-between text-sm"
            >
              <span>{String(row.status_label ?? 'unknown')}</span>
              <span className="font-medium">{fmt(row.total_trx)}</span>
            </div>
          ))}
          {status.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {copy.emptyStatusText}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
