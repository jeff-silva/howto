import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import {
  AppUserCreateUseCase,
  AppUserIndexUseCase,
  AppUserShowUseCase,
  AppUserUpdateUseCase,
  AppUserRemoveUseCase,
} from 'core/use-cases/AppUser';

@Controller('app_user')
export class AppUserController {
  constructor(
    private readonly appUserCreateUseCase: AppUserCreateUseCase,
    private readonly appUserIndexUseCase: AppUserIndexUseCase,
    private readonly appUserShowUseCase: AppUserShowUseCase,
    private readonly appUserUpdateUseCase: AppUserUpdateUseCase,
    private readonly appUserRemoveUseCase: AppUserRemoveUseCase,
  ) {}

  @Post()
  create(@Body() data) {
    return this.appUserCreateUseCase.execute(data);
  }

  @Get()
  index(@Query() query) {
    return this.appUserIndexUseCase.execute(query);
  }

  @Get(':id')
  show(@Param('id') id) {
    return this.appUserShowUseCase.execute(id);
  }

  @Put(':id')
  update(@Param('id') id, @Body() data) {
    return this.appUserUpdateUseCase.execute(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id) {
    return this.appUserRemoveUseCase.execute(id);
  }
}
