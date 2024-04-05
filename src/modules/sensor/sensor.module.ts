import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { CustomRepositoryModule } from 'nestjs-typeorm-custom-repository';
import { SensorRepository } from './sensor.repository';

@Module({
    imports: [
        CustomRepositoryModule.forFeature([SensorRepository]),
    ],
    controllers: [SensorController],
    providers: [SensorService],
})
export class SensorModule { }
