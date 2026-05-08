import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicAuditInterceptor } from './clinic-audit.interceptor';

/**
 * Registers ClinicAuditInterceptor as a global interceptor.
 * Auto-tracks mutating requests to /clinic/* into existing AuditLog table.
 *
 * See ADR 005.
 */
@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClinicAuditInterceptor,
    },
  ],
})
export class ClinicAuditModule {}
