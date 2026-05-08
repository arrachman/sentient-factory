/* Althea Psychology — Shared design data + small components */

const PSYCHOLOGISTS = [
  { id: 'p1', name: 'Vina Permatasari, M.Psi', short: 'Vina', specialty: 'Klinis Dewasa', color: '#5b8a66' },
  { id: 'p2', name: 'Diah Ayu, M.Psi', short: 'Diah', specialty: 'Anak & Remaja', color: '#c97a5d' },
  { id: 'p3', name: 'Rina Hartono, M.Psi', short: 'Rina', specialty: 'Pasangan', color: '#6f8aa3' },
  { id: 'p4', name: 'Bagus Wicaksono, M.Psi', short: 'Bagus', specialty: 'Klinis Dewasa', color: '#9c7c3c' },
  { id: 'p5', name: 'Sari Lestari, M.Psi', short: 'Sari', specialty: 'Anak', color: '#b3493b' },
  { id: 'p6', name: 'Tomi Pradana, M.Psi', short: 'Tomi', specialty: 'Tes Psikologi', color: '#4a7090' },
  { id: 'p7', name: 'Mira Anggraini, M.Psi', short: 'Mira', specialty: 'Keluarga', color: '#467053' },
];

const ROOMS = [
  { id: 'r1', name: 'Sky Room',    type: 'konseling' },
  { id: 'r2', name: 'Sage Room',   type: 'konseling' },
  { id: 'r3', name: 'Forest Room', type: 'konseling' },
  { id: 'r4', name: 'Sunset Room', type: 'konseling' },
  { id: 'r5', name: 'Mint Room',   type: 'konseling' },
  { id: 'r6', name: 'Terapi Anak 1', type: 'anak' },
  { id: 'r7', name: 'Terapi Anak 2', type: 'anak' },
  { id: 'r8', name: 'Terapi Anak 3', type: 'anak' },
  { id: 'r9', name: 'Playground', type: 'anak' },
  { id: 'r10', name: 'Tes', type: 'tes' },
  { id: 'r11', name: 'Seminar', type: 'seminar' },
];

const SLOTS = [
  '08.30 – 10.00', '10.00 – 11.30', '12.00 – 13.30',
  '13.30 – 15.00', '15.15 – 16.45', '16.45 – 18.15'
];

const SERVICES = [
  { name: 'Konseling Individu Dewasa', sessions: 1, kind: 'konseling' },
  { name: 'Konseling Individu Anak', sessions: 1, kind: 'anak' },
  { name: 'Konseling Individu Remaja', sessions: 1, kind: 'konseling' },
  { name: 'Konseling Pasangan', sessions: 1, kind: 'konseling' },
  { name: 'Konseling Keluarga', sessions: 1, kind: 'konseling' },
  { name: 'Terapi Dewasa', sessions: 4, kind: 'terapi' },
  { name: 'Terapi Pasangan', sessions: 3, kind: 'terapi' },
  { name: 'Terapi Anak Singkat', sessions: 4, kind: 'anak' },
  { name: 'Terapi Anak Lengkap', sessions: 10, kind: 'anak' },
  { name: 'Tes Kesiapan Sekolah Anak', sessions: 2, kind: 'tes' },
  { name: 'Tes Tumbuh Kembang Anak', sessions: 2, kind: 'tes' },
  { name: 'Tes Lengkap Anak', sessions: 2, kind: 'tes' },
  { name: 'Tes MHCU', sessions: 2, kind: 'tes' },
  { name: 'Tes Bakat Minat', sessions: 1, kind: 'tes' },
  { name: 'Tes Lainnya', sessions: 1, kind: 'tes' },
  { name: 'Konsultasi Hasil Tes', sessions: 1, kind: 'tes' },
];

