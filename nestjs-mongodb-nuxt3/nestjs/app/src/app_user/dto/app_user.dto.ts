/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsString } from 'class-validator';

export class AppUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
