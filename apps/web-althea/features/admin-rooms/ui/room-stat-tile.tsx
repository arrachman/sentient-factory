/**
 * StatTile — kartu metrik kecil di header halaman Pemakaian Ruangan.
 * Re-usable jadi dipisah supaya bisa dites & diukur sendiri.
 */
export function StatTile({
  lbl,
  val,
  sub,
}: {
  lbl: string;
  val: string | number;
  sub?: string;
}) {
  return (
    <div className="card-althea-flat" style={{ padding: 14 }}>
      <div className="caption" style={{ marginBottom: 6 }}>
        {lbl}
      </div>
      <div className="row gap-2" style={{ alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 26,
            fontWeight: 500,
            color: 'var(--teal-800)',
          }}
        >
          {val}
        </span>
        {sub ? <span className="caption">{sub}</span> : null}
      </div>
    </div>
  );
}
