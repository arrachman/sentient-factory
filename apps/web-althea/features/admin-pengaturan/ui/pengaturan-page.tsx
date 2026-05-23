'use client';

/**
 * Admin · Pengaturan Klinik — orchestrator.
 *
 * Layout: header bar (last saved + Batal/Simpan) + grid 220+1fr (sidebar + content).
 * State form & mutations dikelola via `usePengaturanForm()` hook.
 */
import { useState } from 'react';
import { Check } from 'lucide-react';
import { usePengaturanForm } from '../hooks/use-pengaturan-form';
import type { TabKey } from '../model/constants';
import { PengaturanSidebar } from './pengaturan-sidebar';
import {
  TAB_KEAMANAN_DESCRIPTION,
  TAB_PEMBAYARAN_DESCRIPTION,
  TabDisabled,
} from './tabs/tab-disabled';
import { TabKlinik } from './tabs/tab-klinik';
import { TabSlot } from './tabs/tab-slot';

export function PengaturanPage() {
  const page = usePengaturanForm();
  const [tab, setTab] = useState<TabKey>('klinik');

  if (page.isLoading) {
    return <div className="caption">Memuat pengaturan...</div>;
  }
  if (page.error) {
    return (
      <div
        className="card-althea p-6 text-center"
        style={{ color: 'var(--danger, #b54141)' }}
      >
        Gagal memuat: {page.error.message}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: 'calc(100vh - 100px)' }}
    >
      <ActionBar
        lastSaved={page.lastSaved}
        submitting={page.isSubmitting}
        onReset={page.reset}
        onSave={page.save}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: 22,
          padding: '16px 24px 24px',
          flex: 1,
          minHeight: 0,
        }}
      >
        <PengaturanSidebar active={tab} onChange={setTab} />

        <div style={{ overflowY: 'auto' }}>
          <TabContent tab={tab} page={page} />
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Sub-components
// =====================================================================

function ActionBar({
  lastSaved,
  submitting,
  onReset,
  onSave,
}: {
  lastSaved: string;
  submitting: boolean;
  onReset: () => void;
  onSave: () => void;
}) {
  return (
    <div
      style={{
        padding: '18px 24px 0',
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
          onClick={onReset}
          disabled={submitting}
          className="btn btn-ghost btn-sm"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={submitting}
          className="btn btn-primary btn-sm"
        >
          <Check size={14} style={{ stroke: '#fff' }} />{' '}
          {submitting ? 'Menyimpan...' : 'Simpan perubahan'}
        </button>
      </div>
    </div>
  );
}

function TabContent({
  tab,
  page,
}: {
  tab: TabKey;
  page: ReturnType<typeof usePengaturanForm>;
}) {
  switch (tab) {
    case 'klinik':
      return <TabKlinik form={page.form} set={page.set} />;
    case 'slot':
      return (
        <TabSlot
          form={page.form}
          set={page.set}
          addSlot={page.addSlot}
          updateSlot={page.updateSlot}
          removeSlot={page.removeSlot}
          toggleClosedDay={page.toggleClosedDay}
        />
      );
    case 'pembayaran':
      return (
        <TabDisabled
          title="Pembayaran"
          description={TAB_PEMBAYARAN_DESCRIPTION}
        />
      );
    case 'keamanan':
      return (
        <TabDisabled
          title="Keamanan"
          description={TAB_KEAMANAN_DESCRIPTION}
        />
      );
  }
}
