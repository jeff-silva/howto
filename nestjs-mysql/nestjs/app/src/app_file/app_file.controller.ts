/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AppFileService } from './app_file.service';
import { AppFileDto } from './app_file.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('app_file')
@Controller('app_file')
export class AppFileController {
  constructor(private readonly service: AppFileService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async create(@Body() dto: AppFileDto) {
    const entity = await this.service.create(dto);
    return { entity };
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number) {
    const entity = this.service.findOne({ id });
    return { entity };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() dto: AppFileDto) {
    const entity = await this.service.update(+id, dto);
    return { entity };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    const entity = await this.service.remove(+id);
    return { entity };
  }
}
