import { TabLembaga } from '@/components';
import { hrefInduk, type FilterInduk } from './filter';
import type { PohonInduk } from './pohon';

/** Tab lembaga /induk di atas `TabLembaga` bersama.
 *
 * Sengaja memetakan ke parameter `unit=` yang sudah ada, bukan `?tab=`: kunci
 * `tab` sudah dipakai tab profil santri (Biodata/Akademik/…), dan menumpuk dua
 * arti pada satu kunci membuat URL tak bisa dibookmark dengan benar. Pohon
 * lembaga di bawahnya tetap hidup dan tersinkron — keduanya menulis filter sama.
 */
export function TabUnit({ pohon, f }: { pohon: PohonInduk; f: FilterInduk }) {
  // Di cabang alumni, lembaga aktif dibaca dari `alumniUnitId` supaya tab tidak
  // padam saat operator menelusuri alumni per lembaga.
  const modeAlumni = typeof f.alumniUnitId === 'number';
  const aktifId = f.alumniUnitId ?? f.unitId;

  return (
    <TabLembaga
      items={pohon.unit.map((u) => ({ key: String(u.id), label: u.nama, jumlah: u.jumlah }))}
      aktif={aktifId ? String(aktifId) : undefined}
      jumlahSemua={pohon.total}
      hrefItem={(key) => {
        if (!key) return hrefInduk(f, { unitId: undefined, kelasId: undefined, alumniUnitId: undefined });
        const id = Number(key);
        // Berpindah lembaga selalu mereset kelas — rombel milik lembaga lama tidak
        // ada di lembaga baru, jadi menahannya hanya menghasilkan daftar kosong.
        return modeAlumni
          ? hrefInduk(f, { alumniUnitId: id })
          : hrefInduk(f, { unitId: id, kelasId: undefined });
      }}
    />
  );
}
