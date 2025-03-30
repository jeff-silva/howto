/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('load')
  getProfile(@Request() req: Record<string, any>) {
    const user = req.user || null;
    const config = {};
    const env = {};
    return { user, config, env };
  }
}
