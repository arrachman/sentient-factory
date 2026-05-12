'use client';

import { Check, ExternalLink, Link2, RefreshCw } from 'lucide-react';
import {
  PERIOD_OPTIONS,
  type DashboardDomain,
  type PeriodFilter,
} from '@/app/(layouts)/app/model/logistic-dashboard';
import {
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
  Toolbar,
} from '@/components/layouts/app/components/toolbar';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';

/**
 * Toolbar dengan 5 filter dropdown + refresh + share link + open tab + reset.
 */
export function OverviewToolbar({
  domain,
  domainOptions,
  setDomain,
  setGroupBy,
  setSortBy,
  period,
  setPeriod,
  groupBy,
  groupByOptions,
  sortBy,
  sortByOptions,
  metricView,
  setMetricView,
  loading,
  isSharing,
  isCopied,
  onRefresh,
  onShareLink,
  onResetFilters,
}: {
  domain: DashboardDomain;
  domainOptions: Array<{ value: string; label: string }>;
  setDomain: (next: DashboardDomain) => void;
  setGroupBy: (next: string) => void;
  setSortBy: (next: string) => void;
  period: PeriodFilter;
  setPeriod: (next: PeriodFilter) => void;
  groupBy: string;
  groupByOptions: Array<{ value: string; label: string }>;
  sortBy: string;
  sortByOptions: Array<{ value: string; label: string }>;
  metricView: 'totalMetric' | 'totalRows';
  setMetricView: (next: 'totalMetric' | 'totalRows') => void;
  loading: boolean;
  isSharing: boolean;
  isCopied: boolean;
  onRefresh: () => void;
  onShareLink: () => void;
  onResetFilters: () => void;
}) {
  const metricViewOptions = [
    { value: 'totalMetric', label: 'Metric' },
    { value: 'totalRows', label: 'Rows' },
  ];

  return (
    <Toolbar>
      <ToolbarHeading>
        <ToolbarPageTitle>Overview</ToolbarPageTitle>
        <ToolbarDescription>
          Ringkasan KPI, tren, breakdown, dan sample data dari dashboard
          mapping SQL templates.
        </ToolbarDescription>
      </ToolbarHeading>
      <ToolbarActions>
        <div className="w-[120px]">
          <AutocompleteSelect
            value={domain}
            onValueChange={(value) => {
              setDomain(value as DashboardDomain);
              setGroupBy('');
              setSortBy('');
            }}
            options={domainOptions}
            placeholder="Domain"
            searchPlaceholder="Cari domain..."
            emptyText="Domain tidak ditemukan."
          />
        </div>
        <div className="w-[140px]">
          <AutocompleteSelect
            value={period}
            onValueChange={(value) => setPeriod(value as PeriodFilter)}
            options={PERIOD_OPTIONS}
            placeholder="Periode"
            searchPlaceholder="Cari periode..."
            emptyText="Periode tidak ditemukan."
          />
        </div>
        <div className="w-[220px]">
          <AutocompleteSelect
            value={groupBy}
            onValueChange={setGroupBy}
            options={groupByOptions}
            placeholder="Group by"
            searchPlaceholder="Cari kolom..."
            emptyText="Kolom tidak ditemukan."
          />
        </div>
        <div className="w-[220px]">
          <AutocompleteSelect
            value={sortBy}
            onValueChange={setSortBy}
            options={sortByOptions}
            placeholder="Sort by"
            searchPlaceholder="Cari kolom..."
            emptyText="Kolom tidak ditemukan."
          />
        </div>
        <div className="w-[120px]">
          <AutocompleteSelect
            value={metricView}
            onValueChange={(value) =>
              setMetricView(value as 'totalMetric' | 'totalRows')
            }
            options={metricViewOptions}
            placeholder="Metric"
            searchPlaceholder="Pilih metric..."
            emptyText="Metric tidak ditemukan."
          />
        </div>
        <Button variant="outline" onClick={onRefresh} disabled={loading}>
          <RefreshCw />
          Refresh
        </Button>
        <Button variant="outline" onClick={onShareLink} disabled={isSharing}>
          {isCopied ? <Check /> : <Link2 />}
          {isCopied ? 'Copied' : isSharing ? 'Sharing...' : 'Share Link'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.open(window.location.href, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          <ExternalLink />
          Open Tab
        </Button>
        <Button
          variant="outline"
          onClick={onResetFilters}
          disabled={loading}
        >
          Reset Filter
        </Button>
      </ToolbarActions>
    </Toolbar>
  );
}
