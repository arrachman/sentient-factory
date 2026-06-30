'use client';

import { RoleMenuMatrix } from '@/components/organisms/role-menu-matrix';

export function RoleMenusPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-foreground">Akses Menu per Role</h1>
        <p className="text-sm text-muted-foreground">
          mdp · peta akses (mdp_role_menus) — tentukan menu mana yang terlihat &amp; dapat diubah
          tiap role ERP. Identitas &amp; daftar role tetap dikelola di Senti ERP.
        </p>
      </div>
      <RoleMenuMatrix />
    </div>
  );
}
