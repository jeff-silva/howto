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
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('app_user')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Post()
  // @UseGuards(AuthGuard)
  @ApiBearerAuth()
  create(@Body() appUserDto: AppUserDto) {
    return this.appUserService.create(appUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ type: Number, name: 'page', default: 1 })
  @ApiQuery({ type: Number, name: 'per_page', default: 10 })
  @ApiQuery({ type: String, name: 'order', default: 'updated_at:desc' })
  findAll(@Query() query: Record<string, any>) {
    return this.appUserService.findPaginated(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') _id: string) {
    return this.appUserService.findOne({ _id });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() appUserDto: AppUserDto) {
    return this.appUserService.update(id, appUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.appUserService.remove(id);
  }
}
