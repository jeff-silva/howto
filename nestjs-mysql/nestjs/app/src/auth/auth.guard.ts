/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    /**
     * request.user is generated in auth.middleware.ts
     * this middleware works in all routes to know wich user is logged or not
     * so, when works run here, request.user is defined or null
     */

    if (!request.user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
