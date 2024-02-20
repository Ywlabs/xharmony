import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './config/wiston/winston.config';
import { GlobalExceptionFilter } from './common/filter/all-exception.filter';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import * as cookieParser from 'cookie-parser';
import { existsSync, mkdirSync } from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, 
    {
      bufferLogs: true,
      logger: winstonLogger, // replacing logger
    }
  );

 
  //업로드 폴더 생성
  const uploadPath = 'uploads';
  if (!existsSync(uploadPath)) {
    // uploads 폴더가 존재하지 않을시, 생성합니다.
    mkdirSync(uploadPath);
  }
  
  const configService = app.get(ConfigService);
  /* White List 방식 
  var whitelist = ['https://website.com', 'https://www.website.com'];
  app.enableCors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      console.log("allowed cors for:", origin)
      callback(null, true)
    } else {
      console.log("blocked cors for:", origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
  methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
  credentials: true,
  });
  */
  //CORS 설정 
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    exposedHeaders: ['Authorization'], // * 사용할 헤더 추가.
    optionsSuccessStatus: 200,
  });
    
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe({transform:true}));
  
  //path 에 api 붙이기
  app.setGlobalPrefix('api');
  app.enableVersioning({type: VersioningType.URI,defaultVersion: '1'});
  //쿠키사용할때는 쿠키파서
  app.use(cookieParser());

  //app.useGlobalFilters(new HttpExceptionFilter()); 
  await app.listen(configService.get<number>("PORT", 3000));
}
bootstrap();
