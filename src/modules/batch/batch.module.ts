import { KafkaModule} from '../kafka/kafka.module';
import { KafkaService} from '../kafka/kafka.service';
import { BatchService } from './batch.service';
/*
https://docs.nestjs.com/modules
배치 Cron관련 기능을 담당
*/

import { Module } from '@nestjs/common';

@Module({
    imports : [KafkaModule],
    exports:[BatchService],
    providers: [BatchService, KafkaService],
})
export class BatchModule { }
