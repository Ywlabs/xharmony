import { Controller, Post, Body, Get, UseFilters, ParseIntPipe, UseGuards, Version, VERSION_NEUTRAL, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { Sensor } from './entities/sensor.entity';
import { CustomException } from 'src/common/exception/custom.exception';
import { FileInterceptor } from '@nestjs/platform-express/multer';

@Controller({ path: "sensor", version: "1" })
export class SensorController {
    constructor(
        private readonly sensorService: SensorService
    ) {}
    
    @Get()
    async getlist(): Promise<Sensor[]> {
      return this.sensorService.getlist();    
    }
}
