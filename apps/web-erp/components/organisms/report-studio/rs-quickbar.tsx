'use client';

import * as React from 'react';
import { s } from '@/lib/report-studio/css';
import type { RsVals } from './vals';
import { Hov } from './rs-shared';

const SELECT_ARROW = 'height:28px;padding:0 26px 0 9px;border:1px solid rgba(255,255,255,.14);border-radius:6px;background:rgba(255,255,255,.06);color:#eef1f6;font-size:12px;font-weight:600;cursor:pointer;appearance:none;background-image:linear-gradient(45deg,transparent 50%,#9aa3b2 50%),linear-gradient(135deg,#9aa3b2 50%,transparent 50%);background-position:calc(100% - 14px) 12px,calc(100% - 9px) 12px;background-size:5px 5px,5px 5px;background-repeat:no-repeat';

export function RsQuickbar({ v }: { v: RsVals }) {
  return (
    <header style={s('height:46px;flex:0 0 46px;display:flex;align-items:center;gap:8px;padding:0 12px;background:var(--titlebar,#11161f);z-index:40')}>
      <div style={s('display:flex;align-items:center;gap:8px')}>
        <div style={s("width:24px;height:24px;border-radius:6px;background:var(--accent,#2563eb);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;font-family:'IBM Plex Mono',monospace")}>R</div>
        <div style={s('font-weight:700;font-size:13.5px;letter-spacing:-.01em;color:#eef1f6')}>Report<span style={s('color:#7fa8f5')}>Studio</span></div>
      </div>
      <div style={s('width:1px;height:22px;background:rgba(255,255,255,.16)')} />
      <div style={s('display:flex;align-items:center;gap:2px')}>
        <button onClick={v.onUndo} title="Undo (Ctrl+Z)" style={s(v.undoStyle)}><svg width="14" height="14" viewBox="0 0 16 16"><path d="M6 4L2.5 7 6 10M3 7h7a3 3 0 0 1 0 6H7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        <button onClick={v.onRedo} title="Redo (Ctrl+Y)" style={s(v.redoStyle)}><svg width="14" height="14" viewBox="0 0 16 16"><path d="M10 4l3.5 3L10 10M13 7H6a3 3 0 0 0 0 6h3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
      </div>
      <div style={s('width:1px;height:22px;background:rgba(255,255,255,.16)')} />
      <svg width="14" height="14" viewBox="0 0 16 16" style={s('opacity:.7;color:#b9c2d0')}><path d="M3 2h7l3 3v9H3z" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M10 2v3h3" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
      <Hov as="input" value={v.reportName} onChange={v.onName} placeholder={v.t.reportName}
        base="height:28px;width:230px;padding:0 9px;border:1px solid transparent;border-radius:6px;background:rgba(255,255,255,.06);color:#eef1f6;font-size:12.5px;font-weight:500"
        focus="border:1px solid var(--accent,#2563eb);background:rgba(255,255,255,.12)" />
      <span style={s("font-size:11px;color:#7d8799;font-family:'IBM Plex Mono',monospace")}>.rdl — Designer</span>

      <div style={s('margin-left:auto;display:flex;align-items:center;gap:7px')}>
        <select value={v.tplKey} onChange={v.onTemplate} title="Template" style={s(SELECT_ARROW)}>
          {v.templateOptions.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
        </select>
        <button onClick={v.toggleLang} title="Language" style={s("height:28px;width:40px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#eef1f6;font-size:11px;font-weight:700;border-radius:6px;cursor:pointer;font-family:'IBM Plex Mono',monospace")}>{v.langBtnLabel}</button>
        <button onClick={v.toggleTheme} title="Theme" style={s('height:28px;width:30px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#eef1f6;border-radius:6px;cursor:pointer')}>{v.themeGlyph}</button>
        <div style={s('position:relative')}>
          <button onClick={v.toggleExport} style={s('height:28px;padding:0 12px;display:flex;align-items:center;gap:6px;border:none;background:var(--accent,#2563eb);color:#fff;font-size:12px;font-weight:600;border-radius:6px;cursor:pointer')}>
            <svg width="12" height="12" viewBox="0 0 16 16"><path d="M8 2v7M5 6.2l3 3 3-3M3 12.5h10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>{v.t.export}
          </button>
          {v.expOpen && (
            <div style={s('position:absolute;right:0;top:34px;width:182px;background:var(--panel,#fff);border:1px solid var(--border,#e1e5ea);border-radius:10px;box-shadow:0 14px 40px rgba(0,0,0,.22);padding:5px;z-index:60;animation:rsPop .12s ease')}>
              {v.exportItems.map((x) => (
                <Hov as="button" key={x.ext} onClick={x.onClick}
                  base="width:100%;display:flex;align-items:center;gap:9px;height:32px;padding:0 9px;border:none;background:transparent;color:var(--text,#1d2330);font-size:12.5px;font-weight:500;border-radius:7px;cursor:pointer;text-align:left"
                  hover="background:var(--hover,#eef2f8)">
                  <span style={s("width:32px;font-family:'IBM Plex Mono',monospace;font-size:9.5px;font-weight:600;color:var(--accent,#2563eb)")}>{x.ext}</span>{x.label}
                </Hov>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
