import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUserModule } from './app_user/app_user.module';
import { AppUser } from './app_user/app_user.entity';
import { AppSeeder } from './app.seeder';
import { AppUserGroupModule } from './app_user_group/app_user_group.module';
import { AppUserGroup } from './app_user_group/app_user_group.entity';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { TestCommand } from './@app/commands/test.command';
import { AppFileModule } from './app_file/app_file.module';
import { AppFile } from './app_file/app_file.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql',
      port: 3306,
      username: 'app',
      password: 'app',
      database: 'app',
      entities: [AppUser, AppUserGroup, AppFile],
      synchronize: true,
    }),
    AuthModule,
    AppUserModule,
    AppUserGroupModule,
    AppFileModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppSeeder, TestCommand],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
