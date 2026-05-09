'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Bell, Check, Edit, Plus } from 'lucide-react';
import { useSettings, useUpdateSettings } from '../hooks/use-settings';
import type { DayHours, UpdateSettingsInput } from '../api/settings.api';

// ============================================================================
// Types & Constants
// ============================================================================

const SETTINGS_TABS = [
  { key: 'klinik', label: 'Profil Klinik', hint: 'Identitas & kontak' },
  { key: 'jam', label: 'Jam Operasional', hint: 'Hari & jam buka' },
  { key: 'notifikasi', label: 'Notifikasi', hint: 'WhatsApp, email, reminder' },
  {
    key: 'pembayaran',
    label: 'Pembayaran',
    hint: 'Metode & invoice',
    disabled: true,
    reason: 'Add-on · tidak aktif di Paket Standard',
  },
  {
    key: 'keamanan',
    label: 'Keamanan',
    hint: 'Sesi & akses',
    disabled: true,
    reason: 'Add-on · tidak aktif di Paket Standard',
  },
] as const;

type TabKey = (typeof SETTINGS_TABS)[number]['key'];

const HARI: Array<{ key: string; label: string }> = [
  { key: 'monday', label: 'Senin' },
  { key: 'tuesday', label: 'Selasa' },
  { key: 'wednesday', label: 'Rabu' },
  { key: 'thursday', label: 'Kamis' },
  { key: 'friday', label: 'Jumat' },
  { key: 'saturday', label: 'Sabtu' },
  { key: 'sunday', label: 'Minggu' },
];

const DEFAULT_HOURS: DayHours = { open: '08:00', close: '19:00', isOpen: true };

// ============================================================================
// Shared sub-components
// ============================================================================

function FieldRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: 24,
        padding: '18px 0',
        borderBottom: '1px solid var(--border)',
        alignItems: 'start',
      }}
    >
      <div className="flex flex-col">
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>{label}</span>
        {hint && (
          <span className="caption" style={{ marginTop: 4 }}>
            {hint}
          </span>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({
  on = false,
  label,
  onChange,
}: {
  on?: boolean;
  label?: string;
  onChange?: (on: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!on)}
      className="flex items-center gap-2"
      style={{ background: 'transparent', border: 'none', padding: 0, cursor: onChange ? 'pointer' : 'default' }}
    >
      <span
        style={{
          width: 34,
          height: 20,
          borderRadius: 999,
          background: on ? 'var(--sage-500)' : 'var(--cream-300)',
          position: 'relative',
          flexShrink: 0,
          transition: 'background .15s',
          display: 'inline-block',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: on ? 16 : 2,
            width: 16,
            height: 16,
            borderRadius: 999,
            background: '#fff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
            transition: 'left .15s',
          }}
        />
      </span>
      {label && <span style={{ fontSize: 13, color: 'var(--fg)' }}>{label}</span>}
    </button>
  );
}

// ============================================================================
// Tab: Klinik (Profil)
// ============================================================================

function TabKlinik({
  form,
  set,
}: {
  form: UpdateSettingsInput;
  set: <K extends keyof UpdateSettingsInput>(key: K, value: UpdateSettingsInput[K]) => void;
}) {
  return (
    <div className="card-althea" style={{ padding: '6px 22px 22px' }}>
      <FieldRow label="Nama klinik" hint="Tampil di header dan invoice">
        <input
          className="input-althea"
          value={form.clinicName ?? ''}
          onChange={(e) => set('clinicName', e.target.value)}
          style={{ maxWidth: 380, height: 36, fontSize: 13 }}
        />
      </FieldRow>
      <FieldRow label="Logo" hint="PNG/SVG, maks 1 MB, rasio 1:1">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: 'var(--sage-500)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-serif)',
              fontWeight: 600,
              fontSize: 24,
            }}
          >
            A
          </div>
          <button type="button" className="btn btn-outline btn-sm">
            Ganti logo
          </button>
          <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--fg-muted)' }}>
            Hapus
          </button>
        </div>
      </FieldRow>
      <FieldRow label="Tagline">
        <input
          className="input-althea"
          defaultValue="Ruang aman untuk tumbuh, sembuh, dan berdaya"
          style={{ height: 36, fontSize: 13 }}
        />
      </FieldRow>
      <FieldRow label="Alamat" hint="Tampil di footer & email konfirmasi">
        <textarea
          className="input-althea"
          value={form.address ?? ''}
          onChange={(e) => set('address', e.target.value)}
          style={{ height: 70, fontSize: 13, padding: 10, resize: 'none', fontFamily: 'inherit' }}
        />
      </FieldRow>
      <FieldRow label="Telepon klinik">
        <input
          className="input-althea"
          defaultValue="+62 341 555 0123"
          style={{ maxWidth: 240, height: 36, fontSize: 13 }}
        />
      </FieldRow>
      <FieldRow label="Email">
        <input
          className="input-althea"
          defaultValue="hello@althea-psychology.id"
          style={{ maxWidth: 320, height: 36, fontSize: 13 }}
        />
      </FieldRow>
      <FieldRow label="Zona waktu">
        <select
          className="input-althea"
          value={form.timezone ?? 'Asia/Jakarta'}
          onChange={(e) => set('timezone', e.target.value)}
          style={{ maxWidth: 240, height: 36, fontSize: 13 }}
        >
          <option value="Asia/Jakarta">WIB (UTC+7)</option>
          <option value="Asia/Makassar">WITA (UTC+8)</option>
          <option value="Asia/Jayapura">WIT (UTC+9)</option>
        </select>
      </FieldRow>
      <FieldRow label="Bahasa default">
        <select className="input-althea" defaultValue="id" style={{ maxWidth: 240, height: 36, fontSize: 13 }}>
          <option value="id">Bahasa Indonesia</option>
          <option value="en">English</option>
        </select>
      </FieldRow>
    </div>
  );
}

