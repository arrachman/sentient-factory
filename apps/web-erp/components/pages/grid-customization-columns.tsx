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
  COLUMN_TYPES, COLUMN_TYPE_LABELS, COLUMN_TYPE_PRESETS,
  inferColumnType,
  type ErpGridColumn, type ColumnType,
} from '@/lib/api/transaction-grids';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { GridBulkToolbar, type BooleanColumnFlag } from '@/components/molecules/grid-bulk-toolbar';

const BOOL_FLAGS: BooleanColumnFlag[] = ['isVisible', 'isRequired', 'isEditable', 'isSkippable'];

const DEFAULT_FLAGS: Record<BooleanColumnFlag, boolean> = {
  isVisible: true, isRequired: false, isEditable: true, isSkippable: false,
};

function isColChanged(a: ErpGridColumn, b: ErpGridColumn | undefined): boolean {
  if (!b) return true;
  return (
    a.headerText !== b.headerText ||
    a.dataField !== b.dataField ||
    a.width !== b.width ||
    a.isVisible !== b.isVisible ||
    a.isRequired !== b.isRequired ||
    a.isEditable !== b.isEditable ||
    a.isSkippable !== b.isSkippable ||
    (a.columnType ?? null) !== (b.columnType ?? null)
  );
}

function CenterCheck({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex justify-center">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} />
    </div>
  );
}

function ColumnTypeSelect({ value, onChange }: {
  value: ColumnType | null | undefined;
  onChange: (v: ColumnType) => void;
}) {
  return (
    <Select value={value ?? 'text'} onValueChange={(v) => onChange(v as ColumnType)}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        {COLUMN_TYPES.map((t) => (
          <SelectItem key={t} value={t}>{COLUMN_TYPE_LABELS[t]}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SortableColumnRow({
  col, index, saved, selected, onToggleSelect, onPatch, onRemove,
}: {
  col: ErpGridColumn;
  index: number;
  saved: ErpGridColumn | undefined;
  selected: boolean;
  onToggleSelect: () => void;
  onPatch: (p: Partial<ErpGridColumn>) => void;
  onRemove: () => void;
}) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: String(index) });

  const changed = isColChanged(col, saved);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    backgroundColor: isDragging
      ? 'var(--bg-hover)'
      : selected
        ? 'color-mix(in srgb, var(--primary) 8%, transparent)'
        : undefined,
  };

  const currentType: ColumnType = col.columnType
    ?? inferColumnType(col.labelFormatter, col.cellRenderer, col.cellEditor);

  const handleTypeChange = (type: ColumnType) => {
    const preset = COLUMN_TYPE_PRESETS[type];
    onPatch({
      columnType: type,
      labelFormatter: preset.labelFormatter,
      headerRenderer: preset.headerRenderer,
      cellRenderer: preset.cellRenderer,
      cellEditor: preset.cellEditor,
    });
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
      <TableCell style={{ width: 36 }}>
        <div className="flex items-center justify-center gap-1.5">
          <Checkbox checked={selected} onCheckedChange={onToggleSelect} />
          {changed && (
            <span
              title="Belum disimpan"
              className="inline-block h-1.5 w-1.5 rounded-full bg-warning"
            />
          )}
        </div>
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
        <ColumnTypeSelect value={currentType} onChange={handleTypeChange} />
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
  savedColumns,
  onColumnsChange,
}: {
  columns: ErpGridColumn[];
  savedColumns: ErpGridColumn[];
  onColumnsChange: (cols: ErpGridColumn[]) => void;
}) {
  const [selected, setSelected] = React.useState<Set<number>>(new Set());

  React.useEffect(() => { setSelected(new Set()); }, [columns.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    onColumnsChange(arrayMove(columns, Number(active.id), Number(over.id)));
  };

  const toggleSelect = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? new Set(columns.map((_, i) => i)) : new Set());
  };

  const handleBulkToggle = (flag: BooleanColumnFlag, value: boolean) => {
    onColumnsChange(columns.map((c, i) => selected.has(i) ? { ...c, [flag]: value } : c));
  };

  const handleBulkReset = () => {
    onColumnsChange(
      columns.map((c, i) =>
        selected.has(i) ? { ...c, ...DEFAULT_FLAGS } : c,
      ),
    );
    setSelected(new Set());
  };

  const colIds = React.useMemo(() => columns.map((_, i) => String(i)), [columns]);

  return (
    <div>
      <GridBulkToolbar
        total={columns.length}
        selectedIndices={selected}
        columns={columns}
        onSelectAll={handleSelectAll}
        onBulkToggle={handleBulkToggle}
        onBulkReset={handleBulkReset}
      />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 36 }} />
              <TableHead style={{ width: 52 }} />
              <TableHead style={{ width: 40 }}>No</TableHead>
              <TableHead>Header Text</TableHead>
              <TableHead style={{ width: 150 }}>Data Field</TableHead>
              <TableHead style={{ width: 90, textAlign: 'right' }}>Lebar</TableHead>
              <TableHead style={{ width: 56, textAlign: 'center' }}>Tampil</TableHead>
              <TableHead style={{ width: 56, textAlign: 'center' }}>Wajib</TableHead>
              <TableHead style={{ width: 56, textAlign: 'center' }}>Edit</TableHead>
              <TableHead style={{ width: 56, textAlign: 'center' }}>Skip</TableHead>
              <TableHead style={{ width: 180 }}>Tipe Kolom</TableHead>
              <TableHead style={{ width: 48 }} />
            </TableRow>
          </TableHeader>
          <SortableContext items={colIds} strategy={verticalListSortingStrategy}>
            <TableBody>
              {columns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="py-4 text-center text-muted-foreground">
                    Belum ada kolom. Klik &ldquo;Tambah Kolom&rdquo;.
                  </TableCell>
                </TableRow>
              ) : (
                columns.map((c, i) => (
                  <SortableColumnRow
                    key={String(i)}
                    col={c}
                    index={i}
                    saved={savedColumns[i]}
                    selected={selected.has(i)}
                    onToggleSelect={() => toggleSelect(i)}
                    onPatch={(p) => onColumnsChange(columns.map((col, idx) => (idx === i ? { ...col, ...p } : col)))}
                    onRemove={() => onColumnsChange(columns.filter((_, idx) => idx !== i))}
                  />
                ))
              )}
            </TableBody>
          </SortableContext>
        </Table>
      </DndContext>
    </div>
  );
}
