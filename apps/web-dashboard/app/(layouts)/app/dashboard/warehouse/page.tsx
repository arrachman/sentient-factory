'use client';

import { useMemo } from 'react';
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
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/components/layouts/app/components/toolbar';
import {
  activityRows,
  agingRows,
  dockQueueRows,
  inboundOutboundStatus,
  inventoryCoverageRows,
  inventoryMovementMetrics,
  kpiByPeriod,
  occupancyRows,
  rackUtilizationRows,
  timeseriesByWarehouse,
  timeseriesSeries,
  topWarehouseRows,
  warehouseAlerts,
  warehouseStatus,
} from './_data';
import { warehouseDashboardSections } from './_sections';
import type { WarehouseDashboardWidgetSchema } from './_sections';

export default function WarehouseDashboardPage() {
  const period = 'Maret 2026' as const;
  const region = 'Semua Region' as const;
  const warehouse = 'Semua Warehouse' as const;
  const kpiCards = useMemo(() => kpiByPeriod[period], [period]);
  const trendRows = useMemo(() => timeseriesByWarehouse[warehouse], [warehouse]);
  const subtitle = useMemo(() => `${period} · ${region}`, [period, region]);
  const widgetData = useMemo(
    () => ({
      kpiCards,
      warehouseStatus,
      inboundOutboundStatus,
      occupancyRows,
      trendRows,
      topWarehouseRows,
      inventoryCoverageRows,
      warehouseAlerts,
      rackUtilizationRows,
      inventoryMovementMetrics,
      dockQueueRows,
      agingRows,
      activityRows,
    }),
    [kpiCards, trendRows],
  );

  const renderWidget = (widget: WarehouseDashboardWidgetSchema) => {
    switch (widget.kind) {
      case 'kpi_grid':
        return <KpiGrid cards={widgetData.kpiCards} />;
      case 'order_status':
        return <OrderStatusCard title={widget.title} subtitle={subtitle} items={widgetData.warehouseStatus} />;
      case 'open_close_bar':
        return <OpenCloseBarCard title={widget.title} subtitle={subtitle} data={widgetData.inboundOutboundStatus.series} />;
      case 'top_aging':
        return (
          <TopAgingCard
            title={widget.title}
            subtitle={subtitle}
            rows={widget.dataKey === 'occupancyRows' ? widgetData.occupancyRows : widgetData.agingRows}
            axisMax={widget.axisMax ?? 0}
            ticks={widget.ticks ?? []}
          />
        );
      case 'timeseries':
        return (
          <TimeseriesCard
            title={widget.title}
            subtitle={subtitle}
            data={widgetData.trendRows}
            series={timeseriesSeries}
            chartHeightClass={widget.chartHeightClass}
            legendAlign={widget.legendAlign === 'end' ? 'center' : widget.legendAlign}
          />
        );
      case 'top_amount':
        return <TopAmountCard title={widget.title} subtitle={subtitle} rows={widgetData.topWarehouseRows} />;
      case 'inventory_coverage':
        return <InventoryCoverageCard title={widget.title} subtitle={subtitle} rows={widgetData.inventoryCoverageRows} maxDays={30} />;
      case 'warehouse_alert':
        return <WarehouseAlertCard title={widget.title} subtitle={subtitle} rows={widgetData.warehouseAlerts} />;
      case 'rack_utilization':
        return <RackUtilizationCard title={widget.title} subtitle={subtitle} rows={widgetData.rackUtilizationRows} />;
      case 'inventory_movement':
        return <InventoryMovementCard title={widget.title} subtitle={subtitle} metrics={widgetData.inventoryMovementMetrics} />;
      case 'dock_queue':
        return <DockQueueCard title={widget.title} subtitle={subtitle} rows={widgetData.dockQueueRows} />;
      case 'outstanding_watchlist':
        return (
          <OutstandingOverdueTableCard
            title={widget.title}
            subtitle={subtitle}
            rows={widgetData.activityRows}
            actionLabel={widget.actionLabel ?? 'Lihat Detail'}
            overdueLabel={widget.overdueLabel}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container space-y-7 pb-10">
      <Toolbar>
        <div>
          <ToolbarHeading>
            <ToolbarPageTitle>Dashboard Warehouse</ToolbarPageTitle>
            <ToolbarDescription>
              Monitoring kapasitas gudang, stok, aging batch, inbound, dan outbound per warehouse.
            </ToolbarDescription>
          </ToolbarHeading>
        </div>
      </Toolbar>

      {warehouseDashboardSections.map((section) => (
        <div key={section.id} className={section.className || undefined}>
          {section.widgets.map((widget) => (
            <div key={widget.id} className={section.className ? widget.spanClassName : undefined}>
              {renderWidget(widget)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
