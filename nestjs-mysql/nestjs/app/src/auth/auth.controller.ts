/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', default: 'main@grr.la' },
        password: { type: 'string', default: 'main@grr.la' },
      },
      required: ['email', 'password'],
    },
  })
  login(@Body() dto: Record<string, any>) {
    return this.authService.login(dto.username, dto.password);
  }
}