// Sample bookings keyed by `${psyId}-${slotIdx}` for the demo day
const TODAY_BOOKINGS = {
  'p1-0': { client: 'Anita W.', service: 'Konseling Individu Dewasa', kind: 'konseling', room: 'Sky Room', sessionN: 1, sessionTotal: 1 },
  'p1-2': { client: 'Bayu S.', service: 'Terapi Dewasa', kind: 'terapi', room: 'Sage Room', sessionN: 2, sessionTotal: 4 },
  'p1-4': { client: 'Citra A.', service: 'Konseling Pasangan', kind: 'konseling', room: 'Mint Room', sessionN: 1, sessionTotal: 1 },
  'p2-0': { client: 'Davi (8 thn)', service: 'Terapi Anak Lengkap', kind: 'anak', room: 'Terapi Anak 1', sessionN: 6, sessionTotal: 10 },
  'p2-1': { client: 'Eka (5 thn)', service: 'Tes Kesiapan Sekolah', kind: 'tes', room: 'Tes', sessionN: 1, sessionTotal: 2 },
  'p2-3': { client: 'Fani (10 thn)', service: 'Konseling Individu Anak', kind: 'anak', room: 'Terapi Anak 2', sessionN: 1, sessionTotal: 1 },
  'p3-1': { client: 'Gita & Hadi', service: 'Terapi Pasangan', kind: 'terapi', room: 'Forest Room', sessionN: 1, sessionTotal: 3 },
  'p3-2': { client: 'Indra K.', service: 'Konseling Individu Dewasa', kind: 'konseling', room: 'Sunset Room', sessionN: 1, sessionTotal: 1 },
  'p4-0': { client: 'Joko M.', service: 'Konseling Individu Dewasa', kind: 'konseling', room: 'Sunset Room', sessionN: 1, sessionTotal: 1 },
  'p4-3': { client: 'Karin L.', service: 'Terapi Dewasa', kind: 'terapi', room: 'Sky Room', sessionN: 3, sessionTotal: 4 },
  'p5-2': { client: 'Lina (6 thn)', service: 'Tes Tumbuh Kembang', kind: 'tes', room: 'Tes', sessionN: 2, sessionTotal: 2 },
  'p5-4': { client: 'Maya (9 thn)', service: 'Konseling Individu Anak', kind: 'anak', room: 'Playground', sessionN: 1, sessionTotal: 1 },
  'p6-1': { client: 'PT Aksara', service: 'Tes MHCU (12 org)', kind: 'tes', room: 'Seminar', sessionN: 1, sessionTotal: 2 },
  'p6-3': { client: 'Nadia P.', service: 'Tes Bakat Minat', kind: 'tes', room: 'Tes', sessionN: 1, sessionTotal: 2 },
  'p7-0': { client: 'Keluarga Oka', service: 'Konseling Keluarga', kind: 'konseling', room: 'Mint Room', sessionN: 1, sessionTotal: 1 },
  'p7-2': { client: 'Putri & ortu', service: 'Konseling Keluarga', kind: 'konseling', room: 'Forest Room', sessionN: 1, sessionTotal: 1 },
};

// Tiny inline SVG icons (Lucide-style stroke 1.75)
const I = ({ d, size = 18, fill = 'none', stroke = 'currentColor', sw = 1.75 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const Icons = {
  cal: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  user: 'M20 21a8 8 0 0 0-16 0 M12 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M22 21v-2a4 4 0 0 0-3-3.87 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M16 3.13A4 4 0 0 1 16 11',
  door: 'M3 21h18 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16 M14 12h.01',
  plus: 'M12 5v14 M5 12h14',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0',
  chevR: 'M9 18l6-6-6-6',
  chevL: 'M15 18l-6-6 6-6',
  chevD: 'M6 9l6 6 6-6',
  home: 'M3 12l9-9 9 9 M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
  list: 'M3 6h18 M3 12h18 M3 18h18',
  msg: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  more: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2 M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2 M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54z',
  sort: 'M3 6h13 M3 12h9 M3 18h5 M17 4v16 M17 20l-3-3 M17 20l3-3',
  check: 'M20 6L9 17l-5-5',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  wa: 'M21 11.5a8.4 8.4 0 0 1-1.27 4.45L21 21l-5.18-1.34a8.5 8.5 0 1 1 5.18-8.16z',
  whatsapp: 'M16 11a4 4 0 0 1-3.95 3.5 6.4 6.4 0 0 1-3.05-.8L6 14.5l.83-2.83A4 4 0 1 1 16 11z',
  arrowR: 'M5 12h14 M12 5l7 7-7 7',
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  x: 'M18 6L6 18 M6 6l12 12',
  dot: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
};

const Icon = ({ name, size, ...rest }) => <I d={Icons[name]} size={size} {...rest} />;

// Initials avatar
const Avatar = ({ name, size = 'md', color }) => {
  const initials = name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();
  const cls = 'avatar avatar-' + size;
  return <span className={cls} style={color ? {background: color + '22', color} : undefined}>{initials}</span>;
};

// Service kind → palette
const kindBar = (kind) => ({
  konseling: { fill: 'var(--svc-konseling-soft)', bar: 'var(--svc-konseling)', text: '#2d4736' },
  terapi:    { fill: 'var(--svc-terapi-soft)',    bar: 'var(--svc-terapi)',    text: '#3d556d' },
  anak:      { fill: 'var(--svc-anak-soft)',      bar: 'var(--svc-anak)',      text: '#8b3d2a' },
  tes:       { fill: 'var(--svc-tes-soft)',       bar: 'var(--svc-tes)',       text: '#6b5320' },
}[kind] || { fill: 'var(--cream-100)', bar: 'var(--neutral-400)', text: 'var(--neutral-700)' });

Object.assign(window, {
  PSYCHOLOGISTS, ROOMS, SLOTS, SERVICES, TODAY_BOOKINGS,
  Icon, Avatar, kindBar
});
