/* components.jsx — Shared UI primitives for SF Admin */

const cls = (...xs) => xs.filter(Boolean).join(' ');

// ─────────────── Button ───────────────
const Button = ({ variant = 'primary', size = 'md', icon, iconRight, children, fullWidth, loading, ...rest }) => {
  return (
    <button className={cls('sf-btn', `sf-btn--${variant}`, `sf-btn--${size}`, fullWidth && 'sf-btn--full', loading && 'sf-btn--loading')} {...rest}>
      {loading && <span className="sf-spinner" />}
      {!loading && icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children && <span>{children}</span>}
      {!loading && iconRight && <Icon name={iconRight} size={size === 'sm' ? 14 : 16} />}
    </button>
  );
};

// ─────────────── IconButton ───────────────
const IconButton = ({ icon, size = 'md', tooltip, badge, ...rest }) => (
  <button className={cls('sf-iconbtn', `sf-iconbtn--${size}`)} title={tooltip} {...rest}>
    <Icon name={icon} size={size === 'sm' ? 14 : 18} />
    {badge && <span className="sf-iconbtn__badge">{badge}</span>}
  </button>
);

// ─────────────── Card ───────────────
const Card = ({ title, subtitle, action, padding = true, children, className, style, ...rest }) => (
  <div className={cls('sf-card', className)} style={style} {...rest}>
    {(title || action) && (
      <div className="sf-card__head">
        <div>
          {title && <div className="sf-card__title">{title}</div>}
          {subtitle && <div className="sf-card__sub">{subtitle}</div>}
        </div>
        {action}
      </div>
    )}
    <div className={cls('sf-card__body', !padding && 'sf-card__body--flush')}>{children}</div>
  </div>
);

// ─────────────── Badge ───────────────
const Badge = ({ tone = 'neutral', dot, soft = true, children, size = 'md' }) => (
  <span className={cls('sf-badge', `sf-badge--${tone}`, soft && 'sf-badge--soft', `sf-badge--${size}`)}>
    {dot && <span className="sf-badge__dot" />}
    {children}
  </span>
);

// ─────────────── Avatar ───────────────
const Avatar = ({ name = '?', src, size = 36, status, tone }) => {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const palette = ['#1B84FF', '#7239EA', '#17C653', '#F6B100', '#F8285A', '#0EA5E9', '#EC4899'];
  const color = tone || palette[(name.charCodeAt(0) || 0) % palette.length];
  return (
    <div className="sf-avatar" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {src
        ? <img src={src} alt={name} />
        : <div style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: '#fff' }}>{initials}</div>
      }
      {status && <span className={cls('sf-avatar__status', `sf-avatar__status--${status}`)} style={{ width: size * 0.28, height: size * 0.28 }} />}
    </div>
  );
};

// ─────────────── Input / Select ───────────────
const Input = ({ icon, iconRight, type = 'text', size = 'md', ...rest }) => (
  <div className={cls('sf-input', `sf-input--${size}`, icon && 'sf-input--has-icon')}>
    {icon && <Icon name={icon} size={16} />}
    <input type={type} {...rest} />
    {iconRight && <Icon name={iconRight} size={16} />}
  </div>
);

const Select = ({ value, onChange, options, size = 'md', placeholder }) => (
  <div className={cls('sf-select', `sf-input--${size}`)}>
    <select value={value} onChange={e => onChange?.(e.target.value)}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => typeof o === 'string'
        ? <option key={o} value={o}>{o}</option>
        : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
    <Icon name="chevronDown" size={14} />
  </div>
);

// ─────────────── Tabs ───────────────
const Tabs = ({ value, onChange, items, variant = 'underline' }) => (
  <div className={cls('sf-tabs', `sf-tabs--${variant}`)}>
    {items.map(it => (
      <button
        key={it.value}
        className={cls('sf-tab', value === it.value && 'sf-tab--active')}
        onClick={() => onChange?.(it.value)}
      >
        {it.icon && <Icon name={it.icon} size={15} />}
        {it.label}
        {it.count != null && <span className="sf-tab__count">{it.count}</span>}
      </button>
    ))}
  </div>
);

