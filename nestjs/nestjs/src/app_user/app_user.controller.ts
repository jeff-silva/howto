import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { AppUserService } from './app_user.service';
import { CreateAppUserDto } from './dto/create-app_user.dto';
import { UpdateAppUserDto } from './dto/update-app_user.dto';

@Controller('app_user')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Post()
  create(@Body() createAppUserDto: CreateAppUserDto) {
    return this.appUserService.create(createAppUserDto);
  }

  @Get()
  index() {
    return this.appUserService.index();
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.appUserService.show(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppUserDto: UpdateAppUserDto) {
    return this.appUserService.update(+id, updateAppUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appUserService.remove(+id);
  }
}
