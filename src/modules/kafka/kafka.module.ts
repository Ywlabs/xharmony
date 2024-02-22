import { KafkaController } from './kafka.controller';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';


@Module({
    imports :[],
    controllers: [KafkaController],
    exports: [],
    providers: [],
})
export class KafkaModule { }
