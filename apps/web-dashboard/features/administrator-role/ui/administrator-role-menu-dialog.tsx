import { Check, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { MenuOptionItem } from '@/features/administrator-role/model/types';
import { pickEntityId } from '@/features/administrator-role/model/utils';

type AdministratorRoleMenuDialogProps = {
  open: boolean;
  roleName: string;
  menus: MenuOptionItem[];
  selectedMenuIds: number[];
  loading: boolean;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleMenu: (menuId: number) => void;
  onToggleMenusBulk: (menuIds: number[], checked: boolean) => void;
  onSave: () => void;
};

export function AdministratorRoleMenuDialog({
  open,
  roleName,
  menus,
  selectedMenuIds,
  loading,
  submitting,
  onOpenChange,
  onToggleMenu,
  onToggleMenusBulk,
  onSave,
}: AdministratorRoleMenuDialogProps) {
  const [search, setSearch] = useState('');

  const filteredMenus = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return menus;
    }
    return menus.filter((menu) =>
      [menu.title, menu.key, menu.path ?? '', menu.parentTitle ?? '', menu.type ?? '']
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [menus, search]);

  const groupedMenus = useMemo(() => {
    const groups = new Map<
      string,
      {
        label: string;
        items: MenuOptionItem[];
      }
    >();

    for (const menu of filteredMenus) {
      const label = menu.parentTitle || 'Root';
      const key = menu.parentTitle || '__root__';
      const existing = groups.get(key);
      if (existing) {
        existing.items.push(menu);
      } else {
        groups.set(key, { label, items: [menu] });
      }
    }

    return Array.from(groups.values()).map((group) => ({
      ...group,
      items: group.items.sort((a, b) => {
        const aTitle = String(a.title ?? '');
        const bTitle = String(b.title ?? '');
        return aTitle.localeCompare(bTitle);
      }),
    }));
  }, [filteredMenus]);

  const visibleMenuIds = useMemo(
    () =>
      filteredMenus
        .map((item) => Number(pickEntityId(item)))
        .filter((value) => Number.isInteger(value) && value > 0),
    [filteredMenus],
  );
  const visibleSelectedCount = useMemo(
    () => visibleMenuIds.filter((id) => selectedMenuIds.includes(id)).length,
    [visibleMenuIds, selectedMenuIds],
  );
  const allVisibleChecked = visibleMenuIds.length > 0 && visibleSelectedCount === visibleMenuIds.length;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !submitting) {
          onOpenChange(false);
        }
      }}
    >
      <DialogContent className="max-w-[860px] p-0">
        <DialogHeader className="border-b px-5 pt-5 pb-4">
          <DialogTitle>Assign Menus: {roleName || '-'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-5 pb-5">
          <div className="relative">
            <Input
              placeholder="Search menu title/key/path..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9 pr-9"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            {search ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onToggleMenusBulk(visibleMenuIds, !allVisibleChecked)}
                disabled={visibleMenuIds.length === 0}
              >
                {allVisibleChecked ? 'Uncheck All Visible' : 'Check All Visible'}
              </Button>
              <span className="text-xs text-muted-foreground">
                {filteredMenus.length} menu{filteredMenus.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading role menus...</p>
          ) : menus.length === 0 ? (
            <p className="text-sm text-muted-foreground">No menu master data found.</p>
          ) : filteredMenus.length === 0 ? (
            <p className="text-sm text-muted-foreground">No menu matches your search.</p>
          ) : (
            <div className="max-h-[420px] space-y-4 overflow-auto rounded-md border p-4">
              {groupedMenus.map((group) => {
                const groupIds = group.items
                  .map((item) => Number(pickEntityId(item)))
                  .filter((value) => Number.isInteger(value) && value > 0);
                const selectedCount = groupIds.filter((id) => selectedMenuIds.includes(id)).length;
                const allChecked = groupIds.length > 0 && selectedCount === groupIds.length;

                return (
                  <div key={group.label} className="rounded-md border">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{group.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedCount}/{groupIds.length} selected
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleMenusBulk(groupIds, !allChecked)}
                        disabled={groupIds.length === 0}
                      >
                        {allChecked ? 'Uncheck All' : 'Check All'}
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[70px]">Use</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Path</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Key</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.items.map((menu) => {
                          const menuId = Number(pickEntityId(menu));
                          const checked = selectedMenuIds.includes(menuId);
                          return (
                            <TableRow key={menuId || menu.key}>
                              <TableCell>
                                <button
                                  type="button"
                                  className={`inline-flex size-7 items-center justify-center rounded border ${
                                    checked ? 'bg-primary text-primary-foreground' : 'bg-background'
                                  }`}
                                  onClick={() => {
                                    if (Number.isInteger(menuId) && menuId > 0) {
                                      onToggleMenu(menuId);
                                    }
                                  }}
                                >
                                  {checked ? <Check className="size-4" /> : null}
                                </button>
                              </TableCell>
                              <TableCell className="font-medium">{menu.title}</TableCell>
                              <TableCell>{menu.path || '-'}</TableCell>
                              <TableCell>{menu.type || '-'}</TableCell>
                              <TableCell>{menu.key}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>
          )}

          <DialogFooter className="pt-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="button" onClick={onSave} disabled={submitting || loading}>
              {submitting ? 'Saving...' : 'Save Assignments'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
