/* page-styles.jsx — Page-specific CSS bundles */

const PAGE_CSS = `
  /* Grid layouts */
  .sf-grid { display: grid; gap: 20px; margin-bottom: 20px; }
  .sf-grid--my { grid-template-columns: 2fr 1fr; grid-template-rows: auto auto; }
  .sf-grid--my > :nth-child(1) { grid-row: span 2; }
  .sf-grid--history { grid-template-columns: 1fr 1.4fr; }
  .sf-grid--dash { grid-template-columns: 1.6fr 1fr; }
  .sf-grid--dash > :nth-child(3) { grid-column: 1; }
  .sf-grid--dash > :nth-child(4) { grid-column: 2; }
  .sf-grid--worksites { grid-template-columns: 320px 1fr; }

  .sf-stats { display: grid; gap: 16px; margin-bottom: 20px; }
  .sf-stats--row { grid-template-columns: repeat(4, 1fr); }
  .sf-stats--col { grid-template-columns: 1fr; gap: 12px; }

  /* Toolbar */
  .sf-toolbar { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-bottom: 1px solid var(--sf-border); flex-wrap: wrap; }
  .sf-iconbtn-group { display: inline-flex; border: 1px solid var(--sf-border); border-radius: 7px; overflow: hidden; }
  .sf-iconbtn-group .sf-iconbtn { border: 0; border-radius: 0; }
  .sf-iconbtn-group .sf-iconbtn--active { background: var(--sf-primary-light); color: var(--sf-primary); }

  /* Clock card */
  .sf-clockcard { display: flex; flex-direction: column; }
  .sf-clockcard__inner { display: grid; grid-template-columns: 1fr auto; gap: 32px; padding: 28px;
    background: linear-gradient(135deg, var(--sf-primary) 0%, color-mix(in oklch, var(--sf-primary), #7239EA 30%) 100%);
    color: #fff; }
  .sf-clockcard__label { font-size: 12px; opacity: .8; letter-spacing: .04em; text-transform: uppercase; font-weight: 500; }
  .sf-clockcard__hh { font: 700 56px/1 var(--sf-font); letter-spacing: -.04em; margin: 6px 0 12px; font-variant-numeric: tabular-nums; }
  .sf-clockcard__sub .sf-badge { background: rgba(255,255,255,.18); color: #fff; backdrop-filter: blur(4px); }
  .sf-clockcard__actions { display: flex; flex-direction: column; align-items: flex-end; gap: 14px; }
  .sf-bigbtn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
    width: 130px; height: 130px; border-radius: 24px; border: 0; cursor: pointer;
    background: rgba(255,255,255,.95); color: var(--sf-primary); font: 700 16px/1 var(--sf-font); letter-spacing: -.01em;
    box-shadow: 0 12px 32px rgba(0,0,0,.18); transition: transform .14s ease; }
  .sf-bigbtn:hover { transform: translateY(-2px); }
  .sf-bigbtn--out { background: #fff; color: var(--sf-danger); animation: sf-pulse-ring 2s infinite; }
  .sf-clockcard__meta { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: rgba(255,255,255,.85); text-align: right; }
  .sf-clockcard__meta div { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }

  .sf-timeline { padding: 20px 28px; display: flex; flex-direction: column; gap: 0; }
  .sf-tl { display: grid; grid-template-columns: 60px 24px 1fr; gap: 12px; padding: 10px 0; position: relative; }
  .sf-tl:not(:last-child)::after { content: ''; position: absolute; left: 71px; top: 28px; bottom: -10px; width: 1.5px; background: var(--sf-border); }
  .sf-tl__time { font-size: 12px; color: var(--sf-text-soft); font-weight: 600; padding-top: 4px; text-align: right; }
  .sf-tl__dot { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    background: var(--sf-bg-elev); border: 2px solid currentColor; }
  .sf-tl__dot--success { color: var(--sf-success); background: var(--sf-success-light); }
  .sf-tl__dot--info { color: var(--sf-info); background: var(--sf-info-light); }
  .sf-tl__dot--neutral { color: var(--sf-text-faint); background: var(--sf-bg-hover); }
  .sf-tl__title { font-size: 13.5px; font-weight: 500; color: var(--sf-text); }
  .sf-tl__sub { font-size: 12px; color: var(--sf-text-soft); margin-top: 1px; }
  .sf-tl--pending { opacity: .55; }
  .sf-tl--pending .sf-tl__dot { border-style: dashed; }

  /* Week */
  .sf-weekrow { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; }
  .sf-weekday { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 4px; border-radius: 10px; background: var(--sf-bg-subtle); border: 1px solid var(--sf-border); transition: all .14s ease; }
  .sf-weekday:hover { background: var(--sf-bg-hover); transform: translateY(-1px); }
  .sf-weekday__name { font-size: 11px; color: var(--sf-text-soft); font-weight: 600; text-transform: uppercase; letter-spacing: .05em; }
  .sf-weekday__bar { width: 16px; height: 64px; background: var(--sf-bg-hover); border-radius: 4px; overflow: hidden; display: flex; align-items: flex-end; }
  .sf-weekday__bar > span { display: block; width: 100%; background: var(--sf-primary); border-radius: 4px; transition: height .3s ease; }
  .sf-weekday--late .sf-weekday__bar > span { background: var(--sf-warning); }
  .sf-weekday--off .sf-weekday__bar > span { background: var(--sf-border-strong); }
  .sf-weekday__h { font-size: 11.5px; font-weight: 600; color: var(--sf-text); font-variant-numeric: tabular-nums; }

  /* Lists */
  .sf-list { display: flex; flex-direction: column; }
  .sf-listitem { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px dashed var(--sf-border); }
  .sf-listitem:last-child { border-bottom: 0; }
  .sf-listitem__icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .sf-listitem__title { font-size: 13.5px; font-weight: 500; color: var(--sf-text); }
  .sf-listitem__sub { font-size: 12px; color: var(--sf-text-soft); margin-top: 1px; }

  .sf-list--feed { gap: 4px; }
  .sf-feeditem { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 9px; transition: background .14s ease; animation: sf-fade-in .3s ease both; }
  .sf-feeditem:hover { background: var(--sf-bg-hover); }

  /* Face cards */
  .sf-facegrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; padding: 20px; }
  .sf-facecard { background: var(--sf-bg-elev); border: 1px solid var(--sf-border); border-radius: var(--sf-radius); padding: 18px;
    display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; transition: all .18s ease; }
  .sf-facecard:hover { border-color: var(--sf-border-strong); transform: translateY(-2px); box-shadow: var(--sf-shadow-md); }
  .sf-facecard__avatar { position: relative; }
  .sf-facecard__shield { position: absolute; bottom: -2px; right: -2px; width: 22px; height: 22px; border-radius: 50%; background: var(--sf-success); color: #fff; display: flex; align-items: center; justify-content: center; border: 2px solid var(--sf-bg-elev); }
  .sf-facecard__shield--warn { background: var(--sf-warning); }
  .sf-facecard__shield--danger { background: var(--sf-danger); }
  .sf-facecard__name { font-size: 14px; font-weight: 600; margin-top: 8px; color: var(--sf-text); }
  .sf-facecard__dept { font-size: 12px; color: var(--sf-text-soft); }
  .sf-facecard__row { display: flex; align-items: center; gap: 8px; margin: 4px 0; }
  .sf-facecard__samples { display: flex; gap: 3px; }
  .sf-sample { width: 18px; height: 4px; border-radius: 2px; background: var(--sf-bg-hover); }
  .sf-sample--filled { background: var(--sf-primary); }
  .sf-facecard__foot { display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: 8px; padding-top: 12px; border-top: 1px solid var(--sf-border); }

  /* Reviews */
  .sf-reviews { padding: 8px; }
  .sf-review { display: flex; gap: 16px; padding: 18px; border-radius: var(--sf-radius); transition: background .14s ease; align-items: flex-start; }
  .sf-review:hover { background: var(--sf-bg-subtle); }
  .sf-review:not(:last-child) { border-bottom: 1px solid var(--sf-border); }
  .sf-review__icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .sf-review__main { flex: 1; min-width: 0; }
  .sf-review__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .sf-review__staff { font-weight: 600; color: var(--sf-text); }
  .sf-review__type { color: var(--sf-text-muted); font-size: 14px; }
  .sf-review__type strong { color: var(--sf-primary); font-weight: 600; text-transform: capitalize; }
  .sf-review__meta { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .sf-review__when { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--sf-text-soft); margin: 6px 0 10px; }
  .sf-review__reason { font-size: 13.5px; color: var(--sf-text-muted); padding: 12px 14px; background: var(--sf-bg-subtle); border-radius: 8px; border-left: 3px solid var(--sf-primary); line-height: 1.55; }
  .sf-review__actions { display: flex; gap: 8px; margin-top: 12px; align-items: center; flex-wrap: wrap; }

  /* Worksites */
  .sf-sitelist { display: flex; flex-direction: column; max-height: 540px; overflow-y: auto; }
  .sf-siteitem { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: transparent; border: 0; cursor: pointer; text-align: left; transition: background .14s ease; border-bottom: 1px solid var(--sf-border); }
  .sf-siteitem:hover { background: var(--sf-bg-hover); }
  .sf-siteitem--active { background: var(--sf-primary-light); border-left: 3px solid var(--sf-primary); padding-left: 13px; }
  .sf-siteitem__icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

  .sf-mapcard { display: flex; flex-direction: column; }
  .sf-map { position: relative; height: 360px; background: var(--sf-bg-subtle); }
  .sf-map svg { display: block; width: 100%; height: 100%; }
  .sf-map__overlay { position: absolute; inset: 16px; pointer-events: none; display: flex; justify-content: space-between; align-items: flex-start; }
  .sf-map__legend { background: var(--sf-bg-elev); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--sf-border); font-size: 12px; color: var(--sf-text-muted); box-shadow: var(--sf-shadow-sm); pointer-events: auto; }
  .sf-map__zoom { display: flex; flex-direction: column; gap: 2px; pointer-events: auto; }
  .sf-map__zoom button { width: 32px; height: 32px; border: 1px solid var(--sf-border); background: var(--sf-bg-elev); cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .sf-map__zoom button:first-child { border-radius: 8px 8px 0 0; }
  .sf-map__zoom button:last-child { border-radius: 0 0 8px 8px; border-top: 0; }

  .sf-sitedetail { padding: 20px 24px; border-top: 1px solid var(--sf-border); }
  .sf-sitedetail__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 18px; flex-wrap: wrap; }
  .sf-sitedetail__name { font-size: 18px; font-weight: 700; color: var(--sf-text); letter-spacing: -.01em; }
  .sf-sitedetail__addr { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--sf-text-soft); margin-top: 4px; }
  .sf-sitedetail__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .sf-detail { padding: 12px 14px; background: var(--sf-bg-subtle); border-radius: 9px; border: 1px solid var(--sf-border); }
  .sf-detail__label { font-size: 11px; color: var(--sf-text-soft); text-transform: uppercase; letter-spacing: .06em; font-weight: 600; }
  .sf-detail__value { font-size: 15px; font-weight: 600; color: var(--sf-text); margin-top: 4px; }

  /* Responsive */
  @media (max-width: 1280px) {
    .sf-grid--my { grid-template-columns: 1fr; }
    .sf-grid--my > :nth-child(1) { grid-row: auto; }
    .sf-grid--worksites { grid-template-columns: 1fr; }
    .sf-stats--row { grid-template-columns: repeat(2, 1fr); }
    .sf-grid--dash { grid-template-columns: 1fr; }
    .sf-grid--dash > * { grid-column: 1 !important; }
  }
  @media (max-width: 768px) {
    .sf-stats--row { grid-template-columns: 1fr 1fr; }
    .sf-grid--history { grid-template-columns: 1fr; }
    .sf-clockcard__inner { grid-template-columns: 1fr; padding: 20px; }
    .sf-clockcard__hh { font-size: 42px; }
    .sf-clockcard__actions { align-items: stretch; }
    .sf-bigbtn { width: 100%; height: 80px; flex-direction: row; justify-content: center; gap: 12px; }
    .sf-clockcard__meta { text-align: left; }
    .sf-clockcard__meta div { justify-content: flex-start; }
    .sf-sitedetail__grid { grid-template-columns: 1fr 1fr; }
    .sf-toolbar { padding: 12px; }
    .sf-toolbar > * { flex: 1; min-width: 0; }
    .sf-review { padding: 14px; gap: 12px; }
    .sf-review__head { flex-direction: column; gap: 6px; }
  }
  @media (max-width: 480px) {
    .sf-stats--row { grid-template-columns: 1fr; }
    .sf-sitedetail__grid { grid-template-columns: 1fr; }
    .sf-weekrow { gap: 4px; }
    .sf-weekday { padding: 8px 2px; }
    .sf-weekday__bar { height: 40px; }
  }
`;
(function() {
  if (document.getElementById('sf-page-css')) return;
  const s = document.createElement('style'); s.id = 'sf-page-css'; s.textContent = PAGE_CSS;
  document.head.appendChild(s);
})();
