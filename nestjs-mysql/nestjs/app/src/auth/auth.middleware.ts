/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AppUserService } from 'src/app_user/app_user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private appUserService: AppUserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    req['user'] = null;

    const token = this.extractTokenFromHeader(req);
    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: 'app',
        });
        if (payload.sub) {
          req['user'] = await this.appUserService.findOne({ id: payload.sub });
        }
      } catch (err) {}
    }

    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
