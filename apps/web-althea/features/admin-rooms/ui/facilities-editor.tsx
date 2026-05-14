'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { DEFAULT_FACILITIES } from '../model/constants';
import { ROOM_TYPE_LABEL, type CreateRoomInput } from '../model/types';

export function FacilitiesEditor({
  value,
  type,
  onChange,
}: {
  value: string[];
  type: CreateRoomInput['type'];
  onChange: (next: string[]) => void;
}) {
  const [input, setInput] = useState('');
  const suggestions = DEFAULT_FACILITIES[type] ?? [];
  const remainingSuggestions = suggestions.filter((s) => !value.includes(s));

  function addFacility(name: string) {
    const trimmed = name.trim();
    if (!trimmed || value.length >= 30) return;
    if (value.some((v) => v.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...value, trimmed]);
    setInput('');
  }

  function removeFacility(name: string) {
    onChange(value.filter((v) => v !== name));
  }

  function applyAllSuggestions() {
    const merged = [...value];
    for (const s of remainingSuggestions) {
      if (merged.length >= 30) break;
      merged.push(s);
    }
    onChange(merged);
  }

  return (
    <div>
      <label className="caption mb-1 block">
        Fasilitas{' '}
        <span className="caption" style={{ fontSize: 11, opacity: 0.7 }}>({value.length}/30)</span>
      </label>

      {value.length > 0 ? (
        <div className="flex flex-wrap" style={{ gap: 6, marginBottom: 8 }}>
          {value.map((f) => (
            <span key={f} className="badge badge-sage" style={{ height: 26, paddingRight: 4, gap: 4 }}>
              {f}
              <button
                type="button"
                onClick={() => removeFacility(f)}
                aria-label={`Hapus ${f}`}
                style={{
                  width: 18, height: 18, borderRadius: 999,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'grid', placeItems: 'center', color: 'inherit', padding: 0,
                }}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="caption" style={{ fontSize: 11, marginBottom: 8, fontStyle: 'italic' }}>
          Belum ada fasilitas — tambah lewat suggestions di bawah atau ketik custom.
        </p>
      )}

      <div className="flex" style={{ gap: 6 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFacility(input); } }}
          maxLength={60}
          className="input-althea"
          placeholder="Ketik fasilitas custom, tekan Enter"
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={() => addFacility(input)}
          disabled={!input.trim() || value.length >= 30}
          className="btn btn-outline btn-sm"
        >
          <Plus size={14} /> Tambah
        </button>
      </div>

      {remainingSuggestions.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
            <span className="caption" style={{ fontSize: 11 }}>
              Saran untuk tipe {ROOM_TYPE_LABEL[type].toLowerCase()}:
            </span>
            <button
              type="button"
              onClick={applyAllSuggestions}
              className="btn btn-ghost btn-sm"
              style={{ height: 22, padding: '0 8px', fontSize: 11 }}
            >
              Pakai semua
            </button>
          </div>
          <div className="flex flex-wrap" style={{ gap: 6 }}>
            {remainingSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addFacility(s)}
                disabled={value.length >= 30}
                className="badge badge-neutral"
                style={{ cursor: 'pointer', border: '1px dashed var(--border-strong)', background: 'transparent' }}
              >
                <Plus size={10} /> {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
