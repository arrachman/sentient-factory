import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MasterDataCitySlasController } from './master-data-city-slas.controller';
import { MasterDataCitySlasService } from './master-data-city-slas.service';

@Module({
  imports: [PrismaModule],
  controllers: [MasterDataCitySlasController],
  providers: [MasterDataCitySlasService],
  exports: [MasterDataCitySlasService],
})
export class MasterDataCitySlasModule {}
