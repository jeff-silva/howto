/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppUserService } from 'src/app_user/app_user.service';

@Injectable()
export class AuthService {
  constructor(
    private appUserService: AppUserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.appUserService.findOne(email);
    if (user?.password !== password) throw new UnauthorizedException();
    return { access_token: await this.jwtService.signAsync({ sub: user.id }) };
    // return { email, password, user };
  }
}
