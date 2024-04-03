/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Controller('kafka')
export class KafkaController { 

    constructor(private readonly kafka: KafkaService) {}

    //꼴랑 이거 하나 추가
    @Post('topic')
    async addSubscriptionTopic(@Body('topic') topic: string): Promise<string> {
      console.log(topic);
      if (topic == undefined) {
        return 'topic is undefined';
      } else {
        await this.kafka.pubTestTopic(topic);
        return `topic ${topic} added`;
      }
    }
}
