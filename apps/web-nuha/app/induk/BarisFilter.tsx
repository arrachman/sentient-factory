import Link from 'next/link';
import { hrefInduk, jumlahFilterAktif, STATUS_SANTRI, type FilterInduk } from './filter';

const CHIP: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
  borderRadius: 999, fontSize: 11.5, fontWeight: 700, border: '1px solid var(--garis)',
  background: '#fff', color: 'var(--teks-2)', whiteSpace: 'nowrap',
};

/** Satu tombol pilihan yang menyala saat nilainya sedang dipakai; klik ulang mematikannya. */
function Opsi({ f, ubah, aktif, anak }: { f: FilterInduk; ubah: Partial<FilterInduk>; aktif: boolean; anak: React.ReactNode }) {
  const mati = Object.fromEntries(Object.keys(ubah).map((k) => [k, undefined])) as Partial<FilterInduk>;
  return (
    <Link
      href={hrefInduk(f, aktif ? mati : ubah)}
      style={{
        ...CHIP,
        background: aktif ? 'var(--hijau)' : '#fff',
        borderColor: aktif ? 'var(--hijau)' : 'var(--garis)',
        color: aktif ? 'var(--krem)' : 'var(--teks-2)',
      }}
    >
      {anak}
    </Link>
  );
}

function Kelompok({ judul, anak }: { judul: string; anak: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
      <span className="label" style={{ fontSize: 10.5 }}>{judul}</span>
      {anak}
    </div>
  );
}

/** Penyaring cepat di atas daftar. Semua pilihan berupa tautan (bukan form),
 * jadi satu klik = satu keadaan URL yang bisa dibookmark dan di-back. */
export function BarisFilter({ f, angkatan, hasil }: { f: FilterInduk; angkatan: string[]; hasil: number }) {
  const aktif = jumlahFilterAktif(f);
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <form action="/induk" method="get" style={{ display: 'flex', gap: 7, alignItems: 'center', flex: '1 1 260px' }}>
          {f.unitId && <input type="hidden" name="unit" value={f.unitId} />}
          {f.kelasId && <input type="hidden" name="kelas" value={f.kelasId} />}
          {f.status && <input type="hidden" name="status" value={f.status} />}
          {f.jk && <input type="hidden" name="jk" value={f.jk} />}
          {f.angkatan && <input type="hidden" name="angkatan" value={f.angkatan} />}
          <input
            type="search"
            name="q"
            defaultValue={f.q}
            placeholder="Cari nama, NIS, atau NISN…"
            aria-label="Cari santri"
            style={{ flex: 1, minWidth: 0 }}
          />
          <button type="submit" className="btn-sekunder" style={{ padding: '7px 14px', fontSize: 12.5, borderRadius: 9, cursor: 'pointer' }}>
            Cari
          </button>
        </form>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="muted" style={{ fontSize: 12.5 }}>
            <strong style={{ color: 'var(--teks-kuat)' }}>{hasil}</strong> santri cocok
          </span>
          {aktif > 0 && (
            <Link href="/induk" style={{ ...CHIP, borderStyle: 'dashed' }}>
              Hapus {aktif} filter
            </Link>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', borderTop: '1px solid var(--garis)', paddingTop: 10 }}>
        <Kelompok
          judul="Status"
          anak={STATUS_SANTRI.map((s) => (
            <Opsi key={s} f={f} ubah={{ status: s }} aktif={f.status === s} anak={s} />
          ))}
        />
        <Kelompok
          judul="Jenis kelamin"
          anak={(['L', 'P'] as const).map((j) => (
            <Opsi key={j} f={f} ubah={{ jk: j }} aktif={f.jk === j} anak={j === 'L' ? 'Putra' : 'Putri'} />
          ))}
        />
        {angkatan.length > 0 && (
          <Kelompok
            judul="Angkatan"
            anak={angkatan.map((a) => (
              <Opsi key={a} f={f} ubah={{ angkatan: a }} aktif={f.angkatan === a} anak={a} />
            ))}
          />
        )}
      </div>
    </div>
  );
}
