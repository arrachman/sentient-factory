import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { uuid: id },
    });
  }

  async findOneByUuid(uuid: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { uuid },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    // In a real app, you might want to hash this token before saving
    // For simplicity, we assume session management handles this or we add a field to User
    // But per our schema, we have a Session model. Let's use that instead or skip for MVP.
    // For MVP B0003, standard JWT usually doesn't strictly require DB storage unless we want revocation.
    // Let's stick to standard stateless JWT for now or implement Session later.
    return;
  }
}
