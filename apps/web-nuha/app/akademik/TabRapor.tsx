import { prisma } from '@/lib/prisma';
import { Kosong } from '@/components/ui/primitives';

type Params = Record<string, string | string[] | undefined>;
const satu = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

export async function TabRapor({ searchParams }: { searchParams: Params }) {
  const kelasOpts = await prisma.kelas.findMany({ include: { unit: true }, orderBy: { nama: 'asc' } });
  const kelasId = Number(satu(searchParams.kelas)) || kelasOpts[0]?.id;
  const kelas = kelasOpts.find((k) => k.id === kelasId);

  const siswa = kelasId
    ? await prisma.santri.findMany({
        where: { kelasId },
        include: {
          orang: true,
          nilai: true,
          hafalan: true,
          tazir: true,
          presensi: true,
        },
        orderBy: { orang: { nama: 'asc' } },
      })
    : [];

  return (
    <div className="card">
      <h3 className="card-judul">Cetak rapor</h3>
      <p className="card-sub" style={{ maxWidth: 640 }}>
        Rapor menggabungkan nilai akademik unit sekolah, capaian hafalan Al-Qur&apos;an, catatan
        kepesantrenan, dan rekap kehadiran jamaah dalam satu dokumen. Pilih rombel untuk melihat
        ringkasan sebelum dikirim ke antrean cetak.
      </p>
      <form method="get" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', margin: '16px 0' }}>
        <input type="hidden" name="tab" value="rapor" />
        <div className="field" style={{ minWidth: 170, marginBottom: 0 }}>
          <label>Rombel</label>
          <select name="kelas" defaultValue={kelasId}>
            {kelasOpts.map((o) => <option key={o.id} value={o.id}>{o.unit.nama} · {o.nama}</option>)}
          </select>
        </div>
        <button type="submit" className="btn-sekunder">Tampilkan</button>
      </form>

      {!kelas && <Kosong pesan="Belum ada rombel yang bisa dipilih." />}
      {kelas && siswa.length === 0 && <Kosong pesan="Rombel ini belum punya siswa." />}

      {kelas && siswa.length > 0 && (
        <div className="tabel-wrap">
          <table>
            <thead>
              <tr>
                <th>Santri</th>
                <th className="num">Rata-rata nilai</th>
                <th className="num">Hafalan tercatat</th>
                <th className="num">Poin ta&apos;zir</th>
                <th className="num">Kehadiran jamaah</th>
              </tr>
            </thead>
            <tbody>
              {siswa.map((s) => {
                const rataNilai = s.nilai.length === 0 ? null : s.nilai.reduce((sum, n) => sum + Number(n.akhir), 0) / s.nilai.length;
                const poinTazir = s.tazir.reduce((sum, t) => sum + t.poin, 0);
                const hadir = s.presensi.filter((p) => p.status === 'Hadir').length;
                const persenHadir = s.presensi.length === 0 ? null : (hadir / s.presensi.length) * 100;
                return (
                  <tr key={String(s.id)}>
                    <td>{s.orang.nama}</td>
                    <td className="num">{rataNilai === null ? '-' : rataNilai.toFixed(1)}</td>
                    <td className="num">{s.hafalan.length}</td>
                    <td className="num">{poinTazir}</td>
                    <td className="num">{persenHadir === null ? '-' : `${Math.round(persenHadir)}%`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
