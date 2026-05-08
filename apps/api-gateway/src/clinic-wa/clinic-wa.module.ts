import { Module } from '@nestjs/common';
import { MockWAProvider } from './providers/mock.provider';

export const WA_PROVIDER = 'WA_PROVIDER';

/**
 * WhatsApp gateway module.
 *
 * Slice 0: registers `MockWAProvider` under `WA_PROVIDER` token.
 * Slice 8: swap implementation to `FonnteProvider` (real send via Fonnte).
 *
 * Consumers inject via:
 *   constructor(@Inject(WA_PROVIDER) private wa: WAProvider) {}
 */
@Module({
  providers: [
    MockWAProvider,
    {
      provide: WA_PROVIDER,
      useExisting: MockWAProvider,
    },
  ],
  exports: [WA_PROVIDER],
})
export class ClinicWaModule {}
