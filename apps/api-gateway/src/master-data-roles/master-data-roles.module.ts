import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MasterDataRolesController } from './master-data-roles.controller';
import { MasterDataRolesService } from './master-data-roles.service';

@Module({
  imports: [PrismaModule],
  controllers: [MasterDataRolesController],
  providers: [MasterDataRolesService],
})
export class MasterDataRolesModule {}
