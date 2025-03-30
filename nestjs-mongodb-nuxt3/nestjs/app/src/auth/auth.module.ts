import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppUserModule } from 'src/app_user/app_user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AppUserModule,
    JwtModule.register({
      global: true,
      secret: 'app',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
