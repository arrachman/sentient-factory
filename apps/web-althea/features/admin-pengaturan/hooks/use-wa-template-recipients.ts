'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { waApi } from '@/features/admin-notif-wa/api/wa.api';
import type { Template } from '@/features/admin-notif-wa/model/types';

export type RecipientRole = 'klien' | 'psikolog' | 'staff' | 'user';

const KEY = ['clinic', 'wa', 'templates', 'recipients'] as const;

/**
 * Hook untuk baca + toggle ClinicWaTemplate.recipients dari surface Pengaturan WA.
 *
 * Single source of truth dispatch routing — drawer "WA klien" / "WA psikolog"
 * toggle mengubah array recipients di template, bukan kolom ClinicSettings.
 *
 * Caller pakai `getRecipients(templateName)` untuk read & `toggle(templateName, role)`
 * untuk add/remove role dari recipients (mutually exclusive).
 */
export function useWaTemplateRecipients() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: KEY,
    queryFn: () => waApi.listTemplates({ limit: 200 }),
  });

  const templates: Template[] = query.data?.data ?? [];

  function findByName(name: string): Template | undefined {
    return templates.find((t) => t.name === name);
  }

  function getRecipients(templateName: string): RecipientRole[] {
    return (findByName(templateName)?.recipients ?? []) as RecipientRole[];
  }

  function hasRecipient(templateName: string, role: RecipientRole): boolean {
    return getRecipients(templateName).includes(role);
  }

  const toggleMutation = useMutation({
    mutationFn: async ({ templateName, role }: { templateName: string; role: RecipientRole }) => {
      const tpl = findByName(templateName);
      if (!tpl) throw new Error(`Template "${templateName}" tidak ditemukan`);
      const current = (tpl.recipients ?? []) as RecipientRole[];
      const next = current.includes(role)
        ? current.filter((r) => r !== role)
        : ([...current, role] as RecipientRole[]);
      return waApi.updateTemplate(tpl.id, { recipients: next });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (e: Error) => toast.error('Gagal simpan penerima', { description: e.message }),
  });

  return {
    isLoading: query.isLoading,
    templates,
    getRecipients,
    hasRecipient,
    toggle: (templateName: string, role: RecipientRole) =>
      toggleMutation.mutate({ templateName, role }),
    isToggling: toggleMutation.isPending,
  };
}
