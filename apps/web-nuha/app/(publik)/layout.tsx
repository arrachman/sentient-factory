import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './publik.css';

// Halaman publik (landing, profil pondok, dst) — tanpa sesi login,
// header & footer sama untuk semua halaman di grup route ini.


export default function PublikLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header className="pub-header">
        <div className="pub-header-bar">
          <Link href="/beranda" className="pub-brand">
            <Image src="/assets/logo-nuha.webp" alt="Logo Nurul Huda Mergosono" width={46} height={46} style={{ objectFit: 'contain' }} />
            <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span className="pub-brand-nama">Nurul Huda Mergosono</span>
              <span className="pub-brand-arab">مَعْهَدُ نُوْرُ الْهُدَى</span>
            </span>
          </Link>
          <nav className="pub-nav">
            <Link href="/beranda">Beranda</Link>
            <Link href="/profil-pondok">Pondok Pesantren</Link>
            <a href="/cek-status">Cek Status PPDB</a>
          </nav>
          <div className="pub-cta">
            <Link href="/login" className="pub-btn">Masuk</Link>
            <a href="/ppdb" className="pub-btn pub-btn-solid">Daftar PPDB</a>
          </div>
        </div>
        <div className="pub-mobnav">
          <Link href="/beranda">Beranda</Link>
          <Link href="/profil-pondok">Pondok Pesantren</Link>
          <a href="/cek-status">Cek Status PPDB</a>
        </div>
      </header>

      {children}

      <footer className="pub-footer">
        <div className="pub-footer-grid">
          <div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 19, color: '#faf8f3', fontWeight: 600 }}>PPSS Nurul Huda Mergosono</div>
            <div style={{ fontFamily: "'Amiri', serif", fontSize: 15, color: '#e8973a', margin: '6px 0 14px' }}>مَعْهَدُ نُوْرُ الْهُدَى</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
              Jl. Kol. Sugiono 3B No.103, Mergosono,<br />Kedungkandang, Kota Malang, Jawa Timur<br />smpnuhamergosono@gmail.com
            </div>
          </div>
          <div>
            <h4>Unit</h4>
            <div className="pub-footer-col">
              <span>SMP Nurul Huda Mergosono</span>
              <span>MA Nurul Huda Mergosono</span>
              <span>Pondok Pesantren</span>
              <span>Poskestren</span>
            </div>
          </div>
          <div>
            <h4>Layanan</h4>
            <div className="pub-footer-col">
              <a href="/ppdb">PPDB Online</a>
              <a href="/cek-status">Cek Status PPDB</a>
              <Link href="/login" style={{ color: 'rgba(243,241,233,.78)', textDecoration: 'none' }}>Portal Wali Santri</Link>
              <Link href="/login" style={{ color: 'rgba(243,241,233,.78)', textDecoration: 'none' }}>SIMTERPADU Staf</Link>
              <a href="https://drive.google.com/drive/folders/18MM-nIa6tlQvsxcJ85kZUmvnvm59n-z4" target="_blank" rel="noopener">Brosur PPSS &amp; SMP</a>
            </div>
          </div>
          <div>
            <h4>Kanal Santri</h4>
            <div className="pub-footer-col">
              <a href="https://www.instagram.com/nuhamergosono/" target="_blank" rel="noopener">@nuhamergosono</a>
              <a href="https://www.instagram.com/quotesnuha/" target="_blank" rel="noopener">@quotesnuha</a>
              <a href="https://www.instagram.com/elquds_nuha/" target="_blank" rel="noopener">@elquds_nuha</a>
              <a href="https://linktr.ee/nuhamergosono" target="_blank" rel="noopener">Semua kanal — linktr.ee/nuhamergosono</a>
            </div>
          </div>
        </div>
        <div className="pub-footer-bottom">
          <span>© {new Date().getFullYear()} PPSS Nurul Huda Mergosono</span>
        </div>
      </footer>
    </div>
  );
}
