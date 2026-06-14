'use client';

import { useEffect, useState } from 'react';
import type { DashboardPinTarget, DashboardVisualizationBlock, SelectedStreamChart, SelectedStreamTable } from './_types';
import type { PinDialogProps } from './ai-dialogs';
import { formatPromptPreview } from './_utils-format';

const DEFAULT_DASHBOARD_PIN_TARGETS: DashboardPinTarget[] = [
  {
    dashboard_id: '0',
    dashboard_key: 'warehouse-operations',
    dashboard_title: 'Warehouse Operations',
    menu_id: '',
    menu_key: 'logistic-dashboard-warehouse',
    menu_title: 'Custom Dashboard 1',
    route_path: '/app/dashboard/custom-db-1',
  },
];

export interface PinWidgetState {
  isPinDialogOpen: boolean;
  setIsPinDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pinTargets: DashboardPinTarget[];
  setPinTargets: React.Dispatch<React.SetStateAction<DashboardPinTarget[]>>;
  selectedPinTargetKey: string;
  setSelectedPinTargetKey: React.Dispatch<React.SetStateAction<string>>;
  isPinTargetsLoading: boolean;
  isPinningWidget: boolean;
  pinDialogError: string | null;
  setPinDialogError: React.Dispatch<React.SetStateAction<string | null>>;
  pinDialogSuccess: string | null;
  setPinDialogSuccess: React.Dispatch<React.SetStateAction<string | null>>;
  pinWidgetTitle: string;
  setPinWidgetTitle: React.Dispatch<React.SetStateAction<string>>;
  pinWidgetSpan: string;
  setPinWidgetSpan: React.Dispatch<React.SetStateAction<string>>;
  pinTargetTitle: string;
  setPinTargetTitle: React.Dispatch<React.SetStateAction<string>>;
  openPinDialog: () => void;
  handlePinActiveWidget: () => Promise<void>;
  pinDialogProps: PinDialogProps;
}

export type PinQueryResult = {
  query_id: string;
  sql: string;
  success: boolean;
  error_message?: string | null;
  row_count?: number;
  columns?: { name: string }[];
  rows?: Record<string, string | number | boolean | null>[];
};

interface PinWidgetOptions {
  activePinWidgetTitle: string;
  activePinQueryResult: PinQueryResult | null;
  previewStreamChart: SelectedStreamChart | null;
  previewStreamTable: SelectedStreamTable | null;
  activeDashboardBlock: DashboardVisualizationBlock | null;
  resultView: string;
  submittedPrompt: string;
  canPinActiveWidget: boolean;
}

