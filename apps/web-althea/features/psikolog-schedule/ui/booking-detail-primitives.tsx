import * as React from 'react';

export function Card({
  title,
  subtitle,
  spacing = false,
  children,
}: {
  title: string;
  subtitle?: string | null;
  /** Add bottom margin (for stacked cards in block layout). */
  spacing?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid var(--border)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        marginBottom: spacing ? 20 : 0,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 8,
          borderBottom: '1px solid var(--border)',
          background: 'rgba(245,240,230,0.4)',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--teal-800)',
            letterSpacing: '0.01em',
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 500 }}>
            {subtitle}
          </span>
        )}
      </div>
      <div style={{ padding: '16px 18px' }}>{children}</div>
    </div>
  );
}

export function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 14,
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      }}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <FieldLabel icon={icon}>{label}</FieldLabel>
      <div style={{ marginTop: 4 }}>{children}</div>
    </div>
  );
}

export function FieldLabel({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--fg-muted)',
      }}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </div>
  );
}

export function NoteBlock({
  label,
  icon,
  tone = 'default',
  muted = false,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  tone?: 'default' | 'warning';
  muted?: boolean;
  children: React.ReactNode;
}) {
  const bg = tone === 'warning' ? '#fff7ed' : 'var(--cream-50, #fbfaf6)';
  const border = tone === 'warning' ? '#fed7aa' : 'var(--border)';
  return (
    <div style={{ marginTop: 16 }}>
      <FieldLabel icon={icon}>{label}</FieldLabel>
      <div
        style={{
          marginTop: 4,
          padding: '10px 12px',
          borderRadius: 8,
          background: bg,
          border: `1px solid ${border}`,
          fontSize: 13,
          lineHeight: 1.55,
          color: muted ? 'var(--fg-muted)' : 'var(--teal-800)',
          fontStyle: muted ? 'italic' : 'normal',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function Pill({
  bg,
  color,
  border,
  icon,
  size = 'md',
  children,
}: {
  bg: string;
  color: string;
  border?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: size === 'sm' ? '1px 7px' : '3px 9px',
        borderRadius: 999,
        fontSize: size === 'sm' ? 10 : 11,
        fontWeight: 600,
        letterSpacing: '0.02em',
        background: bg,
        color,
        border: border ? `1px solid ${border}` : 'none',
        lineHeight: 1.4,
      }}
    >
      {icon}
      {children}
    </span>
  );
}

export function SessionRow({
  icon,
  tone,
  date,
  time,
  title,
  subtitle,
  rightBadge,
  rightBadgeStyle,
}: {
  icon: React.ReactNode;
  tone: 'neutral' | 'upcoming';
  date: string;
  time: string;
  title: string;
  subtitle: string | null;
  rightBadge?: string;
  rightBadgeStyle?: { bg: string; color: string };
}) {
  const iconBg = tone === 'upcoming' ? 'var(--sage-50)' : 'var(--cream-100, #f5f0e6)';
  const iconColor = tone === 'upcoming' ? 'var(--sage-700, #385a43)' : '#6b6047';
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: '10px 12px',
        borderRadius: 8,
        background: 'var(--cream-50, #fbfaf6)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--teal-800)',
            }}
          >
            {date}
          </span>
          <span
            style={{
              fontSize: 11,
              color: 'var(--fg-muted)',
              fontWeight: 500,
            }}
          >
            {time}
          </span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--teal-800)',
            marginTop: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 11,
              color: 'var(--fg-muted)',
              marginTop: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {rightBadge && rightBadgeStyle && (
        <Pill bg={rightBadgeStyle.bg} color={rightBadgeStyle.color} size="sm">
          {rightBadge}
        </Pill>
      )}
    </div>
  );
}

export function Loading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '12px 0',
        fontSize: 12,
        color: 'var(--fg-muted)',
        fontStyle: 'italic',
      }}
    >
      {children}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '12px 0',
        fontSize: 12,
        color: 'var(--fg-muted)',
        fontStyle: 'italic',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
}

export function ErrorRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '10px 12px',
        borderRadius: 8,
        background: '#fee2e2',
        color: '#991b1b',
        fontSize: 12,
      }}
    >
      {children}
    </div>
  );
}

export function Muted({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontStyle: 'italic', color: 'var(--fg-muted)', fontSize: 13 }}>
      {children}
    </span>
  );
}

export function Footnote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 2,
        fontSize: 11,
        color: 'var(--fg-muted)',
        fontStyle: 'italic',
        padding: '0 4px',
      }}
    >
      {children}
    </div>
  );
}
