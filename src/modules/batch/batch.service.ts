import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { KafkaService } from '../kafka/kafka.service';
import { MqttService } from '../mqtt/mqtt.service';

/*배치서비스 구현부*/

@Injectable()
export class BatchService { 

    private readonly logger = new Logger(BatchService.name);

    constructor(
      private readonly dataSource: DataSource,
      private readonly mqtt: MqttService
    ){}

    private getNow() {
      const currentTime = new Date();
      // 미국시간 기준이니까 9를 더해주면 대한민국 시간됨
      currentTime.setHours(currentTime.getHours() + 9);
      // 문자열로 바꿔주고 T를 빈칸으로 바꿔주면 yyyy-mm-dd hh:mm:ss 이런 형식 나옴
      return currentTime.toISOString().replace("T", " ").substring(0, 19)
    }
   

    @Cron(CronExpression.EVERY_6_HOURS,{}) 
    async deleteExpiredRefreshToken() {
  
      this.logger.debug('만료된 deleteExpiredRefreshToken 정리 작업 진행 : EVERY_6_HOURS');
      var yyyymmdd = this.getNow();


      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      try {
        const usersWithExpiredTokens = await queryRunner.query("SELECT * FROM users WHERE refresh_token_dt in ($1)", [yyyymmdd]);
        for (const users of usersWithExpiredTokens) {
          if (users.refresh_token_dt) {
            await queryRunner.query("UPDATE users SET refresh_token_dt=null,  refresh_token = null WHERE userid = $1", [users.userid]);
          }
        }
        await queryRunner.commitTransaction();
      }catch{
        await queryRunner.rollbackTransaction();
      }finally{
        await queryRunner.release();
      }
    }

    // 프로그램 배치 돌릴때 사용하는 방식 (QueryRunner 객체를 활용 및 트랜젝션 관리)
    @Cron(CronExpression.EVERY_MINUTE,{}) 
    async insertSensorData() {
  
      this.logger.debug('센싱데이터 배치시작: insertSensorData : EVERY_MINUTE');
      

      let blnResult = true;

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      try {
      
       await queryRunner.query(`       
                  insert into sensor_data 
                  (deviceid ,
                    data01,
                    data02,
                    data03,
                    data04,
                    data05,
                    data06,
                    data07,
                    data08,
                    data09,
                    data10,
                    data11,
                    data12,
                    data13,
                    data14,
                    data15,
                    data16,
                    data17,
                    data18,
                    data19,
                    data20,
                    create_date,
                    update_date
                  )
                  select 
                    deviceid ,
                    round(cast(random()*14 as numeric),3),
                    round(cast(random()*10 as numeric),3),
                    round(cast(random()*20 as numeric),3),
                    round(cast(random()*30 as numeric),3),
                    round(cast(random()*11 as numeric),3),
                    round(cast(random()*5 as numeric),3),
                    round(cast(random()*3 as numeric),3),
                    round(cast(random()*13 as numeric),3),
                    round(cast(random()*17 as numeric),3),
                    round(cast(random()*60 as numeric),3),
                    round(cast(random()*77 as numeric),3),
                    round(cast(random()*35 as numeric),3),
                    round(cast(random()*92 as numeric),3),
                    round(cast(random()*15 as numeric),3),
                    round(cast(random()*53 as numeric),3),
                    round(cast(random()*23 as numeric),3),
                    round(cast(random()*66 as numeric),3),
                    round(cast(random()*11 as numeric),3),
                    round(cast(random()*24 as numeric),3),
                    round(cast(random()*23 as numeric),3),
                    now(),
                    now()
                  from sensor
                  `);
          
        await queryRunner.commitTransaction();

      }catch{
        blnResult = false;
        await queryRunner.rollbackTransaction();
      }finally{
        await queryRunner.release();
      }
      //카프카 서버한테 전달 해준다. 
      await this.mqtt.pubTestTopic({evtid : '01', msg : this.getNow() +" 수집", result : blnResult});
    }
}
