import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(config.get('PORT', '4000'));
  await app.listen(port, '0.0.0.0'); // Listen on all network interfaces
  // eslint-disable-next-line no-console
  console.log(`Backend running on http://localhost:${port}`);
  console.log(`Network access: http://0.0.0.0:${port}`);
}

bootstrap();
