import Link from 'next/link';
import { Avatar, Kosong } from '@/components/ui/primitives';

export type BarisDaftar = {
  id: bigint;
  orang: { nama: string };
  kelas: { nama: string } | null;
  unit: { nama: string } | null;
};

/** Panel kiri: pencarian + daftar orang. Seleksi dibawa lewat query ?sel=, bukan state klien. */
export function DaftarSantri({ daftar, q, selId }: { daftar: BarisDaftar[]; q: string; selId?: bigint }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <form action="/induk" method="get" className="field" style={{ margin: 0 }}>
        <label htmlFor="q-induk">Cari orang</label>
        <input id="q-induk" type="text" name="q" defaultValue={q} placeholder="Nama santri / siswa" />
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 560, overflowY: 'auto' }}>
        {daftar.length === 0 && <Kosong pesan="Tidak ada santri yang cocok dengan pencarian." />}
        {daftar.map((baris) => {
          const aktif = selId !== undefined && baris.id === selId;
          const href = `/induk?sel=${baris.id}${q ? `&q=${encodeURIComponent(q)}` : ''}`;
          return (
            <Link
              key={String(baris.id)}
              href={href}
              style={{
                display: 'flex', gap: 10, alignItems: 'center', padding: '9px 10px', borderRadius: 10,
                borderLeft: `3px solid ${aktif ? 'var(--hijau)' : 'transparent'}`,
                background: aktif ? 'var(--krem-3)' : 'transparent',
              }}
            >
              <Avatar nama={baris.orang.nama} size={30} />
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--teks-kuat)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {baris.orang.nama}
                </div>
                <div className="muted" style={{ fontSize: 11 }}>{baris.kelas?.nama ?? '-'} · {baris.unit?.nama ?? '-'}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
