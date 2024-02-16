import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';

@Injectable()
export class BatchService { 

    private readonly logger = new Logger(BatchService.name);

    constructor(
        private readonly dataSource: DataSource
    ){}

    // 프로그램 배치 돌릴때 사용하는 방식 (QueryRunner 객체를 활용 및 트랜젝션 관리)
    @Cron(CronExpression.EVERY_6_HOURS,{}) 
    async deleteExpiredRefreshToken() {
  
      this.logger.debug('만료된 deleteExpiredRefreshToken 정리 작업 진행 : EVERY_6_HOURS');
      const currentTime = new Date();
      // 미국시간 기준이니까 9를 더해주면 대한민국 시간됨
      currentTime.setHours(currentTime.getHours() + 9);
      // 문자열로 바꿔주고 T를 빈칸으로 바꿔주면 yyyy-mm-dd hh:mm:ss 이런 형식 나옴
      var yyyymmdd = currentTime.toISOString().replace("T", " ").substring(0, 19)

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      try {
        const usersWithExpiredTokens = await queryRunner.query("SELECT * FROM users WHERE refresh_token_dt in $1", [yyyymmdd]);
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

}
