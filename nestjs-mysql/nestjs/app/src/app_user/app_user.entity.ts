import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('app_user')
export class AppUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;
}
