import type * as React from 'react';
import type { RsCtrl } from '../hooks/use-report-studio';
import type { RsTplKey } from '@/lib/report-studio/types';
import { templateOptions } from '@/lib/report-studio/i18n';
import { qBtn } from './styles';

export function quickbarVals(c: RsCtrl) {
  const id = c.isId; const st = c.st; const a = c.actions;
  const undoStyle = qBtn + 'color:' + (st.undoN ? '#eef1f6' : 'rgba(255,255,255,.3)') + ';';
  const redoStyle = qBtn + 'color:' + (st.redoN ? '#eef1f6' : 'rgba(255,255,255,.3)') + ';';
  const exportItems = [
    { ext: 'PDF', label: 'PDF', onClick: () => a.exportPagesPrint(true) },
    { ext: 'XLS', label: 'Excel', onClick: () => a.exportTable('xls') },
    { ext: 'DOC', label: 'Word', onClick: () => a.exportTable('doc') },
    { ext: 'HTM', label: 'HTML', onClick: () => a.exportHTMLfile() },
    { ext: 'PRN', label: id ? 'Cetak' : 'Print', onClick: () => a.exportPagesPrint(false) },
  ];
  return {
    reportName: c.effName, templateOptions: templateOptions(id), tplKey: st.tplKey,
    onName: (e: React.ChangeEvent<HTMLInputElement>) => c.set({ reportName: e.target.value }),
    onTemplate: (e: React.ChangeEvent<HTMLSelectElement>) => a.loadTemplate(e.target.value as RsTplKey, true),
    onUndo: a.undo, onRedo: a.redo, undoStyle, redoStyle,
    langBtnLabel: id ? 'ID' : 'EN', toggleLang: () => c.set((s) => ({ lang: s.lang === 'id' ? 'en' : 'id' })),
    themeGlyph: c.theme === 'dark' ? '☾' : '☀', toggleTheme: () => c.set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
    toggleExport: () => c.set((s) => ({ expOpen: !s.expOpen, menu: null })), expOpen: st.expOpen, exportItems,
  };
}
