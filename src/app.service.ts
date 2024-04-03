import { Inject, Injectable } from '@nestjs/common';
import { DateTime } from "luxon";

@Injectable()
export class AppService {
  constructor(){}

  async getHello(){
    return DateTime.now().toISO();
  }
}
