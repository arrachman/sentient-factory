import Link from 'next/link';
import { Avatar, Kosong } from '@/components';
import { hrefInduk, type FilterInduk } from './filter';

export type BarisDaftar = {
  id: bigint;
  nis: string | null;
  nisn: string | null;
  status: string;
  orang: { nama: string };
  kelas: { nama: string } | null;
  unit: { nama: string } | null;
};

const WARNA_STATUS: Record<string, string> = {
  Mukim: 'badge-hijau',
  Alumni: 'badge-netral',
  Keluar: 'badge-merah',
};

/** Panel daftar hasil. Seleksi dibawa lewat query ?sel= (bukan state klien) supaya
 * satu tautan mewakili satu tampilan penuh: filter + santri terpilih + tab. */
export function DaftarSantri({
  daftar, f, selId, tab, halaman,
}: { daftar: BarisDaftar[]; f: FilterInduk; selId?: bigint; tab?: string; halaman?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {daftar.length === 0 && <Kosong pesan="Tidak ada santri yang cocok dengan penyaring ini." />}
      {daftar.map((baris) => {
        const aktif = selId !== undefined && baris.id === selId;
        return (
          <Link
            key={String(baris.id)}
            href={hrefInduk(f, {}, { sel: baris.id, tab, halaman })}
            scroll={false}
            className="baris-santri"
            style={{
              display: 'flex', gap: 10, alignItems: 'center', padding: '9px 10px', borderRadius: 10,
              borderLeft: `3px solid ${aktif ? 'var(--hijau)' : 'transparent'}`,
              background: aktif ? 'var(--krem-3)' : 'transparent',
            }}
          >
            <Avatar nama={baris.orang.nama} size={30} />
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--teks-kuat)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {baris.orang.nama}
              </div>
              <div className="muted" style={{ fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {baris.nis ?? baris.nisn ?? '—'} · {baris.kelas?.nama ?? 'Belum berkelas'}
              </div>
            </div>
            <span className={`badge ${WARNA_STATUS[baris.status] ?? 'badge-netral'}`} style={{ fontSize: 10, padding: '2px 7px' }}>
              {baris.status}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
