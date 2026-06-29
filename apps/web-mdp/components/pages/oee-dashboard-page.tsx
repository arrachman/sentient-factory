'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { cn } from '@/lib/utils';
import {
  fetchOee,
  type OeeReport,
  type OeeWorkCenterRow,
  api,
  type WorkCenter,
} from '@/lib/api';

const pct = (v: number | null): string => (v == null ? '—' : `${(v * 100).toFixed(1)}%`);
const hours = (sec: number): string => `${(sec / 3600).toFixed(1)} j`;

/** Color a ratio by the classic OEE world-class thresholds. */
function ratioTone(v: number | null): string {
  if (v == null) return 'text-muted-foreground';
  if (v >= 0.85) return 'text-success';
  if (v >= 0.6) return 'text-warn';
  return 'text-danger';
}

function toDateInput(iso: string): string {
  return iso.slice(0, 10);
}

function defaultRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to.getTime() - 30 * 86_400_000);
  return { from: toDateInput(from.toISOString()), to: toDateInput(to.toISOString()) };
}

export function OeeDashboardPage() {
  const init = defaultRange();
  const [from, setFrom] = useState(init.from);
  const [to, setTo] = useState(init.to);
  const [workCenterId, setWorkCenterId] = useState('');
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [report, setReport] = useState<OeeReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchOee({
        from: new Date(`${from}T00:00:00`).toISOString(),
        to: new Date(`${to}T23:59:59`).toISOString(),
        workCenterId: workCenterId || undefined,
      });
      setReport(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat OEE');
    } finally {
      setLoading(false);
    }
  }, [from, to, workCenterId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    api
      .listWorkCenters()
      .then((r) => setWorkCenters(r.data))
      .catch(() => setWorkCenters([]));
  }, []);

  const s = report?.summary;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">OEE Overlay</h1>
          <p className="text-sm text-muted-foreground">
            Overall Equipment Effectiveness = Ketersediaan × Performa × Kualitas. Metrik turunan
            dari MES (downtime/log) + kalender kerja + QMS — bukan modul, tanpa tabel sendiri.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={cn('size-4', loading && 'animate-spin')} /> Refresh
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-card p-3">
        <Field label="Dari">
          <input type="date" className={inputCls} value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field label="Sampai">
          <input type="date" className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} />
        </Field>
        <Field label="Work Center">
          <select className={inputCls} value={workCenterId} onChange={(e) => setWorkCenterId(e.target.value)}>
            <option value="">Semua</option>
            {workCenters.map((wc) => (
              <option key={wc.id} value={wc.id}>
                {wc.code} · {wc.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="OEE" value={pct(s?.oee ?? null)} tone={ratioTone(s?.oee ?? null)} big />
        <Kpi label="Ketersediaan" value={pct(s?.availability ?? null)} tone={ratioTone(s?.availability ?? null)} />
        <Kpi label="Performa" value={pct(s?.performance ?? null)} tone={ratioTone(s?.performance ?? null)} />
        <Kpi label="Kualitas" value={pct(s?.quality ?? null)} tone={ratioTone(s?.quality ?? null)} />
      </div>

      {error && (
        <p className="rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/60 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Work Center</th>
              <th className="px-3 py-2 text-right font-medium">Planned</th>
              <th className="px-3 py-2 text-right font-medium">Downtime</th>
              <th className="px-3 py-2 text-right font-medium">Good / Total</th>
              <th className="px-3 py-2 text-right font-medium">A</th>
              <th className="px-3 py-2 text-right font-medium">P</th>
              <th className="px-3 py-2 text-right font-medium">Q</th>
              <th className="px-3 py-2 text-right font-medium">OEE</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">Memuat…</td></tr>
            )}
            {!loading && report && report.workCenters.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">Tidak ada work center aktif</td></tr>
            )}
            {!loading && report?.workCenters.map((r) => <Row key={r.workCenter.id} r={r} />)}
          </tbody>
        </table>
      </div>

      {report && (
        <p className="text-xs text-muted-foreground">
          Jendela {toDateInput(report.window.from)} → {toDateInput(report.window.to)} ·{' '}
          {s?.workCenterCount ?? 0} work center · {s?.ncrCount ?? 0} NCR. Sel kosong (—) = data
          belum cukup: kalender kerja (planned time) atau ideal cycle time work center belum diisi.
        </p>
      )}
    </div>
  );
}

function Row({ r }: { r: OeeWorkCenterRow }) {
  return (
    <tr className="border-t border-border hover:bg-muted/40">
      <td className="px-3 py-2">
        <div className="font-medium text-foreground">{r.workCenter.code}</div>
        <div className="text-xs text-muted-foreground">{r.workCenter.name}</div>
        {(r.flags.missingCalendar || r.flags.missingIdealCycle) && (
          <div className="mt-0.5 text-[10px] text-warn">
            {r.flags.missingCalendar && 'kalender? '}
            {r.flags.missingIdealCycle && 'ideal cycle?'}
          </div>
        )}
      </td>
      <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{hours(r.plannedSeconds)}</td>
      <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{hours(r.downtimeSeconds)}</td>
      <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
        {r.goodCount} / {r.totalCount}
      </td>
      <td className={cn('px-3 py-2 text-right tabular-nums', ratioTone(r.availability))}>{pct(r.availability)}</td>
      <td className={cn('px-3 py-2 text-right tabular-nums', ratioTone(r.performance))}>{pct(r.performance)}</td>
      <td className={cn('px-3 py-2 text-right tabular-nums', ratioTone(r.quality))}>{pct(r.quality)}</td>
      <td className={cn('px-3 py-2 text-right font-semibold tabular-nums', ratioTone(r.oee))}>{pct(r.oee)}</td>
    </tr>
  );
}

function Kpi({ label, value, tone, big }: { label: string; value: string; tone: string; big?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className={cn('font-semibold tabular-nums', tone, big ? 'text-3xl' : 'text-2xl')}>{value}</span>
    </div>
  );
}

const inputCls =
  'h-8 w-full rounded-md border border-input bg-card px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
