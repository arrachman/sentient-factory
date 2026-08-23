import { prisma } from '@/lib/prisma';
import { rupiah } from '@/lib/gaji';
import { Badge, Kosong } from '@/components';

function statusTagihan(nominal: number, dibayar: number) {
  if (dibayar >= nominal) return 'Lunas';
  if (dibayar > 0) return 'Sebagian';
  return 'Belum bayar';
}

export async function TabTagihan({ santriId }: { santriId: bigint }) {
  const tagihan = await prisma.tagihan.findMany({ where: { santriId }, orderBy: { jatuhTempo: 'desc' }, take: 20 });

  return (
    <>
      {tagihan.length === 0 && <Kosong pesan="Belum ada tagihan untuk santri ini." />}
      {tagihan.map((t) => {
        const nominal = Number(t.nominal);
        const dibayar = Number(t.dibayar);
        return (
          <div key={String(t.id)} style={{ background: '#FFFFFF', border: '1px solid #E8E3D9', borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>{t.jenis}</span>
              <Badge status={statusTagihan(nominal, dibayar)} />
            </div>
            <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 3 }}>{t.periode} · jatuh tempo {t.jatuhTempo.toLocaleDateString('id-ID')}</div>
            <div style={{ display: 'flex', gap: 18, marginTop: 12, flexWrap: 'wrap' }}>
              <div><div style={{ fontSize: 11, color: '#6B7280' }}>Tagihan</div><div style={{ fontSize: 15, fontWeight: 700, color: '#0A4A2B' }}>{rupiah(nominal)}</div></div>
              <div><div style={{ fontSize: 11, color: '#6B7280' }}>Dibayar</div><div style={{ fontSize: 15, fontWeight: 700, color: '#0F6B3D' }}>{rupiah(dibayar)}</div></div>
              <div><div style={{ fontSize: 11, color: '#6B7280' }}>Sisa</div><div style={{ fontSize: 15, fontWeight: 700, color: '#B91C1C' }}>{rupiah(Math.max(0, nominal - dibayar))}</div></div>
            </div>
          </div>
        );
      })}
      <div style={{ padding: '14px 15px', borderRadius: 12, background: '#FFFBEB', border: '1px solid #F0CFA4', fontSize: 12.5, color: '#6B5A18', lineHeight: 1.65 }}>
        Pembayaran via BSI <strong>7011-2345-6789</strong> a.n. PPSS Nurul Huda Mergosono. Konfirmasi ke bendahara setelah transfer lewat tab Bayar.
      </div>
    </>
  );
}
