/**
 * Konstanta UI untuk halaman Notifikasi WA.
 */
import type { CreateTemplateInput, WaCategory } from './types';

/**
 * Trigger event templates yang hanya tersedia di paket full.
 * Kategori 'bayar' otomatis paket-full (semua row), list ini untuk
 * paid-only triggers di kategori lain.
 */
export const PAID_ONLY_TRIGGERS: ReadonlySet<string> = new Set([
  'payment_due',
]);

export const CATEGORY_HINT: Record<WaCategory, string> = {
  pengingat: 'Cron-scheduled berdasarkan booking',
  jadwal: 'Dipicu oleh aksi admin',
  onboarding: 'Pendaftaran klien & staff',
  bayar: 'DP, pelunasan, bukti bayar',
};

export const RECIPIENT_STYLE: Record<
  string,
  { bg: string; fg: string; label: string }
> = {
  klien: { bg: 'var(--sage-100)', fg: 'var(--sage-800)', label: 'klien' },
  psikolog: { bg: '#dde8f1', fg: '#3b5b75', label: 'psikolog' },
  staff: { bg: 'var(--cream-200)', fg: '#6b5320', label: 'staff' },
  user: { bg: 'var(--info-soft)', fg: 'var(--info)', label: 'user' },
};

export const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  dibaca: { bg: 'var(--success-soft)', fg: 'var(--success)' },
  sampai: { bg: 'var(--info-soft)', fg: 'var(--info)' },
  terkirim: { bg: 'var(--info-soft)', fg: 'var(--info)' },
  gagal: { bg: 'var(--danger-soft)', fg: 'var(--danger)' },
  queued: { bg: 'var(--warning-soft)', fg: '#8a4a00' },
};

export const COMMON_VARIABLES = [
  '{{nama_klien}}',
  '{{tanggal}}',
  '{{waktu_sesi}}',
  '{{nama_psikolog}}',
  '{{nama_ruangan}}',
  '{{nama_layanan}}',
];

export type TriggerMeta = {
  status: 'auto' | 'cron' | 'manual' | 'paket-full' | 'belum-aktif';
  /** Narasi singkat: apa yang terjadi dan kenapa WA ini ada. */
  cerita: string;
  /** Kondisi yang harus terpenuhi supaya notif benar-benar terkirim. */
  syarat: string[];
  /** Tips atau peringatan yang perlu diperhatikan admin. */
  tips?: string;
};

