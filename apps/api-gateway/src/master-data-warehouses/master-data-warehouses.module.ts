import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MasterDataWarehousesController } from './master-data-warehouses.controller';
import { MasterDataWarehousesService } from './master-data-warehouses.service';

@Module({
  imports: [PrismaModule],
  controllers: [MasterDataWarehousesController],
  providers: [MasterDataWarehousesService],
  exports: [MasterDataWarehousesService],
})
export class MasterDataWarehousesModule {}
