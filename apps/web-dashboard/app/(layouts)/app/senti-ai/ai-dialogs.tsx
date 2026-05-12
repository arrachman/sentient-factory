'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DashboardPinTarget, HistorySessionItem } from './_types';
import { formatPromptPreview } from './_utils-format';

// ---------- Rename Dialog ----------

export interface RenameDialogProps {
  historySessionPendingRename: HistorySessionItem | null;
  historySessionRenameTitle: string;
  setHistorySessionRenameTitle: React.Dispatch<React.SetStateAction<string>>;
  isRenamingHistorySession: boolean;
  handleRenameHistorySession: (session: HistorySessionItem) => Promise<void>;
  cancelRenameHistorySession: () => void;
}

export function RenameDialog({
  historySessionPendingRename,
  historySessionRenameTitle,
  setHistorySessionRenameTitle,
  isRenamingHistorySession,
  handleRenameHistorySession,
  cancelRenameHistorySession,
}: RenameDialogProps) {
  return (
    <Dialog
      open={Boolean(historySessionPendingRename)}
      onOpenChange={(open) => {
        if (!open && !isRenamingHistorySession) {
          cancelRenameHistorySession();
        }
      }}
    >
      <DialogContent className="max-w-md rounded-xl border-0 p-0 shadow-[0px_0px_30px_0px_rgba(76,87,125,0.18)]">
        <DialogHeader className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <DialogTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Rename Session
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4 px-5 py-4">
          <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Ubah nama session untuk memudahkan pencarian dan pengelompokan prompt.
          </div>
          <input
            value={historySessionRenameTitle}
            onChange={(event) => setHistorySessionRenameTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && historySessionPendingRename) {
                event.preventDefault();
                void handleRenameHistorySession(historySessionPendingRename);
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                cancelRenameHistorySession();
              }
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#009EF7] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Session name"
            autoFocus
          />
        </DialogBody>
        <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={cancelRenameHistorySession}
            disabled={isRenamingHistorySession}
            className="rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={() =>
              historySessionPendingRename
                ? void handleRenameHistorySession(historySessionPendingRename)
                : undefined
            }
            disabled={!historySessionPendingRename || !historySessionRenameTitle.trim() || isRenamingHistorySession}
            className="rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            {isRenamingHistorySession ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Delete Dialog ----------

export interface DeleteDialogProps {
  historySessionPendingDelete: HistorySessionItem | null;
  setHistorySessionPendingDelete: React.Dispatch<React.SetStateAction<HistorySessionItem | null>>;
  deletingHistorySessionId: string | null;
  handleDeleteHistorySession: (sessionId: string) => Promise<void>;
}

export function DeleteDialog({
  historySessionPendingDelete,
  setHistorySessionPendingDelete,
  deletingHistorySessionId,
  handleDeleteHistorySession,
}: DeleteDialogProps) {
  return (
    <Dialog
      open={Boolean(historySessionPendingDelete)}
      onOpenChange={(open) => {
        if (!open && !deletingHistorySessionId) {
          setHistorySessionPendingDelete(null);
        }
      }}
    >
      <DialogContent className="max-w-md rounded-xl border-0 p-0 shadow-[0px_0px_30px_0px_rgba(76,87,125,0.18)]">
        <DialogHeader className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <DialogTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Hapus Session
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="px-5 py-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {historySessionPendingDelete ? (
            <>
              Session <span className="font-semibold text-slate-900 dark:text-slate-100">{formatPromptPreview(historySessionPendingDelete.title || historySessionPendingDelete.session_key, 56)}</span> akan dihapus dari history.
              Tindakan ini juga menghapus semua prompt di dalam session tersebut.
            </>
          ) : null}
        </DialogBody>
        <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setHistorySessionPendingDelete(null)}
            disabled={Boolean(deletingHistorySessionId)}
            className="rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={() =>
              historySessionPendingDelete
                ? void handleDeleteHistorySession(historySessionPendingDelete.id)
                : undefined
            }
            disabled={!historySessionPendingDelete || Boolean(deletingHistorySessionId)}
            className="rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Pin Dialog ----------

