import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type SidebarMenuItem = {
  id: string;
  key: string;
  title: string;
  path: string | null;
  icon: string | null;
  type: string;
  parentId: string | null;
  sortOrder: number;
  children: SidebarMenuItem[];
};

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  async getSidebarByUserId(userId: string): Promise<SidebarMenuItem[]> {
    if (!userId) {
      return [];
    }
    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId,
        deletedAt: null,
        role: {
          deletedAt: null,
        },
      },
      select: {
        roleId: true,
      },
    });

    const roleIds = userRoles.map((item: { roleId: string }) => item.roleId);
    if (roleIds.length === 0) {
      return [];
    }

    const roleMenus = await this.prisma.roleMenu.findMany({
      where: {
        roleId: { in: roleIds },
        canView: true,
        deletedAt: null,
        menu: {
          deletedAt: null,
          isActive: true,
          isVisible: true,
        },
      },
      select: {
        menu: {
          select: {
            uuid: true,
            key: true,
            title: true,
            path: true,
            icon: true,
            type: true,
            parentId: true,
            sortOrder: true,
          },
        },
      },
      orderBy: {
        menu: {
          sortOrder: 'asc',
        },
      },
    });

    const dedupedMap = new Map<string, SidebarMenuItem>();
    for (const row of roleMenus) {
      const menu = row.menu;
      if (!dedupedMap.has(menu.uuid)) {
        dedupedMap.set(menu.uuid, {
          id: menu.uuid,
          key: menu.key,
          title: menu.title,
          path: menu.path,
          icon: menu.icon,
          type: menu.type,
          parentId: menu.parentId,
          sortOrder: menu.sortOrder,
          children: [],
        });
      }
    }

    const items = Array.from(dedupedMap.values());
    const byId = new Map(items.map((item) => [item.id, item]));
    const roots: SidebarMenuItem[] = [];

    for (const item of items) {
      if (item.parentId && byId.has(item.parentId)) {
        byId.get(item.parentId)!.children.push(item);
      } else {
        roots.push(item);
      }
    }

    const sortRecursively = (list: SidebarMenuItem[]) => {
      list.sort((a, b) => a.sortOrder - b.sortOrder);
      for (const entry of list) {
        sortRecursively(entry.children);
      }
    };

    sortRecursively(roots);
    return roots;
  }
}
