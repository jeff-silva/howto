import { Module } from '@nestjs/common';
import { AppUserController } from './app_user.controller';

import {
  AppUserCreateUseCase,
  AppUserIndexUseCase,
  AppUserShowUseCase,
  AppUserUpdateUseCase,
  AppUserRemoveUseCase,
} from 'core/use-cases/AppUserUseCase';

@Module({
  controllers: [AppUserController],
  providers: [
    AppUserCreateUseCase,
    AppUserIndexUseCase,
    AppUserShowUseCase,
    AppUserUpdateUseCase,
    AppUserRemoveUseCase,
  ],
})
export class AppUserModule {}
