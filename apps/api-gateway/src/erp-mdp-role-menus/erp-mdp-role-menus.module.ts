import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpRoleMenusController } from './erp-mdp-role-menus.controller';
import { ErpMdpRoleMenusService } from './erp-mdp-role-menus.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpRoleMenusController],
  providers: [ErpMdpRoleMenusService],
  exports: [ErpMdpRoleMenusService],
})
export class ErpMdpRoleMenusModule {}
