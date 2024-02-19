import { HealthController } from './health.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [TerminusModule,HttpModule],
    controllers: [
        HealthController,],
    providers: [],
})
export class HealthModule { }
