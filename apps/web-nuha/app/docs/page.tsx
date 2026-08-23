import Link from 'next/link';
import { redirect } from 'next/navigation';
import { readSession } from '@/lib/auth';
import { AKUN, BAGIAN, OPERASIONAL } from './isi';
import { AlurAkses, AlurQr } from './Diagram';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Dokumentasi — SIMTERPADU Nurul Huda' };

/**
 * Dokumentasi dijaga sesi, bukan halaman publik: isinya memuat tangkapan layar
 * data santri, tagihan, dan layar pemasangan WhatsApp.
 */
export default async function DocsPage() {
  const session = await readSession();
  if (!session) redirect('/login');

  return (
    <div className="docs">
      <header className="docs-head">
        <p className="label" style={{ color: 'var(--emas-lembut)' }}>SIMTERPADU Nurul Huda Mergosono</p>
        <h1 style={{ color: '#faf8f3', fontSize: 30 }}>Dokumentasi Sistem</h1>
        <p style={{ color: 'rgba(243,241,233,.78)', maxWidth: 640, marginTop: 8 }}>
          Alur kerja tiap peran, cara menautkan nomor WhatsApp, dan hal-hal operasional yang perlu
          diketahui sebelum sistem dipakai sungguhan.
        </p>
        <Link href="/" className="btn-sekunder btn" style={{ marginTop: 16, display: 'inline-block' }}>
          Kembali ke aplikasi
        </Link>
      </header>

      <nav className="docs-nav card">
        <p className="label">Isi</p>
        <ol>
          <li><a href="#akun">Akun dan peran</a></li>
          {BAGIAN.map((b) => <li key={b.id}><a href={`#${b.id}`}>{b.judul}</a></li>)}
          <li><a href="#operasional">Operasional</a></li>
        </ol>
      </nav>

      <section id="akun" className="card">
        <h2 className="card-judul" style={{ fontSize: 20 }}>Akun dan peran</h2>
        <p className="muted" style={{ marginBottom: 14 }}>
          Peran menentukan menu yang tampil. Angka menu di bawah adalah keadaan seed saat ini.
        </p>
        <div className="tabel-wrap">
          <table>
            <thead><tr><th>Peran</th><th>Login</th><th className="num">Menu</th><th>Catatan</th></tr></thead>
            <tbody>
              {AKUN.map((row) => (
                <tr key={row.peran}>
                  <td><b>{row.peran}</b></td>
                  <td><code>{row.login}</code></td>
                  <td className="num">{row.menu}</td>
                  <td className="muted" style={{ fontSize: 12.5 }}>{row.catatan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="alert alert-peringatan" style={{ marginTop: 14 }}>
          <span>
            <b>Sebelum dipakai sungguhan</b>
            Seluruh akun contoh memakai sandi yang sama. Ganti sandi, nonaktifkan akun yang tidak
            terpakai, dan setel <code>AUTH_SECRET</code> sendiri.
          </span>
        </div>
      </section>

      <section className="card">
        <h2 className="card-judul" style={{ fontSize: 20 }}>Bagaimana hak akses ditegakkan</h2>
        <AlurAkses />
      </section>

      {BAGIAN.map((bagian) => (
        <section key={bagian.id} id={bagian.id} className="card">
          <h2 className="card-judul" style={{ fontSize: 20 }}>{bagian.judul}</h2>
          <p style={{ color: 'var(--teks-2)', fontSize: 14, marginBottom: 14 }}>{bagian.ringkas}</p>

          {bagian.langkah && (
            <ol className="docs-langkah">
              {bagian.langkah.map((l) => (
                <li key={l.judul}>
                  <b>{l.judul}</b>
                  <span>{l.detail}</span>
                </li>
              ))}
            </ol>
          )}

          {bagian.id === 'wa-perangkat' && <AlurQr />}

          {bagian.gambar?.map((gambar) => (
            <figure className="docs-gambar" key={gambar.file}>
              {/* Disajikan route bergerbang sesi, bukan aset publik. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/docs/tangkapan/${gambar.file}`} alt={gambar.caption} loading="lazy" />
              <figcaption>{gambar.caption}</figcaption>
            </figure>
          ))}

          {bagian.catatan && (
            <div className="alert alert-info" style={{ marginTop: 14 }}>
              <span>{bagian.catatan}</span>
            </div>
          )}
        </section>
      ))}

      <section id="operasional" className="card">
        <h2 className="card-judul" style={{ fontSize: 20 }}>Operasional</h2>
        <dl className="docs-daftar">
          {OPERASIONAL.map((row) => (
            <div key={row.judul}>
              <dt>{row.judul}</dt>
              <dd>{row.isi}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="docs-kaki">
        Dokumentasi ini menggambarkan keadaan sistem apa adanya, termasuk data yang belum lengkap.
      </footer>
    </div>
  );
}
