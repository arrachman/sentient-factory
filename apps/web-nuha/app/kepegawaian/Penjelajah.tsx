import Link from 'next/link';
import { hrefKepegawaian, jumlahFilterPegawai, filterPegawaiKosong, type FilterPegawai } from './filter';
import type { PohonPegawai } from './pohon';

/** Satu chip pilihan: label + jumlah pegawai di baliknya. */
function Chip({ href, label, jumlah, aktif }: { href: string; label: string; jumlah: number; aktif: boolean }) {
  return (
    <Link href={href} className={`chip ${aktif ? 'chip-aktif' : ''}`}>
      <span>{label}</span>
      <span className="chip-angka">{jumlah}</span>
    </Link>
  );
}

/** Remah roti Pesantren → lembaga → status; tiap remah bisa diklik mundur. */
function Remah({ f, pohon, tab }: { f: FilterPegawai; pohon: PohonPegawai; tab: string }) {
  const lembaga = pohon.lembaga.find((l) => l.key === f.unit);
  const jejak = [
    { label: 'Semua pesantren', href: hrefKepegawaian(tab, f, { unit: undefined, status: undefined }) },
    ...(lembaga ? [{ label: lembaga.nama, href: hrefKepegawaian(tab, f, { status: undefined }) }] : []),
    ...(f.status ? [{ label: f.status, href: hrefKepegawaian(tab, f) }] : []),
  ];

  return (
    <nav className="remah" aria-label="Jalur penjelajahan">
      {jejak.map((j, i) => (
        <span key={j.href} className="remah-item">
          {i > 0 && <span className="remah-pisah">›</span>}
          {i === jejak.length - 1 ? <b>{j.label}</b> : <Link href={j.href}>{j.label}</Link>}
        </span>
      ))}
    </nav>
  );
}

/**
 * Penjelajah lembaga untuk seluruh modul Kepegawaian: pilih lembaga (SMP / MA /
 * Pondok / Poskestren), lalu status kepegawaian. Sengaja dirender di `page.tsx`
 * DI ATAS tabbar, bukan di dalam tiap tab, supaya pilihan lembaga bertahan saat
 * operator berpindah tab — mengikuti pola yang sama di /induk dan /akademik.
 */
export function Penjelajah({ f, pohon, tab }: { f: FilterPegawai; pohon: PohonPegawai; tab: string }) {
  const aktif = jumlahFilterPegawai(f);

  return (
    <div className="penjelajah">
      <Remah f={f} pohon={pohon} tab={tab} />

      <div className="chip-baris">
        <span className="chip-label">Lembaga</span>
        <Chip
          href={hrefKepegawaian(tab, f, { unit: undefined, status: undefined })}
          label="Semua"
          jumlah={pohon.total}
          aktif={!f.unit}
        />
        {pohon.lembaga.map((l) => (
          <Chip
            key={l.key}
            href={hrefKepegawaian(tab, f, { unit: l.key, status: undefined })}
            label={l.nama}
            jumlah={l.jumlah}
            aktif={f.unit === l.key}
          />
        ))}
      </div>

      {pohon.status.length > 1 && (
        <div className="chip-baris">
          <span className="chip-label">Status</span>
          <Chip
            href={hrefKepegawaian(tab, f, { status: undefined })}
            label="Semua"
            jumlah={pohon.status.reduce((s, x) => s + x.jumlah, 0)}
            aktif={!f.status}
          />
          {pohon.status.map((s) => (
            <Chip
              key={s.nama}
              href={hrefKepegawaian(tab, f, { status: s.nama })}
              label={s.nama}
              jumlah={s.jumlah}
              aktif={f.status === s.nama}
            />
          ))}
        </div>
      )}

      {aktif > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center' }}>
          {f.q && (
            <Link href={hrefKepegawaian(tab, f, { q: '' })} className="chip-copot">
              Cari: &quot;{f.q}&quot; <span className="x">×</span>
            </Link>
          )}
          {f.jk && (
            <Link href={hrefKepegawaian(tab, f, { jk: undefined })} className="chip-copot">
              {f.jk === 'L' ? 'Putra' : 'Putri'} <span className="x">×</span>
            </Link>
          )}
          <Link href={hrefKepegawaian(tab, filterPegawaiKosong(f))} className="chip-copot">
            Bersihkan semua ({aktif})
          </Link>
        </div>
      )}
    </div>
  );
}
