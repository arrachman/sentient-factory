/**
 * Toggle pill — sage saat on, cream saat off, knob putih sliding.
 * Optional `label` text di kanan pill. Onyl onChange render kursor pointer.
 */
export function Toggle({
  on = false,
  label,
  onChange,
}: {
  on?: boolean;
  label?: string;
  onChange?: (on: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!on)}
      className="flex items-center gap-2"
      style={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: onChange ? 'pointer' : 'default',
      }}
    >
      <span
        style={{
          width: 34,
          height: 20,
          borderRadius: 999,
          background: on ? 'var(--sage-500)' : 'var(--cream-300)',
          position: 'relative',
          flexShrink: 0,
          transition: 'background .15s',
          display: 'inline-block',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: on ? 16 : 2,
            width: 16,
            height: 16,
            borderRadius: 999,
            background: '#fff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
            transition: 'left .15s',
          }}
        />
      </span>
      {label ? (
        <span style={{ fontSize: 13, color: 'var(--fg)' }}>{label}</span>
      ) : null}
    </button>
  );
}
