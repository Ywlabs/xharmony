import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { KafkaService } from '../kafka/kafka.service';
import { MqttService } from '../mqtt/mqtt.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

/*배치서비스 구현부*/

@Injectable()
export class BatchService { 

    private readonly logger = new Logger(BatchService.name);

    constructor(
      private readonly dataSource: DataSource,
      private readonly mqtt: MqttService,
      private readonly httpService: HttpService,
      
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
        throw new Error("API DB Insert Error");
      }
    }

    // 프로그램 배치 돌릴때 사용하는 방식 (QueryRunner 객체를 활용 및 트랜젝션 관리)
    @Cron(CronExpression.EVERY_MINUTE,{}) 
    async setRandomSensorData() {
  
      this.logger.debug('센싱데이터 배치시작: insertSensorData : EVERY_MINUTE');
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
        await queryRunner.rollbackTransaction();
        throw new Error("API DB Insert Error");
      }
      //카프카 서버한테 전달 해준다. 
      await this.mqtt.pubTestTopic({evtid : '01', msg : this.getNow() +" 수집", result : "success"});
    }


    // 예측진료정보조회서비스
    @Cron(CronExpression.EVERY_5_MINUTES,{}) 
    async setDissForecastInfoSvc() {
      /*const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        'Authorization': `Basic ${encodeToken}`,
      };*/

      this.logger.debug('예측진료정보조회서비스: setDissForecastInfoSvc : EVERY_10_HOURS');      
      const apiHost  = "http://apis.data.go.kr/B550928/dissForecastInfoSvc/getDissForecastInfo";
      const serviceKey  = "OagSc9ZABwn2cuw5Z6Si/KowFuFO6Zdz2CvRkSuWJp7YG59eCFyeMhHga88rgdmzOvZM5FWFxtaJZ5JEjTBPZA==";
      const numOfRows  = "1000";
      const dissCd  = {1 : "감기",2 : "눈병",3 : "식중독",4 : "천식",5 : "피부염",15 : "심뇌혈관 질환"}; 
      const pageNo  = "1";
      const type  = "json";
      const znCd  = "11";
      //STEP#1 : 
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try{
        Object.keys(dissCd).forEach(async key => {
          let params = {serviceKey:serviceKey,numOfRows:numOfRows,pageNo:pageNo,dissCd:key,type:type,znCd:znCd};
          let { data } = await firstValueFrom(
            this.httpService.get(apiHost,{params}).pipe(
              catchError(async (error: AxiosError) => {
                throw new Error("API Call Error");
              }),
            ),
          );
          data.response.body.items.forEach(async (obj)=>{    
            await queryRunner.query(`       
              insert into diss_data 
              (
                dissCd ,
                dt,
                znCd,
                lowrnkZnCd,
                cnt,
                risk,
                dissRiskXpln,
                create_date,
                update_date
              )values(
                '${obj.dissCd}',
                '${obj.dt}',
                '${obj.znCd}',
                '${obj.lowrnkZnCd}',
                '${obj.cnt}',
                '${obj.risk}',
                '${obj.dissRiskXpln}',
                now(),
                now()
              )`);  
          });
        });
        await queryRunner.commitTransaction();
      }catch(e){
        await queryRunner.rollbackTransaction();
        throw new Error("API DB Insert Error");
      }
  }
}