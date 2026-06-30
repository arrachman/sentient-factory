'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, RefreshCw, Save, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { cn } from '@/lib/utils';
import {
  fetchRoles,
  menus as menusResource,
  roleMenus as roleMenusResource,
  setRoleMenus,
  type Menu,
  type Role,
  type RoleMenuEntry,
} from '@/lib/api';

interface Perm {
  canView: boolean;
  canEdit: boolean;
}

interface FlatMenu {
  menu: Menu;
  depth: number;
}

/** Order menus into a parent→child tree, flattened with depth for indentation. */
function flattenTree(menus: Menu[]): FlatMenu[] {
  const byParent = new Map<string | null, Menu[]>();
  for (const m of menus) {
    const key = m.parentId ?? null;
    const list = byParent.get(key) ?? [];
    list.push(m);
    byParent.set(key, list);
  }
  for (const list of byParent.values()) list.sort((a, b) => a.sequence - b.sequence);

  const out: FlatMenu[] = [];
  const walk = (parentId: string | null, depth: number) => {
    for (const m of byParent.get(parentId) ?? []) {
      out.push({ menu: m, depth });
      walk(m.id, depth + 1);
    }
  };
  walk(null, 0);
  // Surface any orphans (parent missing/soft-deleted) at root so nothing is lost.
  const seen = new Set(out.map((f) => f.menu.id));
  for (const m of menus) if (!seen.has(m.id)) out.push({ menu: m, depth: 0 });
  return out;
}

export function RoleMenuMatrix() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [roleId, setRoleId] = useState<string>('');
  const [perms, setPerms] = useState<Record<string, Perm>>({});
  const [loading, setLoading] = useState(true);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const flat = useMemo(() => flattenTree(menus), [menus]);

  // Bootstrap: roles + full menu list.
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [rolesRes, menusRes] = await Promise.all([
          fetchRoles(),
          menusResource.list({ limit: 500, sortBy: 'sequence', sortDir: 'asc' }),
        ]);
        if (!alive) return;
        setRoles(rolesRes.data);
        setMenus(menusRes.data);
        if (rolesRes.data.length > 0) setRoleId((prev) => prev || rolesRes.data[0].id);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Gagal memuat data');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Load the selected role's current access whenever the role changes. State is
  // set inside an async IIFE (not synchronously in the effect body) to avoid
  // cascading renders.
  useEffect(() => {
    if (!roleId) return undefined;
    let alive = true;
    (async () => {
      setLoadingPerms(true);
      setError(null);
      setSavedAt(null);
      try {
        const res = await roleMenusResource.list({ roleId, limit: 500 });
        if (!alive) return;
        const next: Record<string, Perm> = {};
        for (const rm of res.data) {
          next[rm.menuId] = { canView: rm.canView, canEdit: rm.canEdit };
        }
        setPerms(next);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Gagal memuat akses');
      } finally {
        if (alive) setLoadingPerms(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [roleId]);

  const setView = (menuId: string, on: boolean) => {
    setPerms((prev) => {
      const cur = prev[menuId] ?? { canView: false, canEdit: false };
      // Unchecking view also drops edit (edit implies view).
      const next: Perm = on ? { ...cur, canView: true } : { canView: false, canEdit: false };
      return { ...prev, [menuId]: next };
    });
  };

  const setEdit = (menuId: string, on: boolean) => {
    setPerms((prev) => {
      const cur = prev[menuId] ?? { canView: false, canEdit: false };
      // Granting edit implies view.
      const next: Perm = on ? { canView: true, canEdit: true } : { ...cur, canEdit: false };
      return { ...prev, [menuId]: next };
    });
  };

  const bulk = (canView: boolean, canEdit: boolean) => {
    const next: Record<string, Perm> = {};
    for (const f of flat) next[f.menu.id] = { canView, canEdit };
    setPerms(next);
  };

  const grantedCount = useMemo(
    () => Object.values(perms).filter((p) => p.canView || p.canEdit).length,
    [perms],
  );

  const save = async () => {
    if (!roleId) return;
    setSaving(true);
    setError(null);
    try {
      const entries: RoleMenuEntry[] = Object.entries(perms)
        .filter(([, p]) => p.canView || p.canEdit)
        .map(([menuId, p]) => ({ menuId, canView: p.canView, canEdit: p.canEdit }));
      await setRoleMenus(roleId, entries);
      setSavedAt(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <RefreshCw className="size-4 animate-spin" /> Memuat role &amp; menu…
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Belum ada role di ERP (adm_roles). Buat role dulu di Senti ERP, lalu petakan menunya di sini.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3 rounded-lg border border-border bg-card p-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="role-select" className="text-xs font-medium text-muted-foreground">
            Role
          </label>
          <select
            id="role-select"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="h-8 min-w-56 rounded-md border border-border bg-background px-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.code})
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => bulk(true, false)} disabled={saving}>
            <Check /> Semua lihat
          </Button>
          <Button variant="outline" size="sm" onClick={() => bulk(false, false)} disabled={saving}>
            Kosongkan
          </Button>
          <Button size="sm" onClick={save} disabled={saving || loadingPerms}>
            <Save /> {saving ? 'Menyimpan…' : 'Simpan'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}
      {savedAt && !error && (
        <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-foreground">
          <ShieldCheck className="size-4 text-primary" /> Akses tersimpan — {grantedCount} menu
          aktif untuk role ini.
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
              <th className="px-4 py-2 font-medium">Menu</th>
              <th className="px-4 py-2 font-medium">Kode</th>
              <th className="w-24 px-4 py-2 text-center font-medium">Lihat</th>
              <th className="w-24 px-4 py-2 text-center font-medium">Edit</th>
            </tr>
          </thead>
          <tbody className={cn(loadingPerms && 'opacity-50')}>
            {flat.map(({ menu, depth }) => {
              const p = perms[menu.id] ?? { canView: false, canEdit: false };
              return (
                <tr key={menu.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-2 text-foreground">
                    <span style={{ paddingLeft: `${depth * 16}px` }} className="inline-block">
                      {depth > 0 && <span className="mr-1 text-muted-foreground">└</span>}
                      {menu.name}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <code className="font-mono text-[11px] text-muted-foreground">{menu.code}</code>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={p.canView}
                      onChange={(e) => setView(menu.id, e.target.checked)}
                      aria-label={`Lihat ${menu.name}`}
                      className="size-4 accent-primary"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={p.canEdit}
                      onChange={(e) => setEdit(menu.id, e.target.checked)}
                      aria-label={`Edit ${menu.name}`}
                      className="size-4 accent-primary"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Centang <strong>Lihat</strong> agar menu muncul di sidebar role ini; <strong>Edit</strong>{' '}
        memberi izin ubah (otomatis menyertakan Lihat). Role tanpa pemetaan apa pun melihat seluruh
        menu (fallback). Identitas &amp; role dikelola di Senti ERP.
      </p>
    </div>
  );
}
