/*
https://docs.nestjs.com/providers#services
*/

import { Injectable , Logger} from '@nestjs/common';
import { EachMessagePayload, Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class KafkaService { 
    
    private readonly logger = new Logger(KafkaService.name);

    private kafka = new Kafka({
        clientId: "cumsumer1_"+uuidv4(),
        brokers: [this.config.get('KAFKA_HOST')],
    });
    //프로듀서
    private producer = this.kafka.producer();
    private consumer = this.kafka.consumer({ groupId: this.config.get('KAFKA_GROUP') });


    constructor(
        private readonly config: ConfigService,   

    ){    

        this.producer.connect();
        this.consumer.connect();//접속
        this.consumer.subscribe({ topics: ['test-topic'] });//구독
        this.consumer.run({//메세지 수신 뱅뱅이
            eachMessage: this.consumerCallback,//메세지 수신 콜백
        });
    }

    async pubTestTopic(msg){
        await this.producer.send({
            topic: 'test-topic',
            messages: [{value : msg}]
        });
    }

    async consumerCallback(payload: EachMessagePayload) {//메세지 수신 콜백
        console.log('kafka message arrived');
        console.log(
          `topic: ${payload.topic}, Message:${payload.message.value.toString()}`,
        );
    }
}
