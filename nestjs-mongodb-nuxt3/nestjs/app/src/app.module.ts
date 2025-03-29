import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUserModule } from './app_user/app_user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://app:app@mongo:27017/app?authSource=admin&directConnection=true',
    ),
    AppUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
