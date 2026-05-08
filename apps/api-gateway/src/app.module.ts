import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MenusModule } from './menus/menus.module';
import { MasterDataContactsModule } from './master-data-contacts/master-data-contacts.module';
import { MasterDataUomsModule } from './master-data-uoms/master-data-uoms.module';
import { MasterDataDivisionsModule } from './master-data-divisions/master-data-divisions.module';
import { MasterDataItemsModule } from './master-data-items/master-data-items.module';
import { MasterDataProvincesModule } from './master-data-provinces/master-data-provinces.module';
import { MasterDataCitiesModule } from './master-data-cities/master-data-cities.module';
import { MasterDataCitySlasModule } from './master-data-city-slas/master-data-city-slas.module';
import { MasterDataWarehousesModule } from './master-data-warehouses/master-data-warehouses.module';
import { MasterDataPermissionsModule } from './master-data-permissions/master-data-permissions.module';
import { MasterDataRolesModule } from './master-data-roles/master-data-roles.module';
import { OutboundModule } from './outbound/outbound.module';
import { InboundsModule } from './inbounds/inbounds.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { DepartmentsModule } from './departments/departments.module';
import { SessionsModule } from './sessions/sessions.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HrAttendanceModule } from './hr-attendance/hr-attendance.module';
import { ClinicAuditModule } from './clinic-audit/clinic-audit.module';
import { ClinicWaModule } from './clinic-wa/clinic-wa.module';
import { ClinicPsikologModule } from './clinic-psikolog/clinic-psikolog.module';
import { ClinicServiceModule } from './clinic-service/clinic-service.module';
import { ClinicRoomModule } from './clinic-room/clinic-room.module';
import { ClinicClientModule } from './clinic-client/clinic-client.module';
import { ClinicUsersModule } from './clinic-users/clinic-users.module';
import { ClinicBookingModule } from './clinic-booking/clinic-booking.module';
import { ClinicPaymentModule } from './clinic-payment/clinic-payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Rate limit: 60 requests / 60 seconds default (override per-route via @Throttle decorator)
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    MenusModule,
    MasterDataContactsModule,
    MasterDataUomsModule,
    MasterDataDivisionsModule,
    MasterDataItemsModule,
    MasterDataProvincesModule,
    MasterDataCitiesModule,
    MasterDataCitySlasModule,
    MasterDataWarehousesModule,
    MasterDataPermissionsModule,
    MasterDataRolesModule,
    OutboundModule,
    InboundsModule,
    AuditLogsModule,
    DepartmentsModule,
    SessionsModule,
    DashboardModule,
    HrAttendanceModule,
    // Clinic domain (Althea Psychology) — see .planning/ADRs/002, 005, 006
    ClinicAuditModule,
    ClinicWaModule,
    ClinicPsikologModule,
    ClinicServiceModule,
    ClinicRoomModule,
    ClinicClientModule,
    ClinicUsersModule,
    ClinicBookingModule,
    ClinicPaymentModule,
  ],
  providers: [
    // Global rate limiter (apply to all routes)
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
