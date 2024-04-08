/*
https://docs.nestjs.com/providers#services
*/

import { Injectable , Logger} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect } from "mqtt";


@Injectable()
export class MqttService { 

    private readonly logger = new Logger(MqttService.name);

    private client = connect(this.config.get('MQTT_HOST'),{
        username: this.config.get('MQTT_USERNAME'),
        password: this.config.get('MQTT_PASSWORD')
    });

    private topic_id = "test-topic";

    constructor(
        private readonly config: ConfigService,   
    ){}
    //토픽센더..
    async pubTestTopic(msg){
        let msgtopic = JSON.stringify(msg)
        this.logger.debug(msgtopic);
        this.client.publish(this.topic_id,msgtopic);
    }
}
