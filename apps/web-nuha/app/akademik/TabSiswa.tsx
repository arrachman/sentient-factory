import { prisma } from '@/lib/prisma';
import { Avatar, Badge, Kosong, Pagination, UKURAN_HALAMAN, bacaHalaman, type SearchParams } from '@/components';
import { bacaFilter, whereFilter, hrefAkademik, URUT } from './filter';
import { bacaPohon } from './pohon';
import { bacaOpsi } from './opsi';
import { Penjelajah } from './Penjelajah';
import { BarisFilter } from './BarisFilter';

export async function TabSiswa({ searchParams }: { searchParams: SearchParams }) {
  const f = bacaFilter(searchParams);
  const halaman = bacaHalaman(searchParams);
  const where = whereFilter(f);

  const [pohon, opsi, total, siswaRows] = await Promise.all([
    bacaPohon(f),
    bacaOpsi(),
    prisma.santri.count({ where }),
    prisma.santri.findMany({
      where,
      include: { orang: true, unit: true, kelas: true, kamar: { include: { asrama: true } } },
      orderBy: URUT[f.urut].orderBy,
      skip: (halaman - 1) * UKURAN_HALAMAN,
      take: UKURAN_HALAMAN,
    }),
  ]);
  const totalHalaman = Math.max(1, Math.ceil(total / UKURAN_HALAMAN));

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <Penjelajah f={f} pohon={pohon} />
      </div>

      <div className="card">
        <BarisFilter f={f} opsi={opsi} tab="siswa" />

        <div className="muted" style={{ fontSize: 12.5, margin: '14px 0 10px' }}>
          {total.toLocaleString('id-ID')} santri cocok · halaman {halaman} dari {totalHalaman}
        </div>

        <div className="tabel-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>NIS / NISN</th>
                <th>Unit · Kelas</th>
                <th>Asrama</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {siswaRows.map((x) => (
                <tr key={String(x.id)}>
                  <td>
                    <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
                      <Avatar nama={x.orang.nama} />
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{x.orang.nama}</div>
                        <div className="muted" style={{ fontSize: 11.5 }}>{x.orang.jk} · {x.program ?? '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="num">{x.nis}{x.nisn ? ` / ${x.nisn}` : ''}</td>
                  <td>{x.unit ? `${x.unit.nama} · ${x.kelas?.nama ?? '-'}` : '-'}</td>
                  <td>{x.kamar ? `${x.kamar.asrama.nama} ${x.kamar.kode}` : '-'}</td>
                  <td><Badge status={x.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {siswaRows.length === 0 && <Kosong pesan="Tidak ada santri yang cocok dengan penyaring ini." />}
        <Pagination
          halaman={halaman}
          totalHalaman={totalHalaman}
          total={total}
          jumlahBaris={siswaRows.length}
          ukuranHalaman={UKURAN_HALAMAN}
          buatHref={(p) => hrefAkademik('siswa', f, {}, { halaman: p })}
        />
      </div>
    </>
  );
}
