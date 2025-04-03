import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

@Entity('app_file')
export class AppFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;
}

export class AppFileDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
