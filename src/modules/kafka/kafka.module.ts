import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { KafkaController } from './kafka.controller';


@Module({
    imports: [],
    controllers: [KafkaController],
    providers: [KafkaService],
    exports: [KafkaService],
})
export class KafkaModule { }
