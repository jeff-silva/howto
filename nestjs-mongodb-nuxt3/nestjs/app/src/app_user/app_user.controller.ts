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
} from '@nestjs/common';
import { AppUserService } from './app_user.service';
import { AppUserDto } from './dto/app_user.dto';

@Controller('app_user')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Post()
  create(@Body() appUserDto: AppUserDto) {
    return this.appUserService.create(appUserDto);
  }

  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.appUserService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appUserService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() appUserDto: AppUserDto) {
    return this.appUserService.update(id, appUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appUserService.remove(id);
  }
}
