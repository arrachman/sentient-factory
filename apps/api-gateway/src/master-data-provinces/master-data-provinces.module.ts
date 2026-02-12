import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MasterDataProvincesController } from './master-data-provinces.controller';
import { MasterDataProvincesService } from './master-data-provinces.service';

@Module({
  imports: [PrismaModule],
  controllers: [MasterDataProvincesController],
  providers: [MasterDataProvincesService],
  exports: [MasterDataProvincesService],
})
export class MasterDataProvincesModule {}
