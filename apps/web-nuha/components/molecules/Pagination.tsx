type Props = {
  halaman: number;
  totalHalaman: number;
  total: number;
  jumlahBaris: number;
  ukuranHalaman: number;
  buatHref: (halaman: number) => string;
};

/** Footer pager: "Menampilkan X–Y dari Z" + link nomor halaman. Dipakai bersama util `bacaHalaman`. */
export function Pagination({ halaman, totalHalaman, total, jumlahBaris, ukuranHalaman, buatHref }: Props) {
  const awal = jumlahBaris === 0 ? 0 : (halaman - 1) * ukuranHalaman + 1;
  const akhir = (halaman - 1) * ukuranHalaman + jumlahBaris;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
      <span className="muted" style={{ fontSize: 12.5 }}>
        Menampilkan {awal}–{akhir} dari {total}
      </span>
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((p) => (
          <a
            key={p}
            href={buatHref(p)}
            className={`btn-sekunder ${p === halaman ? 'active' : ''}`}
            style={{ minWidth: 34, textAlign: 'center', padding: '7px 10px', borderRadius: 9, textDecoration: 'none', fontSize: 12.5, fontWeight: 600 }}
          >
            {p}
          </a>
        ))}
      </div>
    </div>
  );
}
