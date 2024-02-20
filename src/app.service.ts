import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This Application is YWLABS NestJS BackEnd';
  }
}
