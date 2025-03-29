import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AppUser, AppUserDocument } from './entities/app_user.entity';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/extends';

@Injectable()
export class AppUserRepository extends BaseRepository<AppUserDocument> {
  constructor(
    @InjectModel(AppUser.name)
    private readonly appUserModel: Model<AppUserDocument>,
  ) {
    super(appUserModel);
  }
}
