import { prisma } from '@/lib/prisma';
import { rupiah } from '@/lib/gaji';
import { Kosong } from '@/components';
import { kirimPemicu } from './actions';

type Baris = { kode: string; judul: string; detail: string; target: string; nomor: string; tujuan: string; isi: string };

/** Ambil kontak wali utama seorang santri, jatuh ke HP santri sendiri bila tidak ada. */
async function kontakWali(santriId: bigint, orangId: bigint, fallbackNama: string, fallbackHp: string | null) {
  const relasi = await prisma.relasiWali.findFirst({ where: { anakId: orangId, utama: true }, include: { wali: true } });
  if (relasi) return { nama: relasi.wali.nama, hp: relasi.wali.hp ?? fallbackHp ?? '' };
  return { nama: fallbackNama, hp: fallbackHp ?? '' };
}

/** Pemicu siap kirim yang dibangkitkan dari kondisi nyata di modul lain: tagihan jatuh tempo, izin menunggu, dan slip gaji baru terbit. */
export async function TabPemicu() {
  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);

  const [tagihan, izin, slip] = await Promise.all([
    prisma.tagihan.findMany({
      where: { jatuhTempo: { lt: hariIni } },
      include: { santri: { include: { orang: true } } },
      orderBy: { jatuhTempo: 'asc' },
      take: 8,
    }),
    prisma.izin.findMany({
      where: { status: 'Menunggu' },
      include: { santri: { include: { orang: true } } },
      orderBy: { keluarAt: 'desc' },
      take: 8,
    }),
    prisma.slipGaji.findMany({
      where: { status: 'Terbit', dibayarAt: null },
      include: { pegawai: { include: { orang: true } } },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
  ]);

  const baris: Baris[] = [];

  for (const t of tagihan) {
    const sisa = Number(t.nominal) - Number(t.dibayar);
    if (sisa <= 0) continue;
    const kontak = await kontakWali(t.santriId, t.santri.orangId, t.santri.orang.nama, t.santri.orang.hp);
    baris.push({
      kode: t.kode,
      judul: `Tagihan ${t.jenis} jatuh tempo`,
      detail: `${t.santri.orang.nama} · periode ${t.periode} · sisa ${rupiah(sisa)}`,
      target: `${kontak.nama} (wali)`,
      nomor: kontak.hp,
      tujuan: kontak.nama,
      isi: `Assalamu'alaikum, tagihan ${t.jenis} periode ${t.periode} atas nama ${t.santri.orang.nama} sebesar ${rupiah(sisa)} telah jatuh tempo. Mohon segera dilunasi.`,
    });
  }

  for (const i of izin) {
    const kontak = await kontakWali(i.santriId, i.santri.orangId, i.santri.orang.nama, i.santri.orang.hp);
    baris.push({
      kode: i.kode,
      judul: `Pengajuan izin ${i.jenis} menunggu verifikasi`,
      detail: `${i.santri.orang.nama} · ${i.alasan}`,
      target: `${kontak.nama} (wali)`,
      nomor: kontak.hp,
      tujuan: kontak.nama,
      isi: `Assalamu'alaikum, pengajuan izin ${i.jenis} untuk ${i.santri.orang.nama} sedang menunggu verifikasi pengasuh.`,
    });
  }

  for (const s of slip) {
    baris.push({
      kode: `SLP-${s.id}`,
      judul: 'Slip gaji baru terbit',
      detail: `${s.pegawai.orang.nama} · periode ${s.periode} · netto ${rupiah(Number(s.netto))}`,
      target: `${s.pegawai.orang.nama} (pegawai)`,
      nomor: s.pegawai.orang.hp ?? '',
      tujuan: s.pegawai.orang.nama,
      isi: `Assalamu'alaikum, slip gaji periode ${s.periode} atas nama ${s.pegawai.orang.nama} telah terbit dengan netto ${rupiah(Number(s.netto))}.`,
    });
  }

  return (
    <div className="card">
      <h3>Pemicu siap kirim dari data hari ini</h3>
      <p className="muted" style={{ marginBottom: 14 }}>Setiap baris dibangkitkan dari kondisi nyata di modul lain: tagihan, izin, dan payroll.</p>
      {baris.length === 0 ? (
        <Kosong pesan="Tidak ada pemicu yang menunggu dikirim saat ini." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {baris.map((b) => (
            <div key={b.kode} className="inset" style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 88, flex: '0 0 auto', fontSize: 11, fontWeight: 700, color: '#0F6B3D' }}>{b.kode}</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 600 }}>{b.judul}</div>
                <div className="muted">{b.detail}</div>
              </div>
              <div className="muted" style={{ minWidth: 170 }}>{b.target}</div>
              <form action={kirimPemicu}>
                <input type="hidden" name="nomor" value={b.nomor} />
                <input type="hidden" name="tujuan" value={b.tujuan} />
                <input type="hidden" name="isi" value={b.isi} />
                <button className="btn" type="submit" disabled={!b.nomor}>Kirim WA</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
