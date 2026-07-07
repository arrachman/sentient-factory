import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpMenusController } from './erp-mdp-menus.controller';
import { ErpMdpMenusService } from './erp-mdp-menus.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpMenusController],
  providers: [ErpMdpMenusService],
  exports: [ErpMdpMenusService],
})
export class ErpMdpMenusModule {}
