import { hapusRelasiWali, jadikanWaliUtama } from './actions';

export type BarisRelasi = {
  id: string;
  waliNama: string;
  waliHp: string | null;
  anakId: string;
  anakNama: string;
  nis: string | null;
  kelas: string | null;
  hubungan: string;
  pekerjaan: string | null;
  utama: boolean;
};

const NADA: Record<string, string> = { Ayah: 'biru', Ibu: 'pink', Wali: 'kuning' };

/** Tabel relasi wali↔santri dengan aksi jadikan-utama dan lepas. */
export function DaftarRelasi({ relasi }: { relasi: BarisRelasi[] }) {
  return <div className="card" style={{ marginTop: 16 }}>
    <h3 className="card-judul" style={{ margin: 0 }}>Relasi wali &amp; santri</h3>
    <div className="tabel-wrap">
      <table className="table-compact" style={{ marginTop: 12 }}>
        <thead><tr>
          <th>Santri</th>
          <th>Wali</th>
          <th>Hubungan</th>
          <th>Kontak</th>
          <th style={{ textAlign: 'center', width: 1, whiteSpace: 'nowrap' }}>Aksi</th>
        </tr></thead>
        <tbody>
          {relasi.length === 0 && <tr><td colSpan={5} className="empty">Belum ada relasi wali yang cocok.</td></tr>}
          {relasi.map((baris) => <tr key={baris.id}>
            <td>
              <strong>{baris.anakNama}</strong>
              <p className="petunjuk" style={{ margin: '2px 0 0' }}>
                {[baris.nis ? `NIS ${baris.nis}` : null, baris.kelas].filter(Boolean).join(' · ') || '—'}
              </p>
            </td>
            <td>
              {baris.waliNama}
              {baris.pekerjaan && <p className="petunjuk" style={{ margin: '2px 0 0' }}>{baris.pekerjaan}</p>}
            </td>
            <td>
              <span className={`badge badge-${NADA[baris.hubungan] ?? 'netral'}`}>{baris.hubungan}</span>
              {baris.utama && <span className="badge badge-hijau" style={{ marginLeft: 5 }}>Utama</span>}
            </td>
            <td>{baris.waliHp ?? '—'}</td>
            <td style={{ width: 1, whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                {!baris.utama && <form action={jadikanWaliUtama}>
                  <input type="hidden" name="id" value={baris.id} />
                  <button className="btn btn-sekunder" type="submit" style={{ padding: '6px 11px', fontSize: 12 }} title="Jadikan wali utama santri ini">Jadikan utama</button>
                </form>}
                <form action={hapusRelasiWali}>
                  <input type="hidden" name="id" value={baris.id} />
                  <button className="btn btn-sekunder" type="submit" style={{ padding: '6px 11px', fontSize: 12 }} title="Lepas wali dari santri ini — identitas orangnya tidak dihapus">Lepas</button>
                </form>
              </div>
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </div>;
}
