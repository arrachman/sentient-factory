import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicWaModule } from '../clinic-wa/clinic-wa.module';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';
import { ClinicPaymentController } from './clinic-payment.controller';
import { ClinicPaymentService } from './clinic-payment.service';

@Module({
  imports: [PrismaModule, ClinicWaModule],
  controllers: [ClinicPaymentController],
  providers: [ClinicPaymentService, IdempotencyInterceptor],
  exports: [ClinicPaymentService],
})
export class ClinicPaymentModule {}
