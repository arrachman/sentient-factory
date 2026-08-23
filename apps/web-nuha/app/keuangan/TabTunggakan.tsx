import { prisma } from '@/lib/prisma';
import { Card, Avatar, Badge, Kosong, rp } from '@/components';

export async function TabTunggakan() {
  const rows = await prisma.tagihan.findMany({
    include: { santri: { include: { orang: true, unit: true } } },
    orderBy: { jatuhTempo: 'asc' },
  });
  const tunggakan = rows.filter((t) => Number(t.dibayar) < Number(t.nominal));

  return (
    <Card
      judul={`Daftar tunggakan — ${tunggakan.length} santri`}
      sub="Prioritas penagihan: hubungi wali via WhatsApp, tembusan ke musyrif asrama."
    >
      {tunggakan.length === 0 ? (
        <Kosong pesan="Tidak ada tunggakan tercatat saat ini." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tunggakan.map((t) => {
            const sisa = Number(t.nominal) - Number(t.dibayar);
            const status = Number(t.dibayar) > 0 ? 'Sebagian' : 'Belum bayar';
            return (
              <div
                key={String(t.id)}
                style={{
                  display: 'flex', gap: 14, alignItems: 'center', padding: '14px 16px', borderRadius: 13,
                  background: '#FEF7F7', border: '1px solid #F0D5D5', flexWrap: 'wrap',
                }}
              >
                <Avatar nama={t.santri.orang.nama} size={36} />
                <div style={{ flex: 1, minWidth: 170 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.santri.orang.nama}</div>
                  <div className="muted">{t.santri.unit?.nama ?? '-'} · {t.jenis}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="muted">Kurang</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#B91C1C' }}>{rp(sisa)}</div>
                </div>
                <Badge status={status} />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
