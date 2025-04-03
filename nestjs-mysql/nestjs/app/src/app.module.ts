import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUserModule } from './app_user/app_user.module';
import { AppUser } from './app_user/app_user.entity';
import { AppSeeder } from './app.seeder';
import { AppUserGroupModule } from './app_user_group/app_user_group.module';
import { AppUserGroup } from './app_user_group/app_user_group.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql',
      port: 3306,
      username: 'app',
      password: 'app',
      database: 'app',
      entities: [AppUser, AppUserGroup],
      synchronize: true,
    }),
    AppUserModule,
    AppUserGroupModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppSeeder],
})
export class AppModule {}
