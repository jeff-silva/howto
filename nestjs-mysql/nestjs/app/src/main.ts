import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
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
        .setTitle('Rest Example')
        .setDescription('Rest Endpoints')
        .setVersion('1.0')
        .addBearerAuth()
        .build(),
    );
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
