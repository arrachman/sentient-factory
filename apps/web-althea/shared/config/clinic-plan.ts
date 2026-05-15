/**
 * Paket langganan klinik yang aktif.
 *
 * standard → tidak ada modul pembayaran, role marketing & intern tidak aktif.
 * premium  → semua fitur aktif.
 *
 * Untuk upgrade ke premium: ubah CLINIC_PLAN ke 'premium'
 * DAN balik semua flag di PLAN_FEATURES ke true.
 */
export type ClinicPlan = 'standard' | 'premium';

// Saat ini: paket standard.
export const CLINIC_PLAN: ClinicPlan = 'standard';

export const PLAN_FEATURES = {
  /** Modul pembayaran (DP, lunas, receipt PDF, kirim WA) */
  payment: false,
  /** Role marketing tersedia di user management */
  marketingRole: false,
  /** Role intern tersedia di user management */
  internRole: false,
} satisfies Record<string, boolean>;
