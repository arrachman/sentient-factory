/**
 * Konstanta UI untuk halaman Catatan Klinis (SOAP & Status row per kategori).
 *
 * Field "Status row" berbeda per kategori layanan: dewasa cuma 4 metric,
 * anak 6 metric (ada observasi ortu), pasangan 5 metric (per pasangan),
 * tes 4 metric (skor + interpretasi).
 *
 * SOAP labels berbeda per kategori juga — tes pakai naming yang lebih
 * spesifik (Riwayat administrasi / Hasil per skala / dll).
 */
import type { ServiceKind } from './types';

export const STATUS_FIELDS: Record<
  ServiceKind,
  Array<[string, string, string]>
> = {
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

export const SOAP_LABELS: Record<
  ServiceKind,
  Array<{ key: string; label: string; placeholder: string }>
> = {
  dewasa: [
    {
      key: 's',
      label: 'S · Subjective',
      placeholder:
        'Apa yang dilaporkan klien minggu ini? Gejala, keluhan, perubahan…',
    },
    {
      key: 'o',
      label: 'O · Objective',
      placeholder:
        'Pengamatan klinis: postur, kontak mata, afek, tempo bicara…',
    },
    {
      key: 'a',
      label: 'A · Assessment',
      placeholder:
        'Interpretasi & analisis: progress vs goal, hipotesis, perubahan diagnosa…',
    },
    {
      key: 'p',
      label: 'P · Plan',
      placeholder:
        'Sesi berikutnya: fokus, intervensi, PR, asesmen ulang…',
    },
  ],
  anak: [
    {
      key: 's',
      label: 'S · Subjective (laporan ortu & anak)',
      placeholder:
        'Laporan dari ortu + anak: tantrum, tidur, makan, sosial…',
    },
    {
      key: 'o',
      label: 'O · Objective (observasi sesi)',
      placeholder:
        'Observasi langsung: bermain, kontak mata, regulasi emosi…',
    },
    {
      key: 'a',
      label: 'A · Assessment',
      placeholder:
        'Adaptasi sosial, skill regulasi, bonding ortu-anak…',
    },
    {
      key: 'p',
      label: 'P · Plan',
      placeholder:
        'Sesi berikutnya + PR untuk ortu (timer, pujian, dll)',
    },
  ],
  pasangan: [
    {
      key: 's',
      label: 'S · Subjective',
      placeholder:
        'Laporan dari pasangan: konflik, latihan, dinamika minggu ini…',
    },
    {
      key: 'o',
      label: 'O · Objective',
      placeholder:
        'Pengamatan dalam sesi: jarak duduk, eye contact, interupsi, listening…',
    },
    {
      key: 'a',
      label: 'A · Assessment',
      placeholder:
        'Komunikasi, listening skill, trigger laten yang muncul…',
    },
    {
      key: 'p',
      label: 'P · Plan',
      placeholder:
        'Latihan untuk minggu depan + tema sesi berikutnya…',
    },
  ],
  tes: [
    {
      key: 's',
      label: 'Riwayat administrasi',
      placeholder:
        'Tes apa, tanggal, durasi, ruangan, rapport, gangguan…',
    },
    {
      key: 'o',
      label: 'Hasil per skala',
      placeholder: 'Skor mentah & komposit per subskala…',
    },
    {
      key: 'a',
      label: 'Interpretasi narasi',
      placeholder:
        'Profil kognitif: kekuatan, kelemahan, disparitas antar-skala…',
    },
    {
      key: 'p',
      label: 'Rekomendasi',
      placeholder: '1) … 2) … 3) …',
    },
  ],
};

export const SERVICE_OPTIONS: Array<{ key: ServiceKind; label: string }> = [
  { key: 'dewasa', label: 'Konseling/Terapi Dewasa' },
  { key: 'anak', label: 'Konseling/Terapi Anak' },
  { key: 'pasangan', label: 'Konseling Pasangan/Keluarga' },
  { key: 'tes', label: 'Tes Psikologi' },
];
