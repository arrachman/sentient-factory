// ── Report Designer Types ────────────────────────────────────────────────────
// Semua tipe untuk template JSON, state designer, dan API contract.

export type PageSize = 'A4' | 'A5' | 'Letter' | 'Legal';
export type Orientation = 'portrait' | 'landscape';
export type BandType = 'pageHeader' | 'pageFooter' | 'groupHeader' | 'groupFooter' | 'data';
export type ComponentType = 'text' | 'image' | 'line';
export type AlignH = 'left' | 'center' | 'right';
export type AlignV = 'top' | 'middle' | 'bottom';

export interface BorderStyle {
  sides: Array<'top' | 'right' | 'bottom' | 'left' | 'all'>;
  style: 'solid' | 'dashed' | 'dotted';
  width: number;
  color: string;
}

export interface ComponentStyle {
  fontSize?: number;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  background?: string;
  align?: AlignH;
  vertAlign?: AlignV;
  wordWrap?: boolean;
  border?: Partial<BorderStyle>;
}

export interface ConditionalFormat {
  when: string;
  style: Partial<ComponentStyle>;
}

export interface RptTextComponent {
  id: string;
  type: 'text';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  expression: string;
  style: ComponentStyle;
  canGrow?: boolean;
  canShrink?: boolean;
  conditions?: ConditionalFormat[];
}

export interface RptImageComponent {
  id: string;
  type: 'image';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  fit?: 'contain' | 'cover' | 'fill';
}

export interface RptLineComponent {
  id: string;
  type: 'line';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style: { color: string; width: number; style: 'solid' | 'dashed' | 'dotted' };
}

export type RptComponent = RptTextComponent | RptImageComponent | RptLineComponent;

export interface RptBand {
  id: string;
  type: BandType;
  level?: 1 | 2;
  height: number;
  groupBy?: string;
  printOnAllPages?: boolean;
  newPageBefore?: boolean;
  canGrow?: boolean;
  minRows?: number;
  components: RptComponent[];
}

export interface RptDataSourceParam {
  name: string;
  type: 'string' | 'number' | 'bigint' | 'boolean' | 'date';
  label?: string;
  required?: boolean;
  bindFrom?: string;
}

export interface RptDataSource {
  id: string;
  alias: string;
  name: string;
  sql: string;
  params: RptDataSourceParam[];
}

export interface RptReportParam {
  name: string;
  type: 'string' | 'number' | 'date' | 'dateRange';
  label: string;
  required?: boolean;
  defaultValue?: string;
}

export interface RptTemplate {
  id?: string;
  name: string;
  module: string;
  version?: number;
  pageSize: PageSize;
  orientation: Orientation;
  margins: { top: number; right: number; bottom: number; left: number };
  dataSources: RptDataSource[];
  params: RptReportParam[];
  bands: RptBand[];
}

// ── Designer UI State ────────────────────────────────────────────────────────

export interface DesignerSelection {
  type: 'band' | 'component' | null;
  bandId?: string;
  componentId?: string;
}

export interface DesignerState {
  template: RptTemplate;
  selection: DesignerSelection;
  isDirty: boolean;
  zoom: number;
  activePanel: 'dataSources' | 'bands' | 'preview';
}

export type DesignerAction =
  | { type: 'SET_TEMPLATE'; template: RptTemplate }
  | { type: 'SELECT_BAND'; bandId: string }
  | { type: 'SELECT_COMPONENT'; bandId: string; componentId: string }
  | { type: 'DESELECT' }
  | { type: 'ADD_BAND'; band: RptBand }
  | { type: 'UPDATE_BAND'; bandId: string; patch: Partial<RptBand> }
  | { type: 'REMOVE_BAND'; bandId: string }
  | { type: 'MOVE_BAND'; bandId: string; direction: 'up' | 'down' }
  | { type: 'ADD_COMPONENT'; bandId: string; component: RptComponent }
  | { type: 'UPDATE_COMPONENT'; bandId: string; componentId: string; patch: Partial<RptComponent> }
  | { type: 'REMOVE_COMPONENT'; bandId: string; componentId: string }
  | { type: 'ADD_DATASOURCE'; ds: RptDataSource }
  | { type: 'UPDATE_DATASOURCE'; dsId: string; patch: Partial<RptDataSource> }
  | { type: 'REMOVE_DATASOURCE'; dsId: string }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_PANEL'; panel: DesignerState['activePanel'] }
  | { type: 'MARK_CLEAN' };

// ── API response types ───────────────────────────────────────────────────────

export interface RptTemplateRecord {
  id: string;
  code: string;
  name: string;
  module: string;
  description?: string;
  templateJson: RptTemplate;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SqlQueryResult {
  rows: Record<string, unknown>[];
  count: number;
  columns: string[];
}
