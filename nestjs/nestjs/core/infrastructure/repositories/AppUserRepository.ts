import { AppUserRepositoryInterface } from '../../domain/repositories/AppUserRepositoryInterface';
import { AppUserEntity } from '../../domain/entities/AppUserEntity';

export class AppUserRepository implements AppUserRepositoryInterface {
  async create(appUserEntity: AppUserEntity): Promise<AppUserEntity> {
    return appUserEntity;
  }

  async findById(id: string): Promise<AppUserEntity | null> {
    return new AppUserEntity({ id });
  }
}
