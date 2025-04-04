/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

  protected generateUUID() {
    return (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).replace(
      /[018]/g,
      (c: string) =>
        (
          Number(c) ^
          (crypto.getRandomValues(new Uint8Array(1))[0] &
            (15 >> (Number(c) / 4)))
        ).toString(16),
    );
  }

  async create(dto: AppFileDto, content: Express.Multer.File) {
    const base64 = Buffer.from(content.buffer).toString('base64');
    dto.name = content.originalname.replace(/(.*)\.[^.]+$/, '$1');
    dto.mime = content.mimetype;
    dto.size = content.size;
    dto.path =
      this.generateUUID() + '.' + content.originalname.split('.').pop();
    dto.content = `data:${dto.mime};base64,${base64}`;
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
