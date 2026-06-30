'use client';

export interface AttendanceErrorCopy {
  title: string;
  description: string;
}

function readErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error ?? '');
}

export function getAttendanceErrorCopy(error: unknown): AttendanceErrorCopy {
  const message = readErrorMessage(error);
  const lower = message.toLowerCase();

  if (lower.includes('face embedding')) {
    return {
      title: 'Data wajah belum lengkap',
      description:
        'Daftarkan ulang wajah dari tombol Daftarkan Wajah, lalu ulangi clock-in. Pastikan halaman sudah versi terbaru sebelum mencoba lagi.',
    };
  }

  if (lower.includes('liveness') || lower.includes('kedip')) {
    return {
      title: 'Verifikasi wajah belum lolos',
      description:
        'Hadapkan wajah ke kamera, pastikan cahaya cukup, kedip sekali, lalu tekan Clock In lagi.',
    };
  }

  if (lower.includes('wajah tidak cocok') || lower.includes('face mismatch')) {
    return {
      title: 'Wajah tidak cocok',
      description:
        'Ulangi dengan wajah lurus dan tanpa penutup. Jika tetap gagal, daftar ulang wajah atau minta admin melakukan review.',
    };
  }

  if (lower.includes('outside_geofence') || lower.includes('geofence')) {
    return {
      title: 'Lokasi di luar area kerja',
      description:
        'Pindah mendekati lokasi kerja yang terdaftar atau minta admin memeriksa radius worksite. Absensi bisa masuk review manual bila diizinkan.',
    };
  }

  if (lower.includes('already has an active') || lower.includes('already clocked')) {
    return {
      title: 'Anda sudah clock-in',
      description: 'Gunakan Clock Out jika jam kerja sudah selesai.',
    };
  }

  if (lower.includes('no active attendance')) {
    return {
      title: 'Belum ada clock-in aktif',
      description: 'Lakukan Clock In terlebih dahulu sebelum Clock Out.',
    };
  }

  if (lower.includes('not registered') || lower.includes('profile not found')) {
    return {
      title: 'Profil HR belum aktif',
      description: 'Minta admin menghubungkan akun Anda ke data karyawan HR.',
    };
  }

  if (message && message !== 'Bad Request') {
    return {
      title: 'Absensi belum bisa diproses',
      description: message,
    };
  }

  return {
    title: 'Absensi belum bisa diproses',
    description:
      'Cek kamera, GPS, dan pendaftaran wajah. Jika masih gagal, daftar ulang wajah lalu coba lagi.',
  };
}
