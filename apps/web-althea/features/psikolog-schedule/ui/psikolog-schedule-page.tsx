'use client';

/**
 * Psikolog · Jadwal Saya — orchestrator.
 *
 * Layout: toolbar (date nav + view toggle + filter button + stats + Set Jadwal) →
 * legend → view (Hari/Minggu/Bulan) → footnote.
 */
import { useState } from 'react';
import { Bell, CalendarClock } from 'lucide-react';
import { useMe } from '@/features/auth/hooks/use-me';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { hasWeeklyAvailability } from '@/features/admin-psikolog/model/types';
import type { Booking } from '@/features/admin-booking/model/types';
import { usePsikologSchedule } from '../hooks/use-psikolog-schedule';
import { AvailabilityDialog } from './availability-dialog';
import { BookingDetailDrawer } from './booking-detail-drawer';
import { BulanView } from './bulan-view';
import { FilterPopover } from './filter-popover';
import { HariView } from './hari-view';
import { ScheduleLegend } from './schedule-legend';
import { ScheduleToolbar } from './schedule-toolbar';
import { WeekGrid } from './week-grid';

export function PsikologSchedulePage() {
  const page = usePsikologSchedule();
  const me = useMe();
  // List psikolog buat cari profile self (untuk pre-populate dialog).
  const psikologList = usePsikologList({ limit: 200 });
  const myProfile = psikologList.data?.data.find(
    (p) => p.userId === me.data?.data.id,
  );
  const myWeekly = myProfile?.weeklyAvailability ?? null;
  const needsSetup = myProfile && !hasWeeklyAvailability(myWeekly);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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
      {needsSetup && (
        <div
          className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 flex items-start gap-2"
          style={{ marginBottom: 12 }}
        >
          <CalendarClock size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <div className="flex-1">
            <div className="font-semibold">Kamu belum atur jadwal availability</div>
            <div className="caption mt-0.5" style={{ color: '#8a4a00' }}>
              Admin tidak bisa booking kamu sampai jadwal di-set. Klik tombol <strong>Set Jadwal</strong> di kanan atas.
            </div>
          </div>
        </div>
      )}

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
        actionExtra={
          <button
            type="button"
            onClick={() => setAvailabilityOpen(true)}
            disabled={!myProfile}
            className="btn btn-primary btn-sm"
            style={{ height: 32 }}
            title="Atur slot availability mingguan kamu"
          >
            <CalendarClock size={14} /> Set Jadwal
          </button>
        }
      />

      <AvailabilityDialog
        open={availabilityOpen}
        onClose={() => setAvailabilityOpen(false)}
        initial={myWeekly}
      />

      <BookingDetailDrawer
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />

      {/* Legend visible only for grid views (Hari & Minggu) */}
      {page.view !== 'Bulan' ? <ScheduleLegend /> : null}

      {/* View switch */}
      {page.view === 'Hari' ? (
        <HariView
          date={page.anchor}
          bookings={page.dayBookings[0] ?? []}
          isLoading={page.isLoading}
          slotsOfDay={page.slotsOfDay}
          availability={
            page.dayAvailability[0] ?? {
              isOpen: false,
              slotIndices: null,
              source: 'unset',
            }
          }
          onBookingClick={setSelectedBooking}
        />
      ) : page.view === 'Minggu' ? (
        <WeekGrid
          days={page.days}
          todayIdx={page.todayIdx}
          dayBookings={page.dayBookings}
          isLoading={page.isLoading}
          slotsOfDay={page.slotsOfDay}
          dayAvailability={page.dayAvailability}
          onBookingClick={setSelectedBooking}
        />
      ) : (
        <BulanView
          anchor={page.anchor}
          bookings={page.allBookings}
          isLoading={page.isLoading}
          weeklyAvailability={page.weeklyAvailability}
          overrides={page.overrides}
          slotsOfDay={page.slotsOfDay}
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
