import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Role, Permission, UserRole, Prisma } from '@prisma/client'; // Import Prisma and specific models

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
    // user object comes from JwtStrategy: { id, email, username }
    // Assuming user.id is the uuid string

    // Step 1: Find the internal integer ID of the user using their UUID
    const userDbId = await this.prisma.user.findFirst({
      where: { uuid: user.id as string },
      select: { id: true },
    });

    if (!userDbId) return false;

    // Step 2: Fetch the user with their roles and permissions using the internal integer ID
    const userWithPermissions: UserWithRolesAndPermissions | null = await this.prisma.user.findUnique({
      where: {
        id: userDbId.id, // Use the internal integer ID
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
