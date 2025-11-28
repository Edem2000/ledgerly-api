import { NestFactory } from '@nestjs/core';
import { CoreContainer } from 'infrastructure/di/containers/core/container';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'infrastructure/config/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(CoreContainer);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // optional: transforms payloads to DTO class instances
    }),
  );
  app.enableCors();
  app.useStaticAssets(join(process.cwd(), 'storage'),{
    prefix: '/storage/',
  });
  console.log("port: ", config.port);
  await app.listen(config.port, '0.0.0.0');
}

bootstrap();
