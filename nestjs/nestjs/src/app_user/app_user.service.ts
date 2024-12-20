import { Injectable } from '@nestjs/common';
// import { CreateAppUserDto } from './dto/create-app_user.dto';
import { UpdateAppUserDto } from './dto/update-app_user.dto';
import { AppUserCreateUseCase } from 'core/use-cases/AppUserCreateUseCase';

@Injectable()
export class AppUserService {
  // create(createAppUserDto: CreateAppUserDto) {
  //   return ['This action adds a new appUser', createAppUserDto];
  // }

  create(data: object = {}) {
    return new AppUserCreateUseCase();
  }

  index() {
    return `This action returns all appUser`;
  }

  show(id: number) {
    return `This action returns a #${id} appUser`;
  }

  update(id: number, updateAppUserDto: UpdateAppUserDto) {
    return [`This action updates a #${id} appUser`, updateAppUserDto];
  }

  remove(id: number) {
    return [`This action removes a #${id} appUser`, id];
  }
}
