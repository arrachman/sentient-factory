import { PrismaService } from '../prisma/prisma.service';
import { SidebarMenuItem } from './menu-tree.utils';
export declare class MenuSidebarService {
    private prisma;
    constructor(prisma: PrismaService);
    getSidebarByUserId(userId: number | string): Promise<SidebarMenuItem[]>;
    assignMenuToAdminRole(menuId: number, actorId?: string | number): Promise<void>;
    private ensureAdministratorRoleMenu;
    private toActor;
}
