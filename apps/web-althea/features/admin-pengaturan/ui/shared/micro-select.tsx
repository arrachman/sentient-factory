/**
 * Micro-select untuk row notif (32px height, 12px font).
 * Pasangan options: `[value, label]` tuples.
 */
export function MicroSelect({
  defaultValue,
  options,
  width = 130,
}: {
  defaultValue: string;
  options: [string, string][];
  width?: number;
}) {
  return (
    <select
      className="input-althea"
      defaultValue={defaultValue}
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
