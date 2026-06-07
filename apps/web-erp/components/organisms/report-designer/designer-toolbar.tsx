'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import type { DesignerAction, DesignerState } from '@/lib/report-types';

interface Props {
  state: DesignerState;
  dispatch: React.Dispatch<DesignerAction>;
  templateName: string;
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
}

const PANELS: Array<{ key: DesignerState['activePanel']; label: string; icon: string }> = [
  { key: 'dataSources', label: 'Data Sources', icon: 'database' },
  { key: 'bands',       label: 'Canvas',        icon: 'layers' },
  { key: 'preview',     label: 'Preview',        icon: 'eye' },
];

export function DesignerToolbar({ state, dispatch, templateName, onBack, onSave, saving }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0 select-none">
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer">
        <Icon name="arrowleft" size={14} />
        Daftar
      </button>

      <div className="w-px h-5 bg-[var(--border)]" />

      <div className="flex items-center gap-2">
        <Icon name="file" size={14} className="text-[var(--accent)]" />
        <span className="text-sm font-semibold">{templateName}</span>
        {state.isDirty && <span className="text-xs text-orange-500 font-medium">● belum disimpan</span>}
      </div>

      <div className="flex-1" />

      {/* Panel switcher */}
      <div className="flex gap-1">
        {PANELS.map(p => (
          <button
            key={p.key}
            onClick={() => dispatch({ type: 'SET_PANEL', panel: p.key })}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs cursor-pointer transition-colors ${
              state.activePanel === p.key
                ? 'bg-[var(--accent)] text-white'
                : 'hover:bg-[var(--bg-hover)] text-[var(--fg-muted)]'
            }`}
          >
            <Icon name={p.icon as any} size={12} />
            {p.label}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-[var(--border)]" />

      <Button size="sm" onClick={onSave} disabled={saving || !state.isDirty} className="gap-1">
        <Icon name="save" size={12} />
        {saving ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </div>
  );
}
