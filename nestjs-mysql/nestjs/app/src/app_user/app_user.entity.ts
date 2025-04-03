import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
