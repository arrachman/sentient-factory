import { URUT_PEGAWAI, type FilterPegawai } from './filter';

const gaya = { minWidth: 138, marginBottom: 0 } as const;

/**
 * Pencarian + penyaring ringan. Dikirim lewat GET biasa (bukan JS) supaya
 * hasilnya jadi URL yang bisa dibookmark dan dibagikan — sesuai pola tab
 * server-side di app ini. Pilihan lembaga/status ikut sebagai hidden input agar
 * penjelajah di atasnya tidak ter-reset saat form disubmit.
 */
export function BarisFilter({ f, tab }: { f: FilterPegawai; tab: string }) {
  return (
    <form method="get" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <input type="hidden" name="tab" value={tab} />
      {f.unit && <input type="hidden" name="unit" value={f.unit} />}
      {f.status && <input type="hidden" name="status" value={f.status} />}

      <div className="field" style={{ flex: 1, minWidth: 220, marginBottom: 0 }}>
        <label>Pencarian</label>
        <input type="search" name="q" placeholder="Nama, NIP, jabatan, atau mapel" defaultValue={f.q} />
      </div>
      <div className="field" style={gaya}>
        <label>Jenis kelamin</label>
        <select name="jk" defaultValue={f.jk ?? ''}>
          <option value="">Semua</option>
          <option value="L">Putra</option>
          <option value="P">Putri</option>
        </select>
      </div>
      <div className="field" style={gaya}>
        <label>Urutkan</label>
        <select name="urut" defaultValue={f.urut}>
          {Object.entries(URUT_PEGAWAI).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>
      <button type="submit" className="btn">Terapkan</button>
    </form>
  );
}
