import { MqttService } from './mqtt.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [],
    providers: [MqttService],
    exports: [MqttService],
})
export class MqttModule { }
