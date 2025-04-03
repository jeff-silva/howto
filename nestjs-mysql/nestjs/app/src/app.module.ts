import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUserModule } from './app_user/app_user.module';
import { AppUser } from './app_user/app_user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql',
      port: 3306,
      username: 'app',
      password: 'app',
      database: 'app',
      entities: [AppUser],
      synchronize: true,
    }),
    AppUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
