'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { listWorksites } from '@/lib/api/worksites';
import type { HrWorksite } from '@/lib/api/worksites';
import { getUserWorksites, updateUserWorksites } from '@/lib/api/employees';
import { asArray } from '@/lib/api/hooks';

function extractAssignedIds(payload: unknown): number[] {
  const raw = (payload as { data?: unknown })?.data ?? payload;
  if (!raw || typeof raw !== 'object') return [];
  const o = raw as Record<string, unknown>;
  if (Array.isArray(o.worksiteIds)) return (o.worksiteIds as unknown[]).map(Number);
  if (Array.isArray(o.worksites)) {
    return (o.worksites as Record<string, unknown>[]).map((w) => Number(w.id ?? w.worksiteId));
  }
  return [];
}

export function WorksiteAssignDialog({
  open,
  onOpenChange,
  appUserId,
  employeeName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appUserId: string | null;
  employeeName?: string;
}) {
  const [selectedOverride, setSelectedOverride] = useState<Set<number> | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: worksitesData } = useQuery({
    queryKey: ['hr', 'worksites', 'all-for-assign'],
    queryFn: () => listWorksites(),
    enabled: open,
  });
  const worksites = asArray<HrWorksite>(worksitesData);

  const { data: userWs, isLoading } = useQuery({
    queryKey: ['hr', 'user-worksites', appUserId],
    queryFn: () => getUserWorksites(appUserId as string),
    enabled: open && Boolean(appUserId),
  });
  const baseSelected = useMemo(() => new Set(extractAssignedIds(userWs)), [userWs]);
  const selected = selectedOverride ?? baseSelected;

  function toggle(id: number) {
    setSelectedOverride((prev) => {
      const source = prev ?? selected;
      const next = new Set(source);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSelectedOverride(null);
    }
    onOpenChange(nextOpen);
  }

  async function save() {
    if (!appUserId) return;
    setSaving(true);
    try {
      await updateUserWorksites(appUserId, { worksiteIds: Array.from(selected) });
      toast.success('Penugasan worksite disimpan.');
      handleOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Worksite — {employeeName ?? 'Karyawan'}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : worksites.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Belum ada worksite.</p>
          ) : (
            <ul className="max-h-72 space-y-1 overflow-auto">
              {worksites.map((w) => (
                <li key={String(w.id)}>
                  <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted">
                    <input
                      type="checkbox"
                      checked={selected.has(Number(w.id))}
                      onChange={() => toggle(Number(w.id))}
                    />
                    <span className="text-sm">{w.name}</span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">{w.code}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="default" onClick={() => handleOpenChange(false)} disabled={saving}>
              Batal
            </Button>
            <Button variant="primary" onClick={save} disabled={saving}>
              {saving ? 'Menyimpan…' : 'Simpan'}
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
