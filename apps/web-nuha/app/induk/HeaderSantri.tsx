import { Avatar, Badge } from '@/components/ui/primitives';

export type SantriDetail = {
  id: bigint;
  nis: string;
  nisn: string | null;
  status: string;
  tahunMasuk: string | null;
  orang: { nama: string; jk: 'L' | 'P' };
  unit: { nama: string } | null;
};

/** Kartu identitas ringkas di puncak panel detail — konsisten di semua tab. */
export function HeaderSantri({ sel }: { sel: SantriDetail }) {
  const peran = sel.status === 'Mukim'
    ? `Siswa ${sel.unit?.nama ?? '-'} · Santri mukim`
    : sel.status === 'Kalong'
      ? `Siswa ${sel.unit?.nama ?? '-'} (santri kalong)`
      : `Siswa ${sel.unit?.nama ?? '-'}`;

  return (
    <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Avatar nama={sel.orang.nama} size={62} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 200 }}>
        <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 21, color: 'var(--hijau-gelap)', fontWeight: 600 }}>{sel.orang.nama}</div>
        <div style={{ fontSize: 13, color: 'var(--teks-2)' }}>
          NIS {sel.nis} · NISN {sel.nisn ?? '-'} · {sel.orang.jk === 'L' ? 'Putra' : 'Putri'}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--hijau)', fontWeight: 600 }}>{peran}</div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Badge status={sel.status} />
        {sel.tahunMasuk && <span className="badge badge-netral">Angkatan {sel.tahunMasuk}</span>}
      </div>
    </div>
  );
}
