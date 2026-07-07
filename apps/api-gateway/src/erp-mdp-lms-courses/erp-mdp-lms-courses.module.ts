import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpLmsCoursesController } from './erp-mdp-lms-courses.controller';
import { ErpMdpLmsCoursesService } from './erp-mdp-lms-courses.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpLmsCoursesController],
  providers: [ErpMdpLmsCoursesService],
  exports: [ErpMdpLmsCoursesService],
})
export class ErpMdpLmsCoursesModule {}
