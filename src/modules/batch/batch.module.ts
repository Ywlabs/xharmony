import { BatchService } from './batch.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [],
    providers: [BatchService],
    exports: [BatchService],
})
export class BatchModule { }