export const TRIGGER_META: Record<string, TriggerMeta> = {
  reminder_h1: {
    status: 'cron',
    cerita:
      'Notifikasi ini dikirim otomatis oleh sistem sehari sebelum jadwal sesi. ' +
      'Tujuannya simpel: supaya klien tidak lupa dan bisa mempersiapkan diri. ' +
      'Sistem memeriksa jadwal secara rutin dan langsung mengirim begitu masuk window H-1.',
    syarat: [
      'Booking masih aktif — belum dibatalkan atau selesai',
      'Nomor WhatsApp klien sudah diisi di data klien',
      'Reminder H-1 belum pernah dikirim untuk booking ini (tidak akan kirim dua kali)',
    ],
    tips: 'Kalau klien tidak terima WA, cek apakah nomor HP-nya sudah benar dan diisi format internasional (628xxx).',
  },
  reminder_30m: {
    status: 'cron',
    cerita:
      'Pengingat terakhir yang dikirim 30 menit sebelum sesi dimulai. ' +
      'Cocok untuk klien yang sering lupa atau perjalanannya perlu perhitungan waktu. ' +
      'Sistem cek lebih sering (tiap menit) supaya timing-nya tepat.',
    syarat: [
      'Booking masih aktif',
      'Nomor WhatsApp klien sudah diisi',
      'Reminder 30 menit belum pernah dikirim untuk booking ini',
    ],
    tips: 'Pastikan isi pesan singkat dan to-the-point — klien biasanya sudah dalam perjalanan.',
  },
  follow_up: {
    status: 'auto',
    cerita:
      'Dikirim otomatis sesaat setelah admin atau psikolog menandai sesi sebagai selesai. ' +
      'Fungsinya untuk menjaga hubungan baik dengan klien pasca-sesi — bisa berisi ucapan terima kasih, ' +
      'info sesi berikutnya, atau dorongan untuk lanjut terapi.',
    syarat: [
      'Admin atau psikolog sudah klik "Selesai" di detail booking',
      'Nomor WhatsApp klien sudah diisi',
    ],
    tips: 'Kalau template memakai variabel {{sesi_berikut_tanggal}}, sistem auto-lookup booking lanjutan klien terdekat (status scheduled/confirmed/checked_in, scheduledStart > now). Kalau belum ada booking lanjutan, variabel diisi "(belum dijadwalkan)" — jadi input booking lanjutan dulu sebelum tandai "Selesai" supaya isinya akurat.',
  },
  feedback_request: {
    status: 'cron',
    cerita:
      'Dikirim otomatis H+1 setelah sesi selesai — sistem cek tiap hari jam 08:00 WIB ' +
      'dan mengirim ke semua klien yang sesinya ditandai "Selesai" pada hari sebelumnya. ' +
      'Klien diminta membalas pesan WhatsApp ini langsung dengan masukannya (tanpa link/formulir); ' +
      'balasan dibaca tim lewat WhatsApp.',
    syarat: [
      'Sesi sudah ditandai "Selesai" (status completed) pada hari sebelumnya',
      'Nomor WhatsApp klien sudah diisi & klien tidak opt-out',
      'Feedback belum pernah dikirim untuk booking ini (tidak akan kirim dua kali)',
    ],
    tips: 'Jaga template tetap meminta klien membalas pesan ini — jangan masukkan link form. Balasan klien masuk ke WhatsApp klinik, bukan ke aplikasi.',
  },
  payment_due: {
    status: 'paket-full',
    cerita:
      'Pengingat khusus untuk klien yang belum melunasi DP atau pembayaran sebelum sesi. ' +
      'Rencananya dikirim otomatis H-1 jika status bayar belum lunas. ' +
      'Fitur ini hanya tersedia di Paket Full karena memerlukan modul payment tracking.',
    syarat: [
      'Hanya tersedia di Paket Full',
      'Modul pelacakan pembayaran harus aktif',
    ],
    tips: 'Upgrade ke Paket Full untuk mengaktifkan reminder pembayaran otomatis.',
  },
  confirmation: {
    status: 'auto',
    cerita:
      'Otomatis terkirim begitu booking dibuat di sistem. ' +
      'Dikirim ke klien DAN psikolog (fan-out) dengan teks netral peran — ' +
      'tidak menyapa "Halo {{nama_klien}}", melainkan mendaftar Klien & Psikolog sebagai field ' +
      'agar kedua pihak nyaman membacanya.',
    syarat: [
      'Booking sudah ada di sistem',
      'Nomor WhatsApp klien sudah diisi',
      'Nomor psikolog (User.phone) terisi agar psikolog ikut menerima',
    ],
    tips: 'Body wajib netral peran (tanpa "Anda"/"Halo nama") karena pesan yang sama dikirim ke klien dan psikolog.',
  },
  reschedule: {
    status: 'auto',
    cerita:
      'Otomatis dikirim setiap kali jadwal booking digeser — baik tanggalnya, jam-nya, psikolognya, maupun ruangannya. ' +
      'Klien langsung dapat info jadwal baru tanpa perlu dihubungi manual. ' +
      'Kalau ada alasan reschedule, akan ikut terkirim di pesan.',
    syarat: [
      'Reschedule dilakukan lewat fitur Reschedule di sistem (bukan edit manual di database)',
      'Nomor WhatsApp klien sudah diisi',
    ],
    tips: 'Gunakan variabel {{alasan_reschedule}} di template supaya klien tahu kenapa jadwalnya diubah.',
  },
  cancel: {
    status: 'auto',
    cerita:
      'Langsung terkirim begitu admin membatalkan booking. ' +
      'Penting supaya klien tidak datang sia-sia ke klinik dan bisa reschedule lebih awal.',
    syarat: [
      'Pembatalan dilakukan lewat fitur Cancel di sistem',
      'Nomor WhatsApp klien sudah diisi',
    ],
    tips: 'Selalu isi alasan pembatalan di form cancel — akan masuk ke variabel {{alasan}} sehingga klien mendapat penjelasan, bukan hanya "dibatalkan".',
  },
  walk_in_confirmation: {
    status: 'belum-aktif',
    cerita:
      'Dirancang untuk klien walk-in yang langsung datang tanpa booking sebelumnya. ' +
      'Begitu resepsionis menginput booking walk-in, WA konfirmasi ini harusnya langsung terkirim. ' +
      'Sayangnya sambungannya ke sistem belum dibuat — jadi belum bisa berjalan otomatis.',
    syarat: [
      'Fitur auto-trigger belum tersedia',
      'Sementara bisa dikirim manual via Send Test',
    ],
    tips: 'Hubungi developer untuk mengaktifkan trigger otomatis saat booking walk-in dibuat.',
  },
  slot_moved: {
    status: 'belum-aktif',
    cerita:
      'Template internal untuk memberi tahu psikolog atau staf kalau jadwal mereka digeser oleh admin. ' +
      'Berbeda dengan reschedule klien — ini khusus notif ke tim internal. ' +
      'Belum tersambung ke sistem, jadi belum aktif.',
    syarat: [
      'Fitur auto-trigger belum tersedia',
      'Sementara bisa dikirim manual',
    ],
  },
  welcome: {
    status: 'auto',
    cerita:
      'Pesan sambutan yang langsung dikirim saat admin mendaftarkan klien baru ke sistem. ' +
      'Momen pertama kali klien "kenal" Althea lewat WA — jadi kesan pertama sangat penting. ' +
      'Pastikan pesannya hangat dan informatif.',
    syarat: [
      'Admin selesai membuat data klien baru',
      'Nomor WhatsApp klien diisi saat pendaftaran',
    ],
    tips: 'Kalau klien tidak dapat WA welcome, cek apakah nomor HP diisi sebelum klik Simpan — sistem hanya kirim saat pertama kali data dibuat.',
  },
  clinic_info: {
    status: 'manual',
    cerita:
      'Template serbaguna untuk mengirim informasi umum tentang klinik ke klien. ' +
      'Tidak ada trigger otomatis — admin kirim kapan saja dianggap perlu, ' +
      'misalnya saat klien baru mau mulai terapi atau ada perubahan jadwal operasional klinik.',
    syarat: [
      'Nomor WhatsApp klien sudah diisi',
      'Admin kirim manual via Send Test',
    ],
  },
  psikolog_info: {
    status: 'auto',
    cerita:
      'Dikirim otomatis saat klien untuk pertama kalinya booking dengan psikolog tertentu. ' +
      'Isinya profil singkat psikolog — nama, gelar, spesialisasi. ' +
      'Tujuannya agar klien lebih percaya dan tidak canggung sebelum sesi pertama.',
    syarat: [
      'Ini booking pertama klien dengan psikolog tersebut',
      'Nomor WhatsApp klien sudah diisi',
      'Profil psikolog sudah dilengkapi di menu Psikolog (nama, gelar, spesialisasi)',
    ],
    tips: 'Kalau variabel profil kosong di WA, berarti data psikolog belum lengkap — minta psikolog mengisi profilnya di /psikolog/profile.',
  },
  dp_confirmed: {
    status: 'paket-full',
    cerita:
      'Notifikasi ke klien bahwa pembayaran DP-nya sudah diterima dan dicatat. ' +
      'Membantu klien merasa tenang bahwa pembayarannya tidak hilang. ' +
      'Fitur ini termasuk Paket Full karena memerlukan modul payment tracking.',
    syarat: ['Hanya tersedia di Paket Full', 'Modul pembayaran harus aktif'],
  },
  lunas_confirmed: {
    status: 'paket-full',
    cerita:
      'Konfirmasi ke klien bahwa pembayaran penuh sudah lunas. ' +
      'Klien mendapat kepastian dan bisa fokus menyiapkan diri untuk sesi tanpa pikiran soal bayar. ' +
      'Fitur Paket Full.',
    syarat: ['Hanya tersedia di Paket Full', 'Modul pembayaran harus aktif'],
  },
  receipt: {
    status: 'paket-full',
    cerita:
      'Mengirim bukti pembayaran dalam format PDF langsung ke WA klien setelah admin mengupload receipt. ' +
      'Praktis karena klien tidak perlu datang ke klinik hanya untuk ambil kwitansi. ' +
      'Fitur Paket Full.',
    syarat: [
      'Hanya tersedia di Paket Full',
      'Admin sudah upload bukti bayar di detail booking',
      'Nomor WhatsApp klien sudah diisi',
    ],
    tips: 'PDF receipt di-generate otomatis oleh sistem. Pastikan data booking (layanan, harga, tanggal) sudah benar sebelum upload.',
  },
  refund: {
    status: 'paket-full',
    cerita:
      'Pemberitahuan ke klien bahwa proses refund sudah disetujui. ' +
      'Penting untuk transparansi — klien tahu kapan uangnya akan kembali tanpa perlu tanya-tanya. ' +
      'Fitur Paket Full.',
    syarat: [
      'Hanya tersedia di Paket Full',
      'Modul refund dan payment tracking harus aktif',
    ],
  },
};

export const STATUS_LABEL: Record<TriggerMeta['status'], string> = {
  auto: 'Otomatis',
  cron: 'Terjadwal',
  manual: 'Manual',
  'paket-full': 'Paket Full',
  'belum-aktif': 'Belum aktif',
};

export const STATUS_PILL_STYLE: Record<TriggerMeta['status'], string> = {
  auto: 'bg-sage-100 text-sage-800',
  cron: 'bg-blue-100 text-blue-900',
  manual: 'bg-cream-200 text-teal-800',
  'paket-full': 'bg-amber-100 text-amber-900',
  'belum-aktif': 'bg-rose-100 text-rose-900',
};

export const EMPTY_TEMPLATE: CreateTemplateInput = {
  name: '',
  category: 'pengingat',
  triggerEvent: '',
  body: '',
  recipients: ['klien'],
  isActive: true,
};
