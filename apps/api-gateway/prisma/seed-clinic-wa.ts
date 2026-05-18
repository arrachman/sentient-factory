/**
 * Seed 18 default WhatsApp templates per PRD (4 categories).
 *
 * Run: `npm run db:seed:clinic:wa`
 *
 * Idempotent — pakai upsert by name. Aman di-run berulang.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type TemplateSeed = {
  name: string;
  category: 'pengingat' | 'jadwal' | 'onboarding' | 'bayar';
  triggerEvent?: string;
  body: string;
  recipients: ('klien' | 'psikolog')[];
};

const TEMPLATES: TemplateSeed[] = [
  // ----- PENGINGAT (5) -----
  {
    name: 'Pengingat H-1 Booking',
    category: 'pengingat',
    triggerEvent: 'reminder_h1',
    body:
      'Halo {{nama_klien}},\n\nMengingatkan sesi Anda di Althea Psychology besok:\n📅 {{tanggal}}\n⏰ {{waktu}}\n👤 {{nama_psikolog}}\n📍 {{ruang}}\n\nMohon hadir 10 menit sebelumnya. Terima kasih.',
    recipients: ['klien'],
  },
  {
    name: 'Pengingat 30 Menit Sebelum Sesi',
    category: 'pengingat',
    triggerEvent: 'reminder_30m',
    body:
      'Halo {{nama_klien}}, sesi Anda dengan {{nama_psikolog}} akan dimulai dalam 30 menit di {{ruang}}. Sampai jumpa.',
    recipients: ['klien'],
  },
  {
    name: 'Follow-up Post Session',
    category: 'pengingat',
    triggerEvent: 'follow_up',
    body:
      'Halo {{nama_klien}},\n\nTerima kasih atas sesi hari ini bersama {{nama_psikolog}}.\n\nKami berharap sesi ini bermanfaat. Sesi berikutnya: {{sesi_berikut_tanggal}} pukul {{sesi_berikut_waktu}}.\n\nKalau ada hal yang ingin disampaikan, balas pesan ini.',
    recipients: ['klien'],
  },
  {
    name: 'Form Feedback',
    category: 'pengingat',
    triggerEvent: 'feedback_request',
    body:
      'Hai {{nama_klien}}, mohon waktunya 2 menit untuk feedback sesi tadi: {{link_form}}. Masukan Anda sangat berarti untuk kami. Terima kasih 🙏',
    recipients: ['klien'],
  },
  {
    name: 'Pengingat Pembayaran (DP/Lunas)',
    category: 'pengingat',
    triggerEvent: 'payment_due',
    body:
      'Halo {{nama_klien}}, mengingatkan pembayaran sesi {{layanan}} sebesar Rp {{jumlah}}. Mohon bayar via {{metode}} sebelum {{deadline}}. Terima kasih.',
    recipients: ['klien'],
  },

  // ----- JADWAL (5) -----
  {
    name: 'Konfirmasi Booking',
    category: 'jadwal',
    triggerEvent: 'confirmation',
    body:
      'Halo {{nama_klien}},\n\nBooking Anda dikonfirmasi ✅\n📅 {{tanggal}}\n⏰ {{waktu}}\n👤 {{nama_psikolog}}\n📍 {{ruang}}\n💰 Total: Rp {{total}}\n\nKami tunggu kehadiran Anda di Althea Psychology.',
    recipients: ['klien', 'psikolog'],
  },
  {
    name: 'Reschedule Booking',
    category: 'jadwal',
    triggerEvent: 'reschedule',
    body:
      'Halo {{nama_klien}},\n\nJadwal sesi Anda berubah:\n❌ Sebelumnya: {{tanggal_lama}} {{waktu_lama}}\n✅ Sekarang: {{tanggal_baru}} {{waktu_baru}}\n📍 {{ruang}}\n\nAlasan: {{alasan}}\n\nMohon konfirmasi kehadiran. Terima kasih.',
    recipients: ['klien', 'psikolog'],
  },
  {
    name: 'Cancel Booking',
    category: 'jadwal',
    triggerEvent: 'cancel',
    body:
      'Halo {{nama_klien}},\n\nSesi Anda di {{tanggal}} {{waktu}} telah dibatalkan.\n\nAlasan: {{alasan}}\n\nUntuk re-booking, silakan hubungi kami. Mohon maaf atas ketidaknyamanannya.',
    recipients: ['klien', 'psikolog'],
  },
  {
    name: 'Walk-in Confirmation',
    category: 'jadwal',
    triggerEvent: 'walk_in_confirmation',
    body:
      'Halo {{nama_klien}}, terima kasih sudah datang. Sesi Anda dengan {{nama_psikolog}} di {{ruang}} dimulai sekarang.',
    recipients: ['klien'],
  },
  {
    name: 'Slot Dipindah (Internal)',
    category: 'jadwal',
    triggerEvent: 'slot_moved',
    body:
      'Mengingatkan: jadwal {{nama_klien}} dipindah ke {{tanggal_baru}} {{waktu_baru}}, ruang {{ruang_baru}}.',
    recipients: ['psikolog'],
  },

  // ----- ONBOARDING (4) -----
  {
    name: 'Welcome New Client',
    category: 'onboarding',
    triggerEvent: 'welcome',
    body:
      'Selamat datang di Althea Psychology, {{nama_klien}} 🌿\n\nKami senang Anda mempercayakan kami untuk perjalanan kesehatan mental Anda.\n\nSemua sesi dilaksanakan dengan privasi dan kerahasiaan terjaga. Kalau ada pertanyaan, silakan hubungi admin.',
    recipients: ['klien'],
  },
  {
    name: 'OTP Login',
    category: 'onboarding',
    triggerEvent: 'otp',
    body:
      'Kode OTP login Althea Anda: {{otp}}\n\nBerlaku 5 menit. Jangan berikan kode ini kepada siapapun.',
    recipients: ['klien'],
  },
  {
    name: 'Info Klinik',
    category: 'onboarding',
    triggerEvent: 'clinic_info',
    body:
      'Althea Psychology\n📍 {{alamat}}\n☎️ {{telepon}}\n🕐 Jam operasional: {{jam}}\n\nMaps: {{maps_link}}',
    recipients: ['klien'],
  },
  {
    name: 'Info Psikolog',
    category: 'onboarding',
    triggerEvent: 'psikolog_info',
    body:
      'Profil {{nama_psikolog}}, {{title}}\n\nSpesialisasi: {{spesialisasi}}\nPendidikan: {{pendidikan}}\nLisensi: {{lisensi}}\n\nWelcome to Althea.',
    recipients: ['klien'],
  },
  {
    name: 'Welcome Psikolog Baru',
    category: 'onboarding',
    triggerEvent: 'psikolog_welcome',
    body:
      'Halo {{nama_psikolog}} 🌿\n\nSelamat datang di Althea Psychology. Akun Anda sudah aktif dan siap dipakai.\n\nLogin: {{login_url}}\nUsername: {{username}}\n\nKalau ada kendala akses, hubungi admin klinik. Terima kasih.',
    recipients: ['psikolog'],
  },

  // ----- BAYAR (4) -----
  {
    name: 'Konfirmasi DP',
    category: 'bayar',
    triggerEvent: 'dp_confirmed',
    body:
      'Halo {{nama_klien}},\n\nDP sebesar Rp {{dp}} sudah kami terima ✅\n\nBooking Anda kini berstatus dikonfirmasi. Sisa pembayaran Rp {{sisa}} dapat dilunasi pada hari sesi.\n\nTerima kasih.',
    recipients: ['klien'],
  },
  {
    name: 'Konfirmasi Pelunasan',
    category: 'bayar',
    triggerEvent: 'lunas_confirmed',
    body:
      'Halo {{nama_klien}},\n\nPembayaran lunas sebesar Rp {{total}} sudah kami terima ✅\n\nBukti pembayaran: {{link_receipt}}\n\nTerima kasih atas kepercayaannya.',
    recipients: ['klien'],
  },
  {
    name: 'Bukti Pembayaran',
    category: 'bayar',
    triggerEvent: 'receipt',
    body:
      'Halo {{nama_klien}},\n\nBukti pembayaran sesi tertanggal {{tanggal}}: {{link_receipt}}\n\nDokumen ini juga dapat diakses kapan saja melalui link tersebut. Terima kasih.',
    recipients: ['klien'],
  },
  {
    name: 'Notifikasi Refund',
    category: 'bayar',
    triggerEvent: 'refund',
    body:
      'Halo {{nama_klien}},\n\nRefund sebesar Rp {{jumlah}} telah diproses dan akan masuk ke rekening Anda dalam 1-3 hari kerja.\n\nKalau ada pertanyaan, hubungi admin. Terima kasih.',
    recipients: ['klien'],
  },
];

async function main() {
  console.log('🌱 Seeding 18 WA templates...');
  for (const t of TEMPLATES) {
    await prisma.clinicWaTemplate.upsert({
      where: { name: t.name },
      update: {
        category: t.category,
        triggerEvent: t.triggerEvent,
        body: t.body,
        recipients: t.recipients,
        isActive: true,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        name: t.name,
        category: t.category,
        triggerEvent: t.triggerEvent,
        body: t.body,
        recipients: t.recipients,
      },
    });
  }
  console.log(`✅ ${TEMPLATES.length} WA templates seeded.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
