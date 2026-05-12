// Cmd+K palette
const PaletteItems = (t) => [
  { group: 'Navigasi', items: [
    { id: 'home', icon: 'home', label: t('Dashboard'), hint: 'G H' },
    { id: 'kas-masuk', icon: 'wallet', label: t('Kas Masuk'), hint: 'G K' },
    { id: 'kas-keluar', icon: 'wallet', label: t('Kas Keluar'), hint: 'G C' },
    { id: 'bank-masuk', icon: 'bank', label: t('Bank Masuk'), hint: 'G B' },
    { id: 'bank-keluar', icon: 'bank', label: t('Bank Keluar') },
    { id: 'jurnal-umum', icon: 'book', label: t('Jurnal Umum'), hint: 'G J' },
    { id: 'buku-besar', icon: 'book', label: t('Buku Besar'), hint: 'G L' },
    { id: 'giro-masuk', icon: 'receipt', label: t('Giro Masuk') },
    { id: 'giro-keluar', icon: 'receipt', label: t('Giro Keluar') },
  ]},
  { group: 'Aksi', items: [
    { id: 'new:kas-masuk', icon: 'plus', label: t('Buat Kas Masuk'), hint: 'N C' },
    { id: 'new:kas-keluar', icon: 'plus', label: t('Buat Kas Keluar'), hint: 'N D' },
    { id: 'new:jurnal-umum', icon: 'plus', label: t('Posting Jurnal'), hint: 'N J' },
    { id: 'toggle:theme', icon: 'moon', label: 'Toggle dark mode', hint: 'T' },
    { id: 'toggle:lang', icon: 'info', label: 'Switch language (ID/EN)' },
  ]},
];

const CommandPalette = ({ open, onClose, onAction, t }) => {
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => { if (open) { setQ(''); setActive(0); setTimeout(() => inputRef.current?.focus(), 10); } }, [open]);

  const groups = PaletteItems(t);
  const flat = React.useMemo(() => {
    const list = [];
    groups.forEach(g => g.items.forEach(it => {
      if (!q || it.label.toLowerCase().includes(q.toLowerCase())) {
        list.push({ ...it, _group: g.group });
      }
    }));
    return list;
  }, [q, t]);

  const groupedFiltered = React.useMemo(() => {
    const map = {};
    flat.forEach(it => { (map[it._group] = map[it._group] || []).push(it); });
    return Object.entries(map).map(([group, items]) => ({ group, items }));
  }, [flat]);

  if (!open) return null;

  const onKey = (e) => {
    if (e.key === 'Escape') { onClose(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(flat.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (flat[active]) { onAction(flat[active].id); onClose(); } }
  };

  let idx = -1;

  return (
    <div className="cp-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cp fade-in" onKeyDown={onKey}>
        <div className="cp-input-row">
          <Icon name="search" size={15}/>
          <input ref={inputRef} placeholder="Ketik perintah atau cari..." value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }}/>
          <Kbd>ESC</Kbd>
        </div>
        <div className="cp-list scrollbar">
          {groupedFiltered.length === 0 && <div style={{ padding: '24px 12px', color: 'var(--fg-muted)', fontSize: 12.5, textAlign: 'center' }}>Tidak ada hasil</div>}
          {groupedFiltered.map(g => (
            <div key={g.group}>
              <div className="cp-group">{g.group}</div>
              {g.items.map(it => {
                idx++;
                const isActive = idx === active;
                const myIdx = idx;
                return (
                  <div key={it.id} className={`cp-item ${isActive ? 'active' : ''}`}
                    onMouseEnter={() => setActive(myIdx)}
                    onClick={() => { onAction(it.id); onClose(); }}>
                    <span className="icon"><Icon name={it.icon} size={14}/></span>
                    <span className="label">{it.label}</span>
                    {it.hint && <span className="hint">{it.hint}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cp-foot">
          <span><Kbd>↑</Kbd><Kbd>↓</Kbd> navigasi</span>
          <span><Kbd>↵</Kbd> pilih</span>
          <span><Kbd>ESC</Kbd> tutup</span>
          <span style={{marginLeft: 'auto'}}>Sentient ERP</span>
        </div>
      </div>
    </div>
  );
};

window.CommandPalette = CommandPalette;
