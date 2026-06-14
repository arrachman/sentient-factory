'use client';

/**
 * Section "Daftar jadwal psikolog" untuk Owner — embed grid Hari/Minggu/Bulan
 * dari admin-schedule TANPA wizard / tombol create. Owner read-only:
 * boleh klik booking untuk lihat detail (dialog read-only), tidak boleh buat.
 *
 * Mengandung state-nya sendiri (date + view + filter) supaya independen dari
 * filter periode di atas (KPI). Default ke hari ini.
 */
import { useState } from 'react';
import { todayKey } from '@/features/admin-schedule/model/format';
import { weekStartMonday } from '@/features/admin-schedule/model/format';
import { BookingDetailDialog } from '@/features/admin-booking/ui/booking-detail-dialog';
import type { Booking } from '@/features/admin-booking/model/types';
import { FilterPopover } from '@/features/admin-schedule/ui/filter-popover';
import { BulanView } from '@/features/admin-schedule/ui/views/bulan-view';
import { HariView } from '@/features/admin-schedule/ui/views/hari-view';
import { MingguView } from '@/features/admin-schedule/ui/views/minggu-view';
import { ServiceLegendItem } from '@/features/admin-schedule/ui/components/service-legend';
import { OwnerScheduleToolbar } from './owner-schedule-toolbar';
import { useOwnerSchedule } from './use-owner-schedule';

const NOOP = () => {};

export function OwnerScheduleSection() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const {
    date,
    setDate,
    view,
    setView,
    filters,
    setFilters,
    psikologs,
    rooms,
    services,
    globalSlots,
    filteredBookings,
    isLoading,
    resolveAvailability,
    psikologsForAvail,
    shiftPrev,
    shiftNext,
    dateLabel,
    activeFilterCount,
  } = useOwnerSchedule();

  return (
    <div className="card-althea" style={{ overflow: 'hidden' }}>
      <OwnerScheduleToolbar
        date={date}
        view={view}
        dateLabel={dateLabel}
        activeFilterCount={activeFilterCount}
        onShiftPrev={shiftPrev}
        onShiftNext={shiftNext}
        onPickDate={setDate}
        onResetToToday={() => setDate(todayKey())}
        onChangeView={setView}
        onToggleFilter={() => setFilterOpen((v) => !v)}
        filterChildren={
          <FilterPopover
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            filters={filters}
            onChange={setFilters}
            psikologs={psikologs}
            rooms={rooms}
            services={services}
          />
        }
      />

      <div
        className="flex items-center justify-between flex-wrap gap-3"
        style={{
          padding: '12px 18px',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <h2 className="h2" style={{ margin: 0 }}>
          {view === 'Hari'
            ? 'Grid Penjadwalan · Psikolog × Slot'
            : view === 'Minggu'
              ? 'Grid Mingguan · Hari × Slot'
              : 'Kalender Bulanan'}
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <ServiceLegendItem category="konseling" label="Konseling" />
          <ServiceLegendItem category="terapi" label="Terapi" />
          <ServiceLegendItem category="anak" label="Anak" />
          <ServiceLegendItem category="tes" label="Tes" />
        </div>
      </div>

      {view === 'Hari' && (
        <HariView
          date={date}
          psikologs={psikologs}
          bookings={filteredBookings}
          slots={globalSlots}
          isLoading={isLoading}
          onBookingClick={setSelectedBooking}
          resolveAvailability={resolveAvailability}
          onEmptySlotClick={NOOP}
        />
      )}
      {view === 'Minggu' && (
        <MingguView
          weekStart={weekStartMonday(date)}
          bookings={filteredBookings}
          slots={globalSlots}
          isLoading={isLoading}
          onBookingClick={setSelectedBooking}
          psikologs={psikologsForAvail}
          resolveAvailability={resolveAvailability}
          onEmptySlotClick={NOOP}
        />
      )}
      {view === 'Bulan' && (
        <BulanView
          monthAnchor={date}
          bookings={filteredBookings}
          isLoading={isLoading}
          onDayClick={(dateKey) => {
            setDate(dateKey);
            setView('Hari');
          }}
        />
      )}

      <BookingDetailDialog
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}
