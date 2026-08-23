import { prisma } from '@/lib/prisma';
import { Card, Tabel, Kosong, rp } from '@/components/ui/primitives';

export async function TabTransaksi() {
  const rows = await prisma.transaksiKas.findMany({ orderBy: { tgl: 'desc' }, take: 40 });

  return (
    <Card judul="Riwayat transaksi kas yayasan">
      {rows.length === 0 ? (
        <Kosong pesan="Belum ada transaksi kas tercatat." />
      ) : (
        <Tabel kolom={['Tanggal', 'Kode', 'Uraian', 'Metode', { label: 'Nominal', num: true }]}>
          {rows.map((t) => (
            <tr key={String(t.id)}>
              <td>{t.tgl.toLocaleDateString('id-ID', { dateStyle: 'medium' })}</td>
              <td className="muted">{t.kode}</td>
              <td>{t.uraian}<div className="muted">{t.kategori}</div></td>
              <td className="muted">{t.metode}</td>
              <td className="num" style={{ fontWeight: 700, color: t.arah === 'Masuk' ? '#0F6B3D' : '#B91C1C' }}>
                {t.arah === 'Masuk' ? '+' : '-'} {rp(Number(t.nominal))}
              </td>
            </tr>
          ))}
        </Tabel>
      )}
    </Card>
  );
}
