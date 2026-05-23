'use client';

import { useState } from 'react';
import { Play, FlaskConical, Info } from 'lucide-react';
import { useTriggerScheduler } from '../hooks/use-wa';
import type { SchedulerType } from '../api/wa.api';

const SCHEDULER_OPTIONS: { value: SchedulerType; label: string; desc: string }[] = [
  { value: 'h1', label: 'Pengingat H-1', desc: 'Booking besok (window: 00:00–23:59 WIB besok)' },
  { value: 'm30', label: 'Pengingat 30 Menit', desc: 'Booking 25–35 menit dari sekarang' },
  { value: 'feedback_h1', label: 'Form Feedback H+1', desc: 'Booking completed kemarin (00:00–23:59 WIB)' },
];

export function SchedulerTestPanel() {
  const [type, setType] = useState<SchedulerType>('h1');
  const [testPhone, setTestPhone] = useState('');
  const [dryRun, setDryRun] = useState(false);
  const trigger = useTriggerScheduler();

  const selected = SCHEDULER_OPTIONS.find((o) => o.value === type)!;
  const lastResult = trigger.data?.data;

  function handleRun() {
    trigger.mutate({
      type,
      testPhone: testPhone.trim() || undefined,
      dryRun,
    });
  }

  return (
    <div className="rounded-xl border border-[var(--sage-200)] bg-white p-5 space-y-4">
      <div className="flex items-center gap-2">
        <FlaskConical className="w-4 h-4 text-[var(--sage-500)]" />
        <h3 className="font-semibold text-[var(--teal-800)] text-sm">Test Scheduler WA</h3>
      </div>

      {/* Tipe scheduler */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-[var(--teal-700)]">Tipe Reminder</label>
        <div className="flex flex-col gap-1.5">
          {SCHEDULER_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-2.5 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
                type === opt.value
                  ? 'border-[var(--sage-400)] bg-[var(--sage-50)]'
                  : 'border-[var(--cream-200)] hover:border-[var(--sage-200)]'
              }`}
            >
              <input
                type="radio"
                name="scheduler-type"
                value={opt.value}
                checked={type === opt.value}
                onChange={() => setType(opt.value)}
                className="mt-0.5 accent-[var(--sage-500)]"
              />
              <div>
                <span className="text-sm font-medium text-[var(--teal-800)]">{opt.label}</span>
                <p className="text-xs text-[var(--teal-500)] mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Nomor test */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-[var(--teal-700)]">
          Nomor WA Test{' '}
          <span className="text-[var(--teal-400)] font-normal">(opsional — buat test client + booking otomatis)</span>
        </label>
        <input
          type="text"
          value={testPhone}
          onChange={(e) => setTestPhone(e.target.value)}
          placeholder="+6285123456789 atau 08123456789"
          className="w-full rounded-lg border border-[var(--cream-300)] px-3 py-2 text-sm text-[var(--teal-800)] placeholder:text-[var(--teal-300)] focus:outline-none focus:ring-1 focus:ring-[var(--sage-400)] bg-white"
        />
        {testPhone.trim() && (
          <p className="flex items-center gap-1 text-xs text-[var(--teal-500)]">
            <Info className="w-3 h-3" />
            Client &amp; booking test akan dibuat. Booking dimark sebagai test di kolom notes.
          </p>
        )}
      </div>

      {/* Dry run toggle */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={dryRun}
          onChange={(e) => setDryRun(e.target.checked)}
          className="accent-[var(--sage-500)] w-4 h-4"
        />
        <span className="text-sm text-[var(--teal-700)]">
          Dry run{' '}
          <span className="text-[var(--teal-400)] text-xs">(hitung kandidat, tidak kirim WA)</span>
        </span>
      </label>

      {/* Tombol run */}
      <button
        onClick={handleRun}
        disabled={trigger.isPending}
        className="flex items-center gap-2 rounded-lg bg-[var(--sage-500)] hover:bg-[var(--sage-600)] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 text-sm font-medium transition-colors"
      >
        <Play className="w-3.5 h-3.5" />
        {trigger.isPending ? 'Menjalankan…' : dryRun ? 'Preview Kandidat' : 'Jalankan Sekarang'}
      </button>

      {/* Hasil */}
      {lastResult && (
        <div className="rounded-lg border border-[var(--sage-200)] bg-[var(--sage-50)] p-3 space-y-1.5 text-xs">
          <p className="font-semibold text-[var(--teal-800)]">
            {lastResult.dryRun ? 'Hasil preview' : 'Hasil pengiriman'} — {selected.label}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[var(--teal-700)]">
            <span>{lastResult.dryRun ? 'Kandidat ditemukan' : 'Terkirim'}</span>
            <span className="font-medium">{lastResult.dryRun ? lastResult.skipped : lastResult.dispatched}</span>
            {!lastResult.dryRun && (
              <>
                <span>Diproses</span>
                <span className="font-medium">{lastResult.dispatched}</span>
              </>
            )}
            {lastResult.testBookingId && (
              <>
                <span>Test booking ID</span>
                <span className="font-medium">#{lastResult.testBookingId}</span>
              </>
            )}
          </div>
          {lastResult.bookingIds.length > 0 && (
            <p className="text-[var(--teal-500)]">
              Booking IDs: {lastResult.bookingIds.join(', ')}
            </p>
          )}
          {lastResult.bookingIds.length === 0 && (
            <p className="text-[var(--teal-400)] italic">Tidak ada kandidat dalam window ini.</p>
          )}
        </div>
      )}
    </div>
  );
}
