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

const JEDA = 'jeda';

/** Ringkas daftar halaman jadi maks ~7 slot: 1 … n-1 [n] n+1 … total. */
function slotHalaman(halaman: number, totalHalaman: number): (number | typeof JEDA)[] {
  if (totalHalaman <= 7) return Array.from({ length: totalHalaman }, (_, i) => i + 1);
  const sekitar = new Set([1, totalHalaman, halaman, halaman - 1, halaman + 1]);
  if (halaman <= 3) [2, 3, 4].forEach((p) => sekitar.add(p));
  if (halaman >= totalHalaman - 2) [totalHalaman - 3, totalHalaman - 2, totalHalaman - 1].forEach((p) => sekitar.add(p));
  const nomor = [...sekitar].filter((p) => p >= 1 && p <= totalHalaman).sort((a, b) => a - b);
  const slot: (number | typeof JEDA)[] = [];
  nomor.forEach((p, i) => {
    if (i > 0 && p - nomor[i - 1] > 1) slot.push(JEDA);
    slot.push(p);
  });
  return slot;
}

/** Footer pager: "Menampilkan X–Y dari Z" + link nomor halaman. Dipakai bersama util `bacaHalaman`. */
export function Pagination({ halaman, totalHalaman, total, jumlahBaris, ukuranHalaman, buatHref, ekstra }: Props) {
  const awal = jumlahBaris === 0 ? 0 : (halaman - 1) * ukuranHalaman + 1;
  const akhir = (halaman - 1) * ukuranHalaman + jumlahBaris;
  const slot = slotHalaman(halaman, totalHalaman);
  return (
    <div className="bilah-footer">
      <span className="muted" style={{ fontSize: 12.5 }}>
        Menampilkan {awal}–{akhir} dari {total}
      </span>
      <div className="bilah-footer-kanan">
        {ekstra}
        {totalHalaman > 1 && <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {slot.map((p, i) => p === JEDA
            ? <span key={`jeda-${i}`} className="muted" style={{ padding: '0 2px', fontSize: 12.5 }}>…</span>
            : <a
                key={p}
                href={buatHref(p)}
                aria-current={p === halaman ? 'page' : undefined}
                className={`btn-sekunder ${p === halaman ? 'active' : ''}`}
                style={{ minWidth: 34, textAlign: 'center', padding: '7px 10px', borderRadius: 9, textDecoration: 'none', fontSize: 12.5, fontWeight: 600 }}
              >
                {p}
              </a>)}
        </div>}
      </div>
    </div>
  );
}
