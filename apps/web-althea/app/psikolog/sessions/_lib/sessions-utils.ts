export type ServiceKind = 'dewasa' | 'anak' | 'pasangan' | 'tes';

export const STATUS_FIELDS: Record<ServiceKind, Array<[string, string, string]>> = {
  dewasa: [
    ['Mood klien', '— / 10', 'belum diisi'],
    ['Tidur', '—', 'jam'],
    ['Kepatuhan PR', '—', 'frekuensi'],
    ['Risiko self-harm', '—', 'tidak ada flag'],
  ],
  anak: [
    ['Mood', '— / 10', 'belum diisi'],
    ['Tidur', '—', 'jam'],
    ['Perilaku makan', '—', '—'],
    ['Kepatuhan PR', '—', '—'],
    ['Observasi ortu', '—', '—'],
    ['Risiko', '—', '—'],
  ],
  pasangan: [
    ['Mood — pasangan A', '— / 10', '—'],
    ['Mood — pasangan B', '— / 10', '—'],
    ['Dinamika hubungan', '—', '—'],
    ['Kepatuhan latihan', '—', '—'],
    ['Risiko KDRT', '—', '—'],
  ],
  tes: [
    ['Skor mentah', '—', '—'],
    ['Klasifikasi', '—', '—'],
    ['Interpretasi', '—', '—'],
    ['Rekomendasi', '—', '—'],
  ],
};

export const SOAP_LABELS: Record<ServiceKind, Array<{ key: string; label: string; placeholder: string }>> = {
  dewasa: [
    { key: 's', label: 'S · Subjective', placeholder: 'Apa yang dilaporkan klien minggu ini? Gejala, keluhan, perubahan…' },
    { key: 'o', label: 'O · Objective', placeholder: 'Pengamatan klinis: postur, kontak mata, afek, tempo bicara…' },
    { key: 'a', label: 'A · Assessment', placeholder: 'Interpretasi & analisis: progress vs goal, hipotesis, perubahan diagnosa…' },
    { key: 'p', label: 'P · Plan', placeholder: 'Sesi berikutnya: fokus, intervensi, PR, asesmen ulang…' },
  ],
  anak: [
    { key: 's', label: 'S · Subjective (laporan ortu & anak)', placeholder: 'Laporan dari ortu + anak: tantrum, tidur, makan, sosial…' },
    { key: 'o', label: 'O · Objective (observasi sesi)', placeholder: 'Observasi langsung: bermain, kontak mata, regulasi emosi…' },
    { key: 'a', label: 'A · Assessment', placeholder: 'Adaptasi sosial, skill regulasi, bonding ortu-anak…' },
    { key: 'p', label: 'P · Plan', placeholder: 'Sesi berikutnya + PR untuk ortu (timer, pujian, dll)' },
  ],
  pasangan: [
    { key: 's', label: 'S · Subjective', placeholder: 'Laporan dari pasangan: konflik, latihan, dinamika minggu ini…' },
    { key: 'o', label: 'O · Objective', placeholder: 'Pengamatan dalam sesi: jarak duduk, eye contact, interupsi, listening…' },
    { key: 'a', label: 'A · Assessment', placeholder: 'Komunikasi, listening skill, trigger laten yang muncul…' },
    { key: 'p', label: 'P · Plan', placeholder: 'Latihan untuk minggu depan + tema sesi berikutnya…' },
  ],
  tes: [
    { key: 's', label: 'Riwayat administrasi', placeholder: 'Tes apa, tanggal, durasi, ruangan, rapport, gangguan…' },
    { key: 'o', label: 'Hasil per skala', placeholder: 'Skor mentah & komposit per subskala…' },
    { key: 'a', label: 'Interpretasi narasi', placeholder: 'Profil kognitif: kekuatan, kelemahan, disparitas antar-skala…' },
    { key: 'p', label: 'Rekomendasi', placeholder: '1) … 2) … 3) …' },
  ],
};

export const SERVICE_OPTIONS: Array<{ key: ServiceKind; label: string }> = [
  { key: 'dewasa', label: 'Konseling/Terapi Dewasa' },
  { key: 'anak', label: 'Konseling/Terapi Anak' },
  { key: 'pasangan', label: 'Konseling Pasangan/Keluarga' },
  { key: 'tes', label: 'Tes Psikologi' },
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function formatSessionTime(start: string): string {
  const d = new Date(start);
  return d.toLocaleString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatSessionShort(start: string): string {
  const d = new Date(start);
  return d.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short' });
}

export function formatTimeOnly(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export function toServiceKind(category: string): ServiceKind {
  const c = category.toLowerCase();
  if (c === 'anak' || c === 'kanak-kanak') return 'anak';
  if (c === 'pasangan' || c === 'keluarga') return 'pasangan';
  if (c === 'tes' || c === 'tes_psikologi') return 'tes';
  return 'dewasa';
}

export function serializeSOAP(soap: Record<string, string>, kind: ServiceKind): string {
  const labels = SOAP_LABELS[kind];
  return labels
    .map((l) => `[${l.label}]\n${(soap[l.key] ?? '').trim()}`)
    .filter((s) => s.split('\n').slice(1).join('').trim().length > 0)
    .join('\n\n');
}

export function parseSOAPFromNote(noteText: string, kind: ServiceKind): Record<string, string> {
  const result: Record<string, string> = {};
  const labels = SOAP_LABELS[kind];
  for (const l of labels) {
    const re = new RegExp(`\\[${l.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]\\s*([\\s\\S]*?)(?=\\n\\n\\[|$)`);
    const match = noteText.match(re);
    result[l.key] = match ? match[1].trim() : '';
  }
  return result;
}

// suppress lint — pad is used internally only
void pad;
