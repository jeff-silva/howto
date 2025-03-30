/* eslint-disable @typescript-eslint/no-floating-promises */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  SwaggerModule.setup('/', app, () => {
    return SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Basic Auth')
        .setDescription('Basic Auth Application Example')
        .setVersion('1.0')
        .build(),
    );
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
