/**
 * 4 stat cards halaman Notifikasi WA: Terkirim hari ini · Tingkat baca ·
 * Gagal kirim · Template aktif.
 */
export function WaStatsRow({
  sentTodayCount,
  readToday,
  readRate,
  failedToday,
  activeTemplates,
  totalTemplates,
}: {
  sentTodayCount: number;
  readToday: number;
  readRate: number;
  failedToday: number;
  activeTemplates: number;
  totalTemplates: number;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        label="Terkirim hari ini"
        value={String(sentTodayCount)}
        sub="Auto refresh tiap 5s"
      />
      <StatCard
        label="Tingkat baca"
        value={`${readRate}%`}
        sub={`${readToday}/${sentTodayCount} hari ini`}
      />
      <StatCard
        label="Gagal kirim"
        value={String(failedToday)}
        sub={failedToday === 0 ? 'tidak ada gagal' : 'cek log untuk detail'}
      />
      <StatCard
        label="Template aktif"
        value={`${activeTemplates}/${totalTemplates}`}
        sub={`${totalTemplates - activeTemplates} dijeda`}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="card-althea p-3">
      <div className="caption mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="brand-mark text-2xl text-teal-800">{value}</span>
        <span className="caption text-xs">{sub}</span>
      </div>
    </div>
  );
}