// ============================================================================
// Tab: Jam Operasional
// ============================================================================

function TabJam({
  form,
  setDayHours,
  set,
}: {
  form: UpdateSettingsInput;
  setDayHours: (day: string, partial: Partial<DayHours>) => void;
  set: <K extends keyof UpdateSettingsInput>(key: K, value: UpdateSettingsInput[K]) => void;
}) {
  const hours = form.operatingHours ?? {};
  return (
    <div className="card-althea" style={{ padding: '6px 22px 22px' }}>
      <FieldRow label="Jam operasional" hint="Klien hanya bisa booking di rentang ini">
        <div className="flex flex-col gap-2" style={{ maxWidth: 520 }}>
          {HARI.map((d) => {
            const h = hours[d.key] ?? { ...DEFAULT_HOURS, isOpen: false };
            return (
              <div
                key={d.key}
                className="flex items-center gap-3"
                style={{
                  padding: '10px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  opacity: h.isOpen ? 1 : 0.55,
                }}
              >
                <Toggle on={h.isOpen} onChange={(v) => setDayHours(d.key, { isOpen: v })} />
                <span style={{ width: 70, fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>
                  {d.label}
                </span>
                <input
                  className="input-althea"
                  type="time"
                  value={h.open ?? '08:00'}
                  onChange={(e) => setDayHours(d.key, { open: e.target.value })}
                  disabled={!h.isOpen}
                  style={{ width: 110, height: 32, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}
                />
                <span className="caption">sampai</span>
                <input
                  className="input-althea"
                  type="time"
                  value={h.close ?? '19:00'}
                  onChange={(e) => setDayHours(d.key, { close: e.target.value })}
                  disabled={!h.isOpen}
                  style={{ width: 110, height: 32, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}
                />
                <span className="caption" style={{ marginLeft: 'auto' }}>
                  {h.isOpen ? 'Buka' : 'Tutup'}
                </span>
              </div>
            );
          })}
        </div>
      </FieldRow>
      <FieldRow label="Slot buffer" hint="Jeda otomatis antar sesi (untuk catatan & istirahat)">
        <select
          className="input-althea"
          value={String(form.bufferMinutes ?? 15)}
          onChange={(e) => set('bufferMinutes', Number(e.target.value))}
          style={{ maxWidth: 200, height: 36, fontSize: 13 }}
        >
          <option value="0">Tanpa buffer</option>
          <option value="10">10 menit</option>
          <option value="15">15 menit</option>
          <option value="30">30 menit</option>
        </select>
      </FieldRow>
      <FieldRow label="Tanggal merah" hint="Otomatis tutup pada hari libur nasional">
        <Toggle on label="Tutup otomatis pada hari libur nasional Indonesia" />
      </FieldRow>
    </div>
  );
}

// ============================================================================
// Tab: Notifikasi
// ============================================================================

type Recipient = { id: string; label: string; on: boolean };

function NotifEventRow({
  title,
  hint,
  recipients = [],
  danger = false,
  extra,
  badge,
  templates,
}: {
  title: string;
  hint?: string;
  recipients?: Recipient[];
  danger?: boolean;
  extra?: ReactNode;
  badge?: string;
  templates?: { id: string; label?: string }[];
}) {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        padding: '12px 14px',
        border: '1px solid var(--border)',
        borderRadius: 8,
        flexWrap: 'wrap',
      }}
    >
      <div className="flex flex-col" style={{ flex: 1, minWidth: 220 }}>
        <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: danger ? '#a14a4a' : 'var(--teal-800)',
            }}
          >
            {title}
          </span>
          {badge && (
            <span className="badge badge-neutral" style={{ height: 18, fontSize: 10 }}>
              {badge}
            </span>
          )}
        </div>
        {hint && (
          <span className="caption" style={{ marginTop: 2 }}>
            {hint}
          </span>
        )}
        {Array.isArray(templates) && templates.length > 0 && (
          <div className="flex gap-1 flex-wrap" style={{ marginTop: 6 }}>
            {templates.map((t) => (
              <Link
                key={t.id}
                href={{ pathname: '/admin/notif-wa', query: { tpl: t.id } }}
                className="btn btn-ghost btn-sm"
                style={{
                  height: 22,
                  padding: '0 8px',
                  fontSize: 11,
                  color: 'var(--sage-700)',
                  background: 'var(--sage-50)',
                  border: '1px solid var(--sage-200)',
                  borderRadius: 999,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  textDecoration: 'none',
                }}
                title={`Buka template editor (${t.id})`}
              >
                <Edit size={10} style={{ stroke: 'var(--sage-700)' }} /> Edit pesan
                {t.label ? <span style={{ opacity: 0.7, marginLeft: 4 }}>· {t.label}</span> : null}
              </Link>
            ))}
          </div>
        )}
      </div>
      {extra && <div style={{ flexShrink: 0 }}>{extra}</div>}
      {recipients.length > 0 && (
        <div className="flex items-center gap-3" style={{ flexShrink: 0 }}>
          {recipients.map((r) => (
            <Toggle key={r.id} on={r.on} label={r.label} />
          ))}
        </div>
      )}
    </div>
  );
}

