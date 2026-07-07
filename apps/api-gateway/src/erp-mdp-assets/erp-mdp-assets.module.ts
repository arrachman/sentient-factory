import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpAssetsController } from './erp-mdp-assets.controller';
import { ErpMdpAssetsService } from './erp-mdp-assets.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpAssetsController],
  providers: [ErpMdpAssetsService],
  exports: [ErpMdpAssetsService],
})
export class ErpMdpAssetsModule {}
