import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MasterDataRolesController } from './master-data-roles.controller';
import { MasterDataRolesService } from './master-data-roles.service';
import { RolePermissionsService } from './role-permissions.service';

@Module({
  imports: [PrismaModule],
  controllers: [MasterDataRolesController],
  providers: [MasterDataRolesService, RolePermissionsService],
  exports: [RolePermissionsService],
})
export class MasterDataRolesModule {}
