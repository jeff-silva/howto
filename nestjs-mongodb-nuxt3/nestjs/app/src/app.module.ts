import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://app:app@mongo:27017/app?authSource=admin&directConnection=true',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
