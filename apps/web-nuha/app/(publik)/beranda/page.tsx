import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

// Landing publik — data ditarik dari basis data yang sama dengan dashboard
// internal (bukan angka contoh). Bagian yang di prototype berupa data
// fabrikasi tanpa padanan model (testimoni alumni, galeri, diagram animasi
// kompleks) sengaja disederhanakan atau dihilangkan.


const ALUR_PPDB = [
  { n: '1', t: 'Isi formulir online', d: 'Data diri, asal sekolah, pilihan unit, unggah berkas.' },
  { n: '2', t: 'Verifikasi berkas', d: 'Panitia memeriksa dokumen dalam beberapa hari kerja.' },
  { n: '3', t: 'Seleksi', d: 'Tes baca Al-Qur\'an, tes dasar, wawancara wali.' },
  { n: '4', t: 'Daftar ulang', d: 'Pengumuman, pelunasan awal, penempatan kamar asrama.' },
];

// Data diambil dari DB saat request; jangan diprerender waktu build.
export const dynamic = 'force-dynamic';

export default async function BerandaPage() {
  const [santriAktif, pegawaiAktif, unit, agenda] = await Promise.all([
    prisma.santri.count({ where: { status: { in: ['Mukim', 'Kalong'] } } }),
    prisma.pegawai.count({ where: { status: { notIn: ['Nonaktif', 'Keluar', 'Pensiun'] } } }),
    prisma.unit.findMany({ where: { aktif: true }, orderBy: { id: 'asc' }, include: { _count: { select: { santri: true } } } }),
    prisma.agenda.findMany({ where: { tgl: { gte: new Date() } }, orderBy: { tgl: 'asc' }, take: 5 }),
  ]);

  const heroStats = [
    { v: (santriAktif + pegawaiAktif).toLocaleString('id-ID'), l: 'Siswa, santri & staf aktif' },
    { v: unit.length.toLocaleString('id-ID'), l: 'Unit terpadu' },
    { v: pegawaiAktif.toLocaleString('id-ID'), l: 'Ustadz, guru & staf' },
    { v: santriAktif.toLocaleString('id-ID'), l: 'Santri & siswa aktif' },
  ];

  const unitUtama = unit.find((u) => u.key === 'Pondok') ?? unit[0];

  return (
    <div>
      <section className="pub-hero">
        <div className="pub-hero-ray" />
        <div className="pub-hero-inner">
          <div>
            <div className="pub-badge">Pesantren Salafiyah Syafi&apos;iyah · Mergosono, Kota Malang</div>
            <h1 className="pub-h1">Mendidik generasi<br />berilmu, beradab,<br /><span>bermanfaat.</span></h1>
            <p className="pub-lead">
              Satu lembaga, empat unit terpadu: SMP Nurul Huda, Madrasah Aliyah, Pondok Pesantren, dan
              Poskestren. Satu identitas santri untuk semua layanan — akademik, kepesantrenan, kesehatan,
              dan keuangan.
            </p>
            <div className="pub-hero-actions">
              <a href="/ppdb" className="pub-btn-cta">Daftar PPDB</a>
              <Link href="/profil-pondok" className="pub-btn-outline">Profil Pesantren</Link>
            </div>
          </div>
          <div className="pub-hero-card">
            <Image src="/assets/hero-prestasi.webp" alt="Santri siswa-siswi SMP Nurul Huda peraih prestasi" width={520} height={218} className="pub-hero-img" />
            <div className="pub-hero-stat-title">Pesantren dalam angka</div>
            <div className="pub-stat-grid">
              {heroStats.map((s) => (
                <div key={s.l}>
                  <div className="pub-stat-v">{s.v}</div>
                  <div className="pub-stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pub-section">
        <div className="pub-section-head">
          <div>
            <div className="pub-eyebrow">Unit Naungan</div>
            <h2 className="pub-h2">Empat unit, satu sistem</h2>
          </div>
          <div className="pub-section-desc">Sebagian besar santri pondok juga siswa SMP/MA. Datanya satu, perannya banyak.</div>
        </div>
        <div className="pub-units-grid">
          {unit.map((u) => (
            <div key={u.id} className={`pub-unit-card${u.id === unitUtama?.id ? ' besar' : ''}`}>
              <div className="pub-unit-icon">🕌</div>
              <div className="pub-unit-nama">{u.nama}</div>
              <div className="pub-unit-desc">{u.deskripsi ?? ''}</div>
              <div className="pub-unit-count">
                <b>{u._count.santri.toLocaleString('id-ID')}</b>
                <span>santri terdaftar</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pub-satu-identitas">
          <div className="pub-diagram">
            <div className="pub-diagram-badge"><span>DATA</span><span>INDUK</span></div>
          </div>
          <div>
            <div className="pub-eyebrow">Satu Identitas</div>
            <h3 style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 600, color: '#0a4a2b', margin: '8px 0 12px' }}>
              Empat unit menulis ke satu data induk
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#4b5563', margin: 0 }}>
              Seorang anak bisa sekaligus siswa SMP, santri mukim, dan pasien Poskestren. Catatan sakit dari
              Poskestren otomatis mengisi presensi kelas dan absensi jamaah; tagihan SPP, syahriyah, dan uang
              makan terbit sebagai satu invoice untuk wali.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: '#fff', borderTop: '1px solid #e8e3d9', borderBottom: '1px solid #e8e3d9' }}>
        <div className="pub-section">
          <div className="pub-eyebrow">Alur Pendaftaran</div>
          <h2 className="pub-h2" style={{ marginBottom: 32 }}>Empat langkah menjadi santri</h2>
          <div className="pub-alur-grid">
            {ALUR_PPDB.map((a) => (
              <div key={a.n} className="pub-alur-card">
                <div className="pub-alur-no">{a.n}</div>
                <div className="pub-alur-t">{a.t}</div>
                <div className="pub-alur-d">{a.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pub-section">
        <div className="pub-eyebrow">Agenda</div>
        <h2 className="pub-h2" style={{ marginBottom: 24 }}>Kegiatan terdekat</h2>
        <div className="pub-agenda-card">
          {agenda.length === 0 ? (
            <div className="pub-agenda-row"><span className="muted">Belum ada agenda terjadwal.</span></div>
          ) : agenda.map((g) => (
            <div key={String(g.id)} className="pub-agenda-row">
              <div className="pub-agenda-tgl">
                <b>{g.tgl.toLocaleDateString('id-ID', { day: '2-digit' })}</b>
                <span>{g.tgl.toLocaleDateString('id-ID', { month: 'short' })}</span>
              </div>
              <div>
                <div className="pub-agenda-judul">{g.judul}</div>
                <div className="pub-agenda-unit">{g.unit ?? 'Yayasan'}{g.jam ? ` · ${g.jam}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
