import Link from 'next/link';
import { hrefAkademik, jumlahFilterAktif, filterKosong, STATUS_SANTRI, URUT, type FilterAkademik } from './filter';

export type OpsiFilter = {
  program: string[];
  angkatan: string[];
  asrama: { id: number; nama: string }[];
};

const gaya = { minWidth: 132, marginBottom: 0 } as const;

/**
 * Penyaring lanjutan + ringkasan filter aktif.
 *
 * Filter dikirim lewat GET biasa (bukan JS) supaya hasilnya jadi URL yang bisa
 * dibookmark dan dibagikan — sesuai pola tab server-side di app ini. Chip
 * "aktif" di bawah form membuat setiap penyaring bisa dicopot satu per satu
 * tanpa harus mencari-cari select mana yang tadi diubah.
 */
export function BarisFilter({ f, opsi, tab }: { f: FilterAkademik; opsi: OpsiFilter; tab: string }) {
  const aktif = jumlahFilterAktif(f);
  const namaAsrama = (id: number) => opsi.asrama.find((a) => a.id === id)?.nama ?? String(id);

  const copot: { label: string; href: string }[] = [
    ...(f.q ? [{ label: `Cari: "${f.q}"`, href: hrefAkademik(tab, f, { q: '' }) }] : []),
    ...(f.status ? [{ label: `Status: ${f.status}`, href: hrefAkademik(tab, f, { status: undefined }) }] : []),
    ...(f.jk ? [{ label: `Jenis kelamin: ${f.jk === 'L' ? 'Putra' : 'Putri'}`, href: hrefAkademik(tab, f, { jk: undefined }) }] : []),
    ...(f.program ? [{ label: `Program: ${f.program}`, href: hrefAkademik(tab, f, { program: undefined }) }] : []),
    ...(f.angkatan ? [{ label: `Angkatan: ${f.angkatan}`, href: hrefAkademik(tab, f, { angkatan: undefined }) }] : []),
    ...(f.asramaId ? [{ label: `Asrama: ${namaAsrama(f.asramaId)}`, href: hrefAkademik(tab, f, { asramaId: undefined }) }] : []),
  ];

  return (
    <>
      <form method="get" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <input type="hidden" name="tab" value={tab} />
        {/* Penjelajah unit/tingkat/kelas dipertahankan saat form disubmit. */}
        {f.unit && <input type="hidden" name="unit" value={f.unit} />}
        {f.tingkat && <input type="hidden" name="tingkat" value={f.tingkat} />}
        {f.kelasId && <input type="hidden" name="kelas" value={f.kelasId} />}

        <div className="field" style={{ flex: 1, minWidth: 210, marginBottom: 0 }}>
          <label>Pencarian</label>
          <input type="search" name="q" placeholder="Nama, NIS, atau NISN" defaultValue={f.q} />
        </div>
        <div className="field" style={gaya}>
          <label>Status</label>
          <select name="status" defaultValue={f.status ?? ''}>
            <option value="">Semua status</option>
            {STATUS_SANTRI.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="field" style={gaya}>
          <label>Jenis kelamin</label>
          <select name="jk" defaultValue={f.jk ?? ''}>
            <option value="">Semua</option>
            <option value="L">Putra</option>
            <option value="P">Putri</option>
          </select>
        </div>
        {opsi.program.length > 0 && (
          <div className="field" style={gaya}>
            <label>Program</label>
            <select name="program" defaultValue={f.program ?? ''}>
              <option value="">Semua program</option>
              {opsi.program.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        )}
        {opsi.angkatan.length > 0 && (
          <div className="field" style={{ ...gaya, minWidth: 116 }}>
            <label>Angkatan</label>
            <select name="angkatan" defaultValue={f.angkatan ?? ''}>
              <option value="">Semua</option>
              {opsi.angkatan.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        )}
        {opsi.asrama.length > 0 && (
          <div className="field" style={gaya}>
            <label>Asrama</label>
            <select name="asrama" defaultValue={f.asramaId ? String(f.asramaId) : ''}>
              <option value="">Semua asrama</option>
              {opsi.asrama.map((o) => <option key={o.id} value={o.id}>{o.nama}</option>)}
            </select>
          </div>
        )}
        <div className="field" style={gaya}>
          <label>Urutkan</label>
          <select name="urut" defaultValue={f.urut}>
            {Object.entries(URUT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <button type="submit" className="btn">Terapkan</button>
      </form>

      {(copot.length > 0 || aktif > 0) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center', marginTop: 12 }}>
          {copot.map((c) => (
            <Link key={c.href} href={c.href} className="chip-copot">
              {c.label} <span className="x">×</span>
            </Link>
          ))}
          {aktif > 0 && (
            <Link href={hrefAkademik(tab, filterKosong(f))} className="chip-copot">
              Bersihkan semua ({aktif})
            </Link>
          )}
        </div>
      )}
    </>
  );
}
