import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicWaController } from './clinic-wa.controller';
import { ClinicWaService } from './clinic-wa.service';
import { FonnteProvider } from './providers/fonnte.provider';
import { MockWAProvider } from './providers/mock.provider';
import { WA_PROVIDER } from './wa.tokens';

export { WA_PROVIDER };

/**
 * WhatsApp gateway module.
 *
 * Provider switch:
 * - FONNTE_API_TOKEN set → use FonnteProvider (real Fonnte API)
 * - else → use MockWAProvider (no-op, for dev/testing)
 *
 * Exports `ClinicWaService` untuk dipakai modul lain (e.g., booking event hooks).
 */
@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [ClinicWaController],
  providers: [
    MockWAProvider,
    FonnteProvider,
    {
      provide: WA_PROVIDER,
      useFactory: (config: ConfigService, mock: MockWAProvider, fonnte: FonnteProvider) => {
        const token = config.get<string>('FONNTE_API_TOKEN');
        return token ? fonnte : mock;
      },
      inject: [ConfigService, MockWAProvider, FonnteProvider],
    },
    ClinicWaService,
  ],
  exports: [WA_PROVIDER, ClinicWaService],
})
export class ClinicWaModule {}
