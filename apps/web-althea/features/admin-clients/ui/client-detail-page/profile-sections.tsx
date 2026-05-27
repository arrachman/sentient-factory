'use client';

/**
 * Section profil klien untuk halaman detail penuh:
 * kontak / layanan saat ini / sesi berikutnya / catatan / WA opt-out.
 * Riwayat sesi TIDAK di sini — sudah digabung ke daftar booking lengkap.
 */
import { BellOff, MessageCircle } from 'lucide-react';
import type { ClientWithHistory as ClientDetail } from '../../model/types';
import { formatNextSession } from '../../model/format';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">
      {children}
    </span>
  );
}

export function ContactSection({ sel }: { sel: ClientDetail }) {
  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>Kontak</SectionLabel>
      <div className="flex items-center gap-2 text-sm">
        <MessageCircle className="h-4 w-4 text-success" />
        <span className="font-mono text-[13px]">{sel.phoneWa}</span>
      </div>
      {sel.email ? <div className="text-sm text-fg-muted truncate">{sel.email}</div> : null}
      {sel.medicalRecordNumber ? (
        <div className="text-xs text-fg-muted">
          MRN: <span className="font-mono">{sel.medicalRecordNumber}</span>
        </div>
      ) : null}
      {sel.address ? (
        <div className="text-xs text-fg-muted whitespace-pre-wrap">{sel.address}</div>
      ) : null}
    </section>
  );
}

export function ServicesSection({ sel }: { sel: ClientDetail }) {
  const services = sel.services ?? [];
  if (services.length === 0) return null;
  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>Layanan terdaftar</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {services.map((sv) => (
          <span
            key={sv.id}
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-sage-50 text-sage-700 border border-sage-200"
          >
            {sv.name}
          </span>
        ))}
      </div>
    </section>
  );
}

export function CurrentServiceSection({ sel }: { sel: ClientDetail }) {
  if (!sel.currentService) return null;
  const cs = sel.currentService;
  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>Layanan saat ini</SectionLabel>
      <div className="rounded-lg p-3 bg-cream-50 border border-border">
        <div className="text-[13.5px] font-semibold text-teal-800">{cs.name}</div>
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
                style={{ width: `${(cs.sessionN / cs.sessionTotal) * 100}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function NextSessionSection({ sel }: { sel: ClientDetail }) {
  if (!sel.nextSession) return null;
  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>Sesi berikutnya</SectionLabel>
      <div className="rounded-lg p-3 bg-sage-50 border border-sage-200">
        <div className="text-[13.5px] font-semibold text-teal-800">
          {formatNextSession(sel.nextSession.date)}
        </div>
        <div className="caption mt-0.5">
          {sel.nextSession.serviceName ?? '—'}
          {sel.nextSession.psikologName ? ` · ${sel.nextSession.psikologName}` : ''}
        </div>
      </div>
    </section>
  );
}

export function NotesSection({ notes }: { notes: string }) {
  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>Catatan internal</SectionLabel>
      <p className="text-sm text-fg-muted px-3 py-2.5 bg-cream-50 rounded-lg leading-relaxed whitespace-pre-wrap">
        {notes}
      </p>
    </section>
  );
}

export function WaOptedOutBanner() {
  return (
    <div className="rounded-md p-2.5 bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
      <BellOff className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
      <div>
        <div className="font-semibold">Notifikasi WhatsApp dimatikan</div>
        <div className="mt-0.5">
          Klien minta tidak menerima WA — hubungi manual untuk reminder & konfirmasi.
        </div>
      </div>
    </div>
  );
}
