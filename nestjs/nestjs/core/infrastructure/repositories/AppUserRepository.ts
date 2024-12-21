import { RepositoryInterface } from '../../domain/repositories/RepositoryInterface';
import { AppUserEntity } from '../../domain/entities/AppUserEntity';

export class AppUserRepository implements RepositoryInterface {
  async create(appUserEntity: AppUserEntity): Promise<AppUserEntity> {
    return appUserEntity;
  }

  async index(params: object): Promise<object | null> {
    return { params };
  }

  async show(id: number): Promise<AppUserEntity | null> {
    if (!id) return null;
    return null;
  }

  async update(
    id: number,
    entity: AppUserEntity,
  ): Promise<AppUserEntity | null> {
    if (!id) return null;
    return entity;
  }

  async remove(id: number): Promise<AppUserEntity | null> {
    if (!id) return null;
    return null;
  }
}
