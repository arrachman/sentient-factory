import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpLmsEnrollmentsController } from './erp-mdp-lms-enrollments.controller';
import { ErpMdpLmsEnrollmentsService } from './erp-mdp-lms-enrollments.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpLmsEnrollmentsController],
  providers: [ErpMdpLmsEnrollmentsService],
  exports: [ErpMdpLmsEnrollmentsService],
})
export class ErpMdpLmsEnrollmentsModule {}
