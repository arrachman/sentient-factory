import { prisma } from '@/lib/prisma';
import { Card, Avatar, Tabel, Badge, Kosong, rp } from '@/components/ui/primitives';

/** Status tagihan diturunkan dari rasio dibayar/nominal — sama seperti TabTagihan. */
function statusTagihan(nominal: number, dibayar: number): string {
  if (dibayar <= 0) return 'Belum bayar';
  if (dibayar >= nominal) return 'Lunas';
  return 'Sebagian';
}

export async function TabSpp({ anakId }: { anakId?: string }) {
  const opsiAnak = await prisma.santri.findMany({
    include: { orang: true },
    orderBy: { orang: { nama: 'asc' } },
  });
  if (opsiAnak.length === 0) return <Kosong pesan="Belum ada data santri." />;

  const terpilih = opsiAnak.find((s) => String(s.id) === anakId) ?? opsiAnak[0];
  const anak = await prisma.santri.findUniqueOrThrow({
    where: { id: terpilih.id },
    include: { orang: true, unit: true, kelas: true },
  });
  const riwayat = await prisma.tagihan.findMany({
    where: { santriId: anak.id },
    include: { pembayaran: { orderBy: { tgl: 'desc' } } },
    orderBy: { jatuhTempo: 'desc' },
  });

  const lunasN = riwayat.filter((t) => Number(t.dibayar) >= Number(t.nominal)).length;
  const totalBayar = riwayat.reduce((sum, t) => sum + Number(t.dibayar), 0);
  const tarifBerjalan = riwayat.length > 0 ? Number(riwayat[0].nominal) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Card>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar nama={anak.orang.nama} size={52} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 19, color: 'var(--hijau-gelap)', fontWeight: 600 }}>{anak.orang.nama}</div>
            <div className="muted">{anak.unit?.nama ?? '-'} {anak.kelas?.nama ?? ''} · NIS {anak.nis} · {anak.status} · tarif {rp(tarifBerjalan)}/tagihan</div>
          </div>
          <form method="get" style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <input type="hidden" name="tab" value="spp" />
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span className="label">Pilih anak</span>
              <select className="field" name="anak" defaultValue={String(anak.id)} style={{ minWidth: 220 }}>
                {opsiAnak.map((o) => (
                  <option key={String(o.id)} value={String(o.id)}>{o.orang.nama}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn">Tampilkan</button>
          </form>
        </div>
      </Card>

      <section className="grid g3">
        <div className="card">
          <div className="label">Tagihan lunas</div>
          <div className="angka" style={{ color: '#0F6B3D' }}>{lunasN} / {riwayat.length}</div>
        </div>
        <div className="card">
          <div className="label">Total diterima</div>
          <div className="angka-sm">{rp(totalBayar)}</div>
        </div>
        <div className="card">
          <div className="label">Tarif berjalan</div>
          <div className="angka-sm" style={{ color: '#E8973A' }}>{rp(tarifBerjalan)}</div>
        </div>
      </section>

      <Card judul="Riwayat tagihan &amp; pembayaran" sub="Seluruh tagihan santri ini yang tercatat di sistem.">
        {riwayat.length === 0 ? (
          <Kosong pesan="Belum ada tagihan tercatat untuk santri ini." />
        ) : (
          <Tabel kolom={['Periode', { label: 'Tagihan', num: true }, { label: 'Dibayar', num: true }, { label: 'Sisa', num: true }, 'Tgl bayar terakhir', 'Metode', 'Status']}>
            {riwayat.map((t) => {
              const nominal = Number(t.nominal);
              const dibayar = Number(t.dibayar);
              const sisa = Math.max(0, nominal - dibayar);
              const bayarTerakhir = t.pembayaran[0];
              return (
                <tr key={String(t.id)}>
                  <td style={{ fontWeight: 600 }}>{t.periode}</td>
                  <td className="num">{rp(nominal)}</td>
                  <td className="num" style={{ color: '#0F6B3D' }}>{rp(dibayar)}</td>
                  <td className="num" style={{ color: sisa > 0 ? '#B91C1C' : undefined }}>{rp(sisa)}</td>
                  <td>{bayarTerakhir ? bayarTerakhir.tgl.toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '—'}</td>
                  <td>{bayarTerakhir?.metode ?? '—'}</td>
                  <td><Badge status={statusTagihan(nominal, dibayar)} /></td>
                </tr>
              );
            })}
          </Tabel>
        )}
      </Card>
    </div>
  );
}
