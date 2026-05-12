/**
 * Schema deklaratif untuk section/widget Warehouse Dashboard.
 * Dipakai oleh `page.tsx` untuk render dan oleh konsumen lain (mis. AI
 * suggestion / editor) untuk mengetahui struktur widget tanpa parsing JSX.
 */

export type WarehouseWidgetKind =
  | 'kpi_grid'
  | 'order_status'
  | 'open_close_bar'
  | 'top_aging'
  | 'timeseries'
  | 'top_amount'
  | 'inventory_coverage'
  | 'warehouse_alert'
  | 'rack_utilization'
  | 'inventory_movement'
  | 'dock_queue'
  | 'outstanding_watchlist';

export type WarehouseWidgetDataKey =
  | 'kpiCards'
  | 'warehouseStatus'
  | 'inboundOutboundStatus'
  | 'occupancyRows'
  | 'trendRows'
  | 'topWarehouseRows'
  | 'inventoryCoverageRows'
  | 'warehouseAlerts'
  | 'rackUtilizationRows'
  | 'inventoryMovementMetrics'
  | 'dockQueueRows'
  | 'agingRows'
  | 'activityRows';

export type WarehouseDashboardWidgetSchema = {
  id: string;
  kind: WarehouseWidgetKind;
  title: string;
  spanClassName: string;
  subtitleSource: 'context';
  dataKey: WarehouseWidgetDataKey;
  axisMax?: number;
  ticks?: number[];
  chartHeightClass?: string;
  legendAlign?: 'start' | 'center' | 'end';
  actionLabel?: string;
  overdueLabel?: string;
};

export type WarehouseDashboardSectionSchema = {
  id: string;
  className: string;
  widgets: WarehouseDashboardWidgetSchema[];
};

export const warehouseDashboardSections: WarehouseDashboardSectionSchema[] = [
  {
    id: 'warehouse-kpis',
    className: '',
    widgets: [
      {
        id: 'warehouse-kpi-grid',
        kind: 'kpi_grid',
        title: 'Warehouse KPIs',
        spanClassName: 'lg:col-span-12',
        subtitleSource: 'context',
        dataKey: 'kpiCards',
      },
    ],
  },
  {
    id: 'warehouse-overview',
    className: 'grid gap-4 lg:grid-cols-12',
    widgets: [
      {
        id: 'warehouse-health-status',
        kind: 'order_status',
        title: 'Warehouse Health Status',
        spanClassName: 'lg:col-span-4',
        subtitleSource: 'context',
        dataKey: 'warehouseStatus',
      },
      {
        id: 'warehouse-inbound-outbound',
        kind: 'open_close_bar',
        title: 'Inbound vs Outbound',
        spanClassName: 'lg:col-span-4',
        subtitleSource: 'context',
        dataKey: 'inboundOutboundStatus',
      },
      {
        id: 'warehouse-occupancy-distribution',
        kind: 'top_aging',
        title: 'Occupancy Distribution',
        spanClassName: 'lg:col-span-4',
        subtitleSource: 'context',
        dataKey: 'occupancyRows',
        axisMax: 8,
        ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      },
    ],
  },
  {
    id: 'warehouse-flow-trend',
    className: 'grid gap-4 lg:grid-cols-12',
    widgets: [
      {
        id: 'warehouse-flow-stock-trend',
        kind: 'timeseries',
        title: 'Warehouse Flow & Stock Trend',
        spanClassName: 'lg:col-span-8',
        subtitleSource: 'context',
        dataKey: 'trendRows',
        chartHeightClass: 'h-[320px]',
        legendAlign: 'center',
      },
      {
        id: 'warehouse-top-utilization',
        kind: 'top_amount',
        title: 'Top Warehouse Utilization',
        spanClassName: 'lg:col-span-4',
        subtitleSource: 'context',
        dataKey: 'topWarehouseRows',
      },
    ],
  },
  {
    id: 'warehouse-coverage-alerts',
    className: 'grid gap-4 lg:grid-cols-12',
    widgets: [
      {
        id: 'warehouse-inventory-coverage',
        kind: 'inventory_coverage',
        title: 'Inventory Coverage',
        spanClassName: 'lg:col-span-5',
        subtitleSource: 'context',
        dataKey: 'inventoryCoverageRows',
      },
      {
        id: 'warehouse-alerts-actions',
        kind: 'warehouse_alert',
        title: 'Warehouse Alerts & Actions',
        spanClassName: 'lg:col-span-7',
        subtitleSource: 'context',
        dataKey: 'warehouseAlerts',
      },
    ],
  },
  {
    id: 'warehouse-utilization-movement',
    className: 'grid gap-4 lg:grid-cols-12',
    widgets: [
      {
        id: 'warehouse-rack-utilization-heatmap',
        kind: 'rack_utilization',
        title: 'Rack Utilization Heatmap',
        spanClassName: 'lg:col-span-5',
        subtitleSource: 'context',
        dataKey: 'rackUtilizationRows',
      },
      {
        id: 'warehouse-inventory-movement-summary',
        kind: 'inventory_movement',
        title: 'Inventory Movement Summary',
        spanClassName: 'lg:col-span-7',
        subtitleSource: 'context',
        dataKey: 'inventoryMovementMetrics',
      },
    ],
  },
  {
    id: 'warehouse-dock-queue',
    className: 'grid gap-4 lg:grid-cols-12',
    widgets: [
      {
        id: 'warehouse-dock-queue-widget',
        kind: 'dock_queue',
        title: 'Inbound / Outbound Dock Queue',
        spanClassName: 'lg:col-span-12',
        subtitleSource: 'context',
        dataKey: 'dockQueueRows',
      },
    ],
  },
  {
    id: 'warehouse-aging-watchlist',
    className: 'grid gap-4 lg:grid-cols-12',
    widgets: [
      {
        id: 'warehouse-batch-aging-risk',
        kind: 'top_aging',
        title: 'Batch Aging Risk',
        spanClassName: 'lg:col-span-4',
        subtitleSource: 'context',
        dataKey: 'agingRows',
        axisMax: 20,
        ticks: [0, 5, 10, 15, 20],
      },
      {
        id: 'warehouse-activity-watchlist',
        kind: 'outstanding_watchlist',
        title: 'Warehouse Activity Watchlist',
        spanClassName: 'lg:col-span-8',
        subtitleSource: 'context',
        dataKey: 'activityRows',
        actionLabel: 'Lihat Detail',
        overdueLabel: 'aktivitas',
      },
    ],
  },
];

export const warehouseDashboardListSchema = warehouseDashboardSections.flatMap(
  (section) =>
    section.widgets.map((widget) => ({
      sectionId: section.id,
      widgetId: widget.id,
      widgetKind: widget.kind,
      title: widget.title,
      spanClassName: widget.spanClassName,
      subtitleSource: widget.subtitleSource,
      dataKey: widget.dataKey,
    })),
);
