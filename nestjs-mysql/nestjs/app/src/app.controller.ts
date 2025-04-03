/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller('app')
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('load')
  @ApiBearerAuth()
  load(@Request() req: Record<string, any>) {
    return this.service.load({ user: req.user || null });
  }
}
