import { Module } from '@nestjs/common';
import { AppUserService } from './app_user.service';
import { AppUserController } from './app_user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppUser, AppUserSchema } from './entities/app_user.entity';
import { AppUserRepository } from './app_user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AppUser.name,
        schema: AppUserSchema,
      },
    ]),
  ],
  controllers: [AppUserController],
  providers: [AppUserService, AppUserRepository],
  exports: [AppUserService],
})
export class AppUserModule {}
