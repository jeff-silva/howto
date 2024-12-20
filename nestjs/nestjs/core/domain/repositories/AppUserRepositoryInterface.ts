import { AppUserEntity } from '../entities/AppUserEntity';

export interface AppUserRepositoryInterface {
  create(appUserEntity: AppUserEntity): Promise<AppUserEntity>;
  findById(id: string): Promise<AppUserEntity | null>;
}
