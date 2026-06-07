import {
  DesignerAction,
  DesignerState,
  RptBand,
  RptComponent,
  RptTemplate,
} from './report-types';

export function buildDefaultTemplate(): RptTemplate {
  return {
    name: 'Laporan Baru',
    module: 'sys',
    pageSize: 'A4',
    orientation: 'portrait',
    margins: { top: 10, right: 10, bottom: 10, left: 10 },
    dataSources: [],
    params: [],
    bands: [
      { id: 'ph', type: 'pageHeader', height: 30, components: [] },
      { id: 'db', type: 'data', height: 8, canGrow: false, minRows: 0, components: [] },
      { id: 'pf', type: 'pageFooter', height: 8, components: [] },
    ],
  };
}

export const INITIAL_STATE: DesignerState = {
  template: buildDefaultTemplate(),
  selection: { type: null },
  isDirty: false,
  zoom: 1,
  activePanel: 'dataSources',
};

function patchBand(bands: RptBand[], bandId: string, patch: Partial<RptBand>): RptBand[] {
  return bands.map(b => b.id === bandId ? { ...b, ...patch } : b);
}

function patchComponent(
  bands: RptBand[],
  bandId: string,
  componentId: string,
  patch: Partial<RptComponent>,
): RptBand[] {
  return bands.map(b =>
    b.id !== bandId ? b : {
      ...b,
      components: b.components.map(c =>
        c.id === componentId ? ({ ...c, ...patch } as RptComponent) : c,
      ),
    },
  );
}

export function designerReducer(state: DesignerState, action: DesignerAction): DesignerState {
  const t = state.template;

  switch (action.type) {
    case 'SET_TEMPLATE':
      return { ...state, template: action.template, isDirty: false, selection: { type: null } };

    case 'SELECT_BAND':
      return { ...state, selection: { type: 'band', bandId: action.bandId } };

    case 'SELECT_COMPONENT':
      return { ...state, selection: { type: 'component', bandId: action.bandId, componentId: action.componentId } };

    case 'DESELECT':
      return { ...state, selection: { type: null } };

    case 'ADD_BAND':
      return { ...state, isDirty: true, template: { ...t, bands: [...t.bands, action.band] } };

    case 'UPDATE_BAND':
      return { ...state, isDirty: true, template: { ...t, bands: patchBand(t.bands, action.bandId, action.patch) } };

    case 'REMOVE_BAND': {
      const next = t.bands.filter(b => b.id !== action.bandId);
      const sel = state.selection.bandId === action.bandId ? { type: null } : state.selection;
      return { ...state, isDirty: true, selection: sel, template: { ...t, bands: next } };
    }

    case 'MOVE_BAND': {
      const idx = t.bands.findIndex(b => b.id === action.bandId);
      if (idx < 0) return state;
      const newIdx = action.direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= t.bands.length) return state;
      const bands = [...t.bands];
      [bands[idx], bands[newIdx]] = [bands[newIdx], bands[idx]];
      return { ...state, isDirty: true, template: { ...t, bands } };
    }

    case 'ADD_COMPONENT':
      return {
        ...state, isDirty: true,
        template: { ...t, bands: t.bands.map(b => b.id !== action.bandId ? b : { ...b, components: [...b.components, action.component] }) },
      };

    case 'UPDATE_COMPONENT':
      return { ...state, isDirty: true, template: { ...t, bands: patchComponent(t.bands, action.bandId, action.componentId, action.patch) } };

    case 'REMOVE_COMPONENT': {
      const sel = state.selection.componentId === action.componentId ? { type: null } : state.selection;
      return {
        ...state, isDirty: true, selection: sel,
        template: {
          ...t, bands: t.bands.map(b =>
            b.id !== action.bandId ? b : { ...b, components: b.components.filter(c => c.id !== action.componentId) },
          ),
        },
      };
    }

    case 'ADD_DATASOURCE':
      return { ...state, isDirty: true, template: { ...t, dataSources: [...t.dataSources, action.ds] } };

    case 'UPDATE_DATASOURCE':
      return { ...state, isDirty: true, template: { ...t, dataSources: t.dataSources.map(d => d.id !== action.dsId ? d : { ...d, ...action.patch }) } };

    case 'REMOVE_DATASOURCE':
      return { ...state, isDirty: true, template: { ...t, dataSources: t.dataSources.filter(d => d.id !== action.dsId) } };

    case 'SET_ZOOM':
      return { ...state, zoom: action.zoom };

    case 'SET_PANEL':
      return { ...state, activePanel: action.panel };

    case 'MARK_CLEAN':
      return { ...state, isDirty: false };

    default:
      return state;
  }
}
