// hr-sys-menus — menu sidebar HR (mirror ERP erp-sys-menus, raw-SQL atas hr_*).
// Live hr_* tables are NOT Prisma-managed → query via $queryRaw (like
// hr-attendance-helpers). IDs cast to text so they serialise as strings (FE
// contract: IDs are strings) and tree comparison works on strings.
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { resolveHrPrivilege } from '../hr-attendance/hr-attendance-helpers';

export type HrMenuType = 'MODULE' | 'GROUP' | 'ITEM';

export interface HrMenuRow {
  id: string;
  code: string;
  title: string;
  path: string | null;
  icon: string | null;
  type: HrMenuType;
  parent_id: string | null;
  sort_order: number;
}

export type HrMenuNode = HrMenuRow & { children: HrMenuNode[] };

function buildTree(items: HrMenuRow[], parentId: string | null = null): HrMenuNode[] {
  return items
    .filter((item) => item.parent_id === parentId)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({ ...item, children: buildTree(items, item.id) }));
}

/**
 * Remove ITEM nodes not in allowedIds; drop GROUP that become empty.
 * MODULE selalu dipertahankan (stub kosong = placeholder di sidebar) — persis
 * perilaku ERP pruneTree.
 */
function pruneTree(nodes: HrMenuNode[], allowedIds: Set<string> | null): HrMenuNode[] {
  return nodes.flatMap((node) => {
    if (node.type === 'ITEM') {
      return allowedIds === null || allowedIds.has(node.id) ? [node] : [];
    }
    const prunedChildren = pruneTree(node.children, allowedIds);
    if (node.type === 'MODULE') {
      return [{ ...node, children: prunedChildren }];
    }
    return prunedChildren.length > 0 ? [{ ...node, children: prunedChildren }] : [];
  });
}

@Injectable()
export class HrSysMenusService {
  constructor(private prisma: PrismaService) {}

  /**
   * Menu tree untuk user saat ini:
   * - privileged (platform admin/manager ATAU HR_ADMIN/HR_MANAGER via
   *   resolveHrPrivilege) → semua menu aktif (tanpa filter)
   * - lainnya → hanya ITEM yang role-nya punya can_view=true; MODULE/GROUP
   *   container ikut otomatis bila punya child visible.
   */
  async getMyMenus(authUser: { id: number; roles?: string[] }) {
    let allowedIds: Set<string> | null = null; // null = no filter

    const privileged = await resolveHrPrivilege(this.prisma, authUser);
    if (!privileged) {
      const granted = await this.prisma.$queryRaw<Array<{ menu_id: string }>>(Prisma.sql`
        SELECT rm.menu_id::text AS menu_id
        FROM public.hr_role_menus rm
        JOIN public.hr_user_roles ur ON ur.role_id = rm.role_id AND ur.deleted_at IS NULL
        JOIN public.hr_users hu ON hu.id = ur.user_id AND hu.deleted_at IS NULL
        WHERE hu.user_id = ${authUser.id} AND rm.can_view AND rm.deleted_at IS NULL
      `);
      allowedIds = new Set(granted.map((row) => row.menu_id));
    }

    const all = await this.prisma.$queryRaw<HrMenuRow[]>(Prisma.sql`
      SELECT id::text, code, title, path, icon, type, parent_id::text, sort_order
      FROM public.hr_menus
      WHERE deleted_at IS NULL AND is_active
      ORDER BY sort_order ASC, title ASC
    `);

    return { success: true, data: pruneTree(buildTree(all), allowedIds) };
  }
}
