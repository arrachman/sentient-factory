import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicRoomController } from './clinic-room.controller';
import { ClinicRoomService } from './clinic-room.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicRoomController],
  providers: [ClinicRoomService],
  exports: [ClinicRoomService],
})
export class ClinicRoomModule {}
