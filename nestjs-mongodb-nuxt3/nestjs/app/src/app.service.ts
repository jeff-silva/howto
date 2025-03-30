import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  load(): Record<string, any> {
    return {};
  }
}
