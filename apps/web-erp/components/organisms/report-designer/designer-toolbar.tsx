'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icons';
import type { DesignerAction, DesignerState } from '@/lib/report-types';

interface Props {
  state: DesignerState;
  dispatch: React.Dispatch<DesignerAction>;
  templateName: string;
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
}

function ToolBtn({ icon, title, onClick, disabled, active }: {
  icon: IconName; title: string; onClick: () => void; disabled?: boolean; active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex items-center justify-center w-7 h-7 rounded cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? 'bg-[var(--accent)] text-white' : 'hover:bg-[var(--bg-hover)] text-[var(--fg-muted)]'
      }`}
    >
      <Icon name={icon} size={14} />
    </button>
  );
}

export function DesignerToolbar({ state, dispatch, templateName, onBack, onSave, saving }: Props) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0 select-none">
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer">
        <Icon name="arrowleft" size={14} />
        Daftar
      </button>

      <div className="w-px h-5 bg-[var(--border)]" />

      {/* Dock kiri toggle */}
      <ToolBtn icon="database" title={state.leftOpen ? 'Sembunyikan dock kiri' : 'Tampilkan dock kiri'}
        active={state.leftOpen} onClick={() => dispatch({ type: 'TOGGLE_LEFT' })} />

      <div className="w-px h-5 bg-[var(--border)]" />

      {/* Undo / redo */}
      <ToolBtn icon="undo" title="Undo (Ctrl+Z)" disabled={!state.past.length} onClick={() => dispatch({ type: 'UNDO' })} />
      <ToolBtn icon="redo" title="Redo (Ctrl+Shift+Z)" disabled={!state.future.length} onClick={() => dispatch({ type: 'REDO' })} />

      <div className="w-px h-5 bg-[var(--border)]" />

      <div className="flex items-center gap-2 min-w-0">
        <Icon name="file" size={14} className="text-[var(--accent)] shrink-0" />
        <span className="text-sm font-semibold truncate">{templateName}</span>
        {state.isDirty && <span className="text-xs text-orange-500 font-medium shrink-0">● belum disimpan</span>}
      </div>

      <div className="flex-1" />

      {/* Preview split toggle */}
      <ToolBtn icon="eye" title="Preview split" active={state.previewOpen} onClick={() => dispatch({ type: 'TOGGLE_PREVIEW' })} />
      {/* Dock kanan toggle */}
      <ToolBtn icon="gear" title={state.rightOpen ? 'Sembunyikan properti' : 'Tampilkan properti'}
        active={state.rightOpen} onClick={() => dispatch({ type: 'TOGGLE_RIGHT' })} />

      <div className="w-px h-5 bg-[var(--border)]" />

      <Button size="sm" onClick={onSave} disabled={saving || !state.isDirty} className="gap-1">
        <Icon name="save" size={12} />
        {saving ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </div>
  );
}
