import { KafkaModule } from './modules/kafka/kafka.module';
import { UploadModule } from './modules/upload/upload.module';
import { HealthModule } from './modules/health/health.module';
import { BatchModule } from './modules/batch/batch.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './modules/boards/board.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmConfig } from './config/database/orm.config'
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/config";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: [`src/config/env/.${process.env.NODE_ENV}.env`],
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync(CrmConfig),
    //배치모듈에 대한 글로벌 옵션 지정 
    ScheduleModule.forRoot(),
    //현재폴더기준으로 경로찿기 
    //업로드 폴더 정적폴더로 처리함
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'uploads'),
      serveRoot: '/img', //가상디렉토리 설정 img로 접근 가능하게.
      exclude: ['/api*'],
      serveStaticOptions: { index: false, redirect: false },
    }),
    AuthModule,
    BoardModule,
    UsersModule,
    BatchModule,
    HealthModule,
    UploadModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}