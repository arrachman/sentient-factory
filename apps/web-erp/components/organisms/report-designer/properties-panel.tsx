'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { BandProperties } from './properties/band-properties';
import { TextProperties } from './properties/text-properties';
import { LineProperties } from './properties/line-properties';
import { ImageProperties } from './properties/image-properties';
import type { DesignerAction, DesignerSelection, PropTab, RptBand } from '@/lib/report-types';

interface Props {
  selection: DesignerSelection;
  bands: RptBand[];
  /** Kolom hasil query untuk picker/autocomplete di tab Data. */
  columns: string[];
  dispatch: React.Dispatch<DesignerAction>;
}

const TABS: Array<{ key: PropTab; label: string }> = [
  { key: 'layout', label: 'Layout' },
  { key: 'style', label: 'Style' },
  { key: 'data', label: 'Data' },
];

export function PropertiesPanel({ selection, bands, columns, dispatch }: Props) {
  const [tab, setTab] = React.useState<PropTab>('layout');

  if (!selection.type) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs text-[var(--fg-muted)] italic p-4 text-center">
        Klik band atau komponen untuk melihat propertinya
      </div>
    );
  }

  const band = bands.find(b => b.id === selection.bandId);
  if (!band) return null;

  // Multi-select → ringkasan, properti detail via single-select.
  const multi = selection.componentIds && selection.componentIds.length > 1;
  if (selection.type === 'component' && multi) {
    return (
      <div className="p-3 text-xs text-[var(--fg-muted)] flex flex-col items-center gap-2 text-center">
        <Icon name="layers" size={20} />
        <span>{selection.componentIds!.length} komponen terpilih</span>
        <span className="text-[11px]">Gunakan toolbar align di canvas, atau pilih satu untuk edit detail.</span>
      </div>
    );
  }

  if (selection.type === 'band') {
    return (
      <div className="p-3 overflow-y-auto">
        <div className="text-xs font-semibold mb-2 text-[var(--fg-muted)] uppercase tracking-wide">Band</div>
        <BandProperties band={band} dispatch={dispatch} />
      </div>
    );
  }

  const comp = band.components.find(c => c.id === selection.componentId);
  if (!comp) return null;

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Tab nav */}
      <div className="flex border-b border-[var(--border)] shrink-0">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 px-2 py-1.5 text-xs cursor-pointer transition-colors ${
              tab === t.key
                ? 'text-[var(--accent)] border-b-2 border-[var(--accent)] font-semibold'
                : 'text-[var(--fg-muted)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-3 overflow-y-auto">
        <div className="text-[10px] font-semibold text-[var(--fg-muted)] uppercase tracking-wide mb-2">{comp.type}</div>
        {comp.type === 'text' && <TextProperties band={band} comp={comp} tab={tab} columns={columns} dispatch={dispatch} />}
        {comp.type === 'line' && <LineProperties band={band} comp={comp} tab={tab} dispatch={dispatch} />}
        {comp.type === 'image' && <ImageProperties band={band} comp={comp} tab={tab} columns={columns} dispatch={dispatch} />}
      </div>
    </div>
  );
}
