'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import type { RdComp, RdCompKind } from '@/lib/report-designer-mock';
import { RibbonGroup, AlignIcon } from './shared';

interface Props {
  selComp: RdComp | undefined;
  updateComp: (patch: Partial<RdComp>) => void;
  addComp: (kind: RdCompKind) => void;
  paper: string;
  setPaper: (p: string) => void;
  zoom: number;
  setZoom: (fn: (z: number) => number) => void;
}

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24];
const ALIGNS: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];

export function RdRibbon({ selComp, updateComp, addComp, paper, setPaper, zoom, setZoom }: Props) {
  return (
    <div className="rd-ribbon">
      <RibbonGroup label="Font">
        <select className="rd-sel" defaultValue="Geist" style={{ width: 96 }}>
          <option>Geist</option><option>Arial</option><option>Times New Roman</option><option>Courier</option>
        </select>
        <select className="rd-sel" value={selComp?.size || 11} style={{ width: 56 }}
          onChange={e => updateComp({ size: Number(e.target.value) })}>
          {FONT_SIZES.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="rd-btngrp">
          <button className={selComp?.bold ? 'on' : ''} style={{ fontWeight: 700 }}
            onClick={() => updateComp({ bold: !selComp?.bold })}>B</button>
          <button style={{ fontStyle: 'italic' }}>I</button>
          <button style={{ textDecoration: 'underline' }}>U</button>
        </div>
      </RibbonGroup>

      <RibbonGroup label="Align">
        <div className="rd-btngrp">
          {ALIGNS.map(a => (
            <button key={a} className={selComp?.align === a ? 'on' : ''} onClick={() => updateComp({ align: a })}>
              <AlignIcon a={a} />
            </button>
          ))}
        </div>
      </RibbonGroup>

      <RibbonGroup label="Bands">
        <button className="btn sm"><Icon name="plus" size={11} /> Band</button>
        <button className="btn sm"><Icon name="layers" size={11} /> Group</button>
      </RibbonGroup>

      <RibbonGroup label="Insert">
        <button className="btn sm" onClick={() => addComp('text')}><Icon name="file" size={11} /> Text</button>
        <button className="btn sm" onClick={() => addComp('field')}><Icon name="database" size={11} /> Field</button>
        <button className="btn sm" onClick={() => addComp('line')}><Icon name="swap" size={11} /> Line</button>
      </RibbonGroup>

      <div style={{ flex: 1 }} />

      <RibbonGroup label="Page">
        <select className="rd-sel" value={paper} style={{ width: 72 }} onChange={e => setPaper(e.target.value)}>
          <option>A4</option><option>Letter</option><option>Legal</option>
        </select>
      </RibbonGroup>

      <RibbonGroup label="Zoom">
        <div className="rd-zoom">
          <button onClick={() => setZoom(z => Math.max(50, z - 10))}><Icon name="chevdown" size={11} /></button>
          <span>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))}><Icon name="chevup" size={11} /></button>
        </div>
      </RibbonGroup>
    </div>
  );
}
