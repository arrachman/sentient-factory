'use client';

/**
 * Detail table for the generic <TrxForm>. Renders an inline-editable
 * grid of `TrxLine` rows (journal: debit/kredit; non-journal: total +
 * proyek). Click a cell to enter edit mode; Blur/Enter/Escape commits
 * via input's `blur()`. Ported from prototype `pages/trx-form.jsx`
 * (`TrxLineRow` + table body) — atomic tier: Pages (sub-page composite,
 * tightly coupled to `<TrxForm>`).
 */

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { Kbd } from '@/components/ui/kbd';
import { fmtIDR, type Translator } from '@/lib/mock';
import type {
  TrxConfig,
  TrxLine,
  TrxLineColumn,
} from './trx-form-config';

export type TrxEditing = { rowId: number; col: keyof TrxLine } | null;

export interface TrxLinesProps {
  cfg: TrxConfig;
  t: Translator;
  lines: TrxLine[];
  setLines: React.Dispatch<React.SetStateAction<TrxLine[]>>;
  editing: TrxEditing;
  setEditing: React.Dispatch<React.SetStateAction<TrxEditing>>;
  total: number;
  totalKredit: number;
  head: { uang: string };
  addLine: () => void;
}

const MONO: React.CSSProperties = { fontFamily: 'Geist Mono, monospace' };

function buildColumns(cfg: TrxConfig, t: Translator): TrxLineColumn[] {
  if (cfg.journal) {
    return [
      { k: 'no', h: t('No Akun'), w: 130 },
      { k: 'nama', h: t('Nama Akun') },
      { k: 'debit', h: 'Debit', w: 130, num: true },
      { k: 'kredit', h: 'Kredit', w: 130, num: true },
      { k: 'catatan', h: t('Catatan'), w: 170 },
      { k: 'cc', h: t('Cost Center'), w: 110 },
    ];
  }
  return [
    { k: 'no', h: t('No Akun'), w: 130 },
    { k: 'nama', h: t('Nama Akun') },
    { k: 'total', h: t('Total'), w: 140, num: true },
    { k: 'catatan', h: t('Catatan'), w: 180 },
    { k: 'cc', h: t('Cost Center'), w: 120 },
    { k: 'proyek', h: t('Proyek'), w: 100 },
  ];
}

interface RowProps {
  idx: number;
  line: TrxLine;
  cols: TrxLineColumn[];
  editing: TrxEditing;
  setEditing: React.Dispatch<React.SetStateAction<TrxEditing>>;
  update: (id: number, col: keyof TrxLine, value: string | number) => void;
  remove: (id: number) => void;
}

function TrxLineRow({
  idx,
  line,
  cols,
  editing,
  setEditing,
  update,
  remove,
}: RowProps): React.ReactElement {
  const isEd = (col: keyof TrxLine): boolean =>
    editing != null && editing.rowId === line.id && editing.col === col;
  return (
    <tr>
      <td>
        <div className="cell muted" style={MONO}>
          {idx}
        </div>
      </td>
      {cols.map((c) => (
        <td
          key={String(c.k)}
          className={isEd(c.k) ? 'editing' : ''}
          onClick={(e) => {
            e.stopPropagation();
            setEditing({ rowId: line.id, col: c.k });
          }}
        >
          <div className={`cell ${c.num ? 'num' : ''}`}>
            {isEd(c.k) ? (
              <input
                autoFocus
                defaultValue={String(line[c.k] ?? '')}
                onBlur={(e) => {
                  const raw = e.target.value;
                  const value = c.num
                    ? Number(raw.replace(/[^0-9.-]/g, '')) || 0
                    : raw;
                  update(line.id, c.k, value);
                  setEditing(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
              />
            ) : c.num ? (
              Number(line[c.k]) ? (
                fmtIDR(Number(line[c.k]))
              ) : (
                <span className="muted">0,00</span>
              )
            ) : (
              line[c.k] || (
                <span style={{ color: 'var(--fg-faint)' }}>—</span>
              )
            )}
          </div>
        </td>
      ))}
      <td onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="iconbtn"
          style={{ width: 26, height: 24, color: 'var(--fg-faint)' }}
          onClick={() => remove(line.id)}
          aria-label="Hapus baris"
        >
          <Icon name="x" size={11} />
        </button>
      </td>
    </tr>
  );
}

export function TrxLines({
  cfg,
  t,
  lines,
  setLines,
  editing,
  setEditing,
  total,
  totalKredit,
  head,
  addLine,
}: TrxLinesProps): React.ReactElement {
  const cols = React.useMemo(() => buildColumns(cfg, t), [cfg, t]);

  const update = React.useCallback(
    (id: number, col: keyof TrxLine, value: string | number): void => {
      setLines((arr) =>
        arr.map((l) => (l.id === id ? { ...l, [col]: value } : l)),
      );
    },
    [setLines],
  );
  const remove = React.useCallback(
    (id: number): void => {
      setLines((arr) => arr.filter((l) => l.id !== id));
    },
    [setLines],
  );

  return (
    <div className="lines scrollbar">
      <table>
        <thead>
          <tr>
            <th style={{ width: 30 }}>#</th>
            {cols.map((c) => (
              <th
                key={String(c.k)}
                className={c.num ? 'num' : ''}
                style={{ width: c.w }}
              >
                {c.h}
              </th>
            ))}
            <th style={{ width: 32 }} />
          </tr>
        </thead>
        <tbody>
          {lines.map((l, i) => (
            <TrxLineRow
              key={l.id}
              idx={i + 1}
              line={l}
              cols={cols}
              editing={editing}
              setEditing={setEditing}
              update={update}
              remove={remove}
            />
          ))}
          <tr
            className="adder"
            onClick={(e) => {
              e.stopPropagation();
              addLine();
            }}
          >
            <td>
              <div className="cell">{lines.length + 1}</div>
            </td>
            <td colSpan={cols.length + 1}>
              <div className="cell" style={{ cursor: 'pointer' }}>
                <Icon name="plus" size={11} />
                &nbsp; Klik di sini atau tekan <Kbd>+</Kbd> untuk menambah
                baris…
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} style={{ textAlign: 'right', paddingRight: 12 }}>
              {t('Total')} {head.uang}
            </td>
            {cfg.journal ? (
              <>
                <td className="num">{fmtIDR(total)}</td>
                <td className="num">{fmtIDR(totalKredit)}</td>
                <td colSpan={3} />
              </>
            ) : (
              <>
                <td className="num">{fmtIDR(total)}</td>
                <td colSpan={4} />
              </>
            )}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
