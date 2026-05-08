
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Artboards are reorderable (grip-drag), labels/titles are inline-editable,
// and any artboard can be opened in a fullscreen focus overlay (←/→/Esc).
// State persists to a .design-canvas.state.json sidecar via the host
// bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = [
    '.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}',
    '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}',
    '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}',
    '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}',
    '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
    '.dc-card{transition:box-shadow .15s,transform .15s}',
    '.dc-card *{scrollbar-width:none}',
    '.dc-card *::-webkit-scrollbar{display:none}',
    '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px}',
    '.dc-grip{cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s}',
    '.dc-grip:hover{background:rgba(0,0,0,.08)}',
    '.dc-grip:active{cursor:grabbing}',
    '.dc-labeltext{cursor:pointer;border-radius:4px;padding:3px 6px;display:flex;align-items:center;transition:background .12s}',
    '.dc-labeltext:hover{background:rgba(0,0,0,.05)}',
    '.dc-expand{position:absolute;bottom:100%;right:0;margin-bottom:5px;z-index:2;opacity:0;transition:opacity .12s,background .12s;',
    '  width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;',
    '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center}',
    '.dc-expand:hover{background:rgba(0,0,0,.06);color:#2a251f}',
    '[data-dc-slot]:hover .dc-expand{opacity:1}',
  ].join('\n');
  document.head.appendChild(s);
}

const DCCtx = React.createContext(null);

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, focused
// artboard). Order/titles/labels persist to a .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';

