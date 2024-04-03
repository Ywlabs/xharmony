import { BatchService } from './batch.service';
/*
https://docs.nestjs.com/modules
배치 Cron관련 기능을 담당
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [],
    providers: [BatchService],
    exports: [BatchService],
})
export class BatchModule { }
