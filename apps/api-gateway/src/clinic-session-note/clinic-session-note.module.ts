import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicSessionNoteController } from './clinic-session-note.controller';
import { ClinicSessionNoteService } from './clinic-session-note.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicSessionNoteController],
  providers: [ClinicSessionNoteService],
  exports: [ClinicSessionNoteService],
})
export class ClinicSessionNoteModule {}
