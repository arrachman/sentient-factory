import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicPaymentController } from './clinic-payment.controller';
import { ClinicPaymentService } from './clinic-payment.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicPaymentController],
  providers: [ClinicPaymentService],
  exports: [ClinicPaymentService],
})
export class ClinicPaymentModule {}
