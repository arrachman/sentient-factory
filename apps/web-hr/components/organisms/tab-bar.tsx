'use client';

// Browser-style tab strip for the HR shell. Ported from the web-erp TabBar
// (@dnd-kit sortable reorder for full ERP parity) and adapted to HR's URL-keyed
// tabs (lib/use-hr-tabs): tabs are identified by their `/app/...` route, and
// activating one navigates the router. Lucide icons (HR has no name-registry).

import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

interface SortableTabChipProps {
  tab: HrTab;
  active: boolean;
  closable: boolean;
  onActivate: (route: string) => void;
  onClose: (route: string) => void;
  onContextMenu: (e: React.MouseEvent, route: string) => void;
}

function SortableTabChip({
  tab,
  active,
  closable,
  onActivate,
  onClose,
  onContextMenu,
}: SortableTabChipProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: tab.route });
  const meta = pageMetaFor(tab.route);
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 10 : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      data-tab={tab.route}
      className={cn('tab-chip', active && 'active', isDragging && 'dragging')}
      title={meta.title}
      onClick={() => onActivate(tab.route)}
      onContextMenu={(e) => onContextMenu(e, tab.route)}
      onAuxClick={(e) => {
        if (e.button === 1 && closable) {
          e.preventDefault();
          onClose(tab.route);
        }
      }}
      {...attributes}
      {...listeners}
    >
      <meta.Icon className="tab-ico" size={13} strokeWidth={1.6} />
      <span className="tab-label">{meta.title}</span>
      {closable && (
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

  useEffect(() => {
    const el = stripRef.current?.querySelector(`[data-tab="${window.CSS.escape(activeRoute)}"]`);
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    onReorder(String(active.id), String(over.id));
  };

  const tabIds = tabs.map((t) => t.route);

  return (
    <div className="tabstrip" ref={stripRef}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tabIds} strategy={horizontalListSortingStrategy}>
          {tabs.map((tab) => (
            <SortableTabChip
              key={tab.route}
              tab={tab}
              active={tab.route === activeRoute}
              closable={tabs.length > 1}
              onActivate={onActivate}
              onClose={onClose}
              onContextMenu={openMenu}
            />
          ))}
        </SortableContext>
      </DndContext>
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
