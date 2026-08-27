import Link from 'next/link';
import { hrefInduk, type FilterInduk } from './filter';
import type { PohonInduk } from './pohon';

const baris = (aktif: boolean, indent: number): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
  padding: `6px 10px 6px ${10 + indent * 12}px`, borderRadius: 9, fontSize: 12.5,
  background: aktif ? 'var(--hijau)' : 'transparent',
  color: aktif ? 'var(--krem)' : 'var(--teks-2)',
  fontWeight: aktif ? 700 : 500,
});

function Cacah({ n, aktif }: { n: number; aktif: boolean }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 999,
      background: aktif ? 'rgba(255,255,255,0.22)' : 'var(--krem-3)',
      color: aktif ? 'var(--krem)' : 'var(--teks-lembut)',
    }}
    >
      {n}
    </span>
  );
}

/** Navigasi berjenjang lembaga → tingkat → kelas. Memakai <details> asli browser
 * supaya buka/tutup tetap jalan tanpa JavaScript klien, dan cabang unit terpilih
 * dibuka otomatis lewat prop `open`. */
export function PohonLembaga({ pohon, f }: { pohon: PohonInduk; f: FilterInduk }) {
  const semuaAktif = !f.unitId && !f.kelasId;
  const kelasTerpilihUnit = pohon.unit.find((u) => u.tingkat.some((t) => t.kelas.some((k) => k.id === f.kelasId)))?.id;

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Link href={hrefInduk(f, { unitId: undefined, kelasId: undefined })} style={baris(semuaAktif, 0)}>
        <span>Semua lembaga</span>
        <Cacah n={pohon.total} aktif={semuaAktif} />
      </Link>

      {pohon.unit.map((u) => {
        const unitAktif = f.unitId === u.id && !f.kelasId;
        const terbuka = f.unitId === u.id || kelasTerpilihUnit === u.id;
        return (
          <details key={u.id} open={terbuka}>
            <summary style={{ listStyle: 'none', cursor: 'pointer' }}>
              <span style={baris(unitAktif, 0)}>
                <Link
                  href={hrefInduk(f, { unitId: u.id, kelasId: undefined })}
                  style={{ color: 'inherit', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {u.nama}
                </Link>
                <Cacah n={u.jumlah} aktif={unitAktif} />
              </span>
            </summary>

            {u.tingkat.map((t, i) => {
              if (t.kelas.length === 1) {
                const k = t.kelas[0];
                const aktif = f.kelasId === k.id;
                return (
                  <Link key={t.tingkat} href={hrefInduk(f, { unitId: u.id, kelasId: k.id })} style={baris(aktif, 1)}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.nama}</span>
                    <Cacah n={k.jumlah} aktif={aktif} />
                  </Link>
                );
              }
              return (
                <details key={t.tingkat} open={t.kelas.some((k) => k.id === f.kelasId)}>
                  <summary style={{ listStyle: 'none', cursor: 'pointer' }}>
                    <span style={baris(false, 1)}>
                      <span className="muted" style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3 }}>
                        Kelas {i + 1}
                      </span>
                      <Cacah n={t.jumlah} aktif={false} />
                    </span>
                  </summary>
                  {t.kelas.map((k) => {
                    const aktif = f.kelasId === k.id;
                    return (
                      <Link key={k.id} href={hrefInduk(f, { unitId: u.id, kelasId: k.id })} style={baris(aktif, 2)}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.nama}</span>
                        <Cacah n={k.jumlah} aktif={aktif} />
                      </Link>
                    );
                  })}
                </details>
              );
            })}
          </details>
        );
      })}

      {pohon.tanpaKelas > 0 && (
        <span style={{ ...baris(false, 0), fontStyle: 'italic' }}>
          <span className="muted" style={{ fontSize: 11.5 }}>Belum berkelas</span>
          <Cacah n={pohon.tanpaKelas} aktif={false} />
        </span>
      )}
    </nav>
  );
}
