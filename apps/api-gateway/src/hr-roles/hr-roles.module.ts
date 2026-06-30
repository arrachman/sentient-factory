import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HrRolesController } from './hr-roles.controller';
import { HrRolesService } from './hr-roles.service';

@Module({
  imports: [PrismaModule],
  controllers: [HrRolesController],
  providers: [HrRolesService],
})
export class HrRolesModule {}
