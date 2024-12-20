import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  hello(): object {
    return {
      hello: 'Hello World!',
    };
  }
}
