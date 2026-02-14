import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MasterDataDivisionsController } from './master-data-divisions.controller';
import { MasterDataDivisionsService } from './master-data-divisions.service';

@Module({
  imports: [PrismaModule],
  controllers: [MasterDataDivisionsController],
  providers: [MasterDataDivisionsService],
  exports: [MasterDataDivisionsService],
})
export class MasterDataDivisionsModule {}
