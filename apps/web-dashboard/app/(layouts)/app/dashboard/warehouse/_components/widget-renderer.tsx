'use client';

/**
 * Render satu widget Warehouse Dashboard berdasarkan schema `WarehouseDashboardWidgetSchema`.
 * Dipisah dari `page.tsx` agar halaman tetap < 400 LOC dan switch-renderer
 * mudah di-extend tanpa membuka halaman utama.
 */
import {
  DockQueueCard,
  InventoryCoverageCard,
  InventoryMovementCard,
  KpiGrid,
  OpenCloseBarCard,
  OrderStatusCard,
  OutstandingOverdueTableCard,
  RackUtilizationCard,
  TimeseriesCard,
  TopAgingCard,
  TopAmountCard,
  WarehouseAlertCard,
} from '@/components/dashboard';
import type { WarehouseDashboardWidgetSchema } from '../_sections';
import { timeseriesSeries } from '../_data';
import type {
  AgingRow,
  KpiCard,
  OutstandingTableRow,
  StatusItem,
  TimeseriesDatum,
  TopAmountRow,
} from '@/components/dashboard';

export type WarehouseWidgetData = {
  kpiCards: KpiCard[];
  warehouseStatus: StatusItem[];
  inboundOutboundStatus: { title: string; series: Array<{ day: string; open: number; closed: number }> };
  occupancyRows: AgingRow[];
  trendRows: TimeseriesDatum[];
  topWarehouseRows: TopAmountRow[];
  inventoryCoverageRows: Array<{
    label: string;
    coverageDays: number;
    stockLevel: string;
    status: 'safe' | 'warning' | 'critical';
  }>;
  warehouseAlerts: Array<{
    title: string;
    warehouse: string;
    detail: string;
    severity: 'info' | 'warning' | 'critical';
  }>;
  rackUtilizationRows: Array<{ zone: string; utilization: number }>;
  inventoryMovementMetrics: Array<{
    label: string;
    value: string;
    hint: string;
    tone: 'inbound' | 'outbound' | 'balance';
  }>;
  dockQueueRows: Array<{
    dock: string;
    warehouse: string;
    eta: string;
    job: string;
    status: 'loading' | 'queued' | 'ready';
  }>;
  agingRows: AgingRow[];
  activityRows: OutstandingTableRow[];
};

export function renderWarehouseWidget(
  widget: WarehouseDashboardWidgetSchema,
  subtitle: string,
  data: WarehouseWidgetData,
) {
  switch (widget.kind) {
    case 'kpi_grid':
      return <KpiGrid cards={data.kpiCards} />;
    case 'order_status':
      return (
        <OrderStatusCard
          title={widget.title}
          subtitle={subtitle}
          items={data.warehouseStatus}
        />
      );
    case 'open_close_bar':
      return (
        <OpenCloseBarCard
          title={widget.title}
          subtitle={subtitle}
          data={data.inboundOutboundStatus.series}
        />
      );
    case 'top_aging':
      return (
        <TopAgingCard
          title={widget.title}
          subtitle={subtitle}
          rows={
            widget.dataKey === 'occupancyRows'
              ? data.occupancyRows
              : data.agingRows
          }
          axisMax={widget.axisMax ?? 0}
          ticks={widget.ticks ?? []}
        />
      );
    case 'timeseries':
      return (
        <TimeseriesCard
          title={widget.title}
          subtitle={subtitle}
          data={data.trendRows}
          series={timeseriesSeries}
          chartHeightClass={widget.chartHeightClass}
          legendAlign={
            widget.legendAlign === 'end' ? 'center' : widget.legendAlign
          }
        />
      );
    case 'top_amount':
      return (
        <TopAmountCard
          title={widget.title}
          subtitle={subtitle}
          rows={data.topWarehouseRows}
        />
      );
    case 'inventory_coverage':
      return (
        <InventoryCoverageCard
          title={widget.title}
          subtitle={subtitle}
          rows={data.inventoryCoverageRows}
          maxDays={30}
        />
      );
    case 'warehouse_alert':
      return (
        <WarehouseAlertCard
          title={widget.title}
          subtitle={subtitle}
          rows={data.warehouseAlerts}
        />
      );
    case 'rack_utilization':
      return (
        <RackUtilizationCard
          title={widget.title}
          subtitle={subtitle}
          rows={data.rackUtilizationRows}
        />
      );
    case 'inventory_movement':
      return (
        <InventoryMovementCard
          title={widget.title}
          subtitle={subtitle}
          metrics={data.inventoryMovementMetrics}
        />
      );
    case 'dock_queue':
      return (
        <DockQueueCard
          title={widget.title}
          subtitle={subtitle}
          rows={data.dockQueueRows}
        />
      );
    case 'outstanding_watchlist':
      return (
        <OutstandingOverdueTableCard
          title={widget.title}
          subtitle={subtitle}
          rows={data.activityRows}
          actionLabel={widget.actionLabel ?? 'Lihat Detail'}
          overdueLabel={widget.overdueLabel}
        />
      );
    default:
      return null;
  }
}
