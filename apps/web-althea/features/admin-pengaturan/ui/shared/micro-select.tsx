/**
 * Micro-select untuk row notif (32px height, 12px font).
 * Pasangan options: `[value, label]` tuples.
 * Mendukung controlled mode via `value` + `onChange`.
 */
export function MicroSelect({
  defaultValue,
  value,
  options,
  width = 130,
  onChange,
}: {
  defaultValue?: string;
  value?: string;
  options: [string, string][];
  width?: number;
  onChange?: (value: string) => void;
}) {
  const isControlled = value !== undefined;
  return (
    <select
      className="input-althea"
      {...(isControlled
        ? { value, onChange: (e) => onChange?.(e.target.value) }
        : { defaultValue })}
      style={{ width, height: 32, fontSize: 12 }}
    >
      {options.map(([v, label]) => (
        <option key={v} value={v}>
          {label}
        </option>
      ))}
    </select>
  );
}
