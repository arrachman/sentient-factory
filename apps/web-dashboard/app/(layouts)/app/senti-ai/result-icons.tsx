// Small SVG icon components for AI result views.
// Extracted from page.tsx.

export function TableResultIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className={className}>
      <rect x="1.5" y="2" width="15" height="14" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
      <rect x="3.25" y="4" width="11.5" height="2.5" rx="1.25" fill="#2563eb" />
      <rect x="3.25" y="7.5" width="3.2" height="2.75" rx="0.8" fill="#34d399" />
      <rect x="7.4" y="7.5" width="3.2" height="2.75" rx="0.8" fill="#f59e0b" />
      <rect x="11.55" y="7.5" width="3.2" height="2.75" rx="0.8" fill="#fb7185" />
      <rect x="3.25" y="11.15" width="3.2" height="2.75" rx="0.8" fill="#22c55e" />
      <rect x="7.4" y="11.15" width="3.2" height="2.75" rx="0.8" fill="#38bdf8" />
      <rect x="11.55" y="11.15" width="3.2" height="2.75" rx="0.8" fill="#a78bfa" />
    </svg>
  );
}

export function ChartResultIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className={className}>
      <rect x="1.5" y="1.5" width="15" height="15" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
      <path d="M4 12.5L6.9 9.6L9.1 11.2L13.7 6.6" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="4" cy="12.5" r="1.1" fill="#34d399" />
      <circle cx="6.9" cy="9.6" r="1.1" fill="#f59e0b" />
      <circle cx="9.1" cy="11.2" r="1.1" fill="#fb7185" />
      <circle cx="13.7" cy="6.6" r="1.1" fill="#8b5cf6" />
      <path d="M4 14.5H14" stroke="#cbd5e1" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
