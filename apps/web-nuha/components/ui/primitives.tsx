import type { ReactNode } from 'react';

// Helper yang di prototype hidup sebagai fungsi lepas di DCLogic.
export const rp = (n: number) => `Rp ${Math.abs(n).toLocaleString('id-ID')}`;

export const inisial = (nama: string) =>
  nama.split(' ').filter((w) => w.length > 1).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const AVA_BG = ['#0F6B3D', '#1D4ED8', '#7C2D12', '#5B21B6', '#166534', '#9A3412', '#065F46', '#3730A3'];
export const avaBg = (nama: string) => AVA_BG[nama.length % AVA_BG.length];

/** Satu tabel status → kelas badge, dipakai seluruh modul. */
const KELAS_STATUS: Record<string, string> = {
  Lunas: 'badge-hijau', Selesai: 'badge-hijau', Disetujui: 'badge-biru', Aktif: 'badge-hijau',
  Mukim: 'badge-hijau', Terbit: 'badge-hijau', Dibayar: 'badge-hijau', Dibaca: 'badge-hijau',
  Lulus: 'badge-hijau', 'Sudah kembali': 'badge-hijau', Hadir: 'badge-hijau',
  Terkirim: 'badge-biru', Seleksi: 'badge-biru', Putra: 'badge-biru',
  Sebagian: 'badge-kuning', Menunggu: 'badge-kuning', Baru: 'badge-kuning', Verifikasi: 'badge-kuning',
  Kalong: 'badge-kuning', Draft: 'badge-kuning', 'Dry-run': 'badge-kuning', Izin: 'badge-kuning',
  'Menunggu verifikasi': 'badge-kuning', Revisi: 'badge-kuning', Sakit: 'badge-kuning',
  'Belum bayar': 'badge-merah', 'Tidak Lulus': 'badge-merah', 'Telat kembali': 'badge-merah',
  Gagal: 'badge-merah', Alpa: 'badge-merah',
  'Sedang di luar': 'badge-oranye', Cicil: 'badge-oranye', Menunggak: 'badge-merah',
  Nonaktif: 'badge-netral', Ditolak: 'badge-netral',
  Putri: 'badge-pink',
};
export const kelasStatus = (status: string) => KELAS_STATUS[status] ?? 'badge-netral';

export function Badge({ status }: { status: string }) {
  return <span className={`badge ${kelasStatus(status)}`}>{status}</span>;
}

export function Card({ judul, sub, aksi, children }: { judul?: string; sub?: string; aksi?: ReactNode; children: ReactNode }) {
  return (
    <section className="card">
      {judul && (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
          <div>
            <h3 className="card-judul" style={{ marginBottom: sub ? 0 : undefined }}>{judul}</h3>
            {sub && <p className="card-sub">{sub}</p>}
          </div>
          {aksi}
        </header>
      )}
      {children}
    </section>
  );
}

export function JudulHalaman({ judul, sub, aksi }: { judul: string; sub?: string; aksi?: ReactNode }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
      <div>
        <h2 className="judul-hal">{judul}</h2>
        {sub && <p className="sub-hal">{sub}</p>}
      </div>
      {aksi}
    </header>
  );
}

/** Cincin progres SVG — port dari ring(pct,size,col,w) di prototype. */
export function Ring({ pct, size = 46, warna = '#0F6B3D', w = 5 }: { pct: number; size?: number; warna?: string; w?: number }) {
  const r = (size - w) / 2;
  const c = 2 * Math.PI * r;
  const mid = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={mid} cy={mid} r={r} fill="none" stroke="#F0EDE4" strokeWidth={w} />
      <circle
        cx={mid} cy={mid} r={r} fill="none" stroke={warna} strokeWidth={w} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(100, Math.max(0, pct)) / 100)}
        transform={`rotate(-90 ${mid} ${mid})`}
      />
      <text x={mid} y={mid + 3.5} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#4B5563">
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

export function StatCard({ label, nilai, sub, warna = 'var(--hijau-gelap)', pct }: { label: string; nilai: string | number; sub?: string; warna?: string; pct?: number }) {
  return (
    <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="label">{label}</p>
        <p className="angka" style={{ color: warna }}>{nilai}</p>
        {sub && <p style={{ fontSize: 12, color: 'var(--teks-lembut)' }}>{sub}</p>}
      </div>
      {pct !== undefined && <Ring pct={pct} warna={warna === 'var(--hijau-gelap)' ? '#0F6B3D' : warna} />}
    </div>
  );
}

export function ProgressBar({ pct, warna }: { pct: number; warna?: string }) {
  const w = Math.min(100, Math.max(0, pct));
  // Ambang warna prototype: >95% merah, >90% amber, sisanya hijau.
  const auto = w > 95 ? '#B91C1C' : w > 90 ? '#E8973A' : '#0F6B3D';
  return <div className="bar"><span style={{ width: `${w}%`, background: warna ?? auto }} /></div>;
}

export function Kosong({ pesan = 'Tidak ada data yang cocok dengan filter.' }: { pesan?: string }) {
  return <p className="empty">{pesan}</p>;
}

export function Tabel({ kolom, children }: { kolom: Array<string | { label: string; num?: boolean }>; children: ReactNode }) {
  return (
    <div className="tabel-wrap">
      <table>
        <thead>
          <tr>
            {kolom.map((k) => {
              const label = typeof k === 'string' ? k : k.label;
              const num = typeof k === 'string' ? false : k.num;
              return <th key={label} className={num ? 'num' : undefined}>{label}</th>;
            })}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Avatar({ nama, size = 32 }: { nama: string; size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        width: size, height: size, borderRadius: '50%', background: avaBg(nama), color: '#FFF',
        fontWeight: 700, fontSize: size * 0.37, display: 'grid', placeItems: 'center', flex: '0 0 auto',
      }}
    >
      {inisial(nama)}
    </span>
  );
}
