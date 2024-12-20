import { AppUserRepositoryInterface } from '../domain/repositories/AppUserRepositoryInterface';
import { AppUserEntity } from '../domain/entities/AppUserEntity';

export class AppUserCreateUseCase {
  constructor(private appUserRepository: AppUserRepositoryInterface) {}

  async execute(appUserData: object = {}): Promise<AppUserEntity> {
    const appUserEntity = new AppUserEntity(appUserData);
    return await this.appUserRepository.create(appUserEntity);
  }
}
