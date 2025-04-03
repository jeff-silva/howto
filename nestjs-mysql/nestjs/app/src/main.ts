import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  SwaggerModule.setup('/', app, () => {
    return SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Rest Example')
        .setDescription('Rest Endpoints')
        .setVersion('1.0')
        .build(),
    );
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
