/* theme.jsx — Design tokens for Sentient Factory HR Admin
   Metronic 9 inspired: clean, modern, soft shadows, generous whitespace.
   Exposes CSS variables; theme switches via [data-theme] attr on <html>.
*/

const SF_THEME_CSS = `
  :root {
    /* Brand */
    --sf-primary: #1B84FF;
    --sf-primary-hover: #056EE9;
    --sf-primary-light: #E9F3FF;
    --sf-primary-fg: #ffffff;

    --sf-success: #17C653;
    --sf-success-light: #DFFFEA;
    --sf-warning: #F6B100;
    --sf-warning-light: #FFF8DD;
    --sf-danger: #F8285A;
    --sf-danger-light: #FFE2E5;
    --sf-info: #7239EA;
    --sf-info-light: #F8F5FF;

    /* Density (overridable by tweaks) */
    --sf-density: 1;
    --sf-radius: 12px;
    --sf-radius-sm: 8px;
    --sf-radius-lg: 16px;
    --sf-radius-pill: 999px;

    /* Type */
    --sf-font: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --sf-font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    --sf-font-size: 14px;
  }

  /* Light theme */
  [data-theme="light"] {
    --sf-bg: #F9FAFB;
    --sf-bg-elev: #FFFFFF;
    --sf-bg-subtle: #F4F6F8;
    --sf-bg-hover: #F1F1F4;
    --sf-border: #E5E7EB;
    --sf-border-strong: #D1D5DB;
    --sf-text: #0F172A;
    --sf-text-muted: #4B5675;
    --sf-text-soft: #78829D;
    --sf-text-faint: #99A1B7;

    --sf-sidebar-bg: #0F172A;
    --sf-sidebar-fg: #94A3B8;
    --sf-sidebar-fg-active: #FFFFFF;
    --sf-sidebar-bg-active: rgba(255,255,255,.08);
    --sf-sidebar-border: rgba(255,255,255,.06);

    --sf-shadow-sm: 0 1px 2px rgba(15,23,42,.04);
    --sf-shadow: 0 1px 3px rgba(15,23,42,.06), 0 1px 2px rgba(15,23,42,.04);
    --sf-shadow-md: 0 4px 12px rgba(15,23,42,.08), 0 2px 4px rgba(15,23,42,.04);
    --sf-shadow-lg: 0 12px 32px rgba(15,23,42,.10), 0 4px 8px rgba(15,23,42,.06);
    --sf-ring: 0 0 0 4px rgba(27,132,255,.18);
  }

  /* Dark theme */
  [data-theme="dark"] {
    --sf-bg: #0B1120;
    --sf-bg-elev: #131A2B;
    --sf-bg-subtle: #0F1729;
    --sf-bg-hover: #1B2236;
    --sf-border: #1F2A44;
    --sf-border-strong: #2A3756;
    --sf-text: #F1F5F9;
    --sf-text-muted: #94A3B8;
    --sf-text-soft: #64748B;
    --sf-text-faint: #475569;

    --sf-sidebar-bg: #070B17;
    --sf-sidebar-fg: #94A3B8;
    --sf-sidebar-fg-active: #FFFFFF;
    --sf-sidebar-bg-active: rgba(27,132,255,.16);
    --sf-sidebar-border: rgba(255,255,255,.04);

    --sf-primary-light: rgba(27,132,255,.14);
    --sf-success-light: rgba(23,198,83,.14);
    --sf-warning-light: rgba(246,177,0,.14);
    --sf-danger-light: rgba(248,40,90,.14);
    --sf-info-light: rgba(114,57,234,.14);

    --sf-shadow-sm: 0 1px 2px rgba(0,0,0,.3);
    --sf-shadow: 0 1px 3px rgba(0,0,0,.4), 0 1px 2px rgba(0,0,0,.3);
    --sf-shadow-md: 0 4px 12px rgba(0,0,0,.5), 0 2px 4px rgba(0,0,0,.3);
    --sf-shadow-lg: 0 12px 32px rgba(0,0,0,.6), 0 4px 8px rgba(0,0,0,.4);
    --sf-ring: 0 0 0 4px rgba(27,132,255,.28);
  }

  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: var(--sf-font);
    font-size: var(--sf-font-size);
    color: var(--sf-text);
    background: var(--sf-bg);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
    transition: background-color .18s ease, color .18s ease;
  }
  ::selection { background: var(--sf-primary); color: #fff; }

  /* Scrollbar */
  *::-webkit-scrollbar { width: 10px; height: 10px; }
  *::-webkit-scrollbar-track { background: transparent; }
  *::-webkit-scrollbar-thumb { background: var(--sf-border); border-radius: 6px; border: 2px solid transparent; background-clip: content-box; }
  *::-webkit-scrollbar-thumb:hover { background: var(--sf-border-strong); border: 2px solid transparent; background-clip: content-box; }

  /* Focus */
  :focus-visible { outline: none; box-shadow: var(--sf-ring); border-radius: var(--sf-radius-sm); }

  /* Utility */
  .sf-tabular { font-variant-numeric: tabular-nums; }
  .sf-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* Animations */
  @keyframes sf-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes sf-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(27,132,255,.5); } 70% { box-shadow: 0 0 0 12px rgba(27,132,255,0); } 100% { box-shadow: 0 0 0 0 rgba(27,132,255,0); } }
  @keyframes sf-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes sf-spin { to { transform: rotate(360deg); } }
`;

// inject
(function injectThemeCSS() {
  if (document.getElementById('sf-theme-css')) return;
  const style = document.createElement('style');
  style.id = 'sf-theme-css';
  style.textContent = SF_THEME_CSS;
  document.head.appendChild(style);
})();

// Apply theme/density/primary at runtime
function applyTheme(opts) {
  const root = document.documentElement;
  if (opts.theme) root.setAttribute('data-theme', opts.theme);
  if (opts.primary) {
    root.style.setProperty('--sf-primary', opts.primary);
    // derive hover (-10% L) and light (alpha 0.12) using simple manipulation on hex
    const hex = opts.primary.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      root.style.setProperty('--sf-primary-hover', `rgb(${Math.max(0, r - 25)}, ${Math.max(0, g - 25)}, ${Math.max(0, b - 25)})`);
      root.style.setProperty('--sf-primary-light', `rgba(${r}, ${g}, ${b}, 0.12)`);
      root.style.setProperty('--sf-ring', `0 0 0 4px rgba(${r}, ${g}, ${b}, 0.22)`);
    }
  }
  if (opts.density != null) {
    const map = { compact: 0.85, comfortable: 1, spacious: 1.15 };
    root.style.setProperty('--sf-density', map[opts.density] || 1);
  }
  if (opts.radius != null) {
    root.style.setProperty('--sf-radius', `${opts.radius}px`);
    root.style.setProperty('--sf-radius-sm', `${Math.max(4, opts.radius - 4)}px`);
    root.style.setProperty('--sf-radius-lg', `${opts.radius + 4}px`);
  }
  if (opts.fontSize) root.style.setProperty('--sf-font-size', `${opts.fontSize}px`);
  if (opts.font) root.style.setProperty('--sf-font', opts.font);
}

window.applyTheme = applyTheme;
