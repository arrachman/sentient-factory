-- web-hr Fase 2 — Mode Kiosk: PIN verifikasi per-karyawan (additive, 0 DROP).
-- PIN di-hash dengan scrypt (format: scrypt$<saltHex>$<hashHex>) — bukan plaintext.
-- Kolom nullable: karyawan tanpa PIN tidak bisa clock via PIN (boleh via wajah).

ALTER TABLE public.hr_users
  ADD COLUMN IF NOT EXISTS kiosk_pin_hash   text,
  ADD COLUMN IF NOT EXISTS kiosk_pin_set_at timestamp without time zone;
