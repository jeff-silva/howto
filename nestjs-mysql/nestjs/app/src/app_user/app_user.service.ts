import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppUser, AppUserDto } from './app_user.entity';

@Injectable()
export class AppUserService {
  constructor(
    @InjectRepository(AppUser)
    private repository: Repository<AppUser>,
  ) {}

  async create(dto: AppUserDto) {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findOne(params = {}): Promise<AppUserDto | null> {
    return this.repository.findOneBy(params);
  }

  findAll(params = {}): Promise<AppUser[]> {
    return this.repository.find(params);
  }

  findPaginated(params = {}): Promise<Record<string, any>> {
    return this.repository.find(params);
  }

  async update(id: number, dto: AppUserDto) {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) return null;
    this.repository.merge(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
