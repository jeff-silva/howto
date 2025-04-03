#!/bin/sh

to_snake_case() {
  local input="$1"
  local snake_case

  # Converter para minúsculas e substituir espaços por sublinhados
  snake_case=$(echo "$input" | tr '[:upper:]' '[:lower:]' | sed 's/ /_/g' | sed 's/[^a-z0-9_]//g')

  echo "$snake_case"
}

to_studly_case() {
  local input="$1"
  local studly_case

  # Capitalizar a primeira letra de cada palavra e remover caracteres não alfanuméricos
  studly_case=$(echo "$input" | sed -e 's/\b./\u&/g' | sed 's/[^a-zA-Z0-9]//g')

  echo "$studly_case"
}

read -p "Nome do módulo (separado por espaço, por ex: \"app user\"): " value
value_snake=$(to_snake_case "$value")
value_studly=$(to_studly_case "$value")

nest g resource "$value_snake"

rm -rf "./src/${value_snake}/dto"
rm -rf "./src/${value_snake}/entities"

cat <<EOF > ./src/$value_snake/$value_snake.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ${value_studly}Controller } from './${value_snake}.controller';
import { ${value_studly}Service } from './${value_snake}.service';

describe('${value_studly}Controller', () => {
  let controller: ${value_studly}Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [${value_studly}Controller],
      providers: [${value_studly}Service],
    }).compile();

    controller = module.get<${value_studly}Controller>(${value_studly}Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
EOF

cat <<EOF > ./src/$value_snake/$value_snake.controller.ts
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ${value_studly}Service } from './${value_snake}.service';
import { ${value_studly}Dto } from './${value_snake}.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('${value_snake}')
@Controller('${value_snake}')
export class ${value_studly}Controller {
  constructor(private readonly service: ${value_studly}Service) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async create(@Body() dto: ${value_studly}Dto) {
    const entity = await this.service.create(dto);
    return { entity };
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number) {
    const entity = this.service.findOne({ id });
    return { entity };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() dto: ${value_studly}Dto) {
    const entity = await this.service.update(+id, dto);
    return { entity };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    const entity = await this.service.remove(+id);
    return { entity };
  }
}
EOF

cat <<EOF > ./src/$value_snake/$value_snake.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

@Entity('${value_snake}')
export class ${value_studly} {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;
}

export class ${value_studly}Dto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
EOF

cat <<EOF > ./src/$value_snake/$value_snake.module.ts
import { Module } from '@nestjs/common';
import { ${value_studly}Service } from './${value_snake}.service';
import { ${value_studly}Controller } from './${value_snake}.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${value_studly} } from './${value_snake}.entity';

@Module({
  imports: [TypeOrmModule.forFeature([${value_studly}])],
  controllers: [${value_studly}Controller],
  providers: [${value_studly}Service],
  exports: [${value_studly}Service],
})
export class ${value_studly}Module {}
EOF

cat <<EOF > ./src/$value_snake/$value_snake.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ${value_studly}Service } from './${value_snake}.service';

describe('${value_studly}Service', () => {
  let service: ${value_studly}Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [${value_studly}Service],
    }).compile();

    service = module.get<${value_studly}Service>(${value_studly}Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
EOF

cat <<EOF > ./src/$value_snake/$value_snake.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ${value_studly}, ${value_studly}Dto } from './${value_snake}.entity';

@Injectable()
export class ${value_studly}Service {
  constructor(
    @InjectRepository(${value_studly})
    private repository: Repository<${value_studly}>,
  ) {}

  async create(dto: ${value_studly}Dto) {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findOne(params = {}): Promise<${value_studly}Dto | null> {
    return this.repository.findOneBy(params);
  }

  findAll(params = {}): Promise<${value_studly}[]> {
    return this.repository.find(params);
  }

  findPaginated(params = {}): Promise<Record<string, any>> {
    return this.repository.find(params);
  }

  async update(id: number, dto: ${value_studly}Dto) {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) return null;
    this.repository.merge(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
EOF

echo "Insert \"${value_studly}\" service on \"TypeOrmModule.forRoot entities\" in \"app.module.ts\" file."

chmod 0777 -R .
