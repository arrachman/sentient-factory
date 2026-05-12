/**
 * Card asesmen GAD-7 / PHQ-9 — backend stub.
 * Belum punya endpoint, jadi ditampilkan "—" + label "belum tersedia".
 */
const ASSESSMENT_STUBS = [
  { label: 'GAD-7', max: 21 },
  { label: 'PHQ-9', max: 27 },
];

export function AssessmentCard() {
  return (
    <div
      className="card-althea-flat"
      style={{ padding: 12, marginBottom: 12 }}
    >
      <span className="eyebrow" style={{ display: 'block' }}>
        Asesmen terbaru
      </span>
      <div className="flex" style={{ gap: 8, marginTop: 8 }}>
        {ASSESSMENT_STUBS.map((it) => (
          <div
            key={it.label}
            className="flex flex-col"
            style={{
              flex: 1,
              padding: 10,
              background: 'var(--bg-elev, #fff)',
              borderRadius: 6,
            }}
          >
            <span className="caption" style={{ fontSize: 10.5 }}>
              {it.label}
            </span>
            <div
              className="flex items-baseline"
              style={{ gap: 6, marginTop: 2 }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'var(--fg-muted)',
                  fontFamily: 'var(--font-serif)',
                }}
              >
                —
              </span>
              <span className="caption" style={{ fontSize: 10 }}>
                / {it.max} · belum tersedia
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
