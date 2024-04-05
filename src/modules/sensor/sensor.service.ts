import { HttpException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import { SensorRepository } from './sensor.repository';
import { Sensor } from './entities/sensor.entity';

@Injectable()
export class SensorService {
    private readonly logger = new Logger(SensorService.name);

    constructor(
      private readonly dao: SensorRepository,
    ){}
    
    async getlist() : Promise<Sensor[]> {
        
        this.logger.debug("Call list")
        
        return this.dao.find({
            order: {seq: "DESC"},
            skip: 0,
            take: 15,
        })
    }
}
