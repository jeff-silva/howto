import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppUser } from 'src/app_user/app_user.entity';

@Entity('app_file')
export class AppFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  path: string;

  @Column({ default: null })
  size: number;

  @Column({ default: null })
  mime: string;

  @Column('longtext', { default: null })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => AppUser, (user) => user.group)
  users: AppUser[];
}

export class AppFileDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Description' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'file.txt' })
  path: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, example: 1024 })
  size: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'text/plain' })
  mime: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, format: 'binary' })
  content: any;
}
