/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
    return this.appUserRepository.create(appUserDto);
  }

  findOne(query: Record<string, any>, options?: Record<string, any>) {
    return this.appUserRepository.findOne(query, options);
  }

  findAll(params: Record<string, any> = {}) {
    return this.appUserRepository.findAll(params);
  }

  findPaginated(params: Record<string, any> = {}) {
    return this.appUserRepository.findPaginated(params);
  }

  update(id: string, appUserDto: AppUserDto) {
    return this.appUserRepository.findOneAndUpdate(
      { _id: id },
      { $set: appUserDto },
    );
  }

  remove(id: string) {
    // return `This action removes a #${id} appUser`;
    return this.appUserRepository.deleteOne({ _id: id }, { soft: true });
  }
}
