import { Module } from '@nestjs/common';
import { UserAdminService } from './user-admin.service';
import { UsersService } from './users.service';
import { UserWarehouseService } from './user-warehouse.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UserAdminService, UserWarehouseService],
  exports: [UsersService, UserAdminService, UserWarehouseService],
})
export class UsersModule {}
