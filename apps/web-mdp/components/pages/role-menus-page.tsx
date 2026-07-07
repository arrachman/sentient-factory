'use client';

import { RoleMenuMatrix } from '@/components/organisms/role-menu-matrix';

export function RoleMenusPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          Akses Menu per Role
          <span className="code-tag">MDP</span>
        </h1>
      </div>
      <div className="page-body overflow-auto p-4">
        <p className="mb-4 text-sm text-muted-foreground">
          mdp · peta akses (mdp_role_menus) — tentukan menu mana yang terlihat &amp; dapat diubah
          tiap role ERP. Identitas &amp; daftar role tetap dikelola di Senti ERP.
        </p>
        <RoleMenuMatrix />
      </div>
    </div>
  );
}
