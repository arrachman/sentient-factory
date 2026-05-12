/**
 * Section catatan klinis di aside — placeholder + link ke editor lengkap.
 * Sementara render CTA untuk write note + redirect ke /psikolog/sessions.
 */
export function ClinicalNotesSection() {
  return (
    <>
      <div
        className="flex items-baseline justify-between"
        style={{ marginBottom: 8 }}
      >
        <span className="eyebrow">Catatan klinis</span>
        <a
          href="/psikolog/sessions"
          style={{
            fontSize: 11,
            color: 'var(--sage-700)',
            fontWeight: 500,
          }}
        >
          Buka editor lengkap →
        </a>
      </div>
      <div
        className="flex flex-col"
        style={{ gap: 8, marginBottom: 14 }}
      >
        <div
          className="card-althea-flat"
          style={{
            padding: 14,
            background: 'var(--bg-elev, #fff)',
            textAlign: 'center',
          }}
        >
          <span
            className="caption"
            style={{ fontSize: 11.5, lineHeight: 1.45 }}
          >
            Catatan klinis per-sesi tersedia di halaman{' '}
            <strong>Catatan klinis</strong>.
          </span>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        style={{ width: '100%' }}
      >
        + Tulis catatan sesi hari ini
      </button>
    </>
  );
}
