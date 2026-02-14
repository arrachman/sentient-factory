import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { RegisterDto } from './dto/register.dto';
import { hashPassword, verifyPassword } from './password-hasher';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await verifyPassword(pass, user.passwordHash))) {
      if (!user.isActive) {
        return null;
      }
      const hasWarehouse = await this.usersService.hasWarehouse(user.uuid);
      if (!hasWarehouse) {
        return null;
      }
      const { passwordHash: _passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const roles = user.roles?.map((ur: any) => ur.role.name) || [];
    const warehouse = await this.usersService.getWarehouseMetaByUserUuid(user.uuid);
    const payload = {
      username: user.username,
      fullName: user.fullName ?? null,
      sub: user.uuid,
      email: user.email,
      roles: roles,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      success: true,
      data: {
        token: accessToken,
        refreshToken: refreshToken,
        user: {
          id: user.uuid,
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
        id: user.uuid,
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

    const id = authUser?.id ?? dbUser?.uuid ?? null;
    const email = dbUser?.email ?? authUser?.email ?? null;
    const username = dbUser?.username ?? authUser?.username ?? null;
    const fullName =
      (typeof dbUser?.fullName === 'string' && dbUser.fullName.trim().length > 0
        ? dbUser.fullName
        : typeof authUser?.fullName === 'string' && authUser.fullName.trim().length > 0
          ? authUser.fullName
          : null);
    const roles = Array.isArray(authUser?.roles) ? authUser.roles : [];

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
        role: roles[0] || 'user',
        roles,
      },
    };
  }
}
