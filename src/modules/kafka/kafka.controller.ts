import { Controller, Get, Inject } from '@nestjs/common';
import { EachMessagePayload, Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';


@Controller({ path: "kafka", version: "1" })
export class KafkaController { 
    /*카프카 접속 진행*/
    private kafka = new Kafka({
        clientId: "cumsumer1_"+uuidv4(),
        brokers: ['1.233.71.51:19092'],
    })
    //프로듀서
    private producer = this.kafka.producer();
    
    constructor(){
        this.producer.connect();//접속
    }

    @Get("/test")
    async sendMsg(){
        await this.producer.send({
            topic: 'test-topic',
            messages: [
                { key: 'key1', value: 'hello world', partition: 0 },
                { key: 'key2', value: 'hey hey!', partition: 1 }
            ],
        });
    }
}
