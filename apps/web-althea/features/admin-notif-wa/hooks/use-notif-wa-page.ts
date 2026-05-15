'use client';

/**
 * Hook orchestrator untuk halaman Notifikasi WA:
 *   - Fetch templates + logs + mutations
 *   - Editor state (selected/draft/creating/testOpen)
 *   - Auto-select first template on first load
 *   - Derived stats (sentToday, readRate, failed, active templates)
 *   - bodyVars (regex `{{var}}`) untuk send-test dialog
 */
import { useEffect, useMemo, useState } from 'react';
import {
  useCreateTemplate,
  useDeleteTemplate,
  useLogList,
  useSendTest,
  useTemplateList,
  useUpdateTemplate,
} from './use-wa';
import { EMPTY_TEMPLATE } from '../model/constants';
import { isToday } from '../model/format';
import type { CreateTemplateInput, Template, WaLog } from '../model/types';

export function useNotifWaPage() {
  const tplList = useTemplateList({ limit: 200 });
  const logList = useLogList({ limit: 50 });
  const updateMut = useUpdateTemplate();
  const deleteMut = useDeleteTemplate();
  const createMut = useCreateTemplate();
  const sendTestMut = useSendTest();

  const templates = useMemo<Template[]>(
    () =>
      (tplList.data?.data ?? []).filter((t) => {
        const trig = t.triggerEvent?.toLowerCase() ?? '';
        const name = t.name.toLowerCase();
        return !trig.includes('otp') && !name.includes('otp');
      }),
    [tplList.data],
  );
  const logs = useMemo<WaLog[]>(
    () => logList.data?.data ?? [],
    [logList.data],
  );

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState<CreateTemplateInput>(EMPTY_TEMPLATE);
  const [creating, setCreating] = useState(false);
  const [testOpen, setTestOpen] = useState(false);

  // Pre-select first template on first load
  useEffect(() => {
    if (selectedId === null && templates.length > 0 && !creating) {
      const first = templates[0];
      setSelectedId(first.id);
      setDraft({
        name: first.name,
        category: first.category,
        triggerEvent: first.triggerEvent ?? '',
        body: first.body,
        recipients: first.recipients,
        isActive: first.isActive,
      });
    }
  }, [templates, selectedId, creating]);

  function selectTemplate(t: Template) {
    setCreating(false);
    setSelectedId(t.id);
    setDraft({
      name: t.name,
      category: t.category,
      triggerEvent: t.triggerEvent ?? '',
      body: t.body,
      recipients: t.recipients,
      isActive: t.isActive,
    });
  }

  function startCreate() {
    setCreating(true);
    setSelectedId(null);
    setDraft(EMPTY_TEMPLATE);
  }

  function toggleRecipient(r: string) {
    if (draft.recipients.includes(r)) {
      setDraft({
        ...draft,
        recipients: draft.recipients.filter((x) => x !== r),
      });
    } else {
      setDraft({ ...draft, recipients: [...draft.recipients, r] });
    }
  }

  function toggleActive(t: Template) {
    updateMut.mutate({ id: t.id, input: { isActive: !t.isActive } });
  }

  function save() {
    if (creating) {
      createMut.mutate(draft, {
        onSuccess: (res) => {
          setCreating(false);
          setSelectedId(res.data.id);
        },
      });
    } else if (selectedId !== null) {
      updateMut.mutate({ id: selectedId, input: draft });
    }
  }

  function handleDelete() {
    if (selectedId === null) return;
    const t = templates.find((x) => x.id === selectedId);
    if (!t || !confirm(`Hapus template "${t.name}"?`)) return;
    deleteMut.mutate(selectedId, {
      onSuccess: () => {
        setSelectedId(null);
        setDraft(EMPTY_TEMPLATE);
      },
    });
  }

  function insertVariable(v: string) {
    setDraft({ ...draft, body: draft.body + v });
  }

  // Stats
  const totalTemplates = templates.length;
  const activeTemplates = templates.filter((t) => t.isActive).length;
  const sentToday = useMemo(
    () => logs.filter((l) => isToday(l.createdAt)),
    [logs],
  );
  const sentTodayCount = sentToday.length;
  const readToday = sentToday.filter((l) => l.status === 'dibaca').length;
  const readRate =
    sentTodayCount > 0 ? Math.round((readToday / sentTodayCount) * 100) : 0;
  const failedToday = sentToday.filter((l) => l.status === 'gagal').length;

  // Body vars dari template aktif (regex `{{var}}`)
  const bodyVars = useMemo(() => {
    if (!selectedId) return [];
    const tpl = templates.find((t) => t.id === selectedId);
    if (!tpl) return [];
    const matches = tpl.body.match(/\{\{(\w+)\}\}/g) ?? [];
    return [...new Set(matches.map((m) => m.slice(2, -2)))];
  }, [selectedId, templates]);

  return {
    // data
    templates,
    logs,
    isLoadingTemplates: tplList.isLoading,
    isLoadingLogs: logList.isLoading,
    // editor state
    selectedId,
    draft,
    setDraft,
    creating,
    testOpen,
    setTestOpen,
    submittingSave: createMut.isPending || updateMut.isPending,
    // mutations re-export
    sendTestMut,
    // handlers
    selectTemplate,
    startCreate,
    toggleRecipient,
    toggleActive,
    save,
    handleDelete,
    insertVariable,
    // stats
    totalTemplates,
    activeTemplates,
    sentTodayCount,
    readToday,
    readRate,
    failedToday,
    bodyVars,
  };
}
