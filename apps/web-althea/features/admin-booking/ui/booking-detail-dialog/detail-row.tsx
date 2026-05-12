/**
 * Generic label-value row dengan width 32 untuk label kiri.
 */
export function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start gap-2">
      <span className="caption text-fg-muted w-32 shrink-0">{label}</span>
      <div className="flex-1 min-w-0">{value}</div>
    </div>
  );
}
