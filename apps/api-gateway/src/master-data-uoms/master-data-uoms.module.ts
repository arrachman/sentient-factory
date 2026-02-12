import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MasterDataUomsController } from './master-data-uoms.controller';
import { MasterDataUomsService } from './master-data-uoms.service';

@Module({
  imports: [PrismaModule],
  controllers: [MasterDataUomsController],
  providers: [MasterDataUomsService],
  exports: [MasterDataUomsService],
})
export class MasterDataUomsModule {}
