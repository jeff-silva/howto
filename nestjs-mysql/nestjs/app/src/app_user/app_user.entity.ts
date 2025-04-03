import { AppUserGroup } from 'src/app_user_group/app_user_group.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ nullable: true }) // Permite valores nulos
  group_id: number; // Coluna para a chave estrangeira

  @ManyToOne(() => AppUserGroup, (group) => group.users)
  @JoinColumn({ name: 'group_id' })
  group: AppUserGroup;
}

export class AppUserDto {}
