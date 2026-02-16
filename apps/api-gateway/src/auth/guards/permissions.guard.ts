import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

// Define a type for the user object with its relations
type UserWithRolesAndPermissions = Prisma.UserGetPayload<{
  include: {
    roles: {
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true;
              };
            };
          };
        };
      };
    };
  };
}>;

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userId = Number(user?.id);
    if (!Number.isInteger(userId)) return false;

    const userWithPermissions: UserWithRolesAndPermissions | null = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userWithPermissions) return false;

    const userPermissions = new Set<string>();
    userWithPermissions.roles.forEach((userRole) => {
      userRole.role.permissions.forEach((rolePermission) => {
        userPermissions.add(rolePermission.permission.name);
      });
    });

    return requiredPermissions.some((permission) => userPermissions.has(permission));
  }
}
