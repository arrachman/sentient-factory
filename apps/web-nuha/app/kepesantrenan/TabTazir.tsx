import { prisma } from '@/lib/prisma';
import { Kosong, Tabel } from '@/components';

/** Akumulasi poin dihitung berjalan per santri, urut tanggal — bukan angka hardcode. */
export async function TabTazir() {
  const tazir = await prisma.tazir.findMany({
    include: { santri: { include: { orang: true, kamar: true } } },
    orderBy: { tgl: 'asc' },
  });

  const akumulasi = new Map<string, number>();
  const baris = tazir.map((t) => {
    const key = String(t.santriId);
    const total = (akumulasi.get(key) ?? 0) + t.poin;
    akumulasi.set(key, total);
    return { ...t, total };
  });
  baris.reverse(); // tampilkan terbaru di atas

  return (
    <div className="card">
      <div className="card-judul" style={{ marginBottom: 4 }}>Buku pelanggaran &amp; poin ta&apos;zir</div>
      <div className="muted" style={{ marginBottom: 14 }}>
        Akumulasi 25 poin memicu panggilan wali; 50 poin sidang pengasuh.
      </div>
      {baris.length === 0 ? (
        <Kosong pesan="Belum ada catatan pelanggaran." />
      ) : (
        <Tabel kolom={['Tanggal', 'Santri', 'Pelanggaran', 'Sanksi', { label: 'Poin', num: true }, { label: 'Akumulasi', num: true }]}>
          {baris.map((t) => (
            <tr key={String(t.id)}>
              <td>{t.tgl.toLocaleDateString('id-ID')}</td>
              <td>
                {t.santri.orang.nama}
                <div className="muted" style={{ fontSize: 11.5 }}>Kamar {t.santri.kamar?.kode ?? '—'}</div>
              </td>
              <td>{t.pelanggaran}</td>
              <td>
                {t.sanksi ?? '—'}
                <div className="muted" style={{ fontSize: 11.5 }}>{t.petugas}</div>
              </td>
              <td className="num"><span className="badge badge-kuning">{t.poin}</span></td>
              <td className="num"><strong style={{ color: '#B91C1C' }}>{t.total}</strong></td>
            </tr>
          ))}
        </Tabel>
      )}
    </div>
  );
}
