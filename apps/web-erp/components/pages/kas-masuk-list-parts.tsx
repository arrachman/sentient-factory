'use client';

// Presentational sub-components for the Kas Masuk list page.
// Split out of `kas-masuk-list.tsx` to keep each file ≤400 lines.
import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { Kbd } from '@/components/ui/kbd';
import { StatusBadge } from '@/components/ui/badge';
import { fmtIDR, type KasMasukRow, type Translator } from '@/lib/mock';

interface KasMasukTableProps {
  t: Translator;
  tblRef: React.RefObject<HTMLDivElement | null>;
  view: KasMasukRow[];
  selected: Set<number>;
  focused: number;
  allSelected: boolean;
  someSelected: boolean;
  toggle: (id: number) => void;
  toggleAll: () => void;
  setFocused: (i: number) => void;
  setSortCol: (col: keyof KasMasukRow) => void;
  sortInd: (col: keyof KasMasukRow) => React.ReactNode;
  openForm: () => void;
}

export function KasMasukTable({
  t,
  tblRef,
  view,
  selected,
  focused,
  allSelected,
  someSelected,
  toggle,
  toggleAll,
  setFocused,
  setSortCol,
  sortInd,
  openForm,
}: KasMasukTableProps) {
  return (
    <div className="tbl-wrap scrollbar" ref={tblRef}>
      <table className="tbl">
        <thead>
          <tr>
            <th className="col-check">
              <input
                type="checkbox"
                className="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={toggleAll}
              />
            </th>
            <th className="sortable" onClick={() => setSortCol('no')}>
              {t('No Transaksi')}
              {sortInd('no')}
            </th>
            <th className="sortable" onClick={() => setSortCol('tanggal')}>
              {t('Tanggal')}
              {sortInd('tanggal')}
            </th>
            <th
              className="sortable"
              onClick={() => setSortCol('terimaDari')}
            >
              {t('Terima Dari')}
              {sortInd('terimaDari')}
            </th>
            <th>{t('Uraian')}</th>
            <th>{t('Status')}</th>
            <th>{t('Cabang')}</th>
            <th>{t('Lokasi')}</th>
            <th>{t('User')}</th>
            <th
              className="col-num sortable"
              onClick={() => setSortCol('total')}
            >
              {t('Total')} (IDR){sortInd('total')}
            </th>
          </tr>
        </thead>
        <tbody>
          {view.map((r, i) => (
            <tr
              key={r.id}
              className={`${selected.has(r.id) ? 'selected' : ''} ${
                i === focused ? 'focused' : ''
              }`}
              onClick={() => setFocused(i)}
            >
              <td className="col-check">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selected.has(r.id)}
                  onChange={() => toggle(r.id)}
                />
              </td>
              <td className="mono">
                <a
                  style={{
                    color: 'var(--primary-soft-fg)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => openForm()}
                >
                  {r.no}
                </a>
              </td>
              <td className="mono muted">{r.tanggal}</td>
              <td
                style={{
                  maxWidth: 240,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {r.terimaDari}
              </td>
              <td
                className="muted"
                style={{
                  maxWidth: 280,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {r.uraian}
              </td>
              <td>
                <StatusBadge status={r.status} />
              </td>
              <td className="mono muted">{r.cabang}</td>
              <td className="muted">{r.lokasi}</td>
              <td className="muted">{r.user}</td>
              <td className="num">{fmtIDR(r.total)}</td>
            </tr>
          ))}
          {view.length === 0 && (
            <tr>
              <td colSpan={10} className="tbl-empty">
                Tidak ada transaksi yang cocok dengan filter
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

interface KasMasukPagerProps {
  t: Translator;
  safePage: number;
  totalPages: number;
  viewLen: number;
  filteredLen: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export function KasMasukPager({
  t,
  safePage,
  totalPages,
  viewLen,
  filteredLen,
  setPage,
}: KasMasukPagerProps) {
  return (
    <div className="pager">
      <span>
        {t('Halaman')}{' '}
        <strong style={{ color: 'var(--fg)' }}>{safePage}</strong>{' '}
        {t('dari')} {totalPages}
      </span>
      <span>
        · {viewLen} {t('dari')} {filteredLen} {t('baris')}
      </span>
      <div className="spacer" />
      <span className="muted">
        Pintasan: <Kbd>J</Kbd>/<Kbd>K</Kbd> navigasi · <Kbd>X</Kbd> pilih ·{' '}
        <Kbd>↵</Kbd> buka
      </span>
      <div className="seg">
        <button disabled={safePage === 1} onClick={() => setPage(1)}>
          <Icon name="chevdoubleleft" size={11} />
        </button>
        <button
          disabled={safePage === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          <Icon name="chevleft" size={11} />
        </button>
        <button
          disabled={safePage === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          <Icon name="chevright" size={11} />
        </button>
        <button
          disabled={safePage === totalPages}
          onClick={() => setPage(totalPages)}
        >
          <Icon name="chevdoubleright" size={11} />
        </button>
      </div>
    </div>
  );
}

interface KasMasukBulkBarProps {
  t: Translator;
  count: number;
  bulk: (kind: string) => void;
  clearSel: () => void;
}

export function KasMasukBulkBar({
  t,
  count,
  bulk,
  clearSel,
}: KasMasukBulkBarProps) {
  return (
    <div className="bulk-bar fade-in">
      <span className="count">{count}</span>
      <span>dipilih</span>
      <span className="divider" />
      <button className="ba-btn" onClick={() => bulk('approve')}>
        <Icon name="check" size={12} /> {t('Approve')}
      </button>
      <button className="ba-btn" onClick={() => bulk('reject')}>
        <Icon name="x" size={12} /> {t('Reject')}
      </button>
      <button className="ba-btn" onClick={() => bulk('post')}>
        <Icon name="play" size={12} /> {t('Posting')}
      </button>
      <button className="ba-btn" onClick={() => bulk('export')}>
        <Icon name="download" size={12} /> {t('Export')}
      </button>
      <span className="divider" />
      <button className="ba-btn danger" onClick={() => bulk('delete')}>
        <Icon name="trash" size={12} /> {t('Hapus')}
      </button>
      <span className="divider" />
      <button className="ba-btn" onClick={clearSel}>
        <Icon name="x" size={12} />
      </button>
    </div>
  );
}
