/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable } from '@nestjs/common';
import { AppUserDto } from './dto/app_user.dto';

@Injectable()
export class AppUserService {
  create(appUserDto: AppUserDto) {
    return 'This action adds a new appUser';
  }

  findAll() {
    return `This action returns all appUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appUser`;
  }

  update(id: number, appUserDto: AppUserDto) {
    return `This action updates a #${id} appUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} appUser`;
  }
}
