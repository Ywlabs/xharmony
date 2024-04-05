import { EntityRepository } from 'nestjs-typeorm-custom-repository';
import { Repository } from 'typeorm';
import { Sensor } from './entities/sensor.entity';

@EntityRepository(Sensor)
export class SensorRepository extends Repository<Sensor> {}

