'use client';

/**
 * Detail aside klien — header (avatar + nama + kategori + actions),
 * lalu sections: kontak / layanan saat ini / sesi berikutnya / riwayat /
 * catatan / WA opt-out warning.
 */
import {
  BellOff,
  Calendar,
  MessageCircle,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { CATEGORY_LABEL, type ClientWithHistory as ClientDetail } from '../model/types';
import { formatDate, formatNextSession } from '../model/format';
import { ClientAvatar } from './client-avatar';

export function ClientDetailAside({
  isLoading,
  detail,
  onClose,
  onEdit,
  onDelete,
}: {
  isLoading: boolean;
  detail: ClientDetail | null;
  onClose: () => void;
  onEdit: (c: ClientDetail) => void;
  onDelete: (c: ClientDetail) => void;
}) {
  return (
    <aside className="w-[360px] border-l border-border bg-card flex flex-col flex-shrink-0">
      {isLoading || !detail ? (
        <div className="p-6 text-center text-fg-muted">
          Memuat detail klien...
        </div>
      ) : (
        <>
          <DetailHeader
            sel={detail}
            onClose={onClose}
            onEdit={() => onEdit(detail)}
            onDelete={() => onDelete(detail)}
          />
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
            <ContactSection sel={detail} />
            {detail.currentService ? (
              <CurrentServiceSection sel={detail} />
            ) : null}
            {detail.nextSession ? (
              <NextSessionSection sel={detail} />
            ) : null}
            <HistorySection sel={detail} />
            {detail.notes ? <NotesSection notes={detail.notes} /> : null}
            {detail.waOptedOut ? <WaOptedOutBanner /> : null}
          </div>
        </>
      )}
    </aside>
  );
}

// =====================================================================
// Sections
// =====================================================================

function DetailHeader({
  sel,
  onClose,
  onEdit,
  onDelete,
}: {
  sel: ClientDetail;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="p-5 border-b border-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">
          Detail klien
        </span>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost btn-icon btn-sm w-[30px]"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <ClientAvatar
          name={sel.name}
          category={sel.category ?? undefined}
          size="lg"
        />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-base font-semibold text-teal-800 font-serif truncate">
            {sel.name}
          </span>
          <span className="caption">
            {sel.age ? `${sel.age} tahun` : ''}
            {sel.age && sel.category ? ' · ' : ''}
            {sel.category ? (
              <span className="capitalize">
                {CATEGORY_LABEL[sel.category]}
              </span>
            ) : null}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={`/admin/booking?clientId=${sel.id}`}
          className="btn btn-primary btn-sm flex-1"
        >
          <Calendar className="h-4 w-4" /> Jadwalkan
        </a>
        <a
          href={`https://wa.me/${sel.phoneWa.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline btn-sm btn-icon"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
        <button
          type="button"
          onClick={onEdit}
          className="btn btn-outline btn-sm btn-icon"
          aria-label="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="btn btn-outline btn-sm btn-icon text-danger"
          aria-label="Hapus"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ContactSection({ sel }: { sel: ClientDetail }) {
  return (
    <section className="flex flex-col gap-2">
      <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">
        Kontak
      </span>
      <div className="flex items-center gap-2 text-sm">
        <MessageCircle className="h-4 w-4 text-success" />
        <span className="font-mono text-[13px]">{sel.phoneWa}</span>
      </div>
      {sel.email ? (
        <div className="text-sm text-fg-muted truncate">{sel.email}</div>
      ) : null}
      {sel.medicalRecordNumber ? (
        <div className="text-xs text-fg-muted">
          MRN:{' '}
          <span className="font-mono">{sel.medicalRecordNumber}</span>
        </div>
      ) : null}
    </section>
  );
}

function CurrentServiceSection({ sel }: { sel: ClientDetail }) {
  if (!sel.currentService) return null;
  const cs = sel.currentService;
  return (
    <section className="flex flex-col gap-2">
      <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">
        Layanan saat ini
      </span>
      <div className="rounded-lg p-3 bg-cream-50 border border-border">
        <div className="text-[13.5px] font-semibold text-teal-800">
          {cs.name}
        </div>
        {cs.psikologName ? (
          <div className="caption mt-0.5">Psikolog: {cs.psikologName}</div>
        ) : null}
        {cs.sessionTotal > 1 ? (
          <div className="mt-2.5">
            <div className="flex justify-between mb-1">
              <span className="caption">Progres</span>
              <span className="caption font-semibold text-teal-800">
                sesi {cs.sessionN}/{cs.sessionTotal}
              </span>
            </div>
            <div className="h-1 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-sage-500 rounded-full transition-all"
                style={{
                  width: `${(cs.sessionN / cs.sessionTotal) * 100}%`,
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function NextSessionSection({ sel }: { sel: ClientDetail }) {
  if (!sel.nextSession) return null;
  return (
    <section className="flex flex-col gap-2">
      <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">
        Sesi berikutnya
      </span>
      <div className="rounded-lg p-3 bg-sage-50 border border-sage-200">
        <div className="text-[13.5px] font-semibold text-teal-800">
          {formatNextSession(sel.nextSession.date)}
        </div>
        <div className="caption mt-0.5">
          {sel.nextSession.serviceName ?? '—'}
          {sel.nextSession.psikologName
            ? ` · ${sel.nextSession.psikologName}`
            : ''}
        </div>
      </div>
    </section>
  );
}

function HistorySection({ sel }: { sel: ClientDetail }) {
  return (
    <section className="flex flex-col gap-2">
      <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">
        Riwayat sesi ({sel.recentSessions.length})
      </span>
      {sel.recentSessions.length === 0 ? (
        <p className="caption italic text-fg-muted">
          Belum ada riwayat sesi selesai.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {sel.recentSessions.map((s) => (
            <div
              key={s.id}
              className="rounded-md p-2.5 bg-cream-50 border border-border"
            >
              <div className="flex justify-between items-center">
                <span className="text-[12.5px] font-semibold text-teal-800">
                  {formatDate(s.date)}
                </span>
                <span className="badge badge-success text-[10px] h-[18px]">
                  {s.status}
                </span>
              </div>
              <span className="caption mt-0.5 block truncate">
                {s.serviceName ?? '—'}
                {s.psikologName ? ` · ${s.psikologName}` : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function NotesSection({ notes }: { notes: string }) {
  return (
    <section className="flex flex-col gap-2">
      <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">
        Catatan internal
      </span>
      <p className="text-sm text-fg-muted px-3 py-2.5 bg-cream-50 rounded-lg leading-relaxed whitespace-pre-wrap">
        {notes}
      </p>
    </section>
  );
}

function WaOptedOutBanner() {
  return (
    <div className="rounded-md p-2.5 bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
      <BellOff className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
      <div>
        <div className="font-semibold">Notifikasi WhatsApp dimatikan</div>
        <div className="mt-0.5">
          Klien minta tidak menerima WA — hubungi manual untuk reminder &
          konfirmasi.
        </div>
      </div>
    </div>
  );
}
