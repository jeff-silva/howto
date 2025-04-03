import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppUserGroupService } from './app_user_group.service';
import { AppUserGroupDto } from './app_user_group.entity';

@Controller('app_user_group')
export class AppUserGroupController {
  constructor(private readonly service: AppUserGroupService) {}

  @Post()
  create(@Body() dto: AppUserGroupDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: AppUserGroupDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
