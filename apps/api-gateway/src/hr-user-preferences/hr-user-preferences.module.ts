import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HrUserPreferencesController } from './hr-user-preferences.controller';
import { HrUserPreferencesService } from './hr-user-preferences.service';

@Module({
  imports: [PrismaModule],
  controllers: [HrUserPreferencesController],
  providers: [HrUserPreferencesService],
})
export class HrUserPreferencesModule {}
