import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash: _passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const roles = user.roles?.map((ur: any) => ur.role.name) || [];
    const payload = {
      username: user.username,
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
          name: user.fullName,
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
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

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
}
