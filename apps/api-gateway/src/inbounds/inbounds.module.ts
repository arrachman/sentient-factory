import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InboundsController } from './inbounds.controller';
import { InboundsService } from './inbounds.service';

@Module({
  imports: [PrismaModule],
  controllers: [InboundsController],
  providers: [InboundsService],
  exports: [InboundsService],
})
export class InboundsModule {}
