import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUserModule } from './app_user/app_user.module';

@Module({
  imports: [AppUserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
