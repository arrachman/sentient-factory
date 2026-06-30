'use client';

// Browser-style tab strip for the HR shell. Ported from the web-erp TabBar but
// adapted to HR's URL-keyed tabs (lib/use-hr-tabs) and without @dnd-kit — reorder
// uses native HTML5 drag events (self-contained, no extra dependency). Tabs are
// identified by their `/app/...` route; activating one navigates the router.

import { useEffect, useRef, useState } from 'react';
import { X, RefreshCw, ChevronRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { pageMetaFor } from '@/lib/nav';
import type { HrTab } from '@/lib/use-hr-tabs';

interface TabBarProps {
  tabs: HrTab[];
  activeRoute: string;
  onActivate: (route: string) => void;
  onClose: (route: string) => void;
  onReload: (route: string) => void;
  onCloseOthers: (route: string) => void;
  onCloseRight: (route: string) => void;
  onReorder: (fromRoute: string, toRoute: string) => void;
}

interface CtxMenu {
  route: string;
  x: number;
  y: number;
}

export function TabBar({
  tabs,
  activeRoute,
  onActivate,
  onClose,
  onReload,
  onCloseOthers,
  onCloseRight,
  onReorder,
}: TabBarProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<CtxMenu | null>(null);
  const dragRoute = useRef<string | null>(null);

  useEffect(() => {
    const el = stripRef.current?.querySelector(`[data-tab="${CSS.escape(activeRoute)}"]`);
    if (el) el.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }, [activeRoute, tabs.length]);

  useEffect(() => {
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

  const openMenu = (e: React.MouseEvent, route: string) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({ route, x: e.clientX, y: e.clientY });
  };

  const run = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
    setMenu(null);
  };

  const menuIdx = menu ? tabs.findIndex((t) => t.route === menu.route) : -1;
  const hasOthers = tabs.length > 1;
  const hasRight = menuIdx > -1 && menuIdx < tabs.length - 1;

  return (
    <div className="tabstrip" ref={stripRef}>
      {tabs.map((tab) => {
        const active = tab.route === activeRoute;
        const meta = pageMetaFor(tab.route);
        return (
          <div
            key={tab.route}
            data-tab={tab.route}
            className={cn('tab-chip', active && 'active')}
            title={meta.title}
            draggable
            onClick={() => onActivate(tab.route)}
            onContextMenu={(e) => openMenu(e, tab.route)}
            onAuxClick={(e) => {
              if (e.button === 1) {
                e.preventDefault();
                onClose(tab.route);
              }
            }}
            onDragStart={() => {
              dragRoute.current = tab.route;
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragRoute.current && dragRoute.current !== tab.route) {
                onReorder(dragRoute.current, tab.route);
              }
              dragRoute.current = null;
            }}
          >
            <meta.Icon className="tab-ico" size={13} strokeWidth={1.6} />
            <span className="tab-label">{meta.title}</span>
            {tabs.length > 1 && (
              <span
                className="tab-x"
                title="Tutup tab"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tab.route);
                }}
                onAuxClick={(e) => e.stopPropagation()}
              >
                <X size={10} />
              </span>
            )}
          </div>
        );
      })}
      <div style={{ flex: 1 }} />
      <span className="tab-count">{tabs.length} tab</span>

      {menu && (
        <div
          className="tab-ctx"
          style={{ left: menu.x, top: menu.y }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <button className="tab-ctx-item" onClick={run(() => onReload(menu.route))}>
            <RefreshCw size={13} />
            <span>Muat ulang</span>
          </button>
          <div className="tab-ctx-sep" />
          <button
            className="tab-ctx-item"
            disabled={!hasOthers}
            onClick={hasOthers ? run(() => onClose(menu.route)) : undefined}
          >
            <X size={13} />
            <span>Tutup</span>
          </button>
          <button
            className="tab-ctx-item"
            disabled={!hasOthers}
            onClick={hasOthers ? run(() => onCloseOthers(menu.route)) : undefined}
          >
            <Trash2 size={13} />
            <span>Tutup tab lain</span>
          </button>
          <button
            className="tab-ctx-item"
            disabled={!hasRight}
            onClick={hasRight ? run(() => onCloseRight(menu.route)) : undefined}
          >
            <ChevronRight size={13} />
            <span>Tutup tab di kanan</span>
          </button>
        </div>
      )}
    </div>
  );
}
