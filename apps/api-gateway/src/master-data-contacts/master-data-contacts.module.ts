import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MasterDataContactsController } from './master-data-contacts.controller';
import { MasterDataContactsService } from './master-data-contacts.service';

@Module({
  imports: [PrismaModule],
  controllers: [MasterDataContactsController],
  providers: [MasterDataContactsService],
  exports: [MasterDataContactsService],
})
export class MasterDataContactsModule {}
