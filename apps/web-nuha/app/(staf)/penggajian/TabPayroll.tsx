import { prisma } from '@/lib/prisma';
import { Card, Tabel, Kosong, Avatar } from '@/components';
import { hitungGaji, rupiah } from '@/lib/gaji';
import { SlipActions } from '@/components/SlipActions';

/** Daftar payroll periode berjalan: pencarian nama/jabatan lewat query ?q=. */
export async function TabPayroll({
  searchParams,
  periode,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  periode: string;
}) {
  const raw = searchParams.q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? '';

  const pegawai = await prisma.pegawai.findMany({
    where: q
      ? { OR: [{ orang: { nama: { contains: q } } }, { jabatan: { contains: q } }] }
      : undefined,
    include: { orang: true, unit: true, komponen: true },
    orderBy: { nip: 'asc' },
  });
  const slips = await prisma.slipGaji.findMany({ where: { periode, pegawaiId: { in: pegawai.map((p) => p.id) } } });
  const slipByPegawai = new Map(slips.map((s) => [String(s.pegawaiId), s]));

  return (
    <Card
      judul={`Payroll ${periode}`}
      sub="Semua pemegang akses menu Penggajian dapat menerbitkan, membayar, atau merevisi. Revisi setelah bayar tetap tercatat di audit log."
      aksi={
        <form method="get" style={{ display: 'flex', gap: 8 }}>
          <input type="hidden" name="tab" value="payroll" />
          <input className="field" name="q" defaultValue={q} placeholder="Cari nama / jabatan" style={{ minWidth: 200 }} />
        </form>
      }
    >
      {pegawai.length === 0 ? (
        <Kosong pesan="Tidak ada pegawai yang cocok dengan pencarian." />
      ) : (
        <Tabel kolom={['Pegawai', 'Jabatan', 'Status', { label: 'Bruto', num: true }, { label: 'Potongan', num: true }, { label: 'Netto', num: true }, 'Slip']}>
          {pegawai.map((p) => {
            const slip = slipByPegawai.get(String(p.id));
            const h = hitungGaji(p.komponen);
            return (
              <tr key={String(p.id)}>
                <td>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Avatar nama={p.orang.nama} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.orang.nama}</div>
                      <div className="muted">{p.nip} · {p.unit?.nama ?? 'Yayasan'}</div>
                    </div>
                  </div>
                </td>
                <td>{p.jabatan}</td>
                <td>{p.status}</td>
                <td className="num">{rupiah(h.bruto)}</td>
                <td className="num" style={{ color: '#B91C1C' }}>{rupiah(h.potongan)}</td>
                <td className="num" style={{ fontWeight: 700 }}>{rupiah(h.netto)}</td>
                <td>
                  {slip && <div className="muted" style={{ marginBottom: 6 }}><span className="badge badge-hijau">{slip.status}</span> · revisi {slip.revisi}</div>}
                  <SlipActions pegawaiId={String(p.id)} periode={periode} status={slip?.status} />
                </td>
              </tr>
            );
          })}
        </Tabel>
      )}
    </Card>
  );
}
