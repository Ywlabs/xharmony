import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessStrategy } from '../../common/strategy/access.strategy';
import { RefreshStrategy } from '../../common/strategy/refresh.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.register({global: true}),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService,AccessStrategy,RefreshStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}