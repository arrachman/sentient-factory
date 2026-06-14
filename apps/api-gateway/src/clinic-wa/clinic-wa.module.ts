import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ClinicSettingsModule } from '../clinic-settings/clinic-settings.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicWaController } from './clinic-wa.controller';
import { ClinicWaService } from './clinic-wa.service';
import { FonnteProvider } from './providers/fonnte.provider';
import { MockWAProvider } from './providers/mock.provider';
import { WA_PROVIDER } from './wa.tokens';
import { WA_QUEUE_NAME } from './queue/wa-queue.constants';
import { WaQueueProcessor } from './queue/wa-queue.processor';

export { WA_PROVIDER };

function parseRedisUrl(url: string | undefined) {
  if (!url) return { host: 'localhost', port: 6379 };
  try {
    const u = new URL(url);
    return {
      host: u.hostname || 'localhost',
      port: Number(u.port || 6379),
      password: u.password || undefined,
      username: u.username || undefined,
    };
  } catch {
    return { host: 'localhost', port: 6379 };
  }
}

/**
 * WhatsApp gateway module.
 *
 * Provider switch:
 * - FONNTE_API_TOKEN set → use FonnteProvider (real Fonnte API)
 * - else → use MockWAProvider (no-op, for dev/testing)
 *
 * Queue mode:
 * - WA_QUEUE_ENABLED=true → enqueue to BullMQ (Redis), worker retries 3× with 5min backoff
 * - else → sync send via dispatchRaw fallback
 *
 * Exports `ClinicWaService` untuk dipakai modul lain (e.g., booking event hooks).
 */
@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    ClinicSettingsModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: parseRedisUrl(config.get<string>('REDIS_URL')),
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: WA_QUEUE_NAME }),
  ],
  controllers: [ClinicWaController],
  providers: [
    MockWAProvider,
    FonnteProvider,
    {
      // Pilih FonnteProvider bila ada salah satu token (env FONNTE_API_TOKEN
      // sebagai fallback lama, atau FONNTE_ACCOUNT_TOKEN supaya pairing flow
      // bisa di-aktifkan dari UI tanpa env API token). FonnteProvider sendiri
      // baca token aktif dari DB via ClinicSettingsService (lihat fonnte.provider.ts).
      provide: WA_PROVIDER,
      useFactory: (config: ConfigService, mock: MockWAProvider, fonnte: FonnteProvider) => {
        const apiToken = config.get<string>('FONNTE_API_TOKEN');
        const accountToken = config.get<string>('FONNTE_ACCOUNT_TOKEN');
        return apiToken || accountToken ? fonnte : mock;
      },
      inject: [ConfigService, MockWAProvider, FonnteProvider],
    },
    ClinicWaService,
    WaQueueProcessor,
  ],
  exports: [WA_PROVIDER, ClinicWaService],
})
export class ClinicWaModule {}