// ─────────────── Stat Card ───────────────
const StatCard = ({ label, value, delta, deltaLabel, icon, tone = 'primary', spark, footer }) => {
  const positive = delta != null && delta >= 0;
  return (
    <div className="sf-stat">
      <div className="sf-stat__head">
        <div className={cls('sf-stat__icon', `sf-stat__icon--${tone}`)}>
          <Icon name={icon} size={18} />
        </div>
        {delta != null && (
          <div className={cls('sf-stat__delta', positive ? 'sf-stat__delta--up' : 'sf-stat__delta--down')}>
            <Icon name={positive ? 'trending' : 'trending'} size={12} style={{ transform: positive ? 'none' : 'scaleY(-1)' }} />
            {positive ? '+' : ''}{delta}%
          </div>
        )}
      </div>
      <div className="sf-stat__value sf-tabular">{value}</div>
      <div className="sf-stat__label">{label}</div>
      {spark && <div className="sf-stat__spark">{spark}</div>}
      {footer && <div className="sf-stat__footer">{footer}</div>}
    </div>
  );
};

// ─────────────── Empty State ───────────────
const Empty = ({ icon = 'info', title, description, action }) => (
  <div className="sf-empty">
    <div className="sf-empty__icon"><Icon name={icon} size={28} /></div>
    <div className="sf-empty__title">{title}</div>
    {description && <div className="sf-empty__desc">{description}</div>}
    {action && <div style={{ marginTop: 16 }}>{action}</div>}
  </div>
);

// ─────────────── Progress ───────────────
const Progress = ({ value, max = 100, tone = 'primary', size = 'md', showLabel }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cls('sf-progress', `sf-progress--${size}`)}>
      <div className="sf-progress__bar" style={{ width: `${pct}%`, background: `var(--sf-${tone})` }} />
      {showLabel && <span className="sf-progress__label sf-tabular">{Math.round(pct)}%</span>}
    </div>
  );
};

