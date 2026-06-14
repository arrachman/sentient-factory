'use client';

/**
 * Left column halaman Notifikasi WA — list template di-group per kategori
 * (pengingat / jadwal / onboarding / bayar). Setiap row punya:
 *   - Nama template + trigger event (truncated)
 *   - Toggle active (mini)
 *   - Recipient badges + "dijeda" badge kalau inactive
 */
import {
  CATEGORY_LABEL,
  WA_CATEGORIES,
  type Template,
} from '../model/types';
import { CATEGORY_HINT, PAID_ONLY_TRIGGERS } from '../model/constants';
import { getRecipStyle } from '../model/format';

function isPaidOnlyTemplate(t: Template): boolean {
  if (t.category === 'bayar') return true;
  return t.triggerEvent ? PAID_ONLY_TRIGGERS.has(t.triggerEvent) : false;
}

export function TemplateList({
  templates,
  isLoading,
  selectedId,
  creating,
  onSelect,
  onToggleActive,
}: {
  templates: Template[];
  isLoading: boolean;
  selectedId: number | null;
  creating: boolean;
  onSelect: (t: Template) => void;
  onToggleActive: (t: Template) => void;
}) {
  return (
    <div className="card-althea overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="h2">Template ({templates.length})</h2>
        <span className="caption">sinkron Pengaturan</span>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[400px] lg:max-h-[700px]">
        {isLoading ? (
          <div className="p-8 text-center text-fg-muted">Memuat...</div>
        ) : templates.length === 0 ? (
          <div className="p-8 text-center text-fg-muted">
            Belum ada template. Klik <strong>Template Baru</strong> di atas.
          </div>
        ) : (
          WA_CATEGORIES.map((cat, ci) => {
            const items = templates.filter((t) => t.category === cat);
            if (items.length === 0) return null;
            const allPaid = cat === 'bayar';
            return (
              <div key={cat}>
                <CategoryHeader category={cat} hasBorderTop={ci > 0} />
                {allPaid ? (
                  <div className="px-4 py-2 bg-amber-50 border-b border-amber-200">
                    <div className="text-xs text-amber-900 leading-relaxed">
                      <strong>Hanya untuk paket full.</strong> Template
                      pembayaran (DP, pelunasan, bukti bayar, refund)
                      di-disable di paket saat ini. Hubungi admin untuk
                      upgrade.
                    </div>
                  </div>
                ) : null}
                {items.map((t) => (
                  <TemplateRow
                    key={t.id}
                    template={t}
                    isSelected={t.id === selectedId && !creating}
                    disabled={isPaidOnlyTemplate(t)}
                    showPaidBadge={!allPaid && isPaidOnlyTemplate(t)}
                    onSelect={() => onSelect(t)}
                    onToggleActive={() => onToggleActive(t)}
                  />
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function CategoryHeader({
  category,
  hasBorderTop,
}: {
  category: keyof typeof CATEGORY_LABEL;
  hasBorderTop: boolean;
}) {
  return (
    <div
      className={`px-4 py-2 bg-cream-50 ${
        hasBorderTop ? 'border-t border-border' : ''
      } border-b border-border`}
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-teal-800">
        {CATEGORY_LABEL[category]}
      </div>
      <div className="caption">{CATEGORY_HINT[category]}</div>
    </div>
  );
}

function TemplateRow({
  template: t,
  isSelected,
  disabled = false,
  showPaidBadge = false,
  onSelect,
  onToggleActive,
}: {
  template: Template;
  isSelected: boolean;
  disabled?: boolean;
  showPaidBadge?: boolean;
  onSelect: () => void;
  onToggleActive: () => void;
}) {
  return (
    <div
      onClick={disabled ? undefined : onSelect}
      className={`px-4 py-2.5 border-b border-border transition ${
        disabled
          ? 'cursor-not-allowed opacity-60 border-l-[3px] border-l-transparent pl-[13px]'
          : isSelected
            ? 'cursor-pointer bg-sage-50 border-l-[3px] border-l-sage-500 pl-[13px]'
            : 'cursor-pointer hover:bg-cream-50 border-l-[3px] border-l-transparent pl-[13px]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-teal-800 truncate">
            {t.name}
          </div>
          {t.triggerEvent ? (
            <div className="caption text-xs mt-0.5 truncate">
              {t.triggerEvent}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (disabled) return;
            onToggleActive();
          }}
          aria-label={
            disabled
              ? 'Toggle dinonaktifkan — hanya untuk paket full'
              : t.isActive
                ? 'Nonaktifkan'
                : 'Aktifkan'
          }
          title={
            disabled ? 'Hanya untuk paket full' : undefined
          }
          className={`flex-shrink-0 mt-1 ${
            disabled ? 'cursor-not-allowed' : ''
          }`}
        >
          <span
            className={`block w-6 h-3.5 rounded-full relative transition ${
              disabled
                ? 'bg-cream-200 opacity-50'
                : t.isActive
                  ? 'bg-sage-500'
                  : 'bg-cream-200'
            }`}
          >
            <span
              className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all ${
                !disabled && t.isActive ? 'left-3' : 'left-0.5'
              }`}
            />
          </span>
        </button>
      </div>

      <div className="flex flex-wrap gap-1 mt-1.5">
        {t.recipients.map((r) => {
          const rs = getRecipStyle(r);
          return (
            <span
              key={r}
              className="inline-flex items-center px-1.5 h-4 rounded-full text-[10px] font-medium"
              style={{ background: rs.bg, color: rs.fg }}
            >
              {rs.label}
            </span>
          );
        })}
        {!t.isActive ? (
          <span className="badge badge-warn text-[10px] h-4 px-1.5">
            dijeda
          </span>
        ) : null}
        {showPaidBadge ? (
          <span
            className="inline-flex items-center px-1.5 h-4 rounded-full text-[10px] font-medium bg-amber-100 text-amber-900"
            title="Hanya untuk paket full"
          >
            paket full
          </span>
        ) : null}
      </div>
    </div>
  );
}
