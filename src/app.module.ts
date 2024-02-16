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

@Module({
  imports: [
    BatchModule,
    BatchModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: [`src/config/env/.${process.env.NODE_ENV}.env`],
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync(CrmConfig),
    AuthModule,
    BoardModule,
    UsersModule,
    BatchModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}