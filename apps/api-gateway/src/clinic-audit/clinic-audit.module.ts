import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicAuditController } from './clinic-audit.controller';
import { ClinicAuditInterceptor } from './clinic-audit.interceptor';
import { ClinicAuditService } from './clinic-audit.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicAuditController],
  providers: [
    ClinicAuditService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClinicAuditInterceptor,
    },
  ],
  exports: [ClinicAuditService],
})
export class ClinicAuditModule {}
