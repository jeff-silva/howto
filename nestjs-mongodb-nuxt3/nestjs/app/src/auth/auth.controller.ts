/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: Record<string, any>) {
    return this.authService.login(dto?.email, dto?.password);
  }
}
