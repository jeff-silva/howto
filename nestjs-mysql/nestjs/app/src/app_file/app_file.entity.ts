import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity('app_file')
export class AppFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column()
  path: string;

  @Column()
  size: number;

  @Column()
  mime: string;

  @Column('longtext')
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export class AppFileDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'filename.txt' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'algo.txt' })
  path: string;

  @IsNumber()
  @ApiProperty({ type: Number, example: 1024 })
  size: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'text/plain' })
  mime: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'base64encodedstring...' })
  content: string;
}
