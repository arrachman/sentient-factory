import { RISK_TONE, type RiskLevel } from '../_lib/patients-model';

export function ClientAvatar({
  initial,
  risk,
  size = 32,
}: {
  initial: string;
  risk: RiskLevel;
  size?: number;
}) {
  const dotSize = size > 40 ? 14 : 10;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: 'var(--sage-200)',
        color: 'var(--sage-800)',
        display: 'grid',
        placeItems: 'center',
        fontSize: size > 40 ? 19 : 12,
        fontWeight: 600,
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {initial}
      <span
        title={`Risiko: ${risk}`}
        style={{
          position: 'absolute',
          bottom: -1,
          right: -1,
          width: dotSize,
          height: dotSize,
          borderRadius: 999,
          background: RISK_TONE[risk].dot,
          border: '2px solid var(--bg-elev, #fff)',
        }}
      />
    </div>
  );
}
