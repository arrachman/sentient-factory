import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { RegisterDto } from './dto/register.dto';
import { hashPassword, verifyPassword } from './password-hasher';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await verifyPassword(pass, user.passwordHash))) {
      if (!user.isActive) {
        return null;
      }
      const roles = await this.usersService.getActiveRoleNamesByUserId(user.id);
      const isClinicUser = roles.some((r) => r.startsWith('clinic-'));
      if (!isClinicUser) {
        // ERP users must have a warehouse assignment; clinic users skip this gate.
        const hasWarehouse = await this.usersService.hasWarehouse(user.id);
        if (!hasWarehouse) {
          return null;
        }
      }
      const { passwordHash: _passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, meta?: { ipAddress?: string | null; userAgent?: string | null }) {
    const sessionKey = randomUUID();
    const roles = await this.usersService.getActiveRoleNamesByUserId(user.id);
    const warehouse = await this.usersService.getWarehouseMetaByUserUuid(user.id);
    const payload = {
      username: user.username,
      fullName: user.fullName ?? null,
      sub: user.id,
      email: user.email,
      roles: roles,
      sid: sessionKey,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const ipAddress = this.normalizeHeaderValue(meta?.ipAddress);
    const userAgent = this.normalizeHeaderValue(meta?.userAgent);

    try {
      await this.prisma.session.create({
        data: {
          userId: user.id,
          token: accessToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          ipAddress,
          userAgent,
          createdBy: user.id,
          updatedBy: user.id,
        },
      });
    } catch (error) {
      this.logger.warn(
        `Session tracking failed for user ${user.id}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    return {
      success: true,
      data: {
        token: accessToken,
        refreshToken: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          name: user.fullName,
          warehouseId: warehouse.warehouseId,
          warehouseName: warehouse.warehouseName,
          role: roles[0] || 'user', // Primary role for frontend simplicity
          roles: roles, // Full roles array
          createdAt: user.createdAt,
        },
      },
      message: 'Login successful',
    };
  }

  async logout(authUser: any, token?: string | null) {
    if (authUser?.id && token) {
      try {
        await this.prisma.session.updateMany({
          where: {
            userId: authUser.id,
            token,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
            deletedBy: authUser.id,
            updatedBy: authUser.id,
          },
        });
      } catch (error) {
        this.logger.warn(
          `Session logout tracking failed for user ${authUser.id}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findOneByEmail(registerDto.email);
    if (existingUser) {
      throwDuplicate({
        fieldLabel: 'Email',
        value: registerDto.email,
        isSoftDeleted: Boolean(existingUser.deletedAt),
        type: 'conflict',
      });
    }

    const existingUsername = await this.usersService.findOneByUsername(registerDto.username);
    if (existingUsername) {
      throwDuplicate({
        fieldLabel: 'Username',
        value: registerDto.username,
        isSoftDeleted: Boolean(existingUsername.deletedAt),
        type: 'conflict',
      });
    }

    const hashedPassword = await hashPassword(registerDto.password);

    const user = await this.usersService.create({
      email: registerDto.email,
      username: registerDto.username,
      passwordHash: hashedPassword,
      fullName: registerDto.fullName,
    });

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        username: user.username,
        role: 'user',
        createdAt: user.createdAt,
      },
      message: 'User successfully created',
    };
  }

  async getProfile(authUser: any) {
    const dbUser = authUser?.id ? await this.usersService.findOneById(authUser.id) : null;
    const warehouse = authUser?.id
      ? await this.usersService.getWarehouseMetaByUserUuid(authUser.id)
      : { warehouseId: null, warehouseName: null };
    const roles = authUser?.id
      ? await this.usersService.getActiveRoleNamesByUserId(authUser.id)
      : [];

    const id = authUser?.id ?? dbUser?.id ?? null;
    const email = dbUser?.email ?? authUser?.email ?? null;
    const username = dbUser?.username ?? authUser?.username ?? null;
    const fullName =
      typeof dbUser?.fullName === 'string' && dbUser.fullName.trim().length > 0
        ? dbUser.fullName
        : typeof authUser?.fullName === 'string' && authUser.fullName.trim().length > 0
          ? authUser.fullName
          : null;
    return {
      success: true,
      data: {
        id,
        email,
        username,
        fullName,
        name: fullName || username || 'User',
        warehouseId: warehouse.warehouseId,
        warehouseName: warehouse.warehouseName,
        roles,
      },
    };
  }

  private normalizeHeaderValue(value: string | null | undefined): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }
}
