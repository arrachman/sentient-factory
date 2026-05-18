'use client';

/**
 * Owner · Pemakaian Ruangan — halaman dedicated berisi grid Slot × Ruangan
 * untuk hari ini (read-only). Mirror dari section lama di /owner/dashboard.
 */
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { todayKey } from '../model/format';
import { RoomUsageSection } from './room-usage-section';

export function OwnerRuanganPage() {
  const today = useBookingList({
    date: todayKey(),
    limit: 200,
    includeCancelled: false,
  });
  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });

  return (
    <div className="flex flex-col p-6 gap-4">
      <RoomUsageSection
        rooms={roomList.data?.data ?? []}
        todayBookings={today.data?.data ?? []}
        psikologs={psikologList.data?.data ?? []}
      />
    </div>
  );
}
