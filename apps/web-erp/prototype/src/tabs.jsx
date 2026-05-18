// Browser-style tab strip — one entry per open page (a route can repeat).
const TabStrip = ({ tabs, activeId, onActivate, onClose, onDuplicate, onNew, t }) => {
  const stripRef = React.useRef(null);

  React.useEffect(() => {
    const el = stripRef.current?.querySelector(`[data-tab="${activeId}"]`);
    if (el) el.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }, [activeId, tabs.length]);

  return (
    <div className="tabstrip" ref={stripRef}>
      {tabs.map((tab) => {
        const meta = window.pageMeta(tab.route, t);
        const active = tab.id === activeId;
        return (
          <div key={tab.id} data-tab={tab.id}
            className={`tab-chip ${active ? 'active' : ''}`}
            title={meta.crumbs.map(c => c.label).join(' / ')}
            onClick={() => onActivate(tab.id)}
            onAuxClick={(e) => { if (e.button === 1) { e.preventDefault(); onClose(tab.id); } }}>
            <Icon name={meta.icon || 'file'} size={13} className="tab-ico"/>
            <span className="tab-label">{meta.title}</span>
            {meta.code && <span className="tab-code">{meta.code}</span>}
            <span className="tab-x" title={t('Tutup tab')}
              onClick={(e) => { e.stopPropagation(); onClose(tab.id); }}
              onAuxClick={(e) => e.stopPropagation()}>
              <Icon name="x" size={10}/>
            </span>
          </div>
        );
      })}
      <button className="tab-new" title={`${t('Tab baru')} (Dashboard)`} onClick={onNew}>
        <Icon name="plus" size={13}/>
      </button>
      <div style={{ flex: 1 }}/>
      {tabs.length > 0 && (
        <button className="tab-new" title={t('Duplikat tab')} onClick={() => onDuplicate(activeId)}>
          <Icon name="boxes" size={12}/>
        </button>
      )}
      <span className="tab-count">{tabs.length} tab</span>
    </div>
  );
};

window.TabStrip = TabStrip;
