'use client';

import { useMemo } from 'react';
import { CalendarDays, Clock, Stethoscope, TrendingUp, Users } from 'lucide-react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { useClientList } from '@/features/admin-clients/hooks/use-client';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function OwnerDashboardPage() {
  const today = useBookingList({ date: todayKey(), limit: 200 });
  const clients = useClientList({ limit: 1 });
  const psikologs = usePsikologList({ limit: 1, isActive: true });
  const allBookings = useBookingList({ limit: 200 });

  const stats = useMemo(() => {
    const items = today.data?.data ?? [];
    const completed = items.filter((b) => b.status === 'completed').length;
    const inProgress = items.filter((b) => b.status === 'in_progress').length;
    const upcoming = items.filter((b) => ['confirmed', 'checked_in'].includes(b.status)).length;

    // Revenue estimate: completed sessions × basePrice
    const revenue = items
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + Number(b.service.basePrice), 0);

    // Utilization: completed / total slots (assume 6 slots × n psikolog)
    const totalPsikolog = psikologs.data?.meta.total ?? 0;
    const totalSlots = totalPsikolog * 6; // 6 time slots/day per psikolog (default)
    const utilization = totalSlots > 0 ? Math.round((items.length / totalSlots) * 100) : 0;

    return { completed, inProgress, upcoming, revenue, utilization, total: items.length };
  }, [today.data, psikologs.data]);

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="h1">Owner Dashboard</h1>
        <p className="caption mt-1">KPI klinik hari ini, {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<CalendarDays className="h-5 w-5" />} label="Sesi Hari Ini" value={stats.total} sub={`${stats.completed} selesai, ${stats.inProgress} berlangsung`} />
        <KpiCard icon={<Clock className="h-5 w-5" />} label="Mendatang" value={stats.upcoming} sub="confirmed / checked-in" />
        <KpiCard icon={<TrendingUp className="h-5 w-5" />} label="Utilisasi" value={`${stats.utilization}%`} sub={`${psikologs.data?.meta.total ?? 0} psikolog × 6 slot`} />
        <KpiCard icon={<Stethoscope className="h-5 w-5" />} label="Revenue" value={`Rp ${stats.revenue.toLocaleString('id-ID')}`} sub="dari sesi completed" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-althea p-4">
          <h2 className="h2 mb-3">Total Klien</h2>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-sage-500" />
            <div className="text-3xl font-bold text-teal-800">{clients.data?.meta.total ?? 0}</div>
          </div>
          <p className="caption mt-2">Klien terdaftar di sistem.</p>
        </div>

        <div className="card-althea p-4">
          <h2 className="h2 mb-3">Total Booking (all-time)</h2>
          <div className="text-3xl font-bold text-teal-800">{allBookings.data?.meta.total ?? 0}</div>
          <p className="caption mt-2">Termasuk completed dan cancelled.</p>
        </div>
      </div>

      <div className="card-althea-flat p-3 caption text-fg-muted">
        💡 Slice 12 polish (next session): aggregate stats endpoint untuk historical data,
        chart trend per minggu/bulan, breakdown per psikolog, revenue breakdown per service category.
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="card-althea p-4">
      <div className="flex items-center gap-2 caption">
        <span className="text-sage-600">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="mt-2 text-2xl font-bold text-teal-800">{value}</div>
      {sub && <div className="caption mt-1 text-fg-muted">{sub}</div>}
    </div>
  );
}
