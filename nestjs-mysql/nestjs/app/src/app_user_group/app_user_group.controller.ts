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
  async create(@Body() dto: AppUserGroupDto) {
    const entity = await this.service.create(dto);
    return { entity };
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const entity = this.service.findOne(+id);
    return { entity };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: AppUserGroupDto) {
    const entity = await this.service.update(+id, dto);
    return { entity };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const entity = await this.service.remove(+id);
    return { entity };
  }
}
