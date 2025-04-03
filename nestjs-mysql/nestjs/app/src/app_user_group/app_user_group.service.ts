import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppUserGroup, AppUserGroupDto } from './app_user_group.entity';

@Injectable()
export class AppUserGroupService {
  constructor(
    @InjectRepository(AppUserGroup)
    private repository: Repository<AppUserGroup>,
  ) {}

  async create(dto: AppUserGroupDto) {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findOne(params = {}): Promise<AppUserGroupDto | null> {
    return this.repository.findOneBy(params);
  }

  findAll(params = {}): Promise<AppUserGroup[]> {
    return this.repository.find(params);
  }

  findPaginated(params = {}): Promise<Record<string, any>> {
    return this.repository.find(params);
  }

  async update(id: number, dto: AppUserGroupDto) {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) return null;
    this.repository.merge(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
