import { AppUserEntity } from '../entities/AppUserEntity';

export interface RepositoryInterface {
  create(appUserEntity: AppUserEntity): Promise<AppUserEntity>;

  index(queryParams: object): Promise<object | null>;

  show(id: number): Promise<AppUserEntity | null>;

  update(
    id: number,
    appUserEntity: AppUserEntity,
  ): Promise<AppUserEntity | null>;

  remove(id: number): Promise<AppUserEntity | null>;
}
