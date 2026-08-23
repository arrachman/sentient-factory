/** Chart SVG inline — port dari prototype, tanpa dependensi grafik apa pun. */

export type TitikTren = { label: string; nilai: number };

export function ChartTren({ data, tinggi = 200 }: { data: TitikTren[]; tinggi?: number }) {
  if (data.length < 2) return <p className="empty">Data tren belum cukup.</p>;
  const W = 520;
  const H = tinggi;
  const padX = 34;
  const padY = 22;
  const nilai = data.map((d) => d.nilai);
  const max = Math.max(...nilai);
  const min = Math.min(...nilai);
  const span = max - min || 1;
  const x = (i: number) => padX + (i * (W - padX * 2)) / (data.length - 1);
  const y = (v: number) => padY + (1 - (v - min) / span) * (H - padY * 2 - 16);

  const garis = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(d.nilai).toFixed(1)}`).join(' ');
  const area = `${garis} L${x(data.length - 1).toFixed(1)} ${H - padY} L${padX} ${H - padY} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={tinggi} role="img" aria-label="Tren jumlah santri dan siswa">
      <defs>
        <linearGradient id="gradTren" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F6B3D" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0F6B3D" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#gradTren)" />
      <path d={garis} fill="none" stroke="#0F6B3D" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={d.label}>
          <circle cx={x(i)} cy={y(d.nilai)} r="4.5" fill="#FFFFFF" stroke="#E8973A" strokeWidth="2.2" />
          <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="#6B7280">{d.label}</text>
          <text x={x(i)} y={y(d.nilai) - 11} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#0A4A2B">{d.nilai}</text>
        </g>
      ))}
    </svg>
  );
}

export type IrisanDonut = { label: string; nilai: number; warna: string };

export function ChartDonut({ data, judulTengah }: { data: IrisanDonut[]; judulTengah?: string }) {
  const total = data.reduce((sum, d) => sum + d.nilai, 0) || 1;
  const r = 54;
  const C = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
      <svg width="140" height="140" viewBox="0 0 140 140" role="img" aria-label="Komposisi individu">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#F0EDE4" strokeWidth="17" />
        {data.map((d) => {
          const panjang = (d.nilai / total) * C;
          const dash = `${panjang} ${C - panjang}`;
          const el = (
            <circle
              key={d.label} cx="70" cy="70" r={r} fill="none" stroke={d.warna} strokeWidth="17"
              strokeDasharray={dash} strokeDashoffset={-offset} transform="rotate(-90 70 70)"
            />
          );
          offset += panjang;
          return el;
        })}
        <text x="70" y="66" textAnchor="middle" fontSize="20" fontWeight="700" fill="#0A4A2B">{total}</text>
        <text x="70" y="82" textAnchor="middle" fontSize="10" fill="#6B7280">{judulTengah ?? 'orang'}</text>
      </svg>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 160 }}>
        {data.map((d) => (
          <li key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: d.warna, flex: '0 0 auto' }} />
            <span style={{ flex: 1, color: 'var(--teks-2)' }}>{d.label}</span>
            <b style={{ color: 'var(--hijau-gelap)' }}>{d.nilai}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type Batang = { label: string; nilai: number; warna: string };

export function ChartBatang({ data }: { data: Batang[] }) {
  const max = Math.max(...data.map((d) => d.nilai), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 190 }}>
      {data.map((d) => (
        <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--hijau-gelap)' }}>{d.nilai}</span>
          <div style={{ width: '100%', height: `${(d.nilai / max) * 100}%`, background: d.warna, borderRadius: '7px 7px 0 0', minHeight: 4 }} />
          <span style={{ fontSize: 11.5, color: 'var(--teks-lembut)', textAlign: 'center' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Bar horizontal — dipakai Poskestren "5 penyakit terbanyak" dan rekap presensi. */
export function BarHorizontal({ data, satuan = '' }: { data: Array<{ label: string; nilai: number; warna?: string }>; satuan?: string }) {
  const max = Math.max(...data.map((d) => d.nilai), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      {data.map((d) => (
        <div key={d.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
            <span style={{ color: 'var(--teks-2)' }}>{d.label}</span>
            <b style={{ color: 'var(--hijau-gelap)' }}>{d.nilai}{satuan && ` ${satuan}`}</b>
          </div>
          <div className="bar">
            <span style={{ width: `${(d.nilai / max) * 100}%`, background: d.warna ?? '#0F6B3D' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
