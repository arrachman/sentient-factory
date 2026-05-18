/**
 * ShortcutsOverlay — modal overlay that lists all keyboard shortcuts available
 * in the ERP shell. Rendered by AppShell when `shortcutsOpen` is true.
 */

import * as React from 'react';

interface ShortcutsOverlayProps {
  onClose: () => void;
}

export function ShortcutsOverlay({ onClose }: ShortcutsOverlayProps) {
  // Close on Escape key.
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="sc-overlay" onClick={onClose}>
      <div className="sc-card" onClick={(e) => e.stopPropagation()}>
        <h3>Keyboard Shortcuts</h3>
        <div className="sc-grid">
          <div>Buka command palette</div>
          <div>⌘ K</div>
          <div>Tutup tab aktif</div>
          <div>⌥ W</div>
          <div>Pindah ke tab 1–8</div>
          <div>⌘ 1–8</div>
          <div>Pindah ke tab terakhir</div>
          <div>⌘ 9</div>
          <div>Toggle bahasa ID/EN</div>
          <div>L</div>
          <div>Tampilkan shortcut</div>
          <div>?</div>
          <div>Tutup overlay</div>
          <div>ESC</div>
        </div>
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <button className="btn" onClick={onClose}>
            Tutup ESC
          </button>
        </div>
      </div>
    </div>
  );
}
