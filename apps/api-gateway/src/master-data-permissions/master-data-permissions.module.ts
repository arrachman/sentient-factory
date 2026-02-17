import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MasterDataPermissionsController } from './master-data-permissions.controller';
import { MasterDataPermissionsService } from './master-data-permissions.service';

@Module({
  imports: [PrismaModule],
  controllers: [MasterDataPermissionsController],
  providers: [MasterDataPermissionsService],
})
export class MasterDataPermissionsModule {}
