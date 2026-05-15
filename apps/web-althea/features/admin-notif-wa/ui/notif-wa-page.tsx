'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  useCreateTemplate,
  useDeleteTemplate,
  useLogList,
  useSendTest,
  useTemplateList,
  useUpdateTemplate,
} from '../hooks/use-wa';
import type { CreateTemplateInput, Template } from '../model/types';
import { ActivityLog } from './activity-log';
import { SendTestDialog } from './send-test-dialog';
import { TemplateEditor } from './template-editor';
import { TemplateList } from './template-list';
import { WaPageHeader } from './wa-page-header';
import { WaStatsRow } from './wa-stats-row';

const EMPTY_TEMPLATE: CreateTemplateInput = {
  name: '',
  category: 'pengingat',
  triggerEvent: '',
  body: '',
  recipients: ['klien'],
  isActive: true,
};

export function NotifWaPage() {
  const tplList = useTemplateList({ limit: 200 });
  const logList = useLogList({ limit: 50 });
  const updateMut = useUpdateTemplate();
  const deleteMut = useDeleteTemplate();
  const createMut = useCreateTemplate();
  const sendTestMut = useSendTest();

  const templates = useMemo(() => tplList.data?.data ?? [], [tplList.data]);
  const logs = logList.data?.data ?? [];

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState<CreateTemplateInput>(EMPTY_TEMPLATE);
  const [creating, setCreating] = useState(false);
  const [testOpen, setTestOpen] = useState(false);

  useEffect(() => {
    if (selectedId === null && templates.length > 0) {
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
  }, [templates, selectedId]);

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
    setDraft((d) =>
      d.recipients.includes(r)
        ? { ...d, recipients: d.recipients.filter((x) => x !== r) }
        : { ...d, recipients: [...d.recipients, r] },
    );
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
    setDraft((d) => ({ ...d, body: d.body + v }));
  }

  const totalTemplates = templates.length;
  const activeTemplates = templates.filter((t) => t.isActive).length;
  const sentToday = logs.filter((l) => {
    const created = new Date(l.createdAt);
    const today = new Date();
    return (
      created.getFullYear() === today.getFullYear() &&
      created.getMonth() === today.getMonth() &&
      created.getDate() === today.getDate()
    );
  });
  const sentTodayCount = sentToday.length;
  const readToday = sentToday.filter((l) => l.status === 'dibaca').length;
  const readRate = sentTodayCount > 0 ? Math.round((readToday / sentTodayCount) * 100) : 0;
  const failedToday = sentToday.filter((l) => l.status === 'gagal').length;

  const bodyVars = useMemo(() => {
    if (!selectedId) return [];
    const tpl = templates.find((t) => t.id === selectedId);
    if (!tpl) return [];
    const matches = tpl.body.match(/\{\{(\w+)\}\}/g) ?? [];
    return [...new Set(matches.map((m) => m.slice(2, -2)))];
  }, [selectedId, templates]);

  const submitting = createMut.isPending || updateMut.isPending;

  return (
    <div className="space-y-4 p-6">
      <WaPageHeader onCreate={startCreate} />

      <WaStatsRow
        sentTodayCount={sentTodayCount}
        readToday={readToday}
        readRate={readRate}
        failedToday={failedToday}
        activeTemplates={activeTemplates}
        totalTemplates={totalTemplates}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_380px] gap-4 min-h-[640px]">
        <TemplateList
          templates={templates}
          isLoading={tplList.isLoading}
          selectedId={selectedId}
          creating={creating}
          onSelect={selectTemplate}
          onToggleActive={toggleActive}
        />

        <ActivityLog
          logs={logs}
          isLoading={logList.isLoading}
          totalToday={sentTodayCount}
        />

        <TemplateEditor
          creating={creating}
          selectedId={selectedId}
          draft={draft}
          submitting={submitting}
          bodyEmpty={!draft.body}
          onChangeDraft={setDraft}
          onToggleRecipient={toggleRecipient}
          onInsertVariable={insertVariable}
          onRequestSendTest={() => setTestOpen(true)}
          onSave={save}
          onDelete={handleDelete}
        />
      </div>

      {testOpen && selectedId !== null && (
        <SendTestDialog
          template={templates.find((t) => t.id === selectedId)!}
          variables={bodyVars}
          onClose={() => setTestOpen(false)}
          sendTest={sendTestMut}
        />
      )}
    </div>
  );
}
