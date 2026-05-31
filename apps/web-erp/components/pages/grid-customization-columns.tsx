'use client';

/**
 * Right panel of Kustomisasi Grid: editable column-definition table for the
 * selected transaction type. Plain editable grid (legacy "Grid" parity).
 */

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { NumInput } from '@/components/molecules/num-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icons';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/organisms/table';
import type { ErpGridColumn, GridDataType, GridColumnKind } from '@/lib/api/transaction-grids';

const DATA_TYPES: GridDataType[] = ['TEXT', 'NUMBER', 'DATE', 'LOOKUP'];
const KINDS: GridColumnKind[] = ['STANDARD', 'CUSTOM'];
const LOOKUPS = ['account', 'costCenter', 'division', 'subdivision', 'project'];

function CenterCheck({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex justify-center">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} />
    </div>
  );
}

export function GridCustomizationColumns({
  columns,
  onColumnsChange,
}: {
  columns: ErpGridColumn[];
  onColumnsChange: (cols: ErpGridColumn[]) => void;
}) {
  const patch = (i: number, p: Partial<ErpGridColumn>) =>
    onColumnsChange(columns.map((c, idx) => (idx === i ? { ...c, ...p } : c)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= columns.length) return;
    const next = [...columns];
    [next[i], next[j]] = [next[j], next[i]];
    onColumnsChange(next);
  };
  const remove = (i: number) => onColumnsChange(columns.filter((_, idx) => idx !== i));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead style={{ width: 40 }}>No</TableHead>
          <TableHead>Header Text</TableHead>
          <TableHead style={{ width: 150 }}>Data Field</TableHead>
          <TableHead style={{ width: 90, textAlign: 'right' }}>Lebar</TableHead>
          <TableHead style={{ width: 60, textAlign: 'center' }}>Tampil</TableHead>
          <TableHead style={{ width: 60, textAlign: 'center' }}>Wajib</TableHead>
          <TableHead style={{ width: 60, textAlign: 'center' }}>Edit</TableHead>
          <TableHead style={{ width: 120 }}>Jenis</TableHead>
          <TableHead style={{ width: 120 }}>Tipe</TableHead>
          <TableHead style={{ width: 140 }}>Lookup</TableHead>
          <TableHead style={{ width: 92 }} />
        </TableRow>
      </TableHeader>
      <TableBody>
        {columns.length === 0 ? (
          <TableRow>
            <TableCell colSpan={11} className="py-4 text-center text-muted-foreground">
              Belum ada kolom. Klik “Tambah Kolom”.
            </TableCell>
          </TableRow>
        ) : (
          columns.map((c, i) => (
            <TableRow key={`${c.dataField}-${i}`}>
              <TableCell className="text-muted-foreground">{i + 1}</TableCell>
              <TableCell>
                <Input value={c.headerText} onChange={(e) => patch(i, { headerText: e.target.value })} />
              </TableCell>
              <TableCell>
                <Input value={c.dataField} onChange={(e) => patch(i, { dataField: e.target.value })} />
              </TableCell>
              <TableCell>
                <NumInput value={String(c.width)} decimals={0} onChange={(raw) => patch(i, { width: Number(raw || 0) })} />
              </TableCell>
              <TableCell><CenterCheck checked={c.isVisible} onChange={(v) => patch(i, { isVisible: v })} /></TableCell>
              <TableCell><CenterCheck checked={c.isRequired} onChange={(v) => patch(i, { isRequired: v })} /></TableCell>
              <TableCell><CenterCheck checked={c.isEditable} onChange={(v) => patch(i, { isEditable: v })} /></TableCell>
              <TableCell>
                <Select value={c.kind} onValueChange={(v) => patch(i, { kind: v as GridColumnKind })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {KINDS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select value={c.dataType} onValueChange={(v) => patch(i, { dataType: v as GridDataType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DATA_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {c.dataType === 'LOOKUP' ? (
                  <Select value={c.lookupSource ?? ''} onValueChange={(v) => patch(i, { lookupSource: v })}>
                    <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      {LOOKUPS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <button type="button" className="iconbtn" title="Naik" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                  <button type="button" className="iconbtn" title="Turun" onClick={() => move(i, 1)} disabled={i === columns.length - 1}>↓</button>
                  <button type="button" className="iconbtn danger" title="Hapus kolom" onClick={() => remove(i)}>
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
