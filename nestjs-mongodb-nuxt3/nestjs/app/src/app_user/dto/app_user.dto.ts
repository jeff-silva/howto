/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsString, IsArray } from 'class-validator';

export class AppUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsArray()
  contacts: { type: string; value: string }[];

  @IsArray()
  addresses: {
    name: string;
    route: string;
    number: string;
    complement: string;
    zipcode: string;
    neighborhood: string;
    city: string;
    city_code: string;
    state: string;
    state_code: string;
    country: string;
    country_code: string;
    lat: number;
    lng: number;
  }[];
}
