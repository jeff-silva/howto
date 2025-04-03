/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AppUserGroup } from 'src/app_user_group/app_user_group.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@Entity('app_user')
export class AppUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  email: string;

  @Column({ default: null })
  phone: string;

  @Column({ default: null })
  password: string;

  @Column({ nullable: true })
  group_id: number;

  @ManyToOne(() => AppUserGroup, (group) => group.users)
  @JoinColumn({ name: 'group_id' })
  group: AppUserGroup;

  async onSave() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeInsert()
  async beforeInsert() {
    await this.onSave();
  }

  @BeforeUpdate()
  async beforeUpdate() {
    await this.onSave();
  }
}

export class AppUserDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsNumber()
  @IsOptional()
  group_id: number;
}
