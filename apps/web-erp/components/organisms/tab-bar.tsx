'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icons';
import { pageMeta } from '@/lib/nav';

export interface ShellTab {
  id: string;
  route: string;
  /** Bumped to force-remount the tab's view (reload action). */
  nonce?: number;
}

interface TabBarProps {
  tabs: ShellTab[];
  activeId: string;
  onActivate: (id: string) => void;
  onClose: (id: string) => void;
  onReload: (id: string) => void;
  onCloseOthers: (id: string) => void;
  onCloseRight: (id: string) => void;
  onDuplicate: (id: string) => void;
  onNew: () => void;
  t: (key: string) => string;
}

/** Browser-style tab strip — ported from `tabs.jsx`. */
export function TabBar({
  tabs,
  activeId,
  onActivate,
  onClose,
  onReload,
  onCloseOthers,
  onCloseRight,
  onDuplicate,
  onNew,
  t,
}: TabBarProps) {
  const stripRef = React.useRef<HTMLDivElement>(null);
  const [menu, setMenu] = React.useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);

  React.useEffect(() => {
    const el = stripRef.current?.querySelector(`[data-tab="${activeId}"]`);
    if (el) el.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }, [activeId, tabs.length]);

  React.useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener('click', close);
    window.addEventListener('resize', close);
    window.addEventListener('keydown', close);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('resize', close);
      window.removeEventListener('keydown', close);
    };
  }, [menu]);

  const openMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({ id, x: e.clientX, y: e.clientY });
  };

  const run = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
    setMenu(null);
  };

  const menuIdx = menu ? tabs.findIndex((tb) => tb.id === menu.id) : -1;
  const hasOthers = tabs.length > 1;
  const hasRight = menuIdx > -1 && menuIdx < tabs.length - 1;

  return (
    <div className="tabstrip" ref={stripRef}>
      {tabs.map((tab) => {
        const meta = pageMeta(tab.route, t);
        const active = tab.id === activeId;
        return (
          <div
            key={tab.id}
            data-tab={tab.id}
            className={cn('tab-chip', active && 'active')}
            title={meta.crumbs.map((c) => c.label).join(' / ')}
            onClick={() => onActivate(tab.id)}
            onContextMenu={(e) => openMenu(e, tab.id)}
            onAuxClick={(e) => {
              if (e.button === 1) {
                e.preventDefault();
                onClose(tab.id);
              }
            }}
          >
            <Icon name={meta.icon} size={13} className="tab-ico" />
            <span className="tab-label">{meta.title}</span>
            {meta.code && <span className="tab-code">{meta.code}</span>}
            <span
              className="tab-x"
              title={active ? `${t('Tutup tab')} (⌘E)` : t('Tutup tab')}
              onClick={(e) => {
                e.stopPropagation();
                onClose(tab.id);
              }}
              onAuxClick={(e) => e.stopPropagation()}
            >
              <Icon name="x" size={10} />
            </span>
          </div>
        );
      })}
      <button
        className="tab-new"
        title={`${t('Tab baru')} (⌘K)`}
        onClick={onNew}
      >
        <Icon name="plus" size={13} />
      </button>
      <div style={{ flex: 1 }} />
      {tabs.length > 0 && (
        <button
          className="tab-new"
          title={t('Duplikat tab')}
          onClick={() => onDuplicate(activeId)}
        >
          <Icon name="boxes" size={12} />
        </button>
      )}
      <span className="tab-count">{tabs.length} tab</span>

      {menu && (
        <div
          className="tab-ctx"
          style={{ left: menu.x, top: menu.y }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <button
            className="tab-ctx-item"
            onClick={run(() => onReload(menu.id))}
          >
            <Icon name="refresh" size={13} />
            <span>{t('Muat ulang')}</span>
          </button>
          <div className="tab-ctx-sep" />
          <button
            className="tab-ctx-item"
            onClick={run(() => onClose(menu.id))}
          >
            <Icon name="x" size={13} />
            <span>{t('Tutup')}</span>
          </button>
          <button
            className="tab-ctx-item"
            disabled={!hasOthers}
            onClick={hasOthers ? run(() => onCloseOthers(menu.id)) : undefined}
          >
            <Icon name="trash" size={13} />
            <span>{t('Tutup tab lain')}</span>
          </button>
          <button
            className="tab-ctx-item"
            disabled={!hasRight}
            onClick={hasRight ? run(() => onCloseRight(menu.id)) : undefined}
          >
            <Icon name="chevright" size={13} />
            <span>{t('Tutup tab di kanan')}</span>
          </button>
        </div>
      )}
    </div>
  );
}