function DesignCanvas({ children, minScale, maxScale, style }) {
  const [state, setState] = React.useState({ sections: {}, focus: null });
  const [search, setSearch] = React.useState({ q: '', cursor: 0, open: false });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);

  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE)
      .then((r) => (r.ok ? r.json() : null))
      .then((saved) => {
        if (off || !saved || !saved.sections) return;
        skipNextWrite.current = true;
        setState((s) => ({ ...s, sections: saved.sections }));
      })
      .catch(() => {})
      .finally(() => { didRead.current = true; if (!off) setReady(true); });
    const t = setTimeout(() => { if (!off) setReady(true); }, 150);
    return () => { off = true; clearTimeout(t); };
  }, []);

  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) { skipNextWrite.current = false; return; }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({ sections: state.sections })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // ── Per-artboard rendered-text index. ──────────────────────────────────
  // Each DCArtboardFrame scrapes its card's textContent on mount and pushes
  // it here via registerText(slotId, text). Powers "search inside artboards"
  // so the user can find a screen by any label/copy shown in the mockup, not
  // just the artboard's own label. Stored in state so changes invalidate the
  // matches useMemo. Whitespace is normalized so multi-span text like
  // "<span>Bayu</span>  <span>Saputra</span>" still matches "bayu saputra".
  const [textIndex, setTextIndex] = React.useState({});
  const registerText = React.useCallback((slotId, text) => {
    const norm = String(text || '').replace(/\s+/g, ' ').trim();
    setTextIndex((prev) => (prev[slotId] === norm ? prev : { ...prev, [slotId]: norm }));
  }, []);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Only direct DCSection > DCArtboard children are
  // walked — wrapping them in other elements opts out of focus/reorder.
  const registry = {};     // slotId -> { sectionId, artboard }
  const sectionMeta = {};  // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  React.Children.forEach(children, (sec) => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const srcIds = [];
    React.Children.forEach(sec.props.children, (ab) => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (!aid) return;
      registry[`${sid}/${aid}`] = { sectionId: sid, artboard: ab };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter((k) => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter((k) => !kept.includes(k))],
    };
  });

  // Stash latest registries in a ref so global listeners (URL hashchange,
  // keyboard) can read them without resubscribing each render.
  const regRef = React.useRef(null);
  regRef.current = { registry, sectionMeta, sectionOrder };

  // ── Search: substring match on artboard label, slot id, OR rendered text
  //          inside the artboard (textIndex above). ────────────────────────
  // Returns ordered slotIds (sectionId/artboardId) honoring the persisted
  // section + artboard order. Powers the floating search bar and the
  // arrow-key cycle inside focus mode.
  const matches = React.useMemo(() => {
    const q = (search.q || '').trim().toLowerCase();
    if (!q) return [];
    const out = [];
    sectionOrder.forEach((sid) => {
      const meta = sectionMeta[sid];
      if (!meta) return;
      meta.slotIds.forEach((aid) => {
        const k = `${sid}/${aid}`;
        const r = registry[k];
        if (!r) return;
        const persistedLabel = (state.sections[sid] && state.sections[sid].labels) ? state.sections[sid].labels[aid] : undefined;
        const label = String(persistedLabel != null ? persistedLabel : (r.artboard.props.label != null ? r.artboard.props.label : aid));
        const inner = (textIndex[k] || '').toLowerCase();
        if (
          label.toLowerCase().includes(q) ||
          aid.toLowerCase().includes(q) ||
          inner.includes(q)
        ) out.push(k);
      });
    });
    return out;
  // Stringify simple shapes so we don't trip on object identity churn.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.q, JSON.stringify(state.sections), sectionOrder.join('|'), Object.keys(registry).join('|'), textIndex]);

  // Auto-focus the cursor-th match every time matches/cursor change. If the
  // cursor outranges the new list (e.g. query refined to fewer matches), snap
  // it back to 0 in a separate effect to avoid out-of-range focus flashes.
  React.useEffect(() => {
    if (matches.length === 0) return;
    if (search.cursor >= matches.length) {
      setSearch((s) => ({ ...s, cursor: 0 }));
      return;
    }
    const target = matches[search.cursor];
    if (target && state.focus !== target) {
      setState((s) => ({ ...s, focus: target }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches, search.cursor]);

  const goMatch = React.useCallback((dir) => {
    setSearch((s) => {
      const n = matches.length;
      if (!n) return s;
      return { ...s, cursor: (s.cursor + dir + n) % n };
    });
  }, [matches.length]);

  // ── URL routing: hash mirrors current focus (sectionId/artboardId). ────
  // - Write: every focus change → history.replaceState so back-button doesn't
  //          clutter, but the URL is shareable as a deep-link.
  // - Read: on mount and on hashchange, jump to the matching artboard if the
  //         hash names a known slot.
  // We wait for `ready` before mounting these so the sidecar load (which can
  // re-set state.focus indirectly via labels/order) doesn't race the URL.
  React.useEffect(() => {
    if (!ready) return;
    const desired = state.focus
      ? '#' + state.focus.split('/').map(encodeURIComponent).join('/')
      : '';
    const cur = window.location.hash || '';
    if (cur === desired) return;
    const path = window.location.pathname + window.location.search;
    try { history.replaceState(null, '', path + desired); }
    catch { window.location.hash = desired.replace(/^#/, ''); }
  }, [state.focus, ready]);

  React.useEffect(() => {
    const sync = () => {
      const raw = (window.location.hash || '').replace(/^#/, '');
      if (!raw) {
        setState((s) => (s.focus === null ? s : { ...s, focus: null }));
        return;
      }
      const reg = regRef.current && regRef.current.registry;
      if (!reg) return;
      // Try the decoded form first; fall back to raw for legacy/manual links.
      let key = null;
      try { const dec = raw.split('/').map(decodeURIComponent).join('/'); if (reg[dec]) key = dec; } catch {}
      if (!key && reg[raw]) key = raw;
      if (key) setState((s) => (s.focus === key ? s : { ...s, focus: key }));
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  // Global shortcuts: Ctrl/Cmd+K toggles search; "/" opens search when not
  // typing; Esc layered (focus → search → nothing).
  React.useEffect(() => {
    const onKey = (e) => {
      const ae = document.activeElement;
      const inField = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable);
      // Ctrl/Cmd+K toggles. Ctrl/Cmd+F always opens (overriding the browser's
      // native Find dialog — we want our own search to handle artboard labels).
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setSearch((s) => ({ ...s, open: !s.open }));
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        setSearch((s) => ({ ...s, open: true }));
        return;
      }
      if (e.key === '/' && !inField) {
        e.preventDefault();
        setSearch((s) => ({ ...s, open: true }));
        return;
      }
      if (e.key === 'Escape') {
        setState((s) => {
          if (s.focus) return { ...s, focus: null };
          return s;
        });
        if (!stateFocusRef.current) {
          setSearch((s) => (s.open ? { ...s, open: false, q: '', cursor: 0 } : s));
        }
      }
    };
    const onPd = (e) => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, []);

  // Mirror state.focus into a ref so the global Esc handler (subscribed once
  // above) can layer "exit focus first, then close search" correctly without
  // re-binding on every focus change.
  const stateFocusRef = React.useRef(state.focus);
  React.useEffect(() => { stateFocusRef.current = state.focus; }, [state.focus]);

  const api = React.useMemo(() => ({
    state,
    section: (id) => state.sections[id] || {},
    patchSection: (id, p) => setState((s) => ({
      ...s,
      sections: { ...s.sections, [id]: { ...s.sections[id], ...(typeof p === 'function' ? p(s.sections[id] || {}) : p) } },
    })),
    setFocus: (slotId) => setState((s) => ({ ...s, focus: slotId })),
    // Search API consumed by DCSearchBar + DCFocusOverlay
    search, setSearch, matches, goMatch,
    // Text-index registration consumed by DCArtboardFrame on mount
    registerText,
  }), [state, search, matches, goMatch, registerText]);

  return (
    <DCCtx.Provider value={api}>
      <DCViewport minScale={minScale} maxScale={maxScale} style={style}>{ready && children}</DCViewport>
      <DCSearchTrigger />
      {search.open && <DCSearchBar />}
      {state.focus && registry[state.focus] && (
        <DCFocusOverlay entry={registry[state.focus]} sectionMeta={sectionMeta} sectionOrder={sectionOrder} />
      )}
    </DCCtx.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// DCSearchTrigger — small always-visible "Cari (⌘K)" pill in the
// top-right corner. Mostly there as a discovery affordance; the
// keyboard shortcut is the real entry point.
// ─────────────────────────────────────────────────────────────
function DCSearchTrigger() {
  const ctx = React.useContext(DCCtx);
  if (!ctx || ctx.search.open) return null;
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '');
  return ReactDOM.createPortal(
    <button
      onClick={() => ctx.setSearch((s) => ({ ...s, open: true }))}
      onPointerDown={(e) => e.stopPropagation()}
      title={`Cari label, judul, & isi artboard (${isMac ? '⌘' : 'Ctrl'}+K · ${isMac ? '⌘' : 'Ctrl'}+F · /)`}
      style={{
        position: 'fixed', top: 16, right: 16, zIndex: 90,
        background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 999, padding: '6px 10px 6px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: DC.font, fontSize: 12, color: 'rgba(40,30,20,0.85)',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
        <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35"/>
      </svg>
      <span style={{ opacity: 0.75 }}>Cari</span>
      <kbd style={{
        fontFamily: 'inherit', fontSize: 10.5, fontWeight: 500,
        padding: '1px 5px', borderRadius: 4,
        background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.06)',
        color: 'rgba(40,30,20,0.7)',
      }}>{isMac ? '⌘' : 'Ctrl'} K</kbd>
    </button>,
    document.body,
  );
}

// ─────────────────────────────────────────────────────────────
// DCSearchBar — floating top-center search panel with prev/next
// match navigation. Auto-focuses input when opened. Live updates
// the DesignCanvas focus to the cursor-th match on every change.
// Keys (within input):
//   • Enter / ↓        next match
//   • Shift+Enter / ↑  previous match
//   • Esc              close (handled at DesignCanvas level)
// ─────────────────────────────────────────────────────────────
function DCSearchBar() {
  const ctx = React.useContext(DCCtx);
  const inputRef = React.useRef(null);
  const { search, setSearch, matches, goMatch, setFocus } = ctx;

  React.useEffect(() => {
    if (search.open && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [search.open]);

  const onKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) goMatch(-1); else goMatch(1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); goMatch(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); goMatch(-1);
    }
  };

  const navBtn = (disabled) => ({
    border: 'none',
    background: disabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.10)',
    color: disabled ? 'rgba(255,255,255,0.35)' : '#fff',
    width: 26, height: 26, borderRadius: 13,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background .12s', padding: 0,
  });

  const total = matches.length;
  const cur = total ? Math.min(search.cursor, total - 1) + 1 : 0;

  return ReactDOM.createPortal(
    <div onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 200,
        background: 'rgba(28, 24, 20, 0.92)', backdropFilter: 'blur(10px)',
        color: '#fff', borderRadius: 999, padding: '8px 10px 8px 14px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: DC.font, fontSize: 13, minWidth: 360, maxWidth: 720,
      }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.65, flexShrink: 0 }}>
        <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35"/>
      </svg>
      <input
        ref={inputRef}
        value={search.q}
        onChange={(e) => setSearch((s) => ({ ...s, q: e.target.value, cursor: 0 }))}
        onKeyDown={onKey}
        placeholder="Cari label, judul, atau isi artboard…"
        style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, flex: 1, fontFamily: 'inherit', minWidth: 200 }}
      />
      <span style={{ fontSize: 11, opacity: 0.7, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', minWidth: 64, textAlign: 'right' }}>
        {search.q ? (total ? `${cur} / ${total}` : 'tidak ketemu') : 'mulai ketik…'}
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={() => goMatch(-1)} disabled={!total} title="Sebelumnya (↑ / Shift+Enter)" style={navBtn(!total)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
        </button>
        <button onClick={() => goMatch(1)} disabled={!total} title="Berikutnya (↓ / Enter)" style={navBtn(!total)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>
      <button
        onClick={() => { setSearch({ q: '', cursor: 0, open: false }); setFocus(null); }}
        title="Tutup (Esc)" style={navBtn(false)}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18 M6 6l12 12"/></svg>
      </button>
    </div>,
    document.body,
  );
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({ children, minScale = 0.1, maxScale = 8, style = {} }) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({ x: 0, y: 0, scale: 1 });

  const apply = React.useCallback(() => {
    const { x, y, scale } = tf.current;
    const el = worldRef.current;
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }, []);

  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;

    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left, py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = (e) =>
      e.deltaMode !== 0 ||
      (e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40);

    const onWheel = (e) => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if (e.ctrlKey) {
        // trackpad pinch (or explicit ctrl+wheel)
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = (e) => { e.preventDefault(); isGesturing = true; gsBase = tf.current.scale; };
    const onGestureChange = (e) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, (gsBase * e.scale) / tf.current.scale);
    };
    const onGestureEnd = (e) => { e.preventDefault(); isGesturing = false; };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = (e) => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || (e.button === 0 && onBg))) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = { id: e.pointerId, lx: e.clientX, ly: e.clientY };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX; drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    vp.addEventListener('wheel', onWheel, { passive: false });
    vp.addEventListener('gesturestart', onGestureStart, { passive: false });
    vp.addEventListener('gesturechange', onGestureChange, { passive: false });
    vp.addEventListener('gestureend', onGestureEnd, { passive: false });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);

  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return (
    <div
      ref={vpRef}
      className="design-canvas"
      style={{
        height: '100vh', width: '100vw',
        background: DC.bg,
        overflow: 'hidden',
        overscrollBehavior: 'none',
        touchAction: 'none',
        position: 'relative',
        fontFamily: DC.font,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        ref={worldRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          transformOrigin: '0 0',
          willChange: 'transform',
          width: 'max-content', minWidth: '100%',
          minHeight: '100%',
          padding: '60px 0 80px',
        }}
      >
        <div style={{ position: 'absolute', inset: -6000, backgroundImage: gridSvg, backgroundSize: '120px 120px', pointerEvents: 'none', zIndex: -1 }} />
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({ id, title, subtitle, children, gap = 48 }) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(children);
  const artboards = all.filter((c) => c && c.type === DCArtboard);
  const rest = all.filter((c) => !(c && c.type === DCArtboard));
  const srcOrder = artboards.map((a) => a.props.id ?? a.props.label);
  const sec = (ctx && sid && ctx.section(sid)) || {};

  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter((k) => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter((k) => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);

  const byId = Object.fromEntries(artboards.map((a) => [a.props.id ?? a.props.label, a]));

  return (
    <div data-dc-section={sid} style={{ marginBottom: 80, position: 'relative' }}>
      <div style={{ padding: '0 60px 56px' }}>
        <DCEditable tag="div" value={sec.title ?? title}
          onChange={(v) => ctx && sid && ctx.patchSection(sid, { title: v })}
          style={{ fontSize: 28, fontWeight: 600, color: DC.title, letterSpacing: -0.4, marginBottom: 6, display: 'inline-block' }} />
        {subtitle && <div style={{ fontSize: 16, color: DC.subtitle }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', gap, padding: '0 60px', alignItems: 'flex-start', width: 'max-content' }}>
        {order.map((k) => (
          <DCArtboardFrame key={k} sectionId={sid} artboard={byId[k]} order={order}
            label={(sec.labels || {})[k] ?? byId[k].props.label}
            onRename={(v) => ctx && ctx.patchSection(sid, (x) => ({ labels: { ...x.labels, [k]: v } }))}
            onReorder={(next) => ctx && ctx.patchSection(sid, { order: next })}
            onFocus={() => ctx && ctx.setFocus(`${sid}/${k}`)}
            registerText={ctx && ctx.registerText} />
        ))}
      </div>
      {rest}
    </div>
  );
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() { return null; }

function DCArtboardFrame({ sectionId, artboard, label, order, onRename, onReorder, onFocus, registerText }) {
  const { id: rawId, label: rawLabel, width = 260, height = 480, children, style = {} } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);

  // Index the artboard's rendered text for the canvas-wide search. Runs on
  // mount + on every render where children's textual content has actually
  // changed (registerText itself dedupes). MutationObserver covers async
  // late-mounting children (e.g. components that render after a fetch) so
  // search keeps working when content lands after first paint.
  React.useEffect(() => {
    if (!registerText || !cardRef.current) return;
    const el = cardRef.current;
    const slotId = `${sectionId}/${id}`;
    const push = () => registerText(slotId, el.textContent || '');
    push();
    const mo = new MutationObserver(push);
    mo.observe(el, { childList: true, subtree: true, characterData: true });
    return () => mo.disconnect();
  }, [sectionId, id, registerText]);

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = (e) => {
    e.preventDefault(); e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map((el) => ({ el, id: el.dataset.dcSlot, x: el.getBoundingClientRect().left }));
    const slotXs = homes.map((h) => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');

    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };

    const move = (ev) => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0, best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) { best = d; nearest = i; }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter((k) => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };

    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) { h.el.style.transition = 'none'; h.el.style.transform = ''; }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };

  return (
    <div ref={ref} data-dc-slot={id} style={{ position: 'relative', flexShrink: 0 }}>
      <div className="dc-labelrow" style={{ position: 'absolute', bottom: '100%', left: -4, marginBottom: 4, color: DC.label }}>
        <div className="dc-grip" onPointerDown={onGripDown} title="Drag to reorder">
          <svg width="9" height="13" viewBox="0 0 9 13" fill="currentColor"><circle cx="2" cy="2" r="1.1"/><circle cx="7" cy="2" r="1.1"/><circle cx="2" cy="6.5" r="1.1"/><circle cx="7" cy="6.5" r="1.1"/><circle cx="2" cy="11" r="1.1"/><circle cx="7" cy="11" r="1.1"/></svg>
        </div>
        <div className="dc-labeltext" onClick={onFocus} title="Click to focus">
          <DCEditable value={label} onChange={onRename} onClick={(e) => e.stopPropagation()}
            style={{ fontSize: 15, fontWeight: 500, color: DC.label, lineHeight: 1 }} />
        </div>
      </div>
      <button className="dc-expand" onClick={onFocus} onPointerDown={(e) => e.stopPropagation()} title="Focus">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"/></svg>
      </button>
      <div ref={cardRef} className="dc-card"
        style={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)', overflow: 'hidden', width, height, background: '#fff', ...style }}>
        {children || <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 13, fontFamily: DC.font }}>{id}</div>}
      </div>
    </div>
  );
}

// Inline rename — commits on blur or Enter.
function DCEditable({ value, onChange, style, tag = 'span', onClick }) {
  const T = tag;
  return (
    <T className="dc-editable" contentEditable suppressContentEditableWarning
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      onBlur={(e) => onChange && onChange(e.currentTarget.textContent)}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
      style={style}>{value}</T>
  );
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({ entry, sectionMeta, sectionOrder }) {
  const ctx = React.useContext(DCCtx);
  const { sectionId, artboard } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);

  const go = (d) => { const n = peers[(idx + d + peers.length) % peers.length]; if (n) ctx.setFocus(`${sectionId}/${n}`); };
  const goSection = (d) => {
    const ns = sectionOrder[(secIdx + d + sectionOrder.length) % sectionOrder.length];
    const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
    if (first) ctx.setFocus(`${ns}/${first}`);
  };

  // When a search query is active, arrow keys cycle through MATCHES rather
  // than section peers — this is what makes the search feel like real
  // "search next/prev". Falls back to the default section/cross-section
  // navigation when there is no active query.
  const matches = (ctx && ctx.matches) || [];
  const goMatch = (ctx && ctx.goMatch) || (() => {});
  const searchActive = matches.length > 0;

  React.useEffect(() => {
    const k = (e) => {
      // Don't hijack arrows while typing in inputs (incl. the search bar).
      const ae = document.activeElement;
      if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) return;

      if (searchActive) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')   { e.preventDefault(); goMatch(-1); return; }
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goMatch(1);  return; }
      } else {
        if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        if (e.key === 'ArrowUp')    { e.preventDefault(); goSection(-1); }
        if (e.key === 'ArrowDown')  { e.preventDefault(); goSection(1); }
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });

  const { width = 260, height = 480, children } = artboard.props;
  const [vp, setVp] = React.useState({ w: window.innerWidth, h: window.innerHeight });
  React.useEffect(() => { const r = () => setVp({ w: window.innerWidth, h: window.innerHeight }); window.addEventListener('resize', r); return () => window.removeEventListener('resize', r); }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));

  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({ dir, onClick }) => (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{ position: 'absolute', top: '50%', [dir]: 28, transform: 'translateY(-50%)',
        border: 'none', background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.9)',
        width: 44, height: 44, borderRadius: 22, fontSize: 18, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.18)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.08)')}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d={dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'} /></svg>
    </button>
  );

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(
    <div onClick={() => ctx.setFocus(null)}
      onWheel={(e) => e.preventDefault()}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(24,20,16,.6)', backdropFilter: 'blur(14px)',
        fontFamily: DC.font, color: '#fff' }}>

      {/* top bar: section dropdown (left) · close (right) */}
      <div onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 72, display: 'flex', alignItems: 'flex-start', padding: '16px 20px 0', gap: 16 }}>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setDd((o) => !o)}
            style={{ border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer', padding: '6px 8px',
              borderRadius: 6, textAlign: 'left', fontFamily: 'inherit' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3 }}>{meta.title}</span>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ opacity: .7 }}><path d="M2 4l3.5 3.5L9 4"/></svg>
            </span>
            {meta.subtitle && <span style={{ display: 'block', fontSize: 13, opacity: .6, fontWeight: 400, marginTop: 2 }}>{meta.subtitle}</span>}
          </button>
          {ddOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: '#2a251f', borderRadius: 8,
              boxShadow: '0 8px 32px rgba(0,0,0,.4)', padding: 4, minWidth: 200, zIndex: 10 }}>
              {sectionOrder.map((sid) => (
                <button key={sid} onClick={() => { setDd(false); const f = sectionMeta[sid].slotIds[0]; if (f) ctx.setFocus(`${sid}/${f}`); }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                    background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent', color: '#fff',
                    padding: '8px 12px', borderRadius: 5, fontSize: 14, fontWeight: sid === sectionId ? 600 : 400, fontFamily: 'inherit' }}>
                  {sectionMeta[sid].title}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => ctx.setFocus(null)}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.12)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          style={{ border: 'none', background: 'transparent', color: 'rgba(255,255,255,.7)', width: 32, height: 32,
            borderRadius: 16, fontSize: 20, cursor: 'pointer', lineHeight: 1, transition: 'background .12s' }}>×</button>
      </div>

      {/* card centered, label + index below — only the card itself stops
          propagation so any backdrop click (including the margins around
          the card) exits focus */}
      <div
        style={{ position: 'absolute', top: 64, bottom: 56, left: 100, right: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div onClick={(e) => e.stopPropagation()} style={{ width: width * scale, height: height * scale, position: 'relative' }}>
          <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left', background: '#fff', borderRadius: 2, overflow: 'hidden',
            boxShadow: '0 20px 80px rgba(0,0,0,.4)' }}>
            {children || <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb' }}>{aid}</div>}
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()} style={{ fontSize: 14, fontWeight: 500, opacity: .85, textAlign: 'center' }}>
          {(sec.labels || {})[aid] ?? artboard.props.label}
          <span style={{ opacity: .5, marginLeft: 10, fontVariantNumeric: 'tabular-nums' }}>
            {searchActive
              ? `match ${Math.min(ctx.search.cursor, matches.length - 1) + 1} / ${matches.length}`
              : `${idx + 1} / ${peers.length}`}
          </span>
        </div>
      </div>

      <Arrow dir="left"  onClick={() => searchActive ? goMatch(-1) : go(-1)} />
      <Arrow dir="right" onClick={() => searchActive ? goMatch(1)  : go(1)} />

      {/* dots — section peers (default) or search matches (when searching) */}
      <div onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
        {(searchActive ? matches : peers.map((p) => `${sectionId}/${p}`)).map((slotId, i) => {
          const isCur = searchActive ? i === Math.min(ctx.search.cursor, matches.length - 1) : i === idx;
          return (
            <button key={slotId + ':' + i} onClick={() => searchActive ? ctx.setSearch((s) => ({ ...s, cursor: i })) : ctx.setFocus(slotId)}
              style={{ border: 'none', padding: 0, cursor: 'pointer', width: 6, height: 6, borderRadius: 3,
                background: isCur ? '#fff' : 'rgba(255,255,255,.3)' }} />
          );
        })}
      </div>
    </div>,
    document.body,
  );
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({ children, top, left, right, bottom, rotate = -2, width = 180 }) {
  return (
    <div style={{
      position: 'absolute', top, left, right, bottom, width,
      background: DC.postitBg, padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14, lineHeight: 1.4, color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5,
    }}>{children}</div>
  );
}

Object.assign(window, { DesignCanvas, DCSection, DCArtboard, DCPostIt });

