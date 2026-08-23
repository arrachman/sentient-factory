import { prisma } from '@/lib/prisma';
import { Card, Kosong, avaBg, inisial } from '@/components/ui/primitives';
import { BarHorizontal } from '@/components/ui/charts';

const WARNA_PENYAKIT = ['#B91C1C', '#D97706', '#0F6B3D', '#1D4ED8', '#86B79C'];
const AMBANG_KLB = 3; // ambang KLB prototype: 3 kasus/asrama untuk diagnosis yang sama

export async function TabDashboard() {
  const [semuaKunjungan, obat] = await Promise.all([
    prisma.rekamMedis.findMany({
      include: { santri: { include: { orang: true, kamar: { include: { asrama: true } } } } },
      orderBy: { tgl: 'desc' },
    }),
    prisma.obat.findMany(),
  ]);

  const hariIni = new Date().toDateString();
  const kunjHariIni = semuaKunjungan.filter((k) => k.tgl.toDateString() === hariIni);
  const obatMenipis = obat.filter((o) => o.stok < o.stokMin);
  const rujuk = semuaKunjungan.filter((k) => k.tindakLanjut === 'Rujuk Puskesmas');

  // 5 penyakit terbanyak — dihitung dari seluruh rekam medis yang tercatat.
  const diagCount = new Map<string, number>();
  semuaKunjungan.forEach((k) => {
    if (!k.diagnosis) return;
    diagCount.set(k.diagnosis, (diagCount.get(k.diagnosis) ?? 0) + 1);
  });
  const topPenyakit = [...diagCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nama, n], i) => ({ label: nama, nilai: n, warna: WARNA_PENYAKIT[i % WARNA_PENYAKIT.length] }));

  // Deteksi dini KLB: diagnosis yang sama ≥ ambang di asrama yang sama.
  const klbMap = new Map<string, number>();
  semuaKunjungan.forEach((k) => {
    const asrama = k.santri.kamar?.asrama.nama;
    if (!asrama || !k.diagnosis) return;
    const key = `${k.diagnosis}|${asrama}`;
    klbMap.set(key, (klbMap.get(key) ?? 0) + 1);
  });
  const klb = [...klbMap.entries()]
    .filter(([, n]) => n >= AMBANG_KLB)
    .map(([key, n]) => {
      const [penyakit, asrama] = key.split('|');
      return { penyakit, asrama, n };
    });
  const klbText = klb.map((k) => `${k.n} kasus ${k.penyakit} di Asrama ${k.asrama}`).join(' · ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
      {klb.length > 0 && (
        <div className="alert alert-kritis">
          <b>Peringatan dini KLB aktif</b>
          <p style={{ margin: '3px 0 0' }}>
            {klbText} — ambang batas {AMBANG_KLB} kasus/asrama terlampaui. Jadwalkan pemeriksaan massal & laporkan ke Puskesmas.
          </p>
        </div>
      )}

      <section className="grid g3">
        <div className="card">
          <div className="label">Kunjungan hari ini</div>
          <div className="angka" style={{ color: '#0F6B3D' }}>{kunjHariIni.length}</div>
          <div className="muted">dari {semuaKunjungan.length} kunjungan tercatat</div>
        </div>
        <div className="card">
          <div className="label">Obat di bawah minimum</div>
          <div className="angka" style={{ color: '#B91C1C' }}>{obatMenipis.length}</div>
          <div className="muted">dari {obat.length} item persediaan</div>
        </div>
        <div className="card">
          <div className="label">Rujukan Puskesmas</div>
          <div className="angka" style={{ color: '#9A3412' }}>{rujuk.length}</div>
          <div className="muted">dari seluruh rekam medis</div>
        </div>
      </section>

      <section className="grid g2">
        <Card judul="5 penyakit terbanyak">
          {topPenyakit.length > 0 ? <BarHorizontal data={topPenyakit} satuan="kasus" /> : <Kosong pesan="Belum ada diagnosis tercatat." />}
        </Card>
        <Card judul="Stok menipis">
          {obatMenipis.length === 0 ? <Kosong pesan="Semua stok obat masih aman." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {obatMenipis.map((o) => (
                <div key={o.id} className="alert alert-peringatan" style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div>
                    <b style={{ display: 'block', fontSize: 13 }}>{o.nama}</b>
                    <span className="muted">{o.kategori ?? '-'} · exp {o.kadaluarsa ?? '-'}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <b style={{ display: 'block', color: '#991B1B' }}>{o.stok} {o.satuan}</b>
                    <span className="muted">min {o.stokMin}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <Card judul={`Kunjungan hari ini — ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}`}>
        {kunjHariIni.length === 0 ? <Kosong pesan="Belum ada kunjungan hari ini." /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {kunjHariIni.map((k) => (
              <div key={String(k.id)} className="inset" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ width: 30, height: 30, borderRadius: '50%', background: avaBg(k.santri.orang.nama), color: '#FFF', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, flex: '0 0 auto' }}>
                  {inisial(k.santri.orang.nama)}
                </span>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{k.santri.orang.nama}</span>
                <span className="muted">{k.jam ?? '-'} · Asrama {k.santri.kamar?.asrama.nama ?? '-'}</span>
                <span className="badge badge-merah">{k.diagnosis ?? '-'}</span>
                <span className="muted" style={{ width: '100%' }}>{k.keluhan} → {k.terapi ?? '-'} · <strong>{k.tindakLanjut ?? '-'}</strong></span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
