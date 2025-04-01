/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsArray, IsOptional } from 'class-validator';

export class AppUserDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  password: string;

  @IsArray()
  @ApiProperty({ default: [{ type: 'email', value: 'mail@grr.la' }] })
  contacts: { type: string; value: string }[];

  @IsArray()
  @ApiProperty({
    default: [
      {
        name: '',
        route: '',
        number: '',
        complement: '',
        zipcode: '',
        neighborhood: '',
        city: '',
        city_code: '',
        state: '',
        state_code: '',
        country: '',
        country_code: '',
        lat: 0,
        lng: 0,
      },
    ],
  })
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
