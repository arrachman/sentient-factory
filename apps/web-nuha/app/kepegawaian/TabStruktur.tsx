import { prisma } from '@/lib/prisma';
import { Card, Tabel, Kosong } from '@/components';
import { TANPA_LEMBAGA, type FilterPegawai } from './filter';

// Jabatan struktural BUKAN peran RBAC (lihat prisma/import/import-struktur.ts)
// — tab ini murni tampilan data organisasi dari SK, tanpa mutasi.
export async function TabStruktur({ f }: { f: FilterPegawai }) {
  // Struktur disaring lewat kolom `lingkup` SK ("MA", "Pondok"), bukan relasi
  // pegawai — banyak baris SK belum terhubung ke data Pegawai.
  const lingkup = f.unit && f.unit !== TANPA_LEMBAGA ? f.unit : undefined;
  const baris = await prisma.jabatanStruktural.findMany({
    where: lingkup ? { lingkup } : {},
    include: { pegawai: { include: { orang: true } } },
    orderBy: [{ lingkup: 'asc' }, { skNomor: 'asc' }, { urutan: 'asc' }],
  });

  const kelompok = new Map<string, typeof baris>();
  for (const b of baris) {
    const key = `${b.lingkup} — SK ${b.skNomor}`;
    kelompok.set(key, [...(kelompok.get(key) ?? []), b]);
  }

  return (
    <Card
      judul={`Struktur Organisasi — ${baris.length} baris`}
      sub="Dari SK pengangkatan. Jabatan struktural (bukan peran login/RBAC) — akses menu tetap diatur lewat Peran."
    >
      {baris.length === 0 ? (
        <Kosong pesan="Belum ada data struktur organisasi." />
      ) : (
        [...kelompok.entries()].map(([judulGrup, grup]) => (
          <div key={judulGrup} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.5rem' }}>{judulGrup}</h3>
            <Tabel kolom={['Jabatan', 'Divisi', 'Nama (SK)', 'Pegawai terhubung', 'Periode']}>
              {grup.map((b) => (
                <tr key={String(b.id)}>
                  <td>{b.jabatan}</td>
                  <td>{b.divisi ?? <span style={{ opacity: 0.6 }}>—</span>}</td>
                  <td>{b.namaMentah}</td>
                  <td>
                    {b.pegawai ? (
                      <span className="badge badge-hijau">{b.pegawai.orang.nama}</span>
                    ) : (
                      <span className="badge badge-netral">belum terhubung</span>
                    )}
                  </td>
                  <td>
                    {b.periodeMulai.toLocaleDateString('id-ID')} – {b.periodeSelesai.toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </Tabel>
          </div>
        ))
      )}
    </Card>
  );
}
