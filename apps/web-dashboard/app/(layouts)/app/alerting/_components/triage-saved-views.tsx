'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { AlertTriageSavedViewRecord } from './types';

export function TriageSavedViews({
  savedViews,
  editingSavedViewId,
  setEditingSavedViewId,
  savedViewName,
  setSavedViewName,
  savedViewShared,
  setSavedViewShared,
  savedViewDefault,
  setSavedViewDefault,
  viewActionLoadingId,
  applySavedView,
  toggleSavedViewState,
  deleteSavedView,
  persistSavedView,
  resetSavedViewEditor,
}: {
  savedViews: AlertTriageSavedViewRecord[];
  editingSavedViewId: number | null;
  setEditingSavedViewId: (id: number | null) => void;
  savedViewName: string;
  setSavedViewName: (value: string) => void;
  savedViewShared: boolean;
  setSavedViewShared: (value: boolean) => void;
  savedViewDefault: boolean;
  setSavedViewDefault: (value: boolean) => void;
  viewActionLoadingId: number | null;
  applySavedView: (view: AlertTriageSavedViewRecord) => void;
  toggleSavedViewState: (id: number, active: boolean) => Promise<void>;
  deleteSavedView: (id: number) => Promise<void>;
  persistSavedView: () => Promise<void>;
  resetSavedViewEditor: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Views</CardTitle>
        <CardDescription>Persist reusable triage filter presets for your operational queue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 xl:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-3">
            {savedViews.length ? savedViews.map((view) => (
              <div key={view.view_id} className="rounded-xl border px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{view.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {view.is_shared ? 'Shared' : 'Private'}
                      {view.is_default ? ' · Default' : ''}
                      {view.owner_actor ? ` · ${view.owner_actor}` : ' · System'}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => applySavedView(view)}>Apply</Button>
                    {view.is_owned_by_current_user ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={viewActionLoadingId === view.view_id}
                          onClick={() => {
                            setEditingSavedViewId(view.view_id);
                            setSavedViewName(view.name);
                            setSavedViewShared(view.is_shared);
                            setSavedViewDefault(view.is_default);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={viewActionLoadingId === view.view_id}
                          onClick={() => void toggleSavedViewState(view.view_id, !view.is_active)}
                        >
                          {view.is_active ? 'Deactivate' : 'Reactivate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={viewActionLoadingId === view.view_id}
                          onClick={() => void deleteSavedView(view.view_id)}
                        >
                          Delete
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Sort: {view.sort_by} / {view.sort_order} · Filters: {Object.entries(view.filters_json || {}).filter(([, value]) => String(value || '').trim() && String(value) !== 'all').map(([key, value]) => `${key}=${String(value)}`).join(', ') || 'none'}
                </div>
              </div>
            )) : (
              <div className="rounded-xl border border-dashed px-4 py-4 text-sm text-muted-foreground">
                No saved triage views yet.
              </div>
            )}
          </div>
          <div className="space-y-3 rounded-xl border px-4 py-4">
            <div className="font-medium">{editingSavedViewId ? 'Edit Saved View' : 'Save Current Filters'}</div>
            <Input value={savedViewName} onChange={(event) => setSavedViewName(event.currentTarget.value)} placeholder="Critical finance queue" />
            <div className="flex items-center justify-between rounded-xl border px-3 py-2">
              <span className="text-sm">Shared with other operators</span>
              <Switch checked={savedViewShared} onCheckedChange={setSavedViewShared} />
            </div>
            <div className="flex items-center justify-between rounded-xl border px-3 py-2">
              <span className="text-sm">Set as my default view</span>
              <Switch checked={savedViewDefault} onCheckedChange={setSavedViewDefault} />
            </div>
            <div className="text-xs text-muted-foreground">
              Current preset captures triage status, ack state, SLA state, module, stage, search, and sort order.
            </div>
            <div className="flex gap-2">
              <Button onClick={() => void persistSavedView()} disabled={viewActionLoadingId !== null}>
                {editingSavedViewId ? 'Update View' : 'Save View'}
              </Button>
              {editingSavedViewId ? (
                <Button variant="outline" onClick={resetSavedViewEditor} disabled={viewActionLoadingId !== null}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
