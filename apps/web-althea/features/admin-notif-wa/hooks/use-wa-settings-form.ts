'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  useSettings,
  useUpdateSettings,
} from '@/features/admin-pengaturan/hooks/use-settings';
import type { UpdateSettingsInput } from '@/features/admin-pengaturan/api/settings.api';

type Settings = NonNullable<ReturnType<typeof useSettings>['data']>['data'];

function pickWaFields(s: Settings): UpdateSettingsInput {
  return {
    waSendEnabled: s.waSendEnabled,
    waCountryCode: s.waCountryCode,
    waSenderNumber: s.waSenderNumber,
    waRetryCount: s.waRetryCount,
    waRetryDelayMinutes: s.waRetryDelayMinutes,
    waSendWindowStart: s.waSendWindowStart,
    waSendWindowEnd: s.waSendWindowEnd,
    notifFailedSendEmail: s.notifFailedSendEmail,
    emailInvoiceAfterPayment: s.emailInvoiceAfterPayment,
    emailWeeklyRecap: s.emailWeeklyRecap,
    emailMonthlyPsikolog: s.emailMonthlyPsikolog,
    notifH1SendTime: s.notifH1SendTime,
    notifFollowupDelayHours: s.notifFollowupDelayHours,
    notifFeedbackSendTime: s.notifFeedbackSendTime,
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

export function useWaSettingsForm() {
  const settingsQuery = useSettings();
  const updateMut = useUpdateSettings();
  const [form, setForm] = useState<UpdateSettingsInput>({});

  useEffect(() => {
    const s = settingsQuery.data?.data;
    if (s) setForm(pickWaFields(s));
  }, [settingsQuery.data?.data]);

  function set<K extends keyof UpdateSettingsInput>(
    key: K,
    value: UpdateSettingsInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
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
    if (s) setForm(pickWaFields(s));
  }

  return {
    form,
    set,
    save,
    reset,
    isSubmitting: updateMut.isPending,
    isLoading: settingsQuery.isLoading,
    lastSaved,
  };
}
