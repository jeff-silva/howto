import { AppUser } from 'src/app_user/app_user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('app_user_group')
export class AppUserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  slug: string;

  @Column({ default: null })
  name: string;

  @OneToMany(() => AppUser, (user) => user.group)
  users: AppUser[];
}

export class AppUserGroupDto {}
