/**
 * Inline SVG icon registry + sparkline untuk Home page.
 * Dipisah dari `page.tsx` agar halaman fokus pada layout, dan icon paths
 * mudah di-extend tanpa scroll halaman utama.
 */
import type { IconName } from '../_data';

export function Icon({
  name,
  size = 18,
  color = 'currentColor',
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="M3 10.5L12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></>,
    sparkles: <><path d="M12 3l1.8 4.6L18.5 9.5l-4.7 1.9L12 16l-1.8-4.6L5.5 9.5l4.7-1.9z" /><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
    shield: <path d="M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z" />,
    chev: <path d="m9 6 6 6-6 6" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
    chart: <><path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-7" /></>,
    coin: <><circle cx="12" cy="12" r="9" /><path d="M14 9h-3a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9" /><path d="M12 7v2M12 15v2" /></>,
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
    factory: <><path d="M2 21V9l6 4V9l6 4V9l6 4v8z" /><path d="M9 17h2M14 17h2" /></>,
    box: <><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></>,
    cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h2l3 13h12l2-9H6" /></>,
    truck: <><rect x="1" y="6" width="13" height="11" rx="1" /><path d="M14 9h4l3 4v4h-7" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    layers: <><path d="m12 2 10 6-10 6L2 8z" /><path d="m2 14 10 6 10-6" /></>,
    refresh: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></>,
  };

  return <svg {...props}>{paths[name]}</svg>;
}

export function Sparkline({
  data,
  color,
}: {
  data: readonly number[];
  color: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map(
      (value, index) =>
        `${(index / (data.length - 1)) * 100},${
          30 - ((value - min) / (max - min || 1)) * 28 - 1
        }`,
    )
    .join(' ');

  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      style={{ width: '100%', height: 32 }}
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
