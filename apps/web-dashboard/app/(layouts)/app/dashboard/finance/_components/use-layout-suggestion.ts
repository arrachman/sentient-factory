'use client';

/**
 * Hook untuk minta AI layout suggestion ke endpoint
 * `/api/dashboard/finance/layout-suggestion`. Mengembalikan loading flag dan
 * setter dua layout state (Finance vs Accounting) sehingga page tinggal
 * mengkonsumsi tanpa repetisi.
 */
import { useState } from 'react';
import { toast } from 'sonner';
import type { WidgetDefinition } from './finance-editable-widget-grid';

export type LayoutSuggestionItem = {
  id: string;
  w: number;
  h: number;
};

type SuggestPayload = {
  success?: boolean;
  source?: string;
  model?: string | null;
  provider?: string | null;
  layout?: LayoutSuggestionItem[];
  message?: string;
};

function detectColumns(): number {
  if (typeof window === 'undefined') return 12;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1280) return 6;
  return 12;
}

function inferKind(id: string): 'kpi' | 'table' | 'list' | 'chart' {
  if (id.includes('kpi')) return 'kpi';
  if (id.includes('transaction')) return 'table';
  if (id.includes('top-') || id.includes('checklist')) return 'list';
  return 'chart';
}

export function useLayoutSuggestion(
  activeTab: 'Finance' | 'Accounting',
  activeWidgets: WidgetDefinition[],
) {
  const [financeLayout, setFinanceLayout] = useState<
    LayoutSuggestionItem[] | null
  >(null);
  const [accountingLayout, setAccountingLayout] = useState<
    LayoutSuggestionItem[] | null
  >(null);
  const [financeVersion, setFinanceVersion] = useState(0);
  const [accountingVersion, setAccountingVersion] = useState(0);
  const [loading, setLoading] = useState(false);

  const suggest = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        '/api/dashboard/finance/layout-suggestion',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tab: activeTab,
            columns: detectColumns(),
            widgets: activeWidgets.map((widget) => ({
              id: widget.id,
              title: widget.id.replace(/[-_]/g, ' '),
              kind: inferKind(widget.id),
              minW: widget.minW,
              maxW: widget.maxW,
              minH: widget.minH,
              maxH: widget.maxH,
              defaultW: widget.defaultSize.desktop.w,
              defaultH: widget.defaultSize.desktop.h,
            })),
          }),
        },
      );

      const payload = (await response
        .json()
        .catch(() => null)) as SuggestPayload | null;

      if (
        !response.ok ||
        !payload?.success ||
        !Array.isArray(payload.layout) ||
        !payload.layout.length
      ) {
        throw new Error(payload?.message || 'AI layout suggestion gagal.');
      }

      if (activeTab === 'Finance') {
        setFinanceLayout(payload.layout);
        setFinanceVersion((value) => value + 1);
      } else {
        setAccountingLayout(payload.layout);
        setAccountingVersion((value) => value + 1);
      }

      toast.success(
        payload.source === 'ai'
          ? `AI suggestion applied${
              payload.provider || payload.model
                ? ` (${payload.provider ?? 'AI'}${
                    payload.model ? ` • ${payload.model}` : ''
                  })`
                : ''
            }.`
          : 'Fallback suggestion applied.',
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Gagal meminta suggestion layout.',
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    financeLayout,
    accountingLayout,
    financeVersion,
    accountingVersion,
    loading,
    suggest,
  };
}
