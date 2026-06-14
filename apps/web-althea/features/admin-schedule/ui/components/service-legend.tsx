/**
 * Legend service category di header card grid (Konseling / Terapi / Anak / Tes).
 * Color dot 10×10 + label.
 */
import { SVC_COLOR, SVC_LABEL } from '../../model/constants';

export function ServiceLegend() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {(['konseling', 'terapi', 'anak', 'tes'] as const).map((cat) => (
        <ServiceLegendItem
          key={cat}
          category={cat}
          label={SVC_LABEL[cat]}
        />
      ))}
    </div>
  );
}

export function ServiceLegendItem({
  category,
  label,
}: {
  category: string;
  label: string;
}) {
  const c = SVC_COLOR[category] ?? SVC_COLOR.konseling;
  return (
    <div className="flex items-center gap-1">
      <span
        style={{
          width: 10,
          height: 10,
          background: c.bar,
          borderRadius: 2,
        }}
      />
      <span className="caption">{label}</span>
    </div>
  );
}