export interface PinDialogProps {
  isPinDialogOpen: boolean;
  setIsPinDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPinningWidget: boolean;
  activePinWidgetTitle: string;
  pinWidgetTitle: string;
  setPinWidgetTitle: React.Dispatch<React.SetStateAction<string>>;
  selectedPinTargetKey: string;
  setSelectedPinTargetKey: React.Dispatch<React.SetStateAction<string>>;
  pinTargets: DashboardPinTarget[];
  setPinTargetTitle: React.Dispatch<React.SetStateAction<string>>;
  isPinTargetsLoading: boolean;
  pinTargetTitle: string;
  setPinTargetTitleDirect: React.Dispatch<React.SetStateAction<string>>;
  pinWidgetSpan: string;
  setPinWidgetSpan: React.Dispatch<React.SetStateAction<string>>;
  pinDialogError: string | null;
  pinDialogSuccess: string | null;
  setPinDialogError: React.Dispatch<React.SetStateAction<string | null>>;
  setPinDialogSuccess: React.Dispatch<React.SetStateAction<string | null>>;
  canPinActiveWidget: boolean;
  handlePinActiveWidget: () => Promise<void>;
}

export function PinDialog({
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
  setPinTargetTitleDirect,
  pinWidgetSpan,
  setPinWidgetSpan,
  pinDialogError,
  pinDialogSuccess,
  setPinDialogError,
  setPinDialogSuccess,
  canPinActiveWidget,
  handlePinActiveWidget,
}: PinDialogProps) {
  return (
    <Dialog
      open={isPinDialogOpen}
      onOpenChange={(open) => {
        if (!isPinningWidget) {
          setIsPinDialogOpen(open);
          if (!open) {
            setPinDialogError(null);
            setPinDialogSuccess(null);
          }
        }
      }}
    >
      <DialogContent className="max-w-lg rounded-xl border-0 p-0 shadow-[0px_0px_30px_0px_rgba(76,87,125,0.18)]">
        <DialogHeader className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <DialogTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Pin Widget Ke Dashboard
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4 px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Widget
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              {activePinWidgetTitle}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Judul Widget
            </div>
            <input
              value={pinWidgetTitle}
              onChange={(event) => setPinWidgetTitle(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-[#009EF7] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              placeholder="Masukkan judul widget"
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Target Menu Dashboard
            </div>
            <Select
              value={selectedPinTargetKey}
              onValueChange={(value) => {
                setSelectedPinTargetKey(value);
                const matched = pinTargets.find((item) => item.dashboard_key === value);
                setPinTargetTitle(matched?.menu_title || matched?.dashboard_title || '');
              }}
              disabled={isPinTargetsLoading}
            >
              <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950">
                <SelectValue placeholder={isPinTargetsLoading ? 'Memuat menu dashboard...' : 'Pilih target menu'} />
              </SelectTrigger>
              <SelectContent>
                {pinTargets.map((target) => (
                  <SelectItem key={target.dashboard_key} value={target.dashboard_key}>
                    {target.menu_title || target.dashboard_title} {target.route_path ? `(${target.route_path})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Nama Dashboard Target
            </div>
            <input
              value={pinTargetTitle}
              onChange={(event) => setPinTargetTitleDirect(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-[#009EF7] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              placeholder="Masukkan nama dashboard target"
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Layout Widget
            </div>
            <Select value={pinWidgetSpan} onValueChange={setPinWidgetSpan}>
              <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lg:col-span-4">Small</SelectItem>
                <SelectItem value="lg:col-span-6">Medium</SelectItem>
                <SelectItem value="lg:col-span-8">Large</SelectItem>
                <SelectItem value="lg:col-span-12">Full Width</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {pinDialogError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
              {pinDialogError}
            </div>
          ) : null}
          {pinDialogSuccess ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
              {pinDialogSuccess}
            </div>
          ) : null}
        </DialogBody>
        <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsPinDialogOpen(false)}
            disabled={isPinningWidget}
            className="rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={() => void handlePinActiveWidget()}
            disabled={!canPinActiveWidget || !selectedPinTargetKey || isPinningWidget}
            className="rounded-lg bg-[#009EF7] text-white hover:bg-[#07a5ff] disabled:opacity-50"
          >
            {isPinningWidget ? 'Menyimpan...' : 'Pin Widget'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
