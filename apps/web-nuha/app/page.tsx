import { redirect } from 'next/navigation';
import { requirePage } from '@/lib/access';
import { readSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/templates/Shell';
import { Card, JudulHalaman, StatCard, Kosong, rp, ChartTren, ChartDonut, ChartBatang } from '@/components';

const WARNA_UNIT = ['#0F6B3D', '#E8973A', '#1D4ED8', '#7C3AED', '#0891B2', '#BE185D'];

export default async function DashboardPage() {
  // Tamu tanpa sesi melihat halaman publik, bukan dilempar ke /login: `/` adalah
  // pintu masuk umum, sedangkan dasbor staf hanya muncul setelah login.
  if (!(await readSession())) redirect('/beranda');
  const session = await requirePage('dashboard');

  const [santri, mukim, kalong, alumni, pegawai, pendaftar, tagihan, unit, kas, agenda, pengumuman] =
    await Promise.all([
      prisma.santri.count({ where: { status: { in: ['Mukim', 'Kalong'] } } }),
      prisma.santri.count({ where: { status: 'Mukim' } }),
      prisma.santri.count({ where: { status: 'Kalong' } }),
      prisma.santri.count({ where: { status: 'Alumni' } }),
      prisma.pegawai.count({ where: { status: { notIn: ['Nonaktif', 'Keluar', 'Pensiun'] } } }),
      prisma.pendaftar.count({ where: { status: { in: ['Baru', 'Verifikasi', 'Seleksi'] } } }),
      prisma.tagihan.aggregate({ _sum: { nominal: true, dibayar: true } }),
      prisma.unit.findMany({ where: { aktif: true }, orderBy: { id: 'asc' }, include: { _count: { select: { santri: true } } } }),
      prisma.transaksiKas.groupBy({ by: ['arah'], _sum: { nominal: true } }),
      prisma.agenda.findMany({ orderBy: { tgl: 'asc' }, take: 5 }),
      prisma.pengumuman.findMany({ orderBy: { tgl: 'desc' }, take: 5 }),
    ]);

  const totalTagihan = Number(tagihan._sum.nominal ?? 0);
  const totalDibayar = Number(tagihan._sum.dibayar ?? 0);
  const tunggakan = totalTagihan - totalDibayar;
  const pctTertagih = totalTagihan > 0 ? Math.round((totalDibayar / totalTagihan) * 100) : 0;

  const masuk = Number(kas.find((k) => k.arah === 'Masuk')?._sum.nominal ?? 0);
  const keluar = Number(kas.find((k) => k.arah === 'Keluar')?._sum.nominal ?? 0);

  // Tren dibangun dari tahun masuk yang tercatat — bukan angka konstan.
  const perTahun = await prisma.santri.groupBy({
    by: ['tahunMasuk'],
    where: { tahunMasuk: { not: null }, status: { in: ['Mukim', 'Kalong', 'Alumni'] } },
    _count: { _all: true },
  });
  const tren = perTahun
    .filter((t) => t.tahunMasuk)
    .sort((a, b) => String(a.tahunMasuk).localeCompare(String(b.tahunMasuk)))
    .slice(-6)
    .map((t) => ({ label: String(t.tahunMasuk), nilai: t._count._all }));

  const donut = [
    { label: 'Santri mukim', nilai: mukim, warna: '#0F6B3D' },
    { label: 'Santri kalong', nilai: kalong, warna: '#E8973A' },
    { label: 'Pegawai & asatidz', nilai: pegawai, warna: '#1D4ED8' },
    { label: 'Alumni terdata', nilai: alumni, warna: '#9CA3AF' },
  ].filter((d) => d.nilai > 0);

  const batang = unit.map((u, i) => ({ label: u.nama, nilai: u._count.santri, warna: WARNA_UNIT[i % WARNA_UNIT.length] }));

  return (
    <Shell session={session} active="dashboard" title="Dashboard Yayasan">
      <JudulHalaman
        judul="Ringkasan Yayasan"
        sub="Satu identitas untuk seluruh unit — data di bawah ditarik langsung dari basis data terpadu."
      />

      <section className="grid g4">
        <StatCard label="Santri aktif" nilai={santri} sub={`${mukim} mukim · ${kalong} kalong`} />
        <StatCard label="Pegawai & asatidz" nilai={pegawai} sub="Tetap, kontrak, honorer & mitra" warna="#1D4ED8" />
        <StatCard label="PPDB perlu diproses" nilai={pendaftar} sub="Baru · verifikasi · seleksi" warna="#E8973A" />
        <StatCard label="Ketertagihan" nilai={`${pctTertagih}%`} sub={`Tunggakan ${rp(tunggakan)}`} pct={pctTertagih} />
      </section>

      <section className="grid g2" style={{ marginTop: 16 }}>
        <Card judul="Tren penerimaan santri" sub="Jumlah santri per tahun masuk">
          {tren.length > 1 ? <ChartTren data={tren} /> : <Kosong pesan="Data tahun masuk belum cukup untuk menggambar tren." />}
        </Card>
        <Card judul="Komposisi individu" sub="Sebaran seluruh orang yang terdata">
          {donut.length > 0 ? <ChartDonut data={donut} judulTengah="orang" /> : <Kosong />}
        </Card>
      </section>

      <section className="grid g2" style={{ marginTop: 16 }}>
        <Card judul="Sebaran santri per unit">
          {batang.length > 0 ? <ChartBatang data={batang} /> : <Kosong />}
        </Card>
        <Card judul="Ringkasan keuangan" sub="Akumulasi kas dan tagihan berjalan">
          <div className="grid g2">
            <div className="inset">
              <div className="label">Kas masuk</div>
              <div className="angka-sm" style={{ color: 'var(--hijau)' }}>{rp(masuk)}</div>
            </div>
            <div className="inset">
              <div className="label">Kas keluar</div>
              <div className="angka-sm" style={{ color: '#B91C1C' }}>{rp(keluar)}</div>
            </div>
            <div className="inset">
              <div className="label">Total tagihan</div>
              <div className="angka-sm">{rp(totalTagihan)}</div>
            </div>
            <div className="inset">
              <div className="label">Sudah dibayar</div>
              <div className="angka-sm" style={{ color: 'var(--hijau)' }}>{rp(totalDibayar)}</div>
            </div>
          </div>
          <div className="bar" style={{ marginTop: 14 }}>
            <span style={{ width: `${pctTertagih}%` }} />
          </div>
          <p className="muted" style={{ marginTop: 6 }}>{pctTertagih}% dari total tagihan sudah tertagih.</p>
        </Card>
      </section>

      <section className="grid g2" style={{ marginTop: 16 }}>
        <Card judul="Agenda terdekat">
          {agenda.length === 0 ? <Kosong pesan="Belum ada agenda terjadwal." /> : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {agenda.map((a) => (
                <li key={String(a.id)} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                  <span className="pill-agenda" style={{ flex: '0 0 auto' }}>
                    {a.tgl.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <b style={{ display: 'block', fontSize: 13 }}>{a.judul}</b>
                    <span className="muted">{a.unit ?? 'Yayasan'}{a.jam ? ` · ${a.jam}` : ''}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card judul="Pengumuman terbaru">
          {pengumuman.length === 0 ? <Kosong pesan="Belum ada pengumuman." /> : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pengumuman.map((p) => (
                <li key={String(p.id)}>
                  <b style={{ display: 'block', fontSize: 13 }}>{p.judul}</b>
                  <span className="muted">{p.tgl.toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                  <p style={{ margin: '3px 0 0', fontSize: 12.5, color: 'var(--teks-2)' }}>{p.isi}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </Shell>
  );
}
