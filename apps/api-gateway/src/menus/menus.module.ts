import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MenusController } from './menus.controller';
import { MenuSidebarService } from './menu-sidebar.service';
import { MenusService } from './menus.service';

@Module({
  imports: [PrismaModule],
  controllers: [MenusController],
  providers: [MenusService, MenuSidebarService],
  exports: [MenusService, MenuSidebarService],
})
export class MenusModule {}
