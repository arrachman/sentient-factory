'use client';

/**
 * Section profil klien untuk halaman detail penuh — mirror semua field di
 * form Tambah / Edit klien. Field opsional tetap dirender dengan placeholder
 * "—" supaya admin tahu data apa yang masih kosong dan field apa yang ada.
 *
 * Riwayat sesi TIDAK di sini — sudah digabung ke daftar booking lengkap.
 */
import { BellOff, MessageCircle } from 'lucide-react';
import {
  CATEGORY_LABEL,
  GENDER_LABEL,
  type ClientWithHistory as ClientDetail,
} from '../../model/types';
import { formatNextSession } from '../../model/format';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">
      {children}
    </span>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode | null | undefined;
  mono?: boolean;
}) {
  const empty = value === null || value === undefined || value === '';
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider font-semibold text-fg-muted">
        {label}
      </span>
      {empty ? (
        <span className="text-sm italic text-fg-muted">—</span>
      ) : (
        <span className={`text-sm text-teal-800 ${mono ? 'font-mono' : ''}`}>{value}</span>
      )}
    </div>
  );
}

export function IdentitySection({ sel }: { sel: ClientDetail }) {
  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>Identitas</SectionLabel>
      <div className="grid grid-cols-2 gap-3 rounded-lg p-3 bg-cream-50 border border-border">
        <Field label="Gender" value={GENDER_LABEL[sel.gender]} />
        <Field label="Umur" value={sel.age != null ? `${sel.age} tahun` : null} />
        <Field
          label="Kategori"
          value={sel.category ? CATEGORY_LABEL[sel.category] : null}
        />
        <Field label="MRN" value={sel.medicalRecordNumber || null} mono />
      </div>
    </section>
  );
}

export function ContactSection({ sel }: { sel: ClientDetail }) {
  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>Kontak</SectionLabel>
      <div className="flex flex-col gap-2.5 rounded-lg p-3 bg-cream-50 border border-border">
        <div className="flex items-start gap-2">
          <MessageCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
          <Field label="WhatsApp" value={sel.phoneWa} mono />
        </div>
        <Field label="Email" value={sel.email || null} />
        <Field
          label="Alamat"
          value={
            sel.address ? (
              <span className="whitespace-pre-wrap">{sel.address}</span>
            ) : null
          }
        />
      </div>
    </section>
  );
}

export function ServicesSection({ sel }: { sel: ClientDetail }) {
  const services = sel.services ?? [];
  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>Layanan yang diminati</SectionLabel>
      {services.length === 0 ? (
        <div className="text-sm italic text-fg-muted px-3 py-2.5 bg-cream-50 rounded-lg border border-border">
          Belum ada layanan terdaftar.
        </div>
      ) : (
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
      )}
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

export function NotesSection({ notes }: { notes: string | null }) {
  const empty = !notes || !notes.trim();
  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>Catatan internal</SectionLabel>
      <p
        className={`text-sm px-3 py-2.5 bg-cream-50 rounded-lg leading-relaxed whitespace-pre-wrap border border-border ${
          empty ? 'italic text-fg-muted' : 'text-fg-muted'
        }`}
      >
        {empty ? 'Belum ada catatan.' : notes}
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

export function InactiveBanner() {
  return (
    <div className="rounded-md p-2.5 bg-neutral-100 border border-border text-xs text-fg-muted flex items-start gap-2">
      <div className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 rounded-full bg-neutral-400" />
      <div>
        <div className="font-semibold text-fg">Klien nonaktif</div>
        <div className="mt-0.5">
          Tidak muncul di pilihan booking baru. Histori sesi tetap tersimpan
          untuk audit.
        </div>
      </div>
    </div>
  );
}
