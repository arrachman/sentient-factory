'use client';

/**
 * Keyboard shortcuts untuk modal form create/edit di SimpleMasterPage
 * (dan modal serupa). Ctrl/Cmd+S = simpan (tutup); Ctrl/Cmd+Enter =
 * simpan & tambah baru (hanya saat create). Esc default Radix Dialog.
 */

import * as React from 'react';

export interface ModalShortcutOptions {
  open: boolean;
  editing: boolean;
  onSave: () => void;
  onSaveAndNew: () => void;
}

export function useModalShortcuts({ open, editing, onSave, onSaveAndNew }: ModalShortcutOptions) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 's' || e.key === 'S') { e.preventDefault(); onSave(); }
      else if (e.key === 'Enter' && !editing) { e.preventDefault(); onSaveAndNew(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, editing, onSave, onSaveAndNew]);
}