// ─────────────── Table ───────────────
const Table = ({ columns, rows, onRowClick, selectable, selected, onSelect, striped, compact, emptyMessage }) => {
  const allSelected = selectable && rows.length > 0 && selected?.length === rows.length;
  return (
    <div className="sf-table-wrap">
      <table className={cls('sf-table', striped && 'sf-table--striped', compact && 'sf-table--compact')}>
        <thead>
          <tr>
            {selectable && (
              <th style={{ width: 36 }}>
                <Checkbox checked={allSelected} onChange={e => onSelect?.(e.target.checked ? rows.map((_, i) => i) : [])} />
              </th>
            )}
            {columns.map(c => (
              <th key={c.key} style={{ width: c.width, textAlign: c.align || 'left' }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length + (selectable ? 1 : 0)} style={{ padding: 0 }}>
              <Empty icon="search" title={emptyMessage || 'No data'} description="Try adjusting your filters" />
            </td></tr>
          )}
          {rows.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row, i)}
              className={cls(onRowClick && 'sf-table__row--clickable', selected?.includes(i) && 'sf-table__row--selected')}
            >
              {selectable && (
                <td onClick={e => e.stopPropagation()}>
                  <Checkbox
                    checked={selected?.includes(i)}
                    onChange={e => {
                      const next = e.target.checked
                        ? [...(selected || []), i]
                        : (selected || []).filter(x => x !== i);
                      onSelect?.(next);
                    }}
                  />
                </td>
              )}
              {columns.map(c => (
                <td key={c.key} style={{ textAlign: c.align || 'left' }}>
                  {c.render ? c.render(row[c.key], row, i) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Checkbox = ({ checked, onChange, ...rest }) => (
  <label className="sf-check">
    <input type="checkbox" checked={!!checked} onChange={onChange} {...rest} />
    <span className="sf-check__box"><Icon name="check" size={12} /></span>
  </label>
);

// ─────────────── Switch ───────────────
const Switch = ({ checked, onChange, label }) => (
  <label className="sf-switch">
    <input type="checkbox" checked={!!checked} onChange={e => onChange?.(e.target.checked)} />
    <span className="sf-switch__track"><span className="sf-switch__thumb" /></span>
    {label && <span className="sf-switch__label">{label}</span>}
  </label>
);

// ─────────────── Component CSS ───────────────
const SF_COMPONENT_CSS = `
  /* Buttons */
  .sf-btn {
    display: inline-flex; align-items: center; gap: 8px; justify-content: center;
    border: 1px solid transparent; border-radius: var(--sf-radius-sm);
    font: 500 14px/1 var(--sf-font); letter-spacing: -.01em;
    cursor: pointer; transition: all .14s ease; white-space: nowrap;
    padding: 0 14px; height: calc(36px * var(--sf-density));
  }
  .sf-btn--sm { height: calc(30px * var(--sf-density)); font-size: 13px; padding: 0 10px; border-radius: 7px; }
  .sf-btn--lg { height: calc(44px * var(--sf-density)); font-size: 15px; padding: 0 18px; }
  .sf-btn--full { width: 100%; }
  .sf-btn--primary { background: var(--sf-primary); color: var(--sf-primary-fg); box-shadow: 0 1px 0 rgba(255,255,255,.2) inset, 0 1px 2px rgba(0,0,0,.08); }
  .sf-btn--primary:hover { background: var(--sf-primary-hover); }
  .sf-btn--secondary { background: var(--sf-bg-elev); color: var(--sf-text); border-color: var(--sf-border); }
  .sf-btn--secondary:hover { background: var(--sf-bg-hover); border-color: var(--sf-border-strong); }
  .sf-btn--ghost { background: transparent; color: var(--sf-text-muted); }
  .sf-btn--ghost:hover { background: var(--sf-bg-hover); color: var(--sf-text); }
  .sf-btn--soft { background: var(--sf-primary-light); color: var(--sf-primary); }
  .sf-btn--soft:hover { background: var(--sf-primary); color: var(--sf-primary-fg); }
  .sf-btn--danger { background: var(--sf-danger); color: #fff; }
  .sf-btn--danger:hover { filter: brightness(.92); }
  .sf-btn--success { background: var(--sf-success); color: #fff; }
  .sf-btn:disabled { opacity: .5; cursor: not-allowed; }

  .sf-spinner { width: 14px; height: 14px; border-radius: 50%; border: 2px solid currentColor; border-right-color: transparent; animation: sf-spin .7s linear infinite; }

  /* IconButton */
  .sf-iconbtn {
    display: inline-flex; align-items: center; justify-content: center; position: relative;
    width: calc(36px * var(--sf-density)); height: calc(36px * var(--sf-density));
    border-radius: var(--sf-radius-sm); border: 1px solid var(--sf-border);
    background: var(--sf-bg-elev); color: var(--sf-text-muted); cursor: pointer; transition: all .14s ease;
  }
  .sf-iconbtn:hover { background: var(--sf-bg-hover); color: var(--sf-text); border-color: var(--sf-border-strong); }
  .sf-iconbtn--sm { width: 30px; height: 30px; border-radius: 7px; }
  .sf-iconbtn__badge { position: absolute; top: 4px; right: 4px; min-width: 16px; height: 16px; padding: 0 4px;
    border-radius: 999px; background: var(--sf-danger); color: #fff; font-size: 10px; font-weight: 600;
    display: flex; align-items: center; justify-content: center; border: 2px solid var(--sf-bg-elev); }

  /* Card */
  .sf-card { background: var(--sf-bg-elev); border: 1px solid var(--sf-border); border-radius: var(--sf-radius);
    box-shadow: var(--sf-shadow-sm); overflow: hidden; transition: box-shadow .18s ease, border-color .18s ease; }
  .sf-card:hover { box-shadow: var(--sf-shadow); }
  .sf-card__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
    padding: calc(20px * var(--sf-density)) calc(20px * var(--sf-density)) 0; }
  .sf-card__title { font-size: 15px; font-weight: 600; color: var(--sf-text); letter-spacing: -.01em; }
  .sf-card__sub { font-size: 13px; color: var(--sf-text-soft); margin-top: 2px; }
  .sf-card__body { padding: calc(20px * var(--sf-density)); }
  .sf-card__body--flush { padding: 0; }

  /* Badge */
  .sf-badge { display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 999px;
    font-size: 12px; font-weight: 500; line-height: 1.4; letter-spacing: 0; }
  .sf-badge--sm { font-size: 11px; padding: 2px 6px; }
  .sf-badge__dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .sf-badge--soft.sf-badge--neutral  { background: var(--sf-bg-hover); color: var(--sf-text-muted); }
  .sf-badge--soft.sf-badge--primary  { background: var(--sf-primary-light); color: var(--sf-primary); }
  .sf-badge--soft.sf-badge--success  { background: var(--sf-success-light); color: var(--sf-success); }
  .sf-badge--soft.sf-badge--warning  { background: var(--sf-warning-light); color: #B5810B; }
  .sf-badge--soft.sf-badge--danger   { background: var(--sf-danger-light); color: var(--sf-danger); }
  .sf-badge--soft.sf-badge--info     { background: var(--sf-info-light); color: var(--sf-info); }
  [data-theme="dark"] .sf-badge--soft.sf-badge--warning { color: #FCD34D; }

  /* Avatar */
  .sf-avatar { position: relative; display: inline-block; flex-shrink: 0; border-radius: 50%; overflow: visible; }
  .sf-avatar img, .sf-avatar > div { width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; letter-spacing: -.02em; object-fit: cover; }
  .sf-avatar__status { position: absolute; bottom: 0; right: 0; border-radius: 50%; border: 2px solid var(--sf-bg-elev); }
  .sf-avatar__status--online { background: var(--sf-success); }
  .sf-avatar__status--away { background: var(--sf-warning); }
  .sf-avatar__status--offline { background: var(--sf-text-faint); }
  .sf-avatar__status--busy { background: var(--sf-danger); }

  /* Input */
  .sf-input { display: inline-flex; align-items: center; gap: 8px; background: var(--sf-bg-elev);
    border: 1px solid var(--sf-border); border-radius: var(--sf-radius-sm); padding: 0 12px;
    height: calc(36px * var(--sf-density)); transition: all .14s ease; color: var(--sf-text-soft); width: 100%; }
  .sf-input--sm { height: calc(30px * var(--sf-density)); padding: 0 10px; font-size: 13px; }
  .sf-input--lg { height: calc(44px * var(--sf-density)); padding: 0 14px; }
  .sf-input:focus-within { border-color: var(--sf-primary); box-shadow: var(--sf-ring); color: var(--sf-text); }
  .sf-input input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--sf-text); font: inherit; height: 100%; padding: 0; }
  .sf-input input::placeholder { color: var(--sf-text-faint); }

  .sf-select { position: relative; display: inline-block; }
  .sf-select select { appearance: none; -webkit-appearance: none; padding: 0 32px 0 12px;
    height: calc(36px * var(--sf-density)); border: 1px solid var(--sf-border); border-radius: var(--sf-radius-sm);
    background: var(--sf-bg-elev); color: var(--sf-text); font: inherit; cursor: pointer; min-width: 120px; }
  .sf-select svg { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--sf-text-soft); }
  .sf-select select:focus { outline: none; border-color: var(--sf-primary); box-shadow: var(--sf-ring); }

  /* Tabs */
  .sf-tabs { display: inline-flex; gap: 2px; align-items: center; }
  .sf-tabs--underline { border-bottom: 1px solid var(--sf-border); gap: 4px; }
  .sf-tabs--pill { background: var(--sf-bg-subtle); padding: 4px; border-radius: var(--sf-radius-sm); border: 1px solid var(--sf-border); }
  .sf-tab { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: transparent; border: 0;
    color: var(--sf-text-muted); font: 500 13.5px/1 var(--sf-font); cursor: pointer; border-radius: 7px; transition: all .14s ease; position: relative; }
  .sf-tabs--underline .sf-tab { padding: 12px 4px; margin-bottom: -1px; border-radius: 0; }
  .sf-tab:hover { color: var(--sf-text); }
  .sf-tabs--pill .sf-tab--active { background: var(--sf-bg-elev); color: var(--sf-text); box-shadow: var(--sf-shadow-sm); }
  .sf-tabs--underline .sf-tab--active { color: var(--sf-primary); border-bottom: 2px solid var(--sf-primary); }
  .sf-tab__count { font-size: 11px; padding: 1px 6px; border-radius: 999px; background: var(--sf-bg-hover); color: var(--sf-text-soft); font-weight: 600; }
  .sf-tab--active .sf-tab__count { background: var(--sf-primary-light); color: var(--sf-primary); }

  /* Stat */
  .sf-stat { background: var(--sf-bg-elev); border: 1px solid var(--sf-border); border-radius: var(--sf-radius);
    padding: calc(20px * var(--sf-density)); display: flex; flex-direction: column; gap: 4px;
    box-shadow: var(--sf-shadow-sm); transition: all .18s ease; position: relative; overflow: hidden; }
  .sf-stat:hover { box-shadow: var(--sf-shadow-md); transform: translateY(-1px); }
  .sf-stat__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .sf-stat__icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .sf-stat__icon--primary { background: var(--sf-primary-light); color: var(--sf-primary); }
  .sf-stat__icon--success { background: var(--sf-success-light); color: var(--sf-success); }
  .sf-stat__icon--warning { background: var(--sf-warning-light); color: #B5810B; }
  .sf-stat__icon--danger { background: var(--sf-danger-light); color: var(--sf-danger); }
  .sf-stat__icon--info { background: var(--sf-info-light); color: var(--sf-info); }
  [data-theme="dark"] .sf-stat__icon--warning { color: #FCD34D; }
  .sf-stat__delta { display: inline-flex; align-items: center; gap: 3px; padding: 3px 7px; border-radius: 999px; font-size: 11px; font-weight: 600; }
  .sf-stat__delta--up { background: var(--sf-success-light); color: var(--sf-success); }
  .sf-stat__delta--down { background: var(--sf-danger-light); color: var(--sf-danger); }
  .sf-stat__value { font-size: 28px; font-weight: 700; letter-spacing: -.02em; color: var(--sf-text); line-height: 1.1; }
  .sf-stat__label { font-size: 13px; color: var(--sf-text-soft); margin-top: 2px; }
  .sf-stat__spark { margin-top: 12px; }
  .sf-stat__footer { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--sf-border); font-size: 12px; color: var(--sf-text-soft); }

  /* Empty */
  .sf-empty { padding: 48px 24px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; color: var(--sf-text-soft); }
  .sf-empty__icon { width: 56px; height: 56px; border-radius: 16px; background: var(--sf-bg-subtle); display: flex; align-items: center; justify-content: center; color: var(--sf-text-muted); margin-bottom: 8px; }
  .sf-empty__title { font-size: 15px; font-weight: 600; color: var(--sf-text); }
  .sf-empty__desc { font-size: 13.5px; color: var(--sf-text-soft); max-width: 320px; }

  /* Progress */
  .sf-progress { position: relative; height: 8px; background: var(--sf-bg-hover); border-radius: 999px; overflow: hidden; display: flex; align-items: center; }
  .sf-progress--sm { height: 4px; }
  .sf-progress--lg { height: 12px; }
  .sf-progress__bar { height: 100%; border-radius: inherit; transition: width .3s ease; }
  .sf-progress__label { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: 10px; color: #fff; font-weight: 600; }

  /* Table */
  .sf-table-wrap { overflow-x: auto; }
  .sf-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13.5px; }
  .sf-table thead th {
    text-align: left; padding: 12px 16px; font-weight: 600; font-size: 11px;
    text-transform: uppercase; letter-spacing: .06em; color: var(--sf-text-soft);
    background: var(--sf-bg-subtle); border-bottom: 1px solid var(--sf-border);
    position: sticky; top: 0; z-index: 1;
  }
  .sf-table thead th:first-child { padding-left: 20px; }
  .sf-table thead th:last-child { padding-right: 20px; }
  .sf-table tbody td { padding: 14px 16px; border-bottom: 1px solid var(--sf-border); color: var(--sf-text); vertical-align: middle; }
  .sf-table tbody td:first-child { padding-left: 20px; }
  .sf-table tbody td:last-child { padding-right: 20px; }
  .sf-table--compact tbody td { padding: 10px 16px; }
  .sf-table--striped tbody tr:nth-child(even) td { background: var(--sf-bg-subtle); }
  .sf-table tbody tr:last-child td { border-bottom: 0; }
  .sf-table__row--clickable { cursor: pointer; }
  .sf-table__row--clickable:hover td { background: var(--sf-bg-hover); }
  .sf-table__row--selected td { background: var(--sf-primary-light) !important; }

  /* Checkbox */
  .sf-check { display: inline-flex; align-items: center; cursor: pointer; }
  .sf-check input { position: absolute; opacity: 0; pointer-events: none; }
  .sf-check__box { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--sf-border-strong);
    background: var(--sf-bg-elev); display: flex; align-items: center; justify-content: center; color: transparent;
    transition: all .14s ease; }
  .sf-check input:checked + .sf-check__box { background: var(--sf-primary); border-color: var(--sf-primary); color: #fff; }
  .sf-check input:focus-visible + .sf-check__box { box-shadow: var(--sf-ring); }

  /* Switch */
  .sf-switch { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
  .sf-switch input { position: absolute; opacity: 0; pointer-events: none; }
  .sf-switch__track { width: 36px; height: 20px; border-radius: 999px; background: var(--sf-border-strong); position: relative; transition: background .14s ease; }
  .sf-switch__thumb { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.2); transition: transform .18s ease; }
  .sf-switch input:checked + .sf-switch__track { background: var(--sf-primary); }
  .sf-switch input:checked + .sf-switch__track .sf-switch__thumb { transform: translateX(16px); }
  .sf-switch__label { font-size: 13.5px; color: var(--sf-text); }

  /* Pagination */
  .sf-pagi { display: flex; align-items: center; gap: 8px; padding: 14px 20px; border-top: 1px solid var(--sf-border); }
  .sf-pagi__info { font-size: 13px; color: var(--sf-text-soft); flex: 1; }
  .sf-pagi__nav { display: flex; gap: 4px; align-items: center; }
  .sf-pagi__nav button { min-width: 32px; height: 32px; padding: 0 10px; border-radius: 7px; border: 1px solid var(--sf-border); background: var(--sf-bg-elev); color: var(--sf-text-muted); cursor: pointer; font-size: 13px; font-weight: 500; }
  .sf-pagi__nav button:hover { background: var(--sf-bg-hover); color: var(--sf-text); }
  .sf-pagi__nav button.active { background: var(--sf-primary); color: #fff; border-color: var(--sf-primary); }
`;
(function() {
  if (document.getElementById('sf-comp-css')) return;
  const s = document.createElement('style');
  s.id = 'sf-comp-css'; s.textContent = SF_COMPONENT_CSS;
  document.head.appendChild(s);
})();

Object.assign(window, { Button, IconButton, Card, Badge, Avatar, Input, Select, Tabs, StatCard, Empty, Progress, Table, Checkbox, Switch, cls });
