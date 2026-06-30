import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HrSysMenusController } from './hr-sys-menus.controller';
import { HrSysMenusService } from './hr-sys-menus.service';

@Module({
  imports: [PrismaModule],
  controllers: [HrSysMenusController],
  providers: [HrSysMenusService],
  exports: [HrSysMenusService],
})
export class HrSysMenusModule {}
