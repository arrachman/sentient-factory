import { Module } from '@nestjs/common';
import { UserAdminService } from './user-admin.service';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UserAdminService],
  exports: [UsersService, UserAdminService],
})
export class UsersModule {}
