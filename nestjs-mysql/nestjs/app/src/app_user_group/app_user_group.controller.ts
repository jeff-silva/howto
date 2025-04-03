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
import { AppUserGroupService } from './app_user_group.service';
import { AppUserGroupDto } from './app_user_group.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('app_user_group')
@Controller('app_user_group')
export class AppUserGroupController {
  constructor(private readonly service: AppUserGroupService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async create(@Body() dto: AppUserGroupDto) {
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
  async update(@Param('id') id: string, @Body() dto: AppUserGroupDto) {
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
