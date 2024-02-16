import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config';

export const CrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const option = {
      type: configService.get('db.type'),
      host: configService.get('db.host'),
      port: configService.get('db.port'),
      username: configService.get('db.username'),
      password: configService.get('db.password'),
      database: configService.get('db.database'),
      synchronize: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      logging: true,
      autoLoadEntities: false, //이 옵션은 엔티티 클래스를 자동으로 로드하고 데이터베이스와 동기화
      // dist/migrations에 있는 파일들을 실행
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    };
    return option;
  },
};