export function usePinWidget({
  activePinWidgetTitle,
  activePinQueryResult,
  previewStreamChart,
  previewStreamTable,
  activeDashboardBlock,
  resultView,
  submittedPrompt,
  canPinActiveWidget,
}: PinWidgetOptions): PinWidgetState {
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [pinTargets, setPinTargets] = useState<DashboardPinTarget[]>([]);
  const [selectedPinTargetKey, setSelectedPinTargetKey] = useState('');
  const [isPinTargetsLoading, setIsPinTargetsLoading] = useState(false);
  const [isPinningWidget, setIsPinningWidget] = useState(false);
  const [pinDialogError, setPinDialogError] = useState<string | null>(null);
  const [pinDialogSuccess, setPinDialogSuccess] = useState<string | null>(null);
  const [pinWidgetTitle, setPinWidgetTitle] = useState('');
  const [pinWidgetSpan, setPinWidgetSpan] = useState('lg:col-span-6');
  const [pinTargetTitle, setPinTargetTitle] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadPinTargets() {
      setIsPinTargetsLoading(true);
      setPinDialogError(null);
      try {
        const response = await fetch('/api/dashboard/custom-db/pin-targets', { cache: 'no-store' });
        const payload = await response.json().catch(() => null);
        const targets =
          response.ok && payload?.success && Array.isArray(payload.data) && payload.data.length > 0
            ? (payload.data as DashboardPinTarget[])
            : DEFAULT_DASHBOARD_PIN_TARGETS;
        if (cancelled) {
          return;
        }
        setPinTargets(targets);
        setSelectedPinTargetKey((current) => current || targets[0]?.dashboard_key || '');
        setPinTargetTitle(targets[0]?.menu_title || targets[0]?.dashboard_title || '');
      } catch (error) {
        if (!cancelled) {
          setPinTargets(DEFAULT_DASHBOARD_PIN_TARGETS);
          setSelectedPinTargetKey(
            (current) => current || DEFAULT_DASHBOARD_PIN_TARGETS[0]?.dashboard_key || '',
          );
          setPinTargetTitle(
            DEFAULT_DASHBOARD_PIN_TARGETS[0]?.menu_title ||
              DEFAULT_DASHBOARD_PIN_TARGETS[0]?.dashboard_title ||
              '',
          );
          setPinDialogError(error instanceof Error ? error.message : 'Gagal memuat target dashboard.');
        }
      } finally {
        if (!cancelled) {
          setIsPinTargetsLoading(false);
        }
      }
    }

    void loadPinTargets();
    return () => {
      cancelled = true;
    };
  }, []);

  const openPinDialog = () => {
    setPinDialogError(null);
    setPinDialogSuccess(null);
    setPinWidgetTitle(activePinWidgetTitle);
    setPinWidgetSpan('lg:col-span-6');
    const matchedTarget =
      pinTargets.find((item) => item.dashboard_key === selectedPinTargetKey) ?? pinTargets[0];
    setPinTargetTitle(matchedTarget?.menu_title || matchedTarget?.dashboard_title || '');
    setIsPinDialogOpen(true);
  };

  const handlePinActiveWidget = async () => {
    if (!activePinQueryResult?.sql || !selectedPinTargetKey || !pinWidgetTitle.trim()) {
      setPinDialogError('Widget aktif belum punya query SQL yang bisa di-pin.');
      return;
    }
    setIsPinningWidget(true);
    setPinDialogError(null);
    setPinDialogSuccess(null);
    try {
      const matchedTargetBeforePin = pinTargets.find(
        (item) => item.dashboard_key === selectedPinTargetKey,
      );
      const existingTargetTitle =
        matchedTargetBeforePin?.dashboard_title || matchedTargetBeforePin?.menu_title || '';
      if (pinTargetTitle.trim() && pinTargetTitle.trim() !== existingTargetTitle) {
        const renameResponse = await fetch(
          `/api/dashboard/custom-db/${selectedPinTargetKey}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: pinTargetTitle.trim() }),
          },
        );
        const renamePayload = await renameResponse.json().catch(() => null);
        if (!renameResponse.ok || !renamePayload?.success) {
          throw new Error(renamePayload?.message || 'Gagal rename dashboard target.');
        }
      }
      const response = await fetch('/api/dashboard/custom-db/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboardKey: selectedPinTargetKey,
          title: pinWidgetTitle.trim(),
          description: `Pinned from Senti AI session${submittedPrompt ? `: ${formatPromptPreview(submittedPrompt, 96)}` : ''}`,
          widgetKind:
            resultView === 'chart' && previewStreamChart ? 'chart' : 'table',
          chartType:
            resultView === 'chart' &&
            activeDashboardBlock &&
            activeDashboardBlock.chartType !== 'table'
              ? activeDashboardBlock.chartType
              : null,
          spanClassName: pinWidgetSpan,
          sqlTemplate: activePinQueryResult.sql,
          outputColumns:
            activePinQueryResult.columns?.map((column) => column.name) ??
            previewStreamTable?.columns ??
            [],
          queryLabel: `${pinWidgetTitle.trim()} Query`,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Gagal pin widget ke dashboard.');
      }
      const matchedTarget = pinTargets.find(
        (item) => item.dashboard_key === selectedPinTargetKey,
      );
      if (pinTargetTitle.trim()) {
        setPinTargets((current) =>
          current.map((item) =>
            item.dashboard_key === selectedPinTargetKey
              ? {
                  ...item,
                  dashboard_title: pinTargetTitle.trim(),
                  menu_title: item.menu_title || pinTargetTitle.trim(),
                }
              : item,
          ),
        );
      }
      setPinDialogSuccess(
        matchedTarget?.route_path
          ? `Widget berhasil di-pin ke ${pinTargetTitle.trim() || matchedTarget.menu_title || matchedTarget.dashboard_title}.`
          : 'Widget berhasil di-pin ke dashboard.',
      );
    } catch (error) {
      setPinDialogError(
        error instanceof Error ? error.message : 'Gagal pin widget ke dashboard.',
      );
    } finally {
      setIsPinningWidget(false);
    }
  };

  const pinDialogProps: PinDialogProps = {
    isPinDialogOpen,
    setIsPinDialogOpen,
    isPinningWidget,
    activePinWidgetTitle,
    pinWidgetTitle,
    setPinWidgetTitle,
    selectedPinTargetKey,
    setSelectedPinTargetKey,
    pinTargets,
    setPinTargetTitle,
    isPinTargetsLoading,
    pinTargetTitle,
    setPinTargetTitleDirect: setPinTargetTitle,
    pinWidgetSpan,
    setPinWidgetSpan,
    pinDialogError,
    pinDialogSuccess,
    setPinDialogError,
    setPinDialogSuccess,
    canPinActiveWidget,
    handlePinActiveWidget,
  };

  return {
    isPinDialogOpen,
    setIsPinDialogOpen,
    pinTargets,
    setPinTargets,
    selectedPinTargetKey,
    setSelectedPinTargetKey,
    isPinTargetsLoading,
    isPinningWidget,
    pinDialogError,
    setPinDialogError,
    pinDialogSuccess,
    setPinDialogSuccess,
    pinWidgetTitle,
    setPinWidgetTitle,
    pinWidgetSpan,
    setPinWidgetSpan,
    pinTargetTitle,
    setPinTargetTitle,
    openPinDialog,
    handlePinActiveWidget,
    pinDialogProps,
  };
}
