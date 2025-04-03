import { Injectable } from '@nestjs/common';
import { AppUserDto } from './app_user.dto';

@Injectable()
export class AppUserService {
  create(dto: AppUserDto) {
    return { dto };
  }

  findAll() {
    return [];
  }

  findOne(id: number) {
    return { id };
  }

  update(id: number, dto: AppUserDto) {
    return { id, dto };
  }

  remove(id: number) {
    return { id };
  }
}
