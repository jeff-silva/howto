import { RepositoryInterface } from '../domain/repositories/RepositoryInterface';
import { AppUserEntity } from '../domain/entities/AppUserEntity';

// Create
export class AppUserCreateUseCase {
  constructor(private appUserRepository: RepositoryInterface) {}

  async execute(appUserData: object = {}): Promise<AppUserEntity> {
    const appUserEntity = new AppUserEntity(appUserData);
    return await this.appUserRepository.create(appUserEntity);
  }
}

// Index
export class AppUserIndexUseCase {
  constructor(private appUserRepository: RepositoryInterface) {}

  async execute(params: object): Promise<object> {
    return await this.appUserRepository.index(params);
  }
}

// Show
export class AppUserShowUseCase {
  constructor(private appUserRepository: RepositoryInterface) {}

  async execute(id: number): Promise<AppUserEntity | null> {
    if (!id) return null;
    return new AppUserEntity();
  }
}

// Update
export class AppUserUpdateUseCase {
  constructor(private appUserRepository: RepositoryInterface) {}

  async execute(
    id: number,
    entity: AppUserEntity,
  ): Promise<AppUserEntity | null> {
    if (!id) return null;
    return entity;
  }
}

// Remove
export class AppUserRemoveUseCase {
  constructor(private appUserRepository: RepositoryInterface) {}

  async execute(id: number): Promise<AppUserEntity | null> {
    if (!id) return null;
    return new AppUserEntity();
  }
}
