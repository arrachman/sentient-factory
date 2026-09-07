import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : undefined,
  });
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(compression({ threshold: 1_024 }));
  app.enableCors({ origin: process.env.NUHA_WEB_ORIGIN ?? 'http://localhost:3226' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(Number(process.env.NUHA_API_PORT ?? 3228), '0.0.0.0');
}

void bootstrap();
