import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppUserDto } from './app_user.dto';
import { AppUser } from './app_user.entity';

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

  findAll(): Promise<AppUser[]> {
    return this.repository.find();
  }

  findOne(id: number): Promise<AppUser | null> {
    return this.repository.findOneBy({ id });
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
