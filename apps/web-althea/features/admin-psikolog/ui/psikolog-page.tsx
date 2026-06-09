'use client';

import { useMemo, useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import {
  useCreatePsikolog,
  useDeactivatePsikolog,
  useDeletePsikolog,
  usePsikologList,
  useUpdatePsikolog,
} from '../hooks/use-psikolog';
import type { CreatePsikologInput, Psikolog } from '../model/types';
import { PsikologCard } from './psikolog-card';
import { ProfileAside } from './profile-aside';
import { PsikologForm } from './psikolog-form';
import { AdminScheduleDialog } from './schedule-dialog';
import { QuotaExplainer } from './quota-explainer';

const FILTER_TABS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'Semua' },
  { key: 'klinis_dewasa', label: 'Klinis Dewasa' },
  { key: 'anak_remaja', label: 'Anak & Remaja' },
  { key: 'tes_psikologi', label: 'Tes' },
  { key: 'keluarga', label: 'Keluarga' },
];

export function PsikologPage() {
  const [filter, setFilter] = useState<string>('all');
  const [editing, setEditing] = useState<Psikolog | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<Psikolog | null>(null);

  const listQuery = usePsikologList({
    isActive: true,
    specialty: filter === 'all' ? undefined : filter,
    limit: 100,
  });

  const createMut = useCreatePsikolog();
  const updateMut = useUpdatePsikolog();
  const deleteMut = useDeletePsikolog();
  const deactivateMut = useDeactivatePsikolog();

  const psikologs = listQuery.data?.data ?? [];

  const selected = useMemo(() => {
    if (psikologs.length === 0) return null;
    if (selectedId !== null) {
      const found = psikologs.find((p) => p.id === selectedId);
      if (found) return found;
    }
    return psikologs[0];
  }, [psikologs, selectedId]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(p: Psikolog) {
    setEditing(p);
    setDialogOpen(true);
  }

  function handleDelete(p: Psikolog) {
    if (!confirm(`Hapus psikolog "${p.fullName || p.email}"? Aksi ini tidak bisa dibatalkan.`)) return;
    deleteMut.mutate(p.id, { onSuccess: () => setSelectedId(null) });
  }

  function handleDeactivate(p: Psikolog) {
    if (!confirm(`Nonaktifkan psikolog "${p.fullName || p.email}"? Psikolog tidak akan muncul di booking baru.`)) return;
    deactivateMut.mutate(p.id, { onSuccess: () => setSelectedId(null) });
  }

  function handleSubmit(input: CreatePsikologInput) {
    if (editing) {
      const { email: _e, username: _u, password: _p, ...rest } = input;
      updateMut.mutate(
        { id: editing.id, input: rest },
        { onSuccess: () => { setDialogOpen(false); setEditing(null); } },
      );
    } else {
      createMut.mutate(input, { onSuccess: () => setDialogOpen(false) });
    }
  }

  const submitting = createMut.isPending || updateMut.isPending;

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 100px)' }}>
      {/* Toolbar */}
      <div
        style={{
          padding: '18px 28px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div className="flex items-center" style={{ background: 'var(--cream-100)', borderRadius: 8, padding: 3, gap: 2 }}>
          {FILTER_TABS.map((t) => {
            const active = filter === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setFilter(t.key)}
                className="btn btn-sm"
                style={{
                  padding: '0 12px',
                  background: active ? 'var(--bg-elev, #fff)' : 'transparent',
                  boxShadow: active ? 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05))' : 'none',
                  color: active ? 'var(--teal-800)' : 'var(--fg-muted)',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-outline btn-sm">
            <Filter size={14} /> Sortir
          </button>
          <button type="button" onClick={openCreate} className="btn btn-primary btn-sm">
            <Plus size={15} style={{ stroke: '#fff' }} /> Tambah Psikolog
          </button>
        </div>
      </div>

      <div style={{ padding: '0 24px 12px' }}>
        <QuotaExplainer />
      </div>

      <div style={{ flex: 1, minHeight: 0, padding: '0 24px 24px', display: 'flex', gap: 16 }}>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
            alignContent: 'start',
            overflowY: 'auto',
          }}
        >
          {listQuery.isLoading ? (
            <div className="caption" style={{ gridColumn: '1 / -1', padding: 32, textAlign: 'center' }}>
              Memuat psikolog...
            </div>
          ) : psikologs.length === 0 ? (
            <div className="card-althea-flat" style={{ gridColumn: '1 / -1', padding: 32, textAlign: 'center' }}>
              <p className="caption">Belum ada psikolog dengan filter ini.</p>
              <button type="button" onClick={openCreate} className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                <Plus size={15} style={{ stroke: '#fff' }} /> Tambah Psikolog
              </button>
            </div>
          ) : (
            psikologs.map((p) => (
              <PsikologCard
                key={p.id}
                p={p}
                selected={selected?.id === p.id}
                onClick={() => setSelectedId(p.id)}
              />
            ))
          )}
        </div>

        {selected && (
          <div className="hidden lg:block">
            <ProfileAside
              p={selected}
              onEdit={() => openEdit(selected)}
              onDelete={handleDelete}
              onDeactivate={handleDeactivate}
              onSchedule={(p) => setScheduleTarget(p)}
            />
          </div>
        )}
      </div>

      <PsikologForm
        open={dialogOpen}
        initial={editing}
        submitting={submitting}
        onSubmit={handleSubmit}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
      />

      <AdminScheduleDialog
        open={scheduleTarget !== null}
        psikolog={scheduleTarget}
        onClose={() => setScheduleTarget(null)}
      />
    </div>
  );
}
