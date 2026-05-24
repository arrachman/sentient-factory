'use client';

/**
 * Menu tree organism — draggable rows for sys_menus.
 * Renders the flattened MODULE→GROUP→ITEM tree as <tr> rows, with
 * sibling-only drag-and-drop reorder (no cross-parent). Per-parent
 * SortableContext keeps drag scope tight.
 *
 * DnD wiring is split into two exports so that `<DndContext>` (which
 * renders a hidden accessibility <div> live region) stays OUTSIDE
 * `<tbody>` — putting it inside breaks valid HTML and triggers a React
 * hydration warning.
 *
 *   <MenusDndProvider rows={...} onReorder={...}>
 *     <Table>
 *       <tbody>
 *         <MenusTreeRows rows={...} onEdit={...} onDelete={...} />
 *       </tbody>
 *     </Table>
 *   </MenusDndProvider>
 *
 * `SortableContext` is a pure React context provider (no DOM), so it is
 * safe to live inside `<tbody>` alongside `<tr>` children.
 *
 * Atomic tier: Organism.
 */

import * as React from 'react';
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
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import {
  TableRow,
  TableCell,
  TableEmpty,
} from '@/components/organisms/table';
import type { ErpSysMenu } from '@/lib/api/sys-menus';

const TYPE_VARIANT: Record<string, 'success' | 'info' | 'default'> = {
  MODULE: 'success',
  GROUP: 'info',
  ITEM: 'default',
};

export interface FlatRow {
  menu: ErpSysMenu;
  depth: number;
  siblings: ErpSysMenu[];
}

/** Depth-first flatten honoring parentId + sortOrder for indented display. */
export function flattenMenus(rows: ErpSysMenu[]): FlatRow[] {
  const byParent = new Map<string, ErpSysMenu[]>();
  for (const r of rows) {
    const key = r.parentId ?? '__root__';
    const arr = byParent.get(key) ?? [];
    arr.push(r);
    byParent.set(key, arr);
  }
  for (const arr of byParent.values()) {
    arr.sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
  }

  const out: FlatRow[] = [];
  const walk = (parentKey: string, depth: number) => {
    const kids = byParent.get(parentKey) ?? [];
    for (const k of kids) {
      out.push({ menu: k, depth, siblings: kids });
      walk(k.id, depth + 1);
    }
  };
  walk('__root__', 0);
  return out;
}

interface MenuRowProps {
  row: FlatRow;
  onEdit: (m: ErpSysMenu) => void;
  onDelete: (m: ErpSysMenu) => void;
}

function MenuRow({ row, onEdit, onDelete }: MenuRowProps) {
  const m = row.menu;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: m.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-dragging={isDragging || undefined}
    >
      <TableCell>
        <span
          style={{
            paddingLeft: row.depth * 18,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <button
            type="button"
            className="btn sm ghost"
            style={{ cursor: 'grab', padding: '0 6px' }}
            aria-label="Geser untuk mengurutkan"
            title="Geser untuk mengurutkan"
            {...attributes}
            {...listeners}
          >
            ⋮⋮
          </button>
          {row.depth > 0 && (
            <span className="muted">↳</span>
          )}
          {m.title}
        </span>
      </TableCell>
      <TableCell className="mono">{m.code}</TableCell>
      <TableCell>
        <Badge variant={TYPE_VARIANT[m.type] ?? 'default'}>{m.type}</Badge>
      </TableCell>
      <TableCell className="muted mono">{m.path ?? '—'}</TableCell>
      <TableCell className="mono">{m.sortOrder}</TableCell>
      <TableCell>
        <Badge variant={m.isActive ? 'success' : 'default'} dot>
          {m.isActive ? 'Aktif' : 'Nonaktif'}
        </Badge>
      </TableCell>
      <TableCell>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn sm" onClick={() => onEdit(m)}>
            Edit
          </button>
          <button className="btn sm danger" onClick={() => onDelete(m)}>
            Hapus
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}

/** Reorder result: new sortOrder assignments (1..N) only for changed rows. */
export interface SortOrderUpdate {
  id: string;
  sortOrder: number;
}


export interface MenusDndProviderProps {
  rows: FlatRow[];
  onReorder: (updates: SortOrderUpdate[]) => void;
  children: React.ReactNode;
}

/**
 * Wraps the table with DndContext. Lives OUTSIDE <tbody> because dnd-kit
 * renders an accessibility live region <div> that would otherwise be an
 * invalid child of <tbody>.
 */
export function MenusDndProvider({
  rows,
  onReorder,
  children,
}: MenusDndProviderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeRow = rows.find((r) => r.menu.id === activeId);
    if (!activeRow) return;
    const siblings = activeRow.siblings;
    const oldIndex = siblings.findIndex((s) => s.id === activeId);
    const newIndex = siblings.findIndex((s) => s.id === overId);
    if (oldIndex < 0 || newIndex < 0) return; // cross-parent drop — ignore

    const reordered = arrayMove(siblings, oldIndex, newIndex);
    const updates: SortOrderUpdate[] = [];
    reordered.forEach((m, idx) => {
      const next = idx + 1;
      if (m.sortOrder !== next) updates.push({ id: m.id, sortOrder: next });
    });
    if (updates.length > 0) onReorder(updates);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
}

export interface MenusTreeRowsProps {
  rows: FlatRow[];
  onEdit: (m: ErpSysMenu) => void;
  onDelete: (m: ErpSysMenu) => void;
}

/** The actual <tr> rows. Must live inside <tbody>. */
export function MenusTreeRows({ rows, onEdit, onDelete }: MenusTreeRowsProps) {
  const childrenByParent = React.useMemo(() => {
    const map = new Map<string, FlatRow[]>();
    for (const r of rows) {
      const key = r.menu.parentId ?? '__root__';
      const arr = map.get(key) ?? [];
      arr.push(r);
      map.set(key, arr);
    }
    return map;
  }, [rows]);

  if (rows.length === 0) {
    return <TableEmpty colSpan={7} />;
  }

  // Render depth-first: each sibling group gets its own SortableContext
  // (SortableContext emits no DOM, so nesting inside <tbody> is safe).
  function renderGroup(parentKey: string): React.ReactNode {
    const group = childrenByParent.get(parentKey);
    if (!group || group.length === 0) return null;
    return (
      <SortableContext
        key={parentKey}
        items={group.map((r) => r.menu.id)}
        strategy={verticalListSortingStrategy}
      >
        {group.map((r) => (
          <React.Fragment key={r.menu.id}>
            <MenuRow row={r} onEdit={onEdit} onDelete={onDelete} />
            {renderGroup(r.menu.id)}
          </React.Fragment>
        ))}
      </SortableContext>
    );
  }

  return <>{renderGroup('__root__')}</>;
}
