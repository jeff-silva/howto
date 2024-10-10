import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ExpressAdapter } from '@nestjs/platform-express';
import * as Express from 'express';

import AppController from '../controllers/AppController.js';

async function bootstrap() {
  const server = Express();

  console.log(AppController);
  // server.get('/api/v1/test', AppController.test);

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.listen(3000);
}
bootstrap();
