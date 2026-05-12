export type DashboardQuery = {
  query_key: string;
  label: string;
  purpose: string;
  default_limit: number | null;
};

export type DashboardWidget = {
  widget_id: string;
  widget_key: string;
  title: string;
  short_label: string;
  description: string;
  widget_kind: string;
  chart_type: string;
  result_kind: string;
  span_class_name?: string;
  widget_order?: number;
  is_primary?: boolean;
  queries: DashboardQuery[];
};

export type DashboardFilter = {
  query_param_name: string;
  default_value: unknown;
};

export type DashboardCatalog = {
  title: string;
  description: string;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
};

export type QueryResult = {
  columns: string[];
  rows: Array<Record<string, unknown>>;
  sql: string;
};

export type ChartDatum = {
  label: string;
  value: number;
  x?: number;
  y?: number;
};

export type ChartType =
  | 'bar'
  | 'vertical_bar'
  | 'horizontal_bar'
  | 'line'
  | 'area'
  | 'pie'
  | 'donut'
  | 'scatter';

export type NormalizedBarDatum = {
  label: string;
  originalValue: number;
  normalizedValue: number;
};

export type ScatterVisualDatum = ChartDatum & {
  bubbleSize: number;
  scatterColor: string;
  scatterLevel: string;
};
