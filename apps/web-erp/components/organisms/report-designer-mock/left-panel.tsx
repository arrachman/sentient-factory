'use client';

import * as React from 'react';
import { Icon, type IconName } from '@/components/ui/icons';
import {
  RD_TOOLBOX, RD_DICT, type RdBand, type RdCompKind,
} from '@/lib/report-designer-mock';

export type RdSelection = { band: string | null; comp: string | null };

interface Props {
  leftTab: 'toolbox' | 'dict';
  setLeftTab: (t: 'toolbox' | 'dict') => void;
  bands: RdBand[];
  sel: RdSelection;
  setSel: (s: RdSelection) => void;
  addComp: (kind: RdCompKind) => void;
  expandDict: Record<string, boolean>;
  setExpandDict: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  insertTag: (path: string) => void;
}

export function RdLeftPanel(props: Props) {
  const { leftTab, setLeftTab, bands, sel, setSel, addComp, expandDict, setExpandDict, insertTag } = props;
  return (
    <aside className="rd-left">
      <div className="rd-tabs">
        <button className={leftTab === 'toolbox' ? 'active' : ''} onClick={() => setLeftTab('toolbox')}>
          <Icon name="boxes" size={13} /> Komponen
        </button>
        <button className={leftTab === 'dict' ? 'active' : ''} onClick={() => setLeftTab('dict')}>
          <Icon name="database" size={13} /> Sumber Data
        </button>
      </div>

      {leftTab === 'toolbox' ? (
        <div className="rd-panel-body">
          <div className="rd-section-label">Komponen Laporan</div>
          <div className="rd-toolbox">
            {RD_TOOLBOX.map(tb => (
              <button key={tb.kind} className="rd-tool" onClick={() => addComp(tb.kind)}>
                <Icon name={tb.icon as IconName} size={16} />
                <span>{tb.label}</span>
              </button>
            ))}
          </div>
          <div className="rd-section-label">Bands</div>
          <div className="rd-bandlist">
            {bands.map(b => (
              <button key={b.id} className={`rd-banditem${sel.band === b.id ? ' active' : ''}`}
                onClick={() => setSel({ band: b.id, comp: null })}>
                <span className="rd-banddot" style={{ background: b.color }} />
                <span>{b.label}</span>
                <span className="rd-bandh">{b.h}px</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rd-panel-body">
          <div className="rd-section-label">Data Source <span className="rd-src-pill">JSON · d</span></div>
          <div className="rd-dict">
            {RD_DICT.map(node => (
              <div key={node.path}>
                <div className="rd-dict-node"
                  onClick={() => setExpandDict(e => ({ ...e, [node.path]: !e[node.path] }))}>
                  <Icon name={expandDict[node.path] ? 'chevdown' : 'chevright'} size={11} />
                  <Icon name={node.array ? 'boxes' : 'database'} size={12} className="rd-dict-ic" />
                  <span className="rd-dict-label">{node.label}</span>
                  {node.array && <span className="rd-dict-type">array</span>}
                </div>
                {expandDict[node.path] && node.children.map(ch => (
                  <div key={ch.path} className="rd-dict-field" title={`Sisipkan {${ch.path}}`}
                    onClick={() => insertTag(ch.path)}>
                    <span className="rd-bullet" />
                    <span className="rd-dict-label">{ch.label}</span>
                    <span className="rd-dict-tag">{`{${ch.path}}`}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="rd-hint">
            <Icon name="info" size={11} /> Klik field untuk menyisipkan tag ke komponen terpilih.
          </div>
        </div>
      )}
    </aside>
  );
}
