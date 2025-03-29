/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';
import { AppUserDto } from './dto/app_user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AppUser } from './entities/app_user.entity';
import { Model } from 'mongoose';
import { AppUserRepository } from './app_user.repository';

@Injectable()
export class AppUserService {
  constructor(private readonly appUserRepository: AppUserRepository) {}

  create(appUserDto: AppUserDto) {
    // return 'This action adds a new appUser';
    return this.appUserRepository.create(appUserDto);
  }

  findAll() {
    // return `This action returns all appUser`;
    return this.appUserRepository.findAll({});
  }

  findOne(id: string) {
    // return `This action returns a #${id} appUser`;
    return this.appUserRepository.findOne({ _id: id });
  }

  update(id: string, appUserDto: AppUserDto) {
    // return `This action updates a #${id} appUser`;
    return this.appUserRepository.findOneAndUpdate(
      { _id: id },
      { $set: appUserDto },
    );
  }

  remove(id: string) {
    // return `This action removes a #${id} appUser`;
    return this.appUserRepository.deleteOne({ _id: id });
  }
}
