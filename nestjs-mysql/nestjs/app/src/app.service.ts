import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  load({ user = null }): Record<string, any> {
    const resp: {
      user: any;
      env: { [key: string]: any };
    } = {
      user,
      env: {},
    };

    resp.env.NODE_ENV = process.env.NODE_ENV || 'development';
    return resp;
  }
}
