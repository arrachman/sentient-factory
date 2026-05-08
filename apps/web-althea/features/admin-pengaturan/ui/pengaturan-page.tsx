'use client';

import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useSettings, useUpdateSettings } from '../hooks/use-settings';
import type { DayHours, UpdateSettingsInput } from '../api/settings.api';

const DAYS: Array<{ key: string; label: string }> = [
  { key: 'monday', label: 'Senin' },
  { key: 'tuesday', label: 'Selasa' },
  { key: 'wednesday', label: 'Rabu' },
  { key: 'thursday', label: 'Kamis' },
  { key: 'friday', label: 'Jumat' },
  { key: 'saturday', label: 'Sabtu' },
  { key: 'sunday', label: 'Minggu' },
];

const DEFAULT_HOURS: DayHours = { open: '09:00', close: '18:00', isOpen: true };

export function PengaturanPage() {
  const settingsQuery = useSettings();
  const updateMut = useUpdateSettings();

  const [form, setForm] = useState<UpdateSettingsInput>({});
  const [newHoliday, setNewHoliday] = useState('');

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

  function addHoliday() {
    if (!newHoliday) return;
    const list = form.holidays ?? [];
    if (list.includes(newHoliday)) return;
    set('holidays', [...list, newHoliday].sort());
    setNewHoliday('');
  }

  function removeHoliday(date: string) {
    set('holidays', (form.holidays ?? []).filter((h) => h !== date));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    updateMut.mutate(form);
  }

  if (settingsQuery.isLoading) {
    return <div className="caption">Memuat pengaturan...</div>;
  }
  if (settingsQuery.error) {
    return (
      <div className="card-althea p-6 text-center text-danger">
        Gagal memuat: {(settingsQuery.error as Error).message}
      </div>
    );
  }

  const hours = form.operatingHours ?? {};

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Pengaturan Klinik</h1>
          <p className="caption mt-1">
            Konfigurasi global: jam operasional, tax, DP, buffer, holidays, WA toggle.
          </p>
        </div>
        <button type="submit" disabled={updateMut.isPending} className="btn btn-primary">
          <Save className="h-4 w-4" /> {updateMut.isPending ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      {/* Identitas Klinik */}
      <section className="card-althea p-6 space-y-3">
        <h2 className="h2">Identitas Klinik</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="caption mb-1 block">Nama Klinik</label>
            <input
              value={form.clinicName ?? ''}
              onChange={(e) => set('clinicName', e.target.value)}
              className="input-althea"
            />
          </div>
          <div>
            <label className="caption mb-1 block">Timezone</label>
            <input
              value={form.timezone ?? ''}
              onChange={(e) => set('timezone', e.target.value)}
              className="input-althea"
              placeholder="Asia/Jakarta"
            />
          </div>
        </div>
        <div>
          <label className="caption mb-1 block">Alamat</label>
          <textarea
            value={form.address ?? ''}
            onChange={(e) => set('address', e.target.value)}
            rows={2}
            className="input-althea h-auto py-2"
          />
        </div>
      </section>

      {/* Jam Operasional */}
      <section className="card-althea p-6 space-y-3">
        <h2 className="h2">Jam Operasional</h2>
        <div className="space-y-2">
          {DAYS.map((d) => {
            const h = hours[d.key] ?? { ...DEFAULT_HOURS, isOpen: false };
            return (
              <div key={d.key} className="flex flex-wrap items-center gap-3 border-b border-border last:border-b-0 py-2">
                <label className="flex items-center gap-2 min-w-[120px]">
                  <input
                    type="checkbox"
                    checked={h.isOpen}
                    onChange={(e) => setDayHours(d.key, { isOpen: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <span className="font-medium">{d.label}</span>
                </label>
                {h.isOpen ? (
                  <>
                    <input
                      type="time"
                      value={h.open ?? ''}
                      onChange={(e) => setDayHours(d.key, { open: e.target.value })}
                      className="input-althea max-w-[140px]"
                    />
                    <span className="text-fg-muted">—</span>
                    <input
                      type="time"
                      value={h.close ?? ''}
                      onChange={(e) => setDayHours(d.key, { close: e.target.value })}
                      className="input-althea max-w-[140px]"
                    />
                  </>
                ) : (
                  <span className="caption text-fg-muted">Tutup</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Holidays */}
      <section className="card-althea p-6 space-y-3">
        <h2 className="h2">Hari Libur</h2>
        <div className="flex flex-wrap gap-2">
          {(form.holidays ?? []).map((h) => (
            <span key={h} className="badge badge-warn flex items-center gap-1">
              {h}
              <button
                type="button"
                onClick={() => removeHoliday(h)}
                className="hover:text-danger"
                aria-label="Remove"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
          {(form.holidays ?? []).length === 0 && (
            <span className="caption text-fg-muted">Belum ada hari libur dikonfigurasi.</span>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={newHoliday}
            onChange={(e) => setNewHoliday(e.target.value)}
            className="input-althea max-w-[200px]"
          />
          <button type="button" onClick={addHoliday} className="btn btn-outline">
            <Plus className="h-4 w-4" /> Tambah
          </button>
        </div>
      </section>

      {/* Booking Constraints */}
      <section className="card-althea p-6 space-y-3">
        <h2 className="h2">Batasan Booking</h2>
        <div>
          <label className="caption mb-1 block">Buffer Antar Sesi (menit)</label>
          <input
            type="number"
            min={0}
            max={120}
            value={form.bufferMinutes ?? 15}
            onChange={(e) => set('bufferMinutes', Number(e.target.value))}
            className="input-althea max-w-[140px]"
          />
          <p className="caption mt-1 text-fg-muted">
            Jeda minimum antar sesi (untuk transition + clean-up). Default 15 menit.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="card-althea p-6 space-y-3">
        <h2 className="h2">Pajak & Pembayaran</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.taxEnabled ?? false}
            onChange={(e) => set('taxEnabled', e.target.checked)}
            className="h-4 w-4"
          />
          <span>Aktifkan PPN otomatis di payment</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="caption mb-1 block">PPN (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={form.taxPercentage ?? 11}
              onChange={(e) => set('taxPercentage', Number(e.target.value))}
              disabled={!form.taxEnabled}
              className="input-althea disabled:opacity-50"
            />
          </div>
          <div>
            <label className="caption mb-1 block">DP Minimum (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={form.dpPercentage ?? 50}
              onChange={(e) => set('dpPercentage', Number(e.target.value))}
              className="input-althea"
            />
            <p className="caption mt-1 text-fg-muted">
              DP wajib saat booking. Sisanya pelunasan post-session.
            </p>
          </div>
        </div>
      </section>

      {/* WhatsApp */}
      <section className="card-althea p-6 space-y-3">
        <h2 className="h2">Notifikasi WhatsApp</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.waSendEnabled ?? false}
            onChange={(e) => set('waSendEnabled', e.target.checked)}
            className="h-4 w-4"
          />
          <span>Aktifkan kirim WA otomatis</span>
        </label>
        <p className="caption text-fg-muted">
          Kalau toggle off, semua dispatch WA di-skip dan log ditandai gagal dengan reason
          &quot;WA send disabled&quot;. Berguna untuk dev / maintenance / hari libur.
        </p>
        <div>
          <label className="caption mb-1 block">Default Country Code</label>
          <input
            value={form.waCountryCode ?? '+62'}
            onChange={(e) => set('waCountryCode', e.target.value)}
            className="input-althea max-w-[120px]"
          />
        </div>
      </section>

      <div className="sticky bottom-0 bg-cream-50 py-3 -mx-6 px-6 border-t border-border flex justify-end">
        <button type="submit" disabled={updateMut.isPending} className="btn btn-primary">
          <Save className="h-4 w-4" /> {updateMut.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  );
}
