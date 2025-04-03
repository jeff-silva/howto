import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AppUserModule } from 'src/app_user/app_user.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'app',
      signOptions: { expiresIn: '1h' },
    }),
    AppUserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
