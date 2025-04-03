import { Module } from '@nestjs/common';
import { AppUserService } from './app_user.service';
import { AppUserController } from './app_user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUser } from './app_user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppUser])],
  controllers: [AppUserController],
  providers: [AppUserService],
})
export class AppUserModule {}
