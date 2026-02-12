import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MasterDataItemsController } from './master-data-items.controller';
import { MasterDataItemsService } from './master-data-items.service';

@Module({
  imports: [PrismaModule],
  controllers: [MasterDataItemsController],
  providers: [MasterDataItemsService],
  exports: [MasterDataItemsService],
})
export class MasterDataItemsModule {}
