/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', default: '' },
        password: { type: 'string', default: '' },
      },
      required: ['email', 'password'],
    },
  })
  login(@Body() dto: Record<string, any>) {
    return this.authService.login(dto?.email, dto?.password);
  }
}
