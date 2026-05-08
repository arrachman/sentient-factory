import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicUsersController } from './clinic-users.controller';
import { ClinicUsersService } from './clinic-users.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicUsersController],
  providers: [ClinicUsersService],
  exports: [ClinicUsersService],
})
export class ClinicUsersModule {}
