/**
 * Tab "Profil Klinik" — identitas + kontak + lokasi + bahasa.
 *
 * Field yang sudah dibinding ke backend:
 *   clinicName, address, timezone (lewat `set` setter).
 * Field static (tagline, telepon, email, bahasa) belum punya kolom DB —
 * dipertahankan untuk fidelity mockup, akan dibinding di slice next.
 */
import type { UpdateSettingsInput } from '../../api/settings.api';
import { FieldRow } from '../shared/field-row';

export function TabKlinik({
  form,
  set,
}: {
  form: UpdateSettingsInput;
  set: <K extends keyof UpdateSettingsInput>(
    key: K,
    value: UpdateSettingsInput[K],
  ) => void;
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
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--fg-muted)' }}
          >
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
          style={{
            height: 70,
            fontSize: 13,
            padding: 10,
            resize: 'none',
            fontFamily: 'inherit',
          }}
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
        <select
          className="input-althea"
          defaultValue="id"
          style={{ maxWidth: 240, height: 36, fontSize: 13 }}
        >
          <option value="id">Bahasa Indonesia</option>
          <option value="en">English</option>
        </select>
      </FieldRow>
    </div>
  );
}
