import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppFile, AppFileDto } from './app_file.entity';

@Injectable()
export class AppFileService {
  constructor(
    @InjectRepository(AppFile)
    private repository: Repository<AppFile>,
  ) {}

  async create(dto: AppFileDto) {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findOne(params = {}): Promise<AppFileDto | null> {
    return this.repository.findOneBy(params);
  }

  findAll(params = {}): Promise<AppFile[]> {
    return this.repository.find(params);
  }

  findPaginated(params = {}): Promise<Record<string, any>> {
    return this.repository.find(params);
  }

  async update(id: number, dto: AppFileDto) {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) return null;
    this.repository.merge(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
