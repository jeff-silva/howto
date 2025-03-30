/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppUserService } from './app_user.service';
import { AppUserDto } from './dto/app_user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('app_user')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() appUserDto: AppUserDto) {
    return this.appUserService.create(appUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() query: Record<string, any>) {
    return this.appUserService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.appUserService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() appUserDto: AppUserDto) {
    return this.appUserService.update(id, appUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.appUserService.remove(id);
  }
}
