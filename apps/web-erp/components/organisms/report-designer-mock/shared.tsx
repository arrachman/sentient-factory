'use client';

import * as React from 'react';

/** Ribbon group: a row of controls with an uppercase label beneath. */
export function RibbonGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rd-rgroup">
      <div className="rd-rrow">{children}</div>
      <div className="rd-rlabel">{label}</div>
    </div>
  );
}

/** Property group: titled section in the right panel. */
export function PropGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rd-propgroup">
      <div className="rd-propgroup-label">{label}</div>
      {children}
    </div>
  );
}

/** Single label + control row in a property group. */
export function PropRow({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`rd-proprow${full ? ' full' : ''}`}>
      <label>{label}</label>
      <div className="rd-propctrl">{children}</div>
    </div>
  );
}

/** iOS-style toggle switch. */
export function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button className={`rd-toggle${on ? ' on' : ''}`} onClick={onClick} aria-pressed={on}>
      <span />
    </button>
  );
}

/** Tiny align-preview glyph for the ribbon Align group. */
export function AlignIcon({ a }: { a: 'left' | 'center' | 'right' }) {
  const midX2 = a === 'right' ? 13 : a === 'center' ? 12 : 10;
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none">
      <line x1="3" y1="4" x2="13" y2="4" />
      <line x1="3" y1="8" x2={midX2} y2="8" />
      <line x1="3" y1="12" x2="13" y2="12" />
    </svg>
  );
}
