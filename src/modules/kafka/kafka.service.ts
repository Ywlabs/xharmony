/*
https://docs.nestjs.com/providers#services
*/

import { Injectable , Logger} from '@nestjs/common';
import { Consumer, EachMessagePayload, Kafka, Producer } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class KafkaService { 
    
    private readonly logger = new Logger(KafkaService.name);
    //프로듀서
    private producer : Producer;
    private consumer : Consumer;
    private kafkaInfo = new Kafka({
        clientId: "cumsumer1_"+uuidv4(),
        brokers: [this.config.get('KAFKA_HOST')],
    });
    private readonly topic_id = 'test-topic';
    //카프카 컨슈머 객체 반환
    private getKafkaConsumer(): Consumer {
        return this.kafkaInfo.consumer({ groupId: this.config.get('KAFKA_GROUP') })
    }
    //카프카 프로듀셔 객체 반환 
    private getKafkaProducer() : Producer {
        return this.kafkaInfo.producer();
    }
    
    constructor(
        private readonly config: ConfigService,   
    ){    
        this.producer = this.getKafkaProducer();
        this.consumer = this.getKafkaConsumer();
        this.producer.connect();
        this.consumer.connect();//접속
        this.consumer.subscribe({ topics: [this.topic_id] });//구독
        this.consumer.run({//메세지 수신 뱅뱅이
            eachMessage: this.consumerCallback,//메세지 수신 콜백
        })
    }
    //토픽센더..
    async pubTestTopic(msg){
        let msgString = JSON.stringify(msg)
        console.log('[kafka][producer]'+msgString);
        
        await this.producer.send({
            topic: this.topic_id,
            messages: [
                {
                    key : uuidv4(),
                    value : msgString,
                    headers: {
                        'correlation-id': '2bfb68bb-893a-423b-a7fa-7b568cad5b67',
                        'system-id': 'ywlabs-msa',
                    }
                }],
            
        });
    }


    //토픽리시버..
    async consumerCallback(payload: EachMessagePayload) {//메세지 수신 콜백
        const { topic, partition, message } = payload;
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
        console.log(`- ${prefix} ${message.key}#${message.value}`)
    }
}
