import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FonnteProvider } from './providers/fonnte.provider';
import { MockWAProvider } from './providers/mock.provider';

export const WA_PROVIDER = 'WA_PROVIDER';

/**
 * WhatsApp gateway module.
 *
 * Provider switch:
 * - FONNTE_API_TOKEN set → use FonnteProvider (real Fonnte API)
 * - else → use MockWAProvider (no-op, for dev/testing)
 *
 * Consumers inject via:
 *   constructor(@Inject(WA_PROVIDER) private wa: WAProvider) {}
 *
 * See ADR 004.
 */
@Module({
  imports: [ConfigModule],
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
  ],
  exports: [WA_PROVIDER],
})
export class ClinicWaModule {}
