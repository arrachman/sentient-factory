'use client';

/**
 * Admin · Audit Log — orchestrator.
 *
 * Layout: header → action bar → stat tiles → 3-col grid (kategori sidebar ·
 * timeline · detail panel). State & data via `useAuditPage()` hook.
 */
import { MousePointerClick } from 'lucide-react';
import { exportAuditCsv } from '../model/export-csv';
import { categoryLabel } from '../model/types';
import { useAuditPage } from '../hooks/use-audit-page';
import { AuditActionBar } from './audit-action-bar';
import { AuditCategorySidebar } from './audit-category-sidebar';
import { AuditDetailPanel } from './audit-detail-panel';
import { AuditStatTilesRow } from './audit-stat-tiles-row';
import { AuditTimeline } from './audit-timeline';

export function AuditLogPage() {
  const page = useAuditPage();

  return (
    <div className="flex flex-col h-full min-h-0">
      <PageHeader />

      <AuditActionBar
        totalLabel={page.totalLabel}
        search={page.search}
        onChangeSearch={page.setSearch}
        onRefetch={() => page.refetch()}
        onExport={() => exportAuditCsv(page.filtered)}
        exportDisabled={page.filtered.length === 0}
      />

      <AuditStatTilesRow stats={page.stats} />

      <div
        className="px-7 pb-7 flex-1 min-h-0"
        style={{
          display: 'grid',
          gridTemplateColumns: '210px 1fr 360px',
          gap: 16,
        }}
      >
        <AuditCategorySidebar
          active={page.cat}
          counts={page.counts}
          onChange={page.setCat}
        />

        <TimelineCard
          activeCat={page.cat}
          filteredCount={page.filtered.length}
          isLoading={page.isLoading}
          isError={page.isError}
          onShowAll={() => page.setCat('all')}
        >
          <AuditTimeline
            events={page.filtered}
            selectedId={page.selected?.id ?? null}
            onSelect={(id) => page.setSelectedId(id)}
          />
        </TimelineCard>

        <DetailCard selectedId={page.selected?.id ?? null}>
          {page.selected ? (
            <AuditDetailPanel event={page.selected} />
          ) : (
            <div className="col gap-2" style={{ padding: 24, alignItems: 'center', textAlign: 'center' }}>
              <MousePointerClick size={32} style={{ color: 'var(--fg-muted)', opacity: 0.35 }} />
              <span className="caption">Klik event di timeline<br />untuk melihat detailnya.</span>
            </div>
          )}
        </DetailCard>
      </div>
    </div>
  );
}

// =====================================================================
// Local layout slivers
// =====================================================================

function PageHeader() {
  return (
    <div className="px-7 pt-6 pb-2">
      <div className="eyebrow">Sistem · Audit Log</div>
      <h1 className="h1 mt-1">Audit Log</h1>
      <p className="caption mt-1">
        Catatan aktivitas seluruh sistem untuk akuntabilitas & investigasi.
        Read-only.
      </p>
    </div>
  );
}

function TimelineCard({
  activeCat,
  filteredCount,
  isLoading,
  isError,
  onShowAll,
  children,
}: {
  activeCat: ReturnType<typeof useAuditPage>['cat'];
  filteredCount: number;
  isLoading: boolean;
  isError: boolean;
  onShowAll: () => void;
  children: React.ReactNode;
}) {
  return (
    <section
      className="card-althea overflow-hidden flex flex-col"
      style={{ minHeight: 0 }}
    >
      <div
        className="row"
        style={{
          padding: '12px 18px',
          borderBottom: '1px solid var(--border)',
          justifyContent: 'space-between',
        }}
      >
        <h2 className="text-base font-medium" style={{ margin: 0 }}>
          {activeCat === 'all'
            ? 'Aktivitas semua kategori'
            : `Aktivitas · ${categoryLabel(activeCat).toLowerCase()}`}
        </h2>
        <span className="caption">
          {filteredCount} event · diurutkan terbaru
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isLoading ? (
          <Centered>Memuat audit log…</Centered>
        ) : isError ? (
          <Centered danger>
            Gagal memuat audit log. Coba refresh halaman.
          </Centered>
        ) : filteredCount === 0 ? (
          <Centered>
            Belum ada audit log untuk filter ini.
            {activeCat !== 'all' && (
              <>
                {' '}
                <button
                  type="button"
                  onClick={onShowAll}
                  style={{
                    color: 'var(--sage-600)',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 'inherit',
                    padding: 0,
                  }}
                >
                  Tampilkan semua
                </button>
              </>
            )}
          </Centered>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

function DetailCard({
  selectedId,
  children,
}: {
  selectedId: number | null;
  children: React.ReactNode;
}) {
  return (
    <aside
      className="card-althea overflow-hidden flex flex-col"
      style={{ minHeight: 0 }}
    >
      <div
        className="row"
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          justifyContent: 'space-between',
        }}
      >
        <h2 className="text-base font-medium" style={{ margin: 0 }}>
          Detail event
        </h2>
        <span
          style={{
            fontSize: 11,
            color: 'var(--fg-muted)',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          {selectedId ? `#${selectedId}` : '—'}
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>{children}</div>
    </aside>
  );
}

function Centered({
  children,
  danger,
}: {
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      className="caption"
      style={{
        padding: 24,
        textAlign: 'center',
        color: danger ? 'var(--danger)' : undefined,
      }}
    >
      {children}
    </div>
  );
}
