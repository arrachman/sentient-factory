/**
 * Placeholder add-on untuk Pembayaran & Keamanan — tidak aktif di Paket
 * Standard. Ditampilkan saat user klik tab disabled.
 */
export function TabDisabled({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="card-althea"
      style={{
        padding: 32,
        textAlign: 'center',
        background: 'var(--cream-100)',
      }}
    >
      <div
        className="badge badge-neutral"
        style={{ marginBottom: 12, padding: '4px 10px', fontSize: 11 }}
      >
        ADD-ON
      </div>
      <h2 className="h2" style={{ marginBottom: 6 }}>
        {title}
      </h2>
      <p className="caption" style={{ maxWidth: 480, margin: '0 auto' }}>
        {description}{' '}
        <strong>Tidak aktif di Paket Standard</strong> — bisa dibuka sebagai
        add-on di fase berikutnya.
      </p>
    </div>
  );
}

export const TAB_PEMBAYARAN_DESCRIPTION =
  'Konfigurasi metode pembayaran (transfer, QRIS, Midtrans), DP wajib, format invoice, dan PPN korporat.';

export const TAB_KEAMANAN_DESCRIPTION =
  'Sesi login, two-factor auth, aturan kata sandi, retensi audit log, dan zona berbahaya (ekspor/hapus data klinik).';
