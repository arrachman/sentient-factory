import { prisma } from '@/lib/prisma';
import { Card, Avatar, Tabel, Badge, Kosong, rp } from '@/components/ui/primitives';

/** Status tagihan diturunkan dari rasio dibayar/nominal — bukan kolom terpisah. */
function statusTagihan(nominal: number, dibayar: number): string {
  if (dibayar <= 0) return 'Belum bayar';
  if (dibayar >= nominal) return 'Lunas';
  return 'Sebagian';
}

export async function TabTagihan({ q }: { q: string }) {
  const [rows, tarifPerJenis] = await Promise.all([
    prisma.tagihan.findMany({
      where: q ? { santri: { orang: { nama: { contains: q } } } } : undefined,
      include: { santri: { include: { orang: true, unit: true } } },
      orderBy: { jatuhTempo: 'desc' },
      take: 30,
    }),
    // Nominal berlaku per jenis diambil dari tagihan dengan periode terbaru untuk jenis tsb.
    prisma.tagihan.groupBy({ by: ['jenis'], _max: { periode: true, jatuhTempo: true }, orderBy: { jenis: 'asc' } }),
  ]);

  const tarif = await Promise.all(
    tarifPerJenis.map(async (t) => {
      const contoh = await prisma.tagihan.findFirst({
        where: { jenis: t.jenis, periode: t._max.periode ?? undefined },
        orderBy: { jatuhTempo: 'desc' },
      });
      return { item: t.jenis, ket: `periode ${t._max.periode ?? '-'}`, n: rp(Number(contoh?.nominal ?? 0)) };
    }),
  );

  return (
    <div className="grid g2" style={{ gridTemplateColumns: '1fr 300px', alignItems: 'start' }}>
      <Card judul="Tagihan santri" sub={q ? `Pencarian: "${q}"` : 'Seluruh tagihan, diurutkan dari jatuh tempo terbaru.'}>
        <form method="get" style={{ marginBottom: 14, display: 'flex', gap: 8 }}>
          <input type="hidden" name="tab" value="tagihan" />
          <input
            className="field"
            name="q"
            defaultValue={q}
            placeholder="Cari nama santri"
            style={{ minWidth: 220 }}
          />
          <button type="submit" className="btn">Cari</button>
        </form>
        {rows.length === 0 ? (
          <Kosong pesan="Tidak ada tagihan yang cocok dengan pencarian." />
        ) : (
          <Tabel kolom={['Santri', 'Komponen', { label: 'Tagihan', num: true }, { label: 'Sisa', num: true }, 'Status']}>
            {rows.map((t) => {
              const nominal = Number(t.nominal);
              const dibayar = Number(t.dibayar);
              const sisa = Math.max(0, nominal - dibayar);
              const status = statusTagihan(nominal, dibayar);
              return (
                <tr key={String(t.id)}>
                  <td>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Avatar nama={t.santri.orang.nama} size={30} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{t.santri.orang.nama}</div>
                        <div className="muted">{t.santri.nis} · {t.santri.unit?.nama ?? '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {t.jenis}
                    <div className="muted">jatuh tempo {t.jatuhTempo.toLocaleDateString('id-ID', { dateStyle: 'medium' })}</div>
                  </td>
                  <td className="num">{rp(nominal)}</td>
                  <td className="num" style={{ color: sisa > 0 ? '#B91C1C' : undefined, fontWeight: 700 }}>{rp(sisa)}</td>
                  <td><Badge status={status} /></td>
                </tr>
              );
            })}
          </Tabel>
        )}
      </Card>
      <Card judul="Nominal berjalan per jenis" sub="Diambil dari periode tagihan terbaru tiap jenis.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tarif.length === 0 ? <Kosong /> : tarif.map((x) => (
            <div key={x.item} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, paddingBottom: 9, borderBottom: '1px solid #F5F2EA' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{x.item}</div>
                <div className="muted">{x.ket}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--hijau-gelap)' }}>{x.n}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
