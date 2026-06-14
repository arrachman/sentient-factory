'use client';

/**
 * Hook orchestrator untuk halaman Pengaturan:
 *   - Sync form ↔ server (`useSettings` query → setForm pertama kali load)
 *   - `set(key, value)` setter terminologi pendek
 *   - Slot helpers: addSlot, updateSlot, removeSlot, toggleClosedDay
 *   - `lastSaved` indicator (relative time)
 *   - `save` & `reset` handlers
 */
import { useEffect, useMemo, useState } from 'react';
import { useSettings, useUpdateSettings } from './use-settings';
import type { SlotDef, UpdateSettingsInput } from '../api/settings.api';

function pickFormFromSettings(
  s: NonNullable<ReturnType<typeof useSettings>['data']>['data'],
): UpdateSettingsInput {
  return {
    clinicName: s.clinicName,
    address: s.address ?? '',
    timezone: s.timezone,
    currency: s.currency,
    slotsOfDay: s.slotsOfDay,
    closedDayOfWeek: s.closedDayOfWeek,
    holidays: s.holidays,
    taxEnabled: s.taxEnabled,
    taxPercentage: Number(s.taxPercentage),
    dpPercentage: Number(s.dpPercentage),
    waSendEnabled: s.waSendEnabled,
    waCountryCode: s.waCountryCode,
  };
}

function relativeTime(updatedAt: number | undefined, justSaved: boolean) {
  if (justSaved) return 'baru saja';
  if (!updatedAt) return '—';
  const diffMs = Date.now() - updatedAt;
  const min = Math.max(0, Math.floor(diffMs / 60000));
  if (min < 1) return 'baru saja';
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  return `${Math.floor(hr / 24)} hari lalu`;
}

export function usePengaturanForm() {
  const settingsQuery = useSettings();
  const updateMut = useUpdateSettings();
  const [form, setForm] = useState<UpdateSettingsInput>({});

  useEffect(() => {
    const s = settingsQuery.data?.data;
    if (s) setForm(pickFormFromSettings(s));
  }, [settingsQuery.data?.data]);

  function set<K extends keyof UpdateSettingsInput>(
    key: K,
    value: UpdateSettingsInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSlot(slot: SlotDef) {
    const next = [...(form.slotsOfDay ?? []), slot];
    next.sort((a, b) => a.start.localeCompare(b.start));
    set('slotsOfDay', next);
  }

  function updateSlot(idx: number, partial: Partial<SlotDef>) {
    const next = (form.slotsOfDay ?? []).map((s, i) =>
      i === idx ? { ...s, ...partial } : s,
    );
    set('slotsOfDay', next);
  }

  function removeSlot(idx: number) {
    const next = (form.slotsOfDay ?? []).filter((_, i) => i !== idx);
    set('slotsOfDay', next);
  }

  function toggleClosedDay(dayIndex: number) {
    const current = form.closedDayOfWeek ?? [];
    const next = current.includes(dayIndex)
      ? current.filter((d) => d !== dayIndex)
      : [...current, dayIndex].sort((a, b) => a - b);
    set('closedDayOfWeek', next);
  }

  const lastSaved = useMemo(
    () => relativeTime(settingsQuery.dataUpdatedAt, updateMut.isSuccess),
    [settingsQuery.dataUpdatedAt, updateMut.isSuccess],
  );

  function save() {
    updateMut.mutate(form);
  }

  function reset() {
    const s = settingsQuery.data?.data;
    if (s) setForm(pickFormFromSettings(s));
  }

  return {
    form,
    set,
    addSlot,
    updateSlot,
    removeSlot,
    toggleClosedDay,
    save,
    reset,
    isSubmitting: updateMut.isPending,
    isLoading: settingsQuery.isLoading,
    error: settingsQuery.error as Error | null,
    lastSaved,
  };
}
