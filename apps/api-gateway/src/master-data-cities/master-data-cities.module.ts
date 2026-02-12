import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MasterDataCitiesController } from './master-data-cities.controller';
import { MasterDataCitiesService } from './master-data-cities.service';

@Module({
  imports: [PrismaModule],
  controllers: [MasterDataCitiesController],
  providers: [MasterDataCitiesService],
  exports: [MasterDataCitiesService],
})
export class MasterDataCitiesModule {}
