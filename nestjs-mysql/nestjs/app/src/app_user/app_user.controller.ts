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
import { AppUserDto } from './app_user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app_user')
@Controller('app_user')
export class AppUserController {
  constructor(private readonly service: AppUserService) {}

  @Post()
  async create(@Body() dto: AppUserDto) {
    const entity = await this.service.create(dto);
    return { entity };
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    const entity = this.service.findOne({ id });
    return { entity };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: AppUserDto) {
    const entity = await this.service.update(+id, dto);
    return { entity };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const entity = await this.service.remove(+id);
    return { entity };
  }
}
