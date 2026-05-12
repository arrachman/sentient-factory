/**
 * Inline CSS untuk Home page (Mission Control look & feel).
 * Diekspor sebagai string lalu di-render lewat <style>{HOME_STYLES}</style>
 * pada page.tsx. Dipisah agar halaman page.tsx tetap < 100 LOC.
 */

export const HOME_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
@keyframes sf-pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
.sf-home {
  --sf-bg: #f4f6fa; --sf-bg-subtle: #f9fafc; --sf-surface: #fff; --sf-surface-2: #fbfbfd;
  --sf-border: #eef0f5; --sf-border-strong: #e1e4ed; --sf-divider: #f1f3f7;
  --sf-text: #131720; --sf-text-2: #4b5263; --sf-text-3: #78808f; --sf-text-muted: #a1a8b5;
  --sf-primary: #3e97ff; --sf-primary-hover: #2b87f0; --sf-primary-soft: #eef6ff; --sf-primary-ink: #0c5fbf;
  --sf-success: #17c653; --sf-success-soft: #dffbe8; --sf-success-ink: #04773c;
  --sf-warning: #f6c000; --sf-warning-soft: #fff5cc; --sf-warning-ink: #8a6c00;
  --sf-danger: #f8285a; --sf-danger-soft: #ffe2ea; --sf-danger-ink: #b91339;
  --sf-info: #7239ea; --sf-info-soft: #efe7fe; --sf-info-ink: #4a1fb8;
  --sf-neutral-soft: #eef0f5; --sf-neutral-ink: #4b5263;
  --sf-sidebar-bg: #11141b; --sf-sidebar-bg-2: #181c25; --sf-sidebar-text: #b6bcc9; --sf-sidebar-text-muted: #6c7280;
  --sf-sidebar-active-bg: rgba(62,151,255,.12); --sf-sidebar-active-text: #fff; --sf-sidebar-border: #1e2330;
  --sf-font-sans: "Inter", "Helvetica Neue", system-ui, -apple-system, sans-serif;
  --sf-font-mono: "JetBrains Mono", "SF Mono", Menlo, monospace;
  width: 100%; min-height: calc(100vh - 84px); background: var(--sf-bg); color: var(--sf-text);
  font-family: var(--sf-font-sans); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; font-feature-settings: "cv11", "ss01";
}
.sf-home * { box-sizing: border-box; }
.sf-home button { font-family: inherit; cursor: pointer; }
.sf-home-content { padding: 4px 24px 24px; overflow: visible; width: 100%; }
.sf-card { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 12px; box-shadow: 0 1px 2px rgba(15,23,42,.04); }
.sf-card-header { padding: 16px 18px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--sf-divider); }
.sf-card-header h3 { font-size: 14px; font-weight: 700; margin: 0; letter-spacing: -.005em; }
.sf-card-header .sub { font-size: 12px; color: var(--sf-text-3); margin-top: 2px; }
.sf-card-header .actions { margin-left: auto; display: flex; align-items: center; gap: 6px; }
.sf-card-header a { color: var(--sf-primary); font-size: 12px; font-weight: 600; cursor: pointer; }
.sf-card-body { padding: 18px; }
.sf-hero { margin-bottom: 16px; background: linear-gradient(135deg, #0a1f3d 0%, #11141b 45%, #1e2a4a 100%); border: none; color: white; overflow: hidden; position: relative; }
.sf-hero-bg { position: absolute; inset: 0; opacity: .06; background-image: radial-gradient(circle at 20% 30%, #3e97ff 0, transparent 40%), radial-gradient(circle at 80% 70%, #7239ea 0, transparent 40%); }
.sf-hero-inner { padding: 24px 28px; display: flex; align-items: center; gap: 28px; position: relative; }
.sf-hero-copy { flex: 1; min-width: 0; }
.sf-hero-status { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.sf-hero-status span { width: 8px; height: 8px; border-radius: 50%; background: var(--sf-success); animation: sf-pulse 1.6s infinite; }
.sf-hero-status p { font-size: 11px; letter-spacing: .16em; text-transform: uppercase; opacity: .75; font-weight: 600; margin: 0; }
.sf-hero h2 { font-size: 24px; margin: 0 0 6px; font-weight: 700; letter-spacing: -.015em; }
.sf-hero-copy > p { font-size: 13px; opacity: .78; margin: 0; max-width: 560px; line-height: 1.55; }
.sf-warn-text { color: #ffd05a; }
.sf-ok-text { color: #9bf0ad; }
.sf-senti-ask { width: 460px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14); border-radius: 12px; padding: 14px; backdrop-filter: blur(6px); }
.sf-senti-title { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.sf-senti-title > div { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg,#3e97ff,#7239ea); display: flex; align-items: center; justify-content: center; }
.sf-senti-title strong { font-size: 13px; }
.sf-senti-title span { margin-left: auto; font-size: 10px; opacity: .6; font-family: var(--sf-font-mono); }
.sf-senti-input { background: rgba(0,0,0,.25); border: 1px solid rgba(255,255,255,.08); border-radius: 8px; display: flex; align-items: center; padding: 8px 12px; margin-bottom: 10px; }
.sf-senti-input input { flex: 1; background: transparent; border: none; outline: none; color: white; font-size: 13px; }
.sf-senti-input button { background: var(--sf-primary); border: none; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.sf-senti-prompts { display: flex; flex-wrap: wrap; gap: 5px; }
.sf-senti-prompts span { font-size: 11px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.1); padding: 4px 9px; border-radius: 999px; display: inline-flex; align-items: center; gap: 5px; cursor: pointer; }
.sf-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; background: var(--sf-neutral-soft); color: var(--sf-neutral-ink); letter-spacing: .01em; white-space: nowrap; }
.sf-badge.primary { background: var(--sf-primary-soft); color: var(--sf-primary-ink); }
.sf-badge.success { background: var(--sf-success-soft); color: var(--sf-success-ink); }
.sf-badge.warning { background: var(--sf-warning-soft); color: var(--sf-warning-ink); }
.sf-badge.danger { background: var(--sf-danger-soft); color: var(--sf-danger-ink); }
.sf-badge.info { background: var(--sf-info-soft); color: var(--sf-info-ink); }
.sf-badge.dot:before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; display: inline-block; }
.sf-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 7px; font-size: 13px; font-weight: 600; border: 1px solid transparent; background: var(--sf-surface); color: var(--sf-text); transition: all .12s; }
.sf-btn.outline { background: transparent; border-color: var(--sf-border-strong); color: var(--sf-text); }
.sf-btn.ghost { background: transparent; color: var(--sf-text-2); }
.sf-btn.dark { background: var(--sf-text); color: white; }
.sf-btn.sm { padding: 6px 10px; font-size: 12px; }
.sf-btn.xs { padding: 4px 8px; font-size: 11.5px; }
.sf-stat-grid { display: grid; gap: 16px; grid-template-columns: repeat(4, 1fr); margin-bottom: 16px; }
.sf-stat { background: var(--sf-surface); border: 1px solid var(--sf-border); border-radius: 12px; padding: 18px; position: relative; overflow: hidden; }
.sf-stat .label { font-size: 12px; color: var(--sf-text-3); font-weight: 500; text-transform: uppercase; letter-spacing: .06em; }
.sf-stat .value { font-size: 28px; font-weight: 700; letter-spacing: -.02em; }
.sf-stat-main { display: flex; align-items: baseline; gap: 8px; margin-top: 4px; }
.sf-stat-sub { font-size: 11px; color: var(--sf-text-3); margin-top: 4px; margin-bottom: 6px; }
.sf-stat .icon-tile { position: absolute; top: 14px; right: 14px; width: 36px; height: 36px; border-radius: 8px; background: var(--sf-primary-soft); color: var(--sf-primary-ink); display: flex; align-items: center; justify-content: center; }
.sf-stat.t-success .icon-tile { background: var(--sf-success-soft); color: var(--sf-success-ink); }
.sf-stat.t-warning .icon-tile { background: var(--sf-warning-soft); color: var(--sf-warning-ink); }
.sf-stat.t-info .icon-tile { background: var(--sf-info-soft); color: var(--sf-info-ink); }
.tnum { font-feature-settings: "tnum"; font-variant-numeric: tabular-nums; }
.sf-module-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 14px; margin-bottom: 16px; }
.sf-module-card { border: 1px solid var(--sf-border); border-radius: 10px; padding: 14px; background: var(--sf-surface); cursor: pointer; transition: all .15s; position: relative; }
.sf-module-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.sf-module-icon { width: 36px; height: 36px; border-radius: 8px; padding: 0; justify-content: center; }
.sf-module-title { flex: 1; }
.sf-module-title strong { font-size: 13px; font-weight: 700; display: block; }
.sf-module-title span { font-size: 11px; color: var(--sf-text-3); }
.sf-module-kpi { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; }
.sf-module-kpi div { font-size: 20px; font-weight: 700; letter-spacing: -.01em; }
.sf-module-kpi .sf-badge:last-child { margin-left: auto; }
.sf-module-hot { font-size: 11.5px; color: var(--sf-text-2); line-height: 1.45; padding: 8px 10px; background: var(--sf-bg-subtle); border-radius: 6px; display: flex; align-items: center; gap: 6px; }
.sf-mid-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; margin-bottom: 16px; }
.sf-activity-chart { width: 100%; height: 220px; }
.sf-activity-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 12px; }
.sf-activity-stats div { padding: 10px 12px; background: var(--sf-bg-subtle); border-radius: 8px; }
.sf-activity-stats span { display: block; font-size: 10.5px; color: var(--sf-text-3); font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
.sf-activity-stats strong { font-size: 18px; font-weight: 700; margin-right: 6px; }
.sf-activity-stats em { font-size: 10.5px; color: var(--sf-success-ink); font-weight: 600; font-style: normal; }
.sf-alert-list { padding: 0; max-height: 360px; overflow-y: auto; }
.sf-alert-row { padding: 11px 18px; border-bottom: 1px solid var(--sf-divider); display: flex; align-items: flex-start; gap: 10px; }
.sf-alert-row > div { flex: 1; min-width: 0; }
.sf-alert-row strong { font-size: 12.5px; font-weight: 600; line-height: 1.4; display: block; }
.sf-alert-row p { font-size: 11px; color: var(--sf-text-3); margin: 2px 0 0; display: flex; align-items: center; gap: 6px; }
.sf-sev-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-top: 6px; }
.sf-sev-critical { background: var(--sf-danger); }
.sf-sev-high { background: #ff8a3d; }
.sf-sev-medium { background: var(--sf-warning); }
.sf-bottom-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 16px; }
.sf-flush-list { padding: 0; }
.sf-task-row { padding: 12px 18px; border-bottom: 1px solid var(--sf-divider); display: flex; align-items: center; gap: 10px; }
.sf-task-row > div { width: 6px; height: 36px; border-radius: 3px; background: var(--sf-warning); }
.sf-task-row > div.high { background: var(--sf-danger); }
.sf-task-row section { flex: 1; }
.sf-task-row strong { font-size: 12.5px; font-weight: 600; display: block; }
.sf-task-row span { font-size: 11px; color: var(--sf-text-3); margin-top: 2px; display: block; }
.sf-status-list > div, .sf-fresh-list > div:not(.sf-refresh-note) { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--sf-divider); }
.sf-status-list section { flex: 1; }
.sf-status-list strong { font-size: 12.5px; font-weight: 600; display: block; }
.sf-status-list span:not(.sf-pulse) { font-size: 10.5px; color: var(--sf-text-3); }
.sf-pulse { width: 8px; height: 8px; border-radius: 50%; animation: sf-pulse 1.8s infinite; }
.sf-pulse.running { background: var(--sf-success); }
.sf-pulse.watch { background: var(--sf-warning); }
.sf-pulse.alert { background: var(--sf-danger); }
.sf-load { width: 80px; height: 6px; background: var(--sf-bg); border-radius: 3px; }
.sf-load span { display: block; height: 100%; background: var(--sf-success); border-radius: 3px; }
.sf-status-list em { font-size: 11px; font-weight: 700; min-width: 30px; text-align: right; font-style: normal; }
.sf-fresh-list strong { flex: 1; font-size: 12.5px; font-weight: 600; font-family: var(--sf-font-mono); }
.sf-refresh-note { margin-top: 10px; padding: 8px 10px; background: var(--sf-primary-soft); border-radius: 6px; display: flex; align-items: center; gap: 8px; }
.sf-refresh-note span { font-size: 11px; color: var(--sf-primary-ink); font-weight: 600; }
`;
