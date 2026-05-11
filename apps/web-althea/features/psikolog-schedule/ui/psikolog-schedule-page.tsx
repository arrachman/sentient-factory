'use client';

/**
 * Psikolog · Jadwal Saya — orchestrator.
 *
 * Layout: toolbar (date nav + view toggle + filter button + stats) → legend →
 * view (Hari/Minggu/Bulan) → footnote.
 */
import { Bell } from 'lucide-react';
import { usePsikologSchedule } from '../hooks/use-psikolog-schedule';
import { BulanView } from './bulan-view';
import { FilterPopover } from './filter-popover';
import { HariView } from './hari-view';
import { ScheduleLegend } from './schedule-legend';
import { ScheduleToolbar } from './schedule-toolbar';
import { WeekGrid } from './week-grid';

export function PsikologSchedulePage() {
  const page = usePsikologSchedule();

  // Skeleton sampai anchor terisi (post-mount). Mencegah hydration
  // mismatch antara SSR (todayKey() di server time) vs CSR (client time).
  if (!page.ready) {
    return (
      <div style={{ padding: 24 }}>
        <div className="caption">Memuat jadwal...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <ScheduleToolbar
        anchor={page.anchor}
        view={page.view}
        onChangeAnchor={page.setAnchor}
        onChangeView={page.setView}
        onShiftPrev={page.shiftPrev}
        onShiftNext={page.shiftNext}
        onResetToToday={page.resetToToday}
        onToggleFilter={() => page.setFilterOpen(!page.filterOpen)}
        activeFilterCount={page.activeFilterCount}
        totalBooked={page.totalBooked}
        utilisation={page.utilisation}
        filterChildren={
          <FilterPopover
            open={page.filterOpen}
            onClose={() => page.setFilterOpen(false)}
            filters={page.filters}
            onChange={page.setFilters}
          />
        }
      />

      {/* Legend visible only for grid views (Hari & Minggu) */}
      {page.view !== 'Bulan' ? <ScheduleLegend /> : null}

      {/* View switch */}
      {page.view === 'Hari' ? (
        <HariView
          date={page.anchor}
          bookings={page.dayBookings[0] ?? []}
          isLoading={page.isLoading}
        />
      ) : page.view === 'Minggu' ? (
        <WeekGrid
          days={page.days}
          todayIdx={page.todayIdx}
          dayBookings={page.dayBookings}
          isLoading={page.isLoading}
        />
      ) : (
        <BulanView
          anchor={page.anchor}
          bookings={page.allBookings}
          isLoading={page.isLoading}
          onDayClick={(d) => {
            page.setAnchor(d);
            page.setView('Hari');
          }}
        />
      )}

      <Footnote />
    </div>
  );
}

function Footnote() {
  return (
    <div
      className="flex items-start gap-2"
      style={{
        marginTop: 14,
        padding: 12,
        background: 'var(--info-soft, #e6f0f7)',
        borderRadius: 8,
        border: '1px solid #cfdde8',
      }}
    >
      <Bell
        size={14}
        style={{
          color: 'var(--info, #4a90c0)',
          flexShrink: 0,
          marginTop: 2,
        }}
      />
      <span className="caption" style={{ color: '#2c4a60' }}>
        Anda hanya dapat mengubah jadwal sendiri. Untuk reschedule
        lintas-psikolog atau menambah klien baru, hubungi admin klinik.
      </span>
    </div>
  );
}
