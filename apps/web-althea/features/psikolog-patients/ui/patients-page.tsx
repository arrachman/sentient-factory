'use client';

/**
 * Psikolog · Klien saya — orchestrator.
 *
 * Layout: split kiri (1.5fr toolbar + table) + kanan (380px detail aside).
 * Logic via `usePatientsPage()`.
 */
import { usePatientsPage } from '../hooks/use-patients-page';
import { PatientDetailAside } from './patient-detail-aside';
import { PatientsTable } from './patients-table';
import { PatientsToolbar } from './patients-toolbar';
import { PrivacyBanner } from './privacy-banner';

export function PatientsPage() {
  const page = usePatientsPage();

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div
        style={{
          flex: 1.5,
          padding: 20,
          overflow: 'auto',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          minWidth: 0,
        }}
      >
        <PrivacyBanner count={page.allClients.length} />

        <PatientsToolbar
          statusTab={page.statusTab}
          onChangeStatusTab={page.setStatusTab}
          query={page.query}
          onChangeQuery={page.setQuery}
          katFilter={page.katFilter}
          onChangeKat={page.setKatFilter}
          sortBy={page.sortBy}
          onChangeSort={page.setSortBy}
          counts={page.counts}
          todayCount={page.todayCount}
          totalCount={page.allClients.length}
          visibleCount={page.visible.length}
        />

        <PatientsTable
          visible={page.visible}
          isLoading={page.isLoading}
          selected={page.selected}
          query={page.query}
          katFilter={page.katFilter}
          statusTab={page.statusTab}
          onSelect={(id) => page.setSelectedId(id)}
          onResetFilters={page.resetFilters}
        />
      </div>

      {page.selected ? (
        <PatientDetailAside client={page.selected} />
      ) : null}
    </div>
  );
}