function Sel({
  defaultValue,
  options,
  width = 130,
}: {
  defaultValue: string;
  options: [string, string][];
  width?: number;
}) {
  return (
    <select
      className="input-althea"
      defaultValue={defaultValue}
      style={{ width, height: 32, fontSize: 12 }}
    >
      {options.map(([v, label]) => (
        <option key={v} value={v}>
          {label}
        </option>
      ))}
    </select>
  );
}

function TabNotifikasi({
  form,
  set,
}: {
  form: UpdateSettingsInput;
  set: <K extends keyof UpdateSettingsInput>(key: K, value: UpdateSettingsInput[K]) => void;
}) {
  return (
    <div className="card-althea" style={{ padding: '6px 22px 22px' }}>
      {/* Status koneksi WA */}
      <FieldRow label="Koneksi WhatsApp" hint="API resmi — semua notif kirim dari nomor ini">
        <div className="flex flex-col gap-2" style={{ maxWidth: 580 }}>
          <div
            className="flex items-center gap-2"
            style={{
              padding: '10px 14px',
              background: 'var(--success-soft)',
              border: '1px solid #c8e0ce',
              borderRadius: 8,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: 'var(--success)',
                boxShadow: '0 0 0 4px rgba(79,140,91,0.18)',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)', flex: 1 }}>
              {form.waSendEnabled ? 'Tersambung' : 'Tidak aktif'} · WA Business {form.waCountryCode ?? '+62'} 822 1100 8899
            </span>
            <span className="badge badge-success">terverifikasi</span>
          </div>
          <Link
            href="/admin/notif-wa"
            className="caption"
            style={{ color: 'var(--sage-700)', cursor: 'pointer', fontSize: 11.5 }}
          >
            Buka halaman Notifikasi WA · Log & template untuk edit isi pesan →
          </Link>
        </div>
      </FieldRow>

      <FieldRow
        label="Aktifkan kirim WA"
        hint="Master toggle. Kalau off, semua dispatch di-skip dan ditandai gagal."
      >
        <Toggle
          on={form.waSendEnabled ?? false}
          label={form.waSendEnabled ? 'Aktif' : 'Nonaktif'}
          onChange={(v) => set('waSendEnabled', v)}
        />
      </FieldRow>

      {/* 1. Pengingat sesi otomatis */}
      <FieldRow
        label="Pengingat sesi otomatis"
        hint="Dijadwalkan otomatis berdasarkan booking. Edit isi pesan via Notifikasi WA · Template."
      >
        <div className="flex flex-col gap-2" style={{ maxWidth: 580 }}>
          <NotifEventRow
            title="Konfirmasi booking"
            hint="Trigger: saat admin selesai jadwalkan klien"
            templates={[{ id: 't-konfirm' }]}
            recipients={[
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
            ]}
          />
          <NotifEventRow
            title="Pengingat H-1"
            hint="Trigger: 24 jam sebelum sesi"
            templates={[{ id: 't-h1' }]}
            extra={
              <div className="flex items-center gap-1">
                <span className="caption" style={{ fontSize: 11 }}>
                  kirim pukul
                </span>
                <input
                  className="input-althea"
                  defaultValue="18:00"
                  style={{
                    width: 70,
                    height: 32,
                    fontSize: 12,
                    fontVariantNumeric: 'tabular-nums',
                    textAlign: 'center',
                  }}
                />
              </div>
            }
            recipients={[
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
            ]}
          />
          <NotifEventRow
            title="Pengingat 30 menit"
            hint="Trigger: 30 menit sebelum sesi (PRD BR-08)"
            templates={[{ id: 't-30m' }]}
            badge="BR-08"
            recipients={[
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
            ]}
          />
          <NotifEventRow
            title="Follow-up pasca sesi"
            hint="Ucapan terima kasih + permintaan feedback (opsi: lampirkan bukti pembayaran)"
            templates={[{ id: 't-followup' }]}
            extra={
              <Sel
                defaultValue="3"
                options={[
                  ['1', '1 jam setelah'],
                  ['3', '3 jam setelah'],
                  ['24', '1 hari setelah'],
                ]}
              />
            }
            recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
          />
          <NotifEventRow
            title="Pengingat sesi lanjutan"
            hint="Untuk paket multi-sesi yang sesinya belum dijadwal"
            templates={[{ id: 't-lanjutan' }]}
            extra={
              <Sel
                defaultValue="7"
                options={[
                  ['3', 'H+3'],
                  ['7', 'H+7'],
                  ['14', 'H+14'],
                ]}
                width={90}
              />
            }
            recipients={[{ id: 'klien', label: 'WA klien', on: false }]}
          />
          <NotifEventRow
            title="Paket akan habis"
            hint="Trigger: saat sesi tersisa ≤ 1 dari paket — tawarkan paket lanjutan"
            templates={[{ id: 't-paket-habis' }]}
            recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
          />
          <NotifEventRow
            title="Pengingat minggu kosong (psikolog)"
            hint="Kirim WA ke psikolog kalau minggu kerja mendatang masih banyak slot kosong."
            badge="psikolog"
            templates={[{ id: 't-week-empty' }]}
            extra={
              <div className="flex items-center gap-1 flex-wrap">
                <span className="caption" style={{ fontSize: 11 }}>
                  kirim
                </span>
                <Sel
                  defaultValue="3"
                  options={[
                    ['1', 'H-1'],
                    ['3', 'H-3'],
                    ['5', 'H-5'],
                    ['7', 'H-7'],
                  ]}
                  width={78}
                />
                <span className="caption" style={{ fontSize: 11 }}>
                  jika kosong ≥
                </span>
                <Sel
                  defaultValue="50"
                  options={[
                    ['30', '30%'],
                    ['50', '50%'],
                    ['70', '70%'],
                    ['80', '80%'],
                  ]}
                  width={78}
                />
              </div>
            }
            recipients={[{ id: 'psikolog', label: 'WA psikolog', on: true }]}
          />
        </div>
      </FieldRow>

      {/* 2. Perubahan jadwal */}
      <FieldRow
        label="Perubahan jadwal sesi"
        hint="Dipicu manual saat admin ubah jadwal. Default: kirim ke klien & psikolog."
      >
        <div className="flex flex-col gap-2" style={{ maxWidth: 580 }}>
          <NotifEventRow
            title="Ubah jadwal sesi (reschedule)"
            hint="Kirim pesan jadwal baru ke kedua pihak."
            templates={[
              { id: 't-resched-k', label: 'klien' },
              { id: 't-resched-p', label: 'psikolog' },
            ]}
            recipients={[
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
            ]}
          />
          <NotifEventRow
            title="Batalkan sesi"
            hint="Kirim alasan + slot kosong."
            danger
            templates={[
              { id: 't-cancel-k', label: 'klien' },
              { id: 't-cancel-p', label: 'psikolog' },
            ]}
            recipients={[
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
            ]}
          />
          <NotifEventRow
            title="Ubah ruangan saja (psikolog & jam tetap)"
            hint="Kirim pemberitahuan ruangan baru tanpa mengubah jadwal."
            templates={[
              { id: 't-ruangan-k', label: 'klien' },
              { id: 't-ruangan-p', label: 'psikolog' },
            ]}
            recipients={[
              { id: 'klien', label: 'WA klien', on: true },
              { id: 'psikolog', label: 'WA psikolog', on: true },
            ]}
          />
          <NotifEventRow
            title="Ubah layanan klien (silent edit)"
            hint="Default: tidak kirim WA — admin tidak perlu kontak psikolog manual."
            recipients={[
              { id: 'klien', label: 'WA klien', on: false },
              { id: 'psikolog', label: 'WA psikolog', on: false },
            ]}
          />
          <div
            className="flex gap-2"
            style={{
              padding: 10,
              background: 'var(--info-soft)',
              borderRadius: 6,
              alignItems: 'flex-start',
              marginTop: 4,
            }}
          >
            <Bell size={13} style={{ color: 'var(--info)', flexShrink: 0, marginTop: 2 }} />
            <span className="caption" style={{ fontSize: 11.5, color: '#2c4a60', lineHeight: 1.5 }}>
              Mematikan WA ke psikolog tidak menonaktifkan notifikasi in-app — psikolog tetap melihat update di Dashboard mereka.
            </span>
          </div>
        </div>
      </FieldRow>

      {/* 3. Onboarding */}
      <FieldRow label="Onboarding & akun" hint="Pesan WA terkait pendaftaran klien dan akun staff">
        <div className="flex flex-col gap-2" style={{ maxWidth: 580 }}>
          <NotifEventRow
            title="Selamat datang klien baru"
            hint="Trigger: setelah klien disimpan pertama kali"
            templates={[{ id: 't-welcome' }]}
            recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
          />
          <NotifEventRow
            title="Invite user baru (admin / psikolog / staff)"
            hint="Link aktivasi akun + kata sandi awal"
            templates={[{ id: 't-invite' }]}
            recipients={[{ id: 'staff', label: 'WA staff', on: true }]}
          />
          <NotifEventRow
            title="OTP login (lupa password)"
            hint="Kode 6 digit untuk reset kata sandi (mobile flow)"
            templates={[{ id: 't-otp' }]}
            recipients={[{ id: 'user', label: 'WA user', on: true }]}
          />
        </div>
      </FieldRow>

      {/* 4. Pembayaran (notif) */}
      <FieldRow label="Pembayaran" hint="Notifikasi WA terkait DP, pelunasan, dan bukti pembayaran">
        <div className="flex flex-col gap-2" style={{ maxWidth: 580 }}>
          <NotifEventRow
            title="Tagihan DP setelah booking"
            hint="Kirim instruksi pembayaran DP ke klien"
            templates={[{ id: 't-dp' }]}
            recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
          />
          <NotifEventRow
            title="Bukti pembayaran (PDF) setelah pelunasan"
            hint="Lampirkan invoice PDF di pesan WA"
            badge="add-on"
            templates={[{ id: 't-bukti-bayar' }]}
            recipients={[{ id: 'klien', label: 'WA klien', on: false }]}
          />
          <NotifEventRow
            title="Pengingat pelunasan"
            hint="Kalau klien belum lunas H-1 sebelum sesi"
            templates={[{ id: 't-pelunasan' }]}
            recipients={[{ id: 'klien', label: 'WA klien', on: true }]}
          />
        </div>
      </FieldRow>

      {/* 5. Pengiriman & retry */}
      <FieldRow label="Pengiriman & retry" hint="Bagaimana sistem menangani pengiriman & kegagalan">
        <div className="flex flex-col gap-3" style={{ maxWidth: 580 }}>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex flex-col" style={{ flex: 1, minWidth: 220 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Pengirim WA</span>
              <span className="caption" style={{ marginTop: 2 }}>
                Nomor terdaftar di WA Business API
              </span>
            </div>
            <input
              className="input-althea"
              defaultValue="+62 822 1100 8899"
              style={{ width: 200, height: 32, fontSize: 12 }}
            />
            <span className="badge badge-success">terverifikasi</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex flex-col" style={{ flex: 1, minWidth: 220 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>
                Jumlah retry otomatis
              </span>
              <span className="caption" style={{ marginTop: 2 }}>
                Coba kirim ulang kalau gagal
              </span>
            </div>
            <Sel
              defaultValue="3"
              options={[
                ['0', 'Tidak retry'],
                ['1', '1 kali'],
                ['3', '3 kali'],
                ['5', '5 kali'],
              ]}
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex flex-col" style={{ flex: 1, minWidth: 220 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Jeda antar retry</span>
              <span className="caption" style={{ marginTop: 2 }}>
                Tunggu sekian lama sebelum coba lagi
              </span>
            </div>
            <Sel
              defaultValue="5"
              options={[
                ['1', '1 menit'],
                ['5', '5 menit'],
                ['15', '15 menit'],
                ['60', '1 jam'],
              ]}
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex flex-col" style={{ flex: 1, minWidth: 220 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>Jam pengiriman</span>
              <span className="caption" style={{ marginTop: 2 }}>
                Di luar jam ini, pesan masuk antrian sampai pagi
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="input-althea"
                defaultValue="07:00"
                style={{
                  width: 70,
                  height: 32,
                  fontSize: 12,
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: 'center',
                }}
              />
              <span className="caption">sampai</span>
              <input
                className="input-althea"
                defaultValue="21:00"
                style={{
                  width: 70,
                  height: 32,
                  fontSize: 12,
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: 'center',
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex flex-col" style={{ flex: 1, minWidth: 220 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>
                Notif gagal kirim ke admin
              </span>
              <span className="caption" style={{ marginTop: 2 }}>
                Email harian rangkuman pesan yang gagal terkirim
              </span>
            </div>
            <Toggle on label="Aktif" />
          </div>
        </div>
      </FieldRow>

      {/* 6. Email & Telegram */}
      <FieldRow label="Email" hint="Untuk invoice & rekap mingguan">
        <div className="flex flex-col gap-3">
          <Toggle on label="Kirim invoice PDF setelah pembayaran" />
          <Toggle on label="Rekap mingguan ke admin (Senin pagi)" />
          <Toggle label="Rekap bulanan ke psikolog" />
        </div>
      </FieldRow>
      <FieldRow label="Telegram bot" hint="Notifikasi internal untuk admin">
        <button type="button" className="btn btn-outline btn-sm">
          <Plus size={13} /> Sambungkan Telegram
        </button>
      </FieldRow>

      {/* Country Code (kept for backend binding) */}
      <FieldRow label="Default Country Code" hint="Prefix nomor WA untuk normalisasi">
        <input
          className="input-althea"
          value={form.waCountryCode ?? '+62'}
          onChange={(e) => set('waCountryCode', e.target.value)}
          style={{ maxWidth: 120, height: 36, fontSize: 13 }}
        />
      </FieldRow>
    </div>
  );
}

// ============================================================================
// Tab: Pembayaran (disabled add-on placeholder)
// ============================================================================

function TabPembayaranDisabled() {
  return (
    <div
      className="card-althea"
      style={{
        padding: 32,
        textAlign: 'center',
        background: 'var(--cream-100)',
      }}
    >
      <div
        className="badge badge-neutral"
        style={{ marginBottom: 12, padding: '4px 10px', fontSize: 11 }}
      >
        ADD-ON
      </div>
      <h2 className="h2" style={{ marginBottom: 6 }}>
        Pembayaran
      </h2>
      <p className="caption" style={{ maxWidth: 480, margin: '0 auto' }}>
        Konfigurasi metode pembayaran (transfer, QRIS, Midtrans), DP wajib, format invoice, dan PPN
        korporat. <strong>Tidak aktif di Paket Standard</strong> — bisa dibuka sebagai add-on di
        fase berikutnya.
      </p>
    </div>
  );
}

// ============================================================================
// Tab: Keamanan (disabled add-on placeholder)
// ============================================================================

function TabKeamananDisabled() {
  return (
    <div
      className="card-althea"
      style={{
        padding: 32,
        textAlign: 'center',
        background: 'var(--cream-100)',
      }}
    >
      <div
        className="badge badge-neutral"
        style={{ marginBottom: 12, padding: '4px 10px', fontSize: 11 }}
      >
        ADD-ON
      </div>
      <h2 className="h2" style={{ marginBottom: 6 }}>
        Keamanan
      </h2>
      <p className="caption" style={{ maxWidth: 480, margin: '0 auto' }}>
        Sesi login, two-factor auth, aturan kata sandi, retensi audit log, dan zona berbahaya
        (ekspor/hapus data klinik). <strong>Tidak aktif di Paket Standard</strong> — bisa dibuka
        sebagai add-on di fase berikutnya.
      </p>
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

export function PengaturanPage() {
  const settingsQuery = useSettings();
  const updateMut = useUpdateSettings();
  const [tab, setTab] = useState<TabKey>('klinik');
  const [form, setForm] = useState<UpdateSettingsInput>({});

  useEffect(() => {
    const s = settingsQuery.data?.data;
    if (s) {
      setForm({
        clinicName: s.clinicName,
        address: s.address ?? '',
        timezone: s.timezone,
        currency: s.currency,
        operatingHours: s.operatingHours,
        holidays: s.holidays,
        bufferMinutes: s.bufferMinutes,
        taxEnabled: s.taxEnabled,
        taxPercentage: Number(s.taxPercentage),
        dpPercentage: Number(s.dpPercentage),
        waSendEnabled: s.waSendEnabled,
        waCountryCode: s.waCountryCode,
      });
    }
  }, [settingsQuery.data?.data]);

  function set<K extends keyof UpdateSettingsInput>(key: K, value: UpdateSettingsInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setDayHours(day: string, partial: Partial<DayHours>) {
    const hours = { ...(form.operatingHours ?? {}) };
    hours[day] = { ...DEFAULT_HOURS, ...hours[day], ...partial };
    set('operatingHours', hours);
  }

  const lastSaved = useMemo(() => {
    if (updateMut.isSuccess) return 'baru saja';
    if (settingsQuery.dataUpdatedAt) {
      const diffMs = Date.now() - settingsQuery.dataUpdatedAt;
      const min = Math.max(0, Math.floor(diffMs / 60000));
      if (min < 1) return 'baru saja';
      if (min < 60) return `${min} menit lalu`;
      const hr = Math.floor(min / 60);
      if (hr < 24) return `${hr} jam lalu`;
      return `${Math.floor(hr / 24)} hari lalu`;
    }
    return '—';
  }, [settingsQuery.dataUpdatedAt, updateMut.isSuccess]);

  if (settingsQuery.isLoading) {
    return <div className="caption">Memuat pengaturan...</div>;
  }
  if (settingsQuery.error) {
    return (
      <div className="card-althea p-6 text-center" style={{ color: 'var(--danger, #b54141)' }}>
        Gagal memuat: {(settingsQuery.error as Error).message}
      </div>
    );
  }

  function handleSave() {
    updateMut.mutate(form);
  }

  function handleReset() {
    const s = settingsQuery.data?.data;
    if (!s) return;
    setForm({
      clinicName: s.clinicName,
      address: s.address ?? '',
      timezone: s.timezone,
      currency: s.currency,
      operatingHours: s.operatingHours,
      holidays: s.holidays,
      bufferMinutes: s.bufferMinutes,
      taxEnabled: s.taxEnabled,
      taxPercentage: Number(s.taxPercentage),
      dpPercentage: Number(s.dpPercentage),
      waSendEnabled: s.waSendEnabled,
      waCountryCode: s.waCountryCode,
    });
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 100px)' }}>
      {/* Header bar: status + actions (title provided by AdminShell top header) */}
      <div
        style={{
          padding: '18px 28px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span className="caption">
          Perubahan disimpan saat klik tombol · terakhir{' '}
          <strong style={{ color: 'var(--teal-800)' }}>{lastSaved}</strong>
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={updateMut.isPending}
            className="btn btn-ghost btn-sm"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={updateMut.isPending}
            className="btn btn-primary btn-sm"
          >
            <Check size={14} style={{ stroke: '#fff' }} /> {updateMut.isPending ? 'Menyimpan...' : 'Simpan perubahan'}
          </button>
        </div>
      </div>

      {/* Tab layout: sidebar + content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: 22,
          padding: '16px 28px 28px',
          flex: 1,
          minHeight: 0,
        }}
      >
        <nav className="flex flex-col gap-1" style={{ alignSelf: 'start', position: 'sticky', top: 0 }}>
          <div className="eyebrow" style={{ padding: '4px 10px' }}>
            Bagian
          </div>
          {SETTINGS_TABS.map((t) => {
            const isActive = tab === t.key && !('disabled' in t && t.disabled);
            const isDisabled = 'disabled' in t && t.disabled;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setTab(t.key);
                }}
                className={'nav-item' + (isActive ? ' active' : '')}
                style={{
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  alignItems: 'flex-start',
                  padding: '10px 12px',
                  opacity: isDisabled ? 0.55 : 1,
                  position: 'relative',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  width: '100%',
                }}
                title={isDisabled && 'reason' in t ? t.reason : ''}
              >
                <div className="flex flex-col" style={{ gap: 2 }}>
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isDisabled ? 'var(--fg-muted)' : 'inherit',
                      }}
                    >
                      {t.label}
                    </span>
                    {isDisabled && (
                      <span
                        className="badge"
                        style={{
                          height: 16,
                          fontSize: 9,
                          padding: '0 6px',
                          background: 'var(--cream-200)',
                          color: 'var(--fg-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          fontWeight: 600,
                        }}
                      >
                        add-on
                      </span>
                    )}
                  </div>
                  <span className="caption" style={{ fontSize: 11.5 }}>
                    {isDisabled && 'reason' in t ? t.reason : t.hint}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        <div style={{ overflowY: 'auto' }}>
          {tab === 'klinik' && <TabKlinik form={form} set={set} />}
          {tab === 'jam' && <TabJam form={form} setDayHours={setDayHours} set={set} />}
          {tab === 'notifikasi' && <TabNotifikasi form={form} set={set} />}
          {tab === 'pembayaran' && <TabPembayaranDisabled />}
          {tab === 'keamanan' && <TabKeamananDisabled />}
        </div>
      </div>
    </div>
  );
}
