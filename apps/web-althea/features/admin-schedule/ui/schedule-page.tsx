'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { bookingApi } from '@/features/admin-booking/api/booking.api';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import { BookingWizard } from '@/features/admin-booking/ui/booking-wizard';
import { BookingDetailDialog } from '@/features/admin-booking/ui/booking-detail-dialog';
import type { Booking } from '@/features/admin-booking/model/types';
import { EMPTY_FILTERS, SLOTS } from '../model/constants';
import { applyFilters, filterCount } from '../model/filters';
import {
  addDays,
  addMonths,
  formatDateLong,
  formatMonth,
  formatWeekRange,
  monthEnd,
  monthStart,
  todayKey,
  toDateKey,
  weekStartMonday,
} from '../model/format';
import type { Filters, ViewMode } from '../model/types';
import { FilterPopover } from './filter-popover';
import { ScheduleStatsStrip } from './schedule-stats-strip';
import { ScheduleToolbar } from './schedule-toolbar';
import { BulanView } from './views/bulan-view';
import { HariView } from './views/hari-view';
import { MingguView } from './views/minggu-view';
import { ServiceLegendItem } from './components/service-legend';

export function SchedulePage() {
  // Init '' supaya SSR + client hydration konsisten. Set today di useEffect.
  const [date, setDate] = useState<string>('');
  useEffect(() => {
    if (!date) setDate(todayKey());
  }, [date]);
  const [view, setView] = useState<ViewMode>('Hari');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const serviceList = useServiceList({ limit: 200 });

  const psikologs = psikologList.data?.data ?? [];
  const rooms = roomList.data?.data ?? [];
  const services = serviceList.data?.data ?? [];

  const datesToFetch = useMemo(() => {
    if (!date) return [];
    if (view === 'Hari') return [date];
    if (view === 'Minggu') {
      const start = weekStartMonday(date);
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }
    const start = new Date(monthStart(date));
    const end = new Date(monthEnd(date));
    const out: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      out.push(toDateKey(d));
    }
    return out;
  }, [date, view]);

  const dayQueries = useQueries({
    queries: datesToFetch.map((d) => ({
      queryKey: ['clinic', 'booking', 'list', { date: d, limit: 200, includeCancelled: false }],
      queryFn: () => bookingApi.list({ date: d, limit: 200, includeCancelled: false }),
    })),
  });
  const isLoading = dayQueries.some((q) => q.isLoading) || psikologList.isLoading;
  const allBookings = useMemo<Booking[]>(
    () => dayQueries.flatMap((q) => q.data?.data ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dayQueries.map((q) => q.dataUpdatedAt).join(',')],
  );

  const filteredBookings = useMemo(
    () => applyFilters(allBookings, filters),
    [allBookings, filters],
  );

  const stats = useMemo(() => {
    const totalSlots = psikologs.length * SLOTS.length * (datesToFetch.length || 1);
    const usedRoomIds = new Set(filteredBookings.map((b) => b.room.id));
    const inProgressCount = filteredBookings.filter((b) => b.status === 'in_progress').length;
    return {
      sesi: {
        value: filteredBookings.length,
        sub: totalSlots ? `dari ${totalSlots} slot tersedia` : '—',
      },
      psikolog: {
        value: psikologs.length,
        sub: inProgressCount ? `${inProgressCount} sedang sesi sekarang` : 'siap menerima',
      },
      ruangan: {
        value: `${usedRoomIds.size}/${rooms.length || '—'}`,
        sub: rooms.length
          ? `${Math.max(0, rooms.length - usedRoomIds.size)} ruangan kosong`
          : 'memuat...',
      },
      wa: { value: '—', sub: 'terkirim hari ini' },
    };
  }, [psikologs.length, filteredBookings, rooms.length, datesToFetch.length]);

  function shiftPrev() {
    if (view === 'Hari') setDate(addDays(date, -1));
    else if (view === 'Minggu') setDate(addDays(date, -7));
    else setDate(addMonths(date, -1));
  }
  function shiftNext() {
    if (view === 'Hari') setDate(addDays(date, 1));
    else if (view === 'Minggu') setDate(addDays(date, 7));
    else setDate(addMonths(date, 1));
  }

  const dateLabel = !date
    ? ''
    : view === 'Hari'
      ? formatDateLong(date)
      : view === 'Minggu'
        ? formatWeekRange(weekStartMonday(date))
        : formatMonth(date);

  const activeFilterCount = filterCount(filters);

  return (
    <>
      <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 160px)' }}>
        <ScheduleToolbar
          date={date}
          view={view}
          dateLabel={dateLabel}
          activeFilterCount={activeFilterCount}
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
          onShiftPrev={shiftPrev}
          onShiftNext={shiftNext}
          onPickDate={setDate}
          onResetToToday={() => setDate(todayKey())}
          onChangeView={setView}
          onToggleFilter={() => setFilterOpen((v) => !v)}
          onCreate={() => setWizardOpen(true)}
        />

        <ScheduleStatsStrip view={view} stats={stats} />

        <div style={{ padding: '0 28px 18px' }}>
          <div className="card-althea" style={{ overflow: 'hidden' }}>
            <div
              className="flex items-center justify-between flex-wrap gap-3"
              style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)' }}
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
                isLoading={isLoading}
                onBookingClick={setSelectedBooking}
              />
            )}
            {view === 'Minggu' && (
              <MingguView
                weekStart={weekStartMonday(date)}
                bookings={filteredBookings}
                isLoading={isLoading}
                onBookingClick={setSelectedBooking}
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
          </div>
        </div>
      </div>

      <BookingWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
      <BookingDetailDialog
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </>
  );
}
