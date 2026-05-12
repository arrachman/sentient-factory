/**
 * Legend psikolog yang aktif di hari berjalan — chip warna + nama pendek.
 * Ditampilkan di header card grid pemakaian ruangan.
 */
export type LegendPsikolog = { id: number; short: string; color: string };

export function RoomUsageLegend({
  psikologs,
}: {
  psikologs: LegendPsikolog[];
}) {
  if (psikologs.length === 0) {
    return (
      <span className="caption">Belum ada psikolog terjadwal hari ini</span>
    );
  }
  return (
    <div className="row gap-3" style={{ flexWrap: 'wrap' }}>
      {psikologs.map((p) => (
        <div
          key={p.id}
          className="row gap-1"
          style={{ alignItems: 'center' }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: p.color,
              display: 'inline-block',
            }}
          />
          <span
            className="caption"
            style={{
              fontSize: 11.5,
              color: 'var(--teal-800)',
              fontWeight: 500,
            }}
          >
            {p.short}
          </span>
        </div>
      ))}
    </div>
  );
}
