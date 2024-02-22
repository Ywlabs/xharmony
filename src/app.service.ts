import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(){}

  async getHello(){
    return 'This Application is YWLABS NestJS BackEnd';
  }
}
