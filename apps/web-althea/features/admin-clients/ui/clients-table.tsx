'use client';

/**
 * Tabel klien — kolom: Nama / Layanan / Psikolog / Sesi terakhir /
 * Sesi berikutnya / Status. Row hover & selected ada styling khusus.
 */
import {
  CATEGORY_LABEL,
  CATEGORY_PALETTE,
  STATUS_BADGE,
  STATUS_LABEL,
  type Client,
} from '../model/types';
import { formatDate, formatNextSession } from '../model/format';
import { ClientAvatar } from './client-avatar';

const COL_TPL = '2fr 1.5fr 1.3fr 1.4fr 1.4fr 90px';

export function ClientsTable({
  items,
  isLoading,
  totalCount,
  selectedId,
  onSelect,
}: {
  items: Client[];
  isLoading: boolean;
  totalCount: number;
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="card-althea overflow-hidden flex-1 min-h-0 flex flex-col bg-card">
      <TableHeader />
      <div className="overflow-y-auto flex-1">
        {isLoading ? (
          <div className="px-4 py-8 text-center text-fg-muted">
            Memuat klien...
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-12 text-center text-fg-muted">
            Belum ada klien sesuai filter.
          </div>
        ) : (
          items.map((c) => (
            <ClientRow
              key={c.id}
              client={c}
              isSelected={selectedId === c.id}
              onClick={() => onSelect(c.id)}
            />
          ))
        )}
      </div>
      <div className="px-4 py-2.5 border-t border-border flex justify-between items-center">
        <span className="caption">
          Menampilkan {items.length} dari {totalCount} klien
        </span>
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div
      className="grid items-center px-4 py-2 bg-cream-50 border-b border-border text-[11px] font-semibold text-fg-muted uppercase tracking-wider"
      style={{ gridTemplateColumns: COL_TPL }}
    >
      <span>Nama</span>
      <span>Layanan aktif</span>
      <span>Psikolog</span>
      <span>Sesi terakhir</span>
      <span>Sesi berikutnya</span>
      <span>Status</span>
    </div>
  );
}

function ClientRow({
  client: c,
  isSelected,
  onClick,
}: {
  client: Client;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid items-center w-full text-left px-4 py-3 border-b border-border transition-colors ${
        isSelected
          ? 'bg-sage-50 border-l-[3px] border-l-sage-500 pl-[13px]'
          : 'border-l-[3px] border-l-transparent hover:bg-cream-50'
      }`}
      style={{ gridTemplateColumns: COL_TPL }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <ClientAvatar
          name={c.name}
          category={c.category ?? undefined}
          size="md"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-[13.5px] font-semibold text-teal-800 truncate">
            {c.name}
          </span>
          <span className="text-[11.5px] text-fg-muted flex items-center gap-1.5">
            {c.age ? <span>{c.age} thn</span> : null}
            {c.category ? (
              <span
                className="px-1.5 py-[1px] rounded text-[10.5px] font-medium"
                style={{
                  background: CATEGORY_PALETTE[c.category].bg,
                  color: CATEGORY_PALETTE[c.category].fg,
                }}
              >
                {CATEGORY_LABEL[c.category]}
              </span>
            ) : null}
          </span>
        </div>
      </div>
      <span className="text-[12.5px] text-fg truncate">
        {c.currentService?.name ?? '—'}
        {c.currentService && c.currentService.sessionTotal > 1 ? (
          <span className="text-fg-muted">
            {' '}
            · {c.currentService.sessionN}/{c.currentService.sessionTotal}
          </span>
        ) : null}
      </span>
      <span className="text-[12.5px] text-fg truncate">
        {c.currentService?.psikologName ?? '—'}
      </span>
      <span className="text-[12.5px] text-fg-muted">
        {c.lastSession ? formatDate(c.lastSession.date) : '—'}
      </span>
      <span
        className={`text-[12.5px] ${
          c.nextSession ? 'text-teal-800 font-medium' : 'text-fg-muted'
        }`}
      >
        {c.nextSession ? formatNextSession(c.nextSession.date) : '—'}
      </span>
      <span
        className={`badge ${STATUS_BADGE[c.derivedStatus]} capitalize text-[11px]`}
      >
        {STATUS_LABEL[c.derivedStatus]}
      </span>
    </button>
  );
}
