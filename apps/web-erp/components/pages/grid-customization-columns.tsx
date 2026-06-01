'use client';

import * as React from 'react';
import {
  DndContext, PointerSensor, KeyboardSensor,
  useSensor, useSensors, closestCenter, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
  sortableKeyboardCoordinates, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Input } from '@/components/ui/input';
import { NumInput } from '@/components/molecules/num-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icons';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/organisms/table';
import {
  LABEL_FORMATTERS, HEADER_RENDERERS, CELL_RENDERERS, CELL_EDITORS,
  type ErpGridColumn,
} from '@/lib/api/transaction-grids';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const AUTO = '__AUTO__';

function CenterCheck({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex justify-center">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} />
    </div>
  );
}

function SlotSelect({
  value, options, onChange,
}: {
  value: string | null | undefined;
  options: readonly string[];
  onChange: (v: string | null) => void;
}) {
  return (
    <Select value={value ?? AUTO} onValueChange={(v) => onChange(v === AUTO ? null : v)}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value={AUTO}>— (auto)</SelectItem>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function SortableColumnRow({
  col, index, onPatch, onRemove,
}: {
  col: ErpGridColumn;
  index: number;
  onPatch: (p: Partial<ErpGridColumn>) => void;
  onRemove: () => void;
}) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: String(index) });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    backgroundColor: isDragging ? 'var(--bg-hover)' : undefined,
  };

  return (
    <TableRow ref={setNodeRef as React.Ref<HTMLTableRowElement>} style={style}>
      <TableCell style={{ width: 36 }}>
        <button
          type="button"
          className="iconbtn text-muted-foreground"
          title="Seret untuk menata ulang"
          style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
          {...attributes}
          {...listeners}
        >
          <Icon name="grip-vertical" size={14} />
        </button>
      </TableCell>
      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
      <TableCell>
        <Input value={col.headerText} onChange={(e) => onPatch({ headerText: e.target.value })} />
      </TableCell>
      <TableCell>
        <Input value={col.dataField} onChange={(e) => onPatch({ dataField: e.target.value })} />
      </TableCell>
      <TableCell>
        <NumInput value={String(col.width)} decimals={0} onChange={(raw) => onPatch({ width: Number(raw || 0) })} />
      </TableCell>
      <TableCell><CenterCheck checked={col.isVisible} onChange={(v) => onPatch({ isVisible: v })} /></TableCell>
      <TableCell><CenterCheck checked={col.isRequired} onChange={(v) => onPatch({ isRequired: v })} /></TableCell>
      <TableCell><CenterCheck checked={col.isEditable} onChange={(v) => onPatch({ isEditable: v })} /></TableCell>
      <TableCell><CenterCheck checked={col.isSkippable} onChange={(v) => onPatch({ isSkippable: v })} /></TableCell>
      <TableCell>
        <SlotSelect value={col.labelFormatter} options={LABEL_FORMATTERS} onChange={(v) => onPatch({ labelFormatter: v as ErpGridColumn['labelFormatter'] })} />
      </TableCell>
      <TableCell>
        <SlotSelect value={col.headerRenderer} options={HEADER_RENDERERS} onChange={(v) => onPatch({ headerRenderer: v as ErpGridColumn['headerRenderer'] })} />
      </TableCell>
      <TableCell>
        <SlotSelect value={col.cellRenderer} options={CELL_RENDERERS} onChange={(v) => onPatch({ cellRenderer: v as ErpGridColumn['cellRenderer'] })} />
      </TableCell>
      <TableCell>
        <SlotSelect value={col.cellEditor} options={CELL_EDITORS} onChange={(v) => onPatch({ cellEditor: v as ErpGridColumn['cellEditor'] })} />
      </TableCell>
      <TableCell style={{ width: 48 }}>
        <button type="button" className="iconbtn danger" title="Hapus kolom" onClick={onRemove}>
          <Icon name="trash" size={13} />
        </button>
      </TableCell>
    </TableRow>
  );
}

export function GridCustomizationColumns({
  columns,
  onColumnsChange,
}: {
  columns: ErpGridColumn[];
  onColumnsChange: (cols: ErpGridColumn[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    onColumnsChange(arrayMove(columns, Number(active.id), Number(over.id)));
  };

  const colIds = React.useMemo(() => columns.map((_, i) => String(i)), [columns]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 36 }} />
            <TableHead style={{ width: 40 }}>No</TableHead>
            <TableHead>Header Text</TableHead>
            <TableHead style={{ width: 150 }}>Data Field</TableHead>
            <TableHead style={{ width: 90, textAlign: 'right' }}>Lebar</TableHead>
            <TableHead style={{ width: 56, textAlign: 'center' }}>Tampil</TableHead>
            <TableHead style={{ width: 56, textAlign: 'center' }}>Wajib</TableHead>
            <TableHead style={{ width: 56, textAlign: 'center' }}>Edit</TableHead>
            <TableHead style={{ width: 56, textAlign: 'center' }}>Skip</TableHead>
            <TableHead style={{ width: 150 }}>Label Formatter</TableHead>
            <TableHead style={{ width: 140 }}>Header Renderer</TableHead>
            <TableHead style={{ width: 140 }}>Cell Renderer</TableHead>
            <TableHead style={{ width: 140 }}>Cell Editor</TableHead>
            <TableHead style={{ width: 48 }} />
          </TableRow>
        </TableHeader>
        <SortableContext items={colIds} strategy={verticalListSortingStrategy}>
          <TableBody>
            {columns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} className="py-4 text-center text-muted-foreground">
                  Belum ada kolom. Klik "Tambah Kolom".
                </TableCell>
              </TableRow>
            ) : (
              columns.map((c, i) => (
                <SortableColumnRow
                  key={String(i)}
                  col={c}
                  index={i}
                  onPatch={(p) => onColumnsChange(columns.map((col, idx) => (idx === i ? { ...col, ...p } : col)))}
                  onRemove={() => onColumnsChange(columns.filter((_, idx) => idx !== i))}
                />
              ))
            )}
          </TableBody>
        </SortableContext>
      </Table>
    </DndContext>
  );
}
