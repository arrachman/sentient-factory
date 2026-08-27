import type { ReactNode } from 'react';

type Props = {
  halaman: number;
  totalHalaman: number;
  total: number;
  jumlahBaris: number;
  ukuranHalaman: number;
  buatHref: (halaman: number) => string;
  /** Kontrol tambahan di sisi kanan, mis. pemilih baris per halaman. */
  ekstra?: ReactNode;
};

const GAYA_TOMBOL = {
  minWidth: 34,
  textAlign: 'center' as const,
  padding: '7px 10px',
  borderRadius: 9,
  textDecoration: 'none',
  fontSize: 12.5,
  fontWeight: 600,
};

type TombolProps = { label: string; judul: string; tujuan: number; aktif: boolean; buatHref: (halaman: number) => string };

/** Satu tombol navigasi; jadi <span> non-klik saat sudah di ujung. */
function TombolNav({ label, judul, tujuan, aktif, buatHref }: TombolProps) {
  if (!aktif) {
    return (
      <span className="btn-sekunder" aria-disabled="true" title={judul} style={{ ...GAYA_TOMBOL, opacity: 0.45, cursor: 'default' }}>
        {label}
      </span>
    );
  }
  return (
    <a className="btn-sekunder" href={buatHref(tujuan)} title={judul} aria-label={judul} style={GAYA_TOMBOL}>
      {label}
    </a>
  );
}

/** Footer pager: "Menampilkan X–Y dari Z" + navigasi awal/sebelumnya/berikutnya/akhir. Dipakai bersama util `bacaHalaman`. */
export function Pagination({ halaman, totalHalaman, total, jumlahBaris, ukuranHalaman, buatHref, ekstra }: Props) {
  const awal = jumlahBaris === 0 ? 0 : (halaman - 1) * ukuranHalaman + 1;
  const akhir = (halaman - 1) * ukuranHalaman + jumlahBaris;
  const adaSebelum = halaman > 1;
  const adaSesudah = halaman < totalHalaman;
  return (
    <div className="bilah-footer">
      <span className="muted" style={{ fontSize: 12.5 }}>
        Menampilkan {awal}–{akhir} dari {total}
      </span>
      <div className="bilah-footer-kanan">
        {ekstra}
        {totalHalaman > 1 && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <TombolNav label="«" judul="Halaman pertama" tujuan={1} aktif={adaSebelum} buatHref={buatHref} />
            <TombolNav label="‹" judul="Halaman sebelumnya" tujuan={halaman - 1} aktif={adaSebelum} buatHref={buatHref} />
            <span className="muted" style={{ padding: '0 4px', fontSize: 12.5, fontWeight: 600 }}>
              Halaman {halaman} dari {totalHalaman}
            </span>
            <TombolNav label="›" judul="Halaman berikutnya" tujuan={halaman + 1} aktif={adaSesudah} buatHref={buatHref} />
            <TombolNav label="»" judul="Halaman terakhir" tujuan={totalHalaman} aktif={adaSesudah} buatHref={buatHref} />
          </div>
        )}
      </div>
    </div>
  );
}
