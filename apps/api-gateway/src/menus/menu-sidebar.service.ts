import { Injectable } from '@nestjs/common';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { buildMenuTree, SidebarMenuItem } from './menu-tree.utils';

@Injectable()
export class MenuSidebarService {
  constructor(private prisma: PrismaService) {}

  async getSidebarByUserId(userId: number | string): Promise<SidebarMenuItem[]> {
    if (!userId) {
      return [];
    }
    const normalizedUserId = typeof userId === 'number' ? userId : Number(userId);
    if (!Number.isInteger(normalizedUserId)) {
      return [];
    }
    await this.ensureAdministratorRoleMenu();

    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId: normalizedUserId,
        deletedAt: null,
        role: {
          deletedAt: null,
        },
      },
      select: {
        roleId: true,
      },
    });

    const roleIds = userRoles.map((item) => item.roleId);
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
      include: {
        menu: {
          select: {
            id: true,
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

    const menuRows = roleMenus.map((row) => row.menu);
    return buildMenuTree(menuRows);
  }

  async assignMenuToAdminRole(menuId: number, actorId?: string | number) {
    const adminRole = await this.prisma.role.findFirst({
      where: { name: 'admin', deletedAt: null },
      select: { id: true },
    });
    if (!adminRole) {
      return;
    }

    const existingRoleMenu = await this.prisma.roleMenu.findFirst({
      where: { roleId: adminRole.id, menuId },
      select: { id: true, deletedAt: true },
    });

    const actor = this.toActor(actorId);

    if (!existingRoleMenu) {
      await this.prisma.roleMenu.create({
        data: {
          roleId: adminRole.id,
          menuId,
          canView: true,
          createdBy: actor,
          updatedBy: actor,
        },
      });
      return;
    }

    if (existingRoleMenu.deletedAt) {
      await this.prisma.roleMenu.update({
        where: { id: existingRoleMenu.id },
        data: {
          canView: true,
          deletedAt: null,
          deletedBy: null,
          updatedBy: actor,
        },
      });
      return;
    }

    await this.prisma.roleMenu.update({
      where: { id: existingRoleMenu.id },
      data: {
        canView: true,
        updatedBy: actor,
      },
    });
  }

  private async ensureAdministratorRoleMenu() {
    const administratorParent = await this.prisma.menu.upsert({
      where: { key: 'administrator' },
      update: {
        title: 'Administrator',
        path: null,
        icon: 'ShieldUser',
        type: 'COLLAPSE',
        parentId: null,
        isVisible: true,
        isActive: true,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        key: 'administrator',
        title: 'Administrator',
        path: null,
        icon: 'ShieldUser',
        type: 'COLLAPSE',
        parentId: null,
        sortOrder: 50,
        isVisible: true,
        isActive: true,
      },
      select: { id: true },
    });

    const roleMenu = await this.prisma.menu.upsert({
      where: { key: 'administrator-role' },
      update: {
        title: 'Role',
        path: '/app/administrator/role',
        icon: 'ShieldCheck',
        type: 'ITEM',
        parentId: administratorParent.id,
        sortOrder: 34,
        isVisible: true,
        isActive: true,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        key: 'administrator-role',
        title: 'Role',
        path: '/app/administrator/role',
        icon: 'ShieldCheck',
        type: 'ITEM',
        parentId: administratorParent.id,
        sortOrder: 34,
        isVisible: true,
        isActive: true,
      },
      select: { id: true },
    });

    const adminRole = await this.prisma.role.findFirst({
      where: { name: 'admin', deletedAt: null },
      select: { id: true },
    });
    if (!adminRole) {
      return;
    }

    const existingRoleMenu = await this.prisma.roleMenu.findFirst({
      where: { roleId: adminRole.id, menuId: roleMenu.id },
      select: { id: true, deletedAt: true },
    });

    if (!existingRoleMenu) {
      await this.prisma.roleMenu.create({
        data: {
          roleId: adminRole.id,
          menuId: roleMenu.id,
          canView: true,
        },
      });
      return;
    }

    if (existingRoleMenu.deletedAt) {
      await this.prisma.roleMenu.update({
        where: { id: existingRoleMenu.id },
        data: {
          canView: true,
          deletedAt: null,
          deletedBy: null,
        },
      });
    }
  }

  private toActor(actorId?: string | number): number | null {
    return toAuditUserId(actorId);
  }
}
