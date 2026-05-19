'use client';

/**
 * Section "Daftar jadwal psikolog" untuk Owner — embed grid Hari/Minggu/Bulan
 * dari admin-schedule TANPA wizard / tombol create. Owner read-only:
 * boleh klik booking untuk lihat detail (dialog read-only), tidak boleh buat.
 *
 * Mengandung state-nya sendiri (date + view + filter) supaya independen dari
 * filter periode di atas (KPI). Default ke hari ini.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { bookingApi } from '@/features/admin-booking/api/booking.api';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import { BookingDetailDialog } from '@/features/admin-booking/ui/booking-detail-dialog';
import type { Booking } from '@/features/admin-booking/model/types';
import { EMPTY_FILTERS } from '@/features/admin-schedule/model/constants';
import {
  applyFilters,
  filterCount,
} from '@/features/admin-schedule/model/filters';
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
} from '@/features/admin-schedule/model/format';
import type {
  Filters,
  ViewMode,
} from '@/features/admin-schedule/model/types';
import { useAvailabilityMap } from '@/features/admin-schedule/hooks/use-availability-map';
import { FilterPopover } from '@/features/admin-schedule/ui/filter-popover';
import { BulanView } from '@/features/admin-schedule/ui/views/bulan-view';
import { HariView } from '@/features/admin-schedule/ui/views/hari-view';
import { MingguView } from '@/features/admin-schedule/ui/views/minggu-view';
import { ServiceLegendItem } from '@/features/admin-schedule/ui/components/service-legend';

const NOOP = () => {};
const VIEW_MODES: ViewMode[] = ['Hari', 'Minggu', 'Bulan'];

export function OwnerScheduleSection() {
  const [date, setDate] = useState<string>('');
  useEffect(() => {
    if (!date) setDate(todayKey());
  }, [date]);
  const [view, setView] = useState<ViewMode>('Hari');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const settingsQuery = useSettings();
  const globalSlots = settingsQuery.data?.data.slotsOfDay ?? [];

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
      queryKey: [
        'clinic',
        'booking',
        'list',
        { date: d, limit: 200, includeCancelled: false },
      ],
      queryFn: () =>
        bookingApi.list({ date: d, limit: 200, includeCancelled: false }),
    })),
  });
  const isLoading =
    dayQueries.some((q) => q.isLoading) || psikologList.isLoading;
  const bookingsStamp = dayQueries.map((q) => q.dataUpdatedAt).join(',');
  const allBookings = useMemo<Booking[]>(
    () => dayQueries.flatMap((q) => q.data?.data ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookingsStamp],
  );
  const filteredBookings = useMemo(
    () => applyFilters(allBookings, filters),
    [allBookings, filters],
  );

  const availEnabled = view === 'Hari' || view === 'Minggu';
  const { resolve: resolveAvailability } = useAvailabilityMap({
    psikologs,
    from: datesToFetch[0] ?? '',
    to: datesToFetch[datesToFetch.length - 1] ?? '',
    enabled: availEnabled,
  });
  const psikologsForAvail = useMemo(
    () =>
      filters.psikologIds.size > 0
        ? psikologs.filter((p) => filters.psikologIds.has(p.userId))
        : psikologs,
    [psikologs, filters.psikologIds],
  );

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

function OwnerScheduleToolbar({
  date,
  view,
  dateLabel,
  activeFilterCount,
  filterChildren,
  onShiftPrev,
  onShiftNext,
  onPickDate,
  onResetToToday,
  onChangeView,
  onToggleFilter,
}: {
  date: string;
  view: ViewMode;
  dateLabel: string;
  activeFilterCount: number;
  filterChildren: React.ReactNode;
  onShiftPrev: () => void;
  onShiftNext: () => void;
  onPickDate: (next: string) => void;
  onResetToToday: () => void;
  onChangeView: (next: ViewMode) => void;
  onToggleFilter: () => void;
}) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      style={{
        padding: '18px 28px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        position: 'relative',
      }}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onShiftPrev}
          className="btn btn-outline btn-sm btn-icon"
          aria-label={`${view} sebelumnya`}
        >
          <ChevronLeft size={15} />
        </button>
        <button
          type="button"
          onClick={() =>
            dateInputRef.current?.showPicker?.() ??
            dateInputRef.current?.focus()
          }
          className="flex items-center gap-2"
          style={{
            background: 'var(--bg-elev, var(--cream-50))',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '6px 14px',
            height: 36,
            cursor: 'pointer',
            position: 'relative',
          }}
          title="Pilih tanggal"
        >
          <CalendarDays size={15} style={{ color: 'var(--sage-600)' }} />
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 500,
              color: 'var(--teal-800)',
            }}
          >
            {dateLabel}
          </span>
          <input
            ref={dateInputRef}
            type="date"
            value={date}
            onChange={(e) => e.target.value && onPickDate(e.target.value)}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
              width: '100%',
              height: '100%',
            }}
            aria-label="Pilih tanggal"
          />
        </button>
        <button
          type="button"
          onClick={onShiftNext}
          className="btn btn-outline btn-sm btn-icon"
          aria-label={`${view} berikutnya`}
        >
          <ChevronRight size={15} />
        </button>
        <button
          type="button"
          onClick={onResetToToday}
          className="btn btn-ghost btn-sm"
          style={{ marginLeft: 4 }}
          title="Kembali ke hari ini"
        >
          Hari ini
        </button>

        <div
          style={{
            display: 'inline-flex',
            background: 'var(--cream-100)',
            borderRadius: 8,
            padding: 3,
            marginLeft: 8,
          }}
        >
          {VIEW_MODES.map((v) => {
            const active = view === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onChangeView(v)}
                className="btn btn-sm"
                style={{
                  background: active ? 'var(--bg-elev, #fff)' : 'transparent',
                  boxShadow: active
                    ? 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05))'
                    : 'none',
                  color: active ? 'var(--teal-800)' : 'var(--fg-muted)',
                  height: 28,
                  padding: '0 12px',
                }}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="flex items-center gap-2"
        style={{ position: 'relative' }}
      >
        <button
          type="button"
          onClick={onToggleFilter}
          className="btn btn-outline btn-sm"
          style={{
            background:
              activeFilterCount > 0 ? 'var(--sage-50)' : undefined,
            borderColor:
              activeFilterCount > 0 ? 'var(--sage-300)' : undefined,
          }}
        >
          <Filter size={14} /> Filter
          {activeFilterCount > 0 ? (
            <span
              className="badge badge-sage"
              style={{
                height: 18,
                fontSize: 10,
                marginLeft: 4,
                padding: '0 6px',
              }}
            >
              {activeFilterCount}
            </span>
          ) : null}
        </button>
        {filterChildren}
      </div>
    </div>
  );
}
