'use client';

import { useCallback, useEffect, useState } from 'react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import {
  type PeriodMode,
  formatRangeLabel,
  resolveRange,
  shiftAnchor,
  todayKey,
} from '../model/period';
import { OwnerPeriodToolbar } from './owner-period-toolbar';
import { RoomUsageMonthly } from './room-usage-monthly';
import { RoomUsageSection } from './room-usage-section';
import { RoomUsageWeekly } from './room-usage-weekly';

export function OwnerRuanganPage() {
  const [mode, setMode] = useState<PeriodMode>('Harian');
  const [anchor, setAnchor] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  // Hydrate anchor client-side to avoid SSR mismatch.
  useEffect(() => {
    if (!anchor) {
      const t = todayKey();
      setAnchor(t);
      setSelectedDay(t);
    }
  }, [anchor]);

  // Reset selectedDay to anchor when mode or anchor changes.
  useEffect(() => {
    if (anchor) setSelectedDay(anchor);
  }, [mode, anchor]);

  const range = resolveRange(mode, anchor);
  const rangeLabel = formatRangeLabel(range);

  const onShiftPrev = useCallback(
    () => anchor && setAnchor((a) => shiftAnchor(mode, a, -1)),
    [anchor, mode],
  );
  const onShiftNext = useCallback(
    () => anchor && setAnchor((a) => shiftAnchor(mode, a, 1)),
    [anchor, mode],
  );

  const bookingsQuery = useBookingList(
    anchor
      ? {
          ...(mode === 'Harian'
            ? { date: anchor }
            : { dateFrom: range.from, dateTo: range.to }),
          limit: mode === 'Harian' ? 200 : 500,
          includeCancelled: false,
        }
      : { limit: 1 },
  );

  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });

  const allBookings = bookingsQuery.data?.data ?? [];
  const rooms = roomList.data?.data ?? [];
  const psikologs = psikologList.data?.data ?? [];

  if (!anchor) return null;

  return (
    <div className="flex flex-col p-6 gap-4">
      <OwnerPeriodToolbar
        anchor={anchor}
        mode={mode}
        rangeLabel={rangeLabel}
        onShiftPrev={onShiftPrev}
        onShiftNext={onShiftNext}
        onPickDate={setAnchor}
        onResetToToday={() => setAnchor(todayKey())}
        onChangeMode={setMode}
      />

      {mode === 'Harian' && (
        <RoomUsageSection
          rooms={rooms}
          todayBookings={allBookings}
          psikologs={psikologs}
          dateKey={anchor}
        />
      )}

      {mode === 'Mingguan' && (
        <RoomUsageWeekly
          rooms={rooms}
          allBookings={allBookings}
          psikologs={psikologs}
          range={range}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />
      )}

      {mode === 'Bulanan' && (
        <RoomUsageMonthly
          rooms={rooms}
          allBookings={allBookings}
          range={range}
        />
      )}
    </div>
  );
}
