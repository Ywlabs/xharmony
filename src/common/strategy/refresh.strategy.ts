import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { UsersService } from 'src/modules/users/users.service';

import { Payload } from "../../modules/auth/interface/payload.interface";
import { ConfigService } from "@nestjs/config";
import { Users } from "src/modules/users/entities/users.entity";
import { Request } from "express";


@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh"){
  
  constructor(
    private userService: UsersService,
    private readonly config: ConfigService
  ) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          (request: any) => {
            let token = null;
            if (request && request.cookies) {
              token = request.cookies['refresh_token']; 
            }
            return token;
          },
        ]),
        //true로 설정하면 Passport에 토큰 검증을 위임하지 않고 직접 검증, false는 Passport에 검증 위임
        ignoreExpiration: false,
        secretOrKey: config.get('JWT_REFRESH_KEY'),
        passReqToCallback: true,
      }
    )
  }
  
  async validate(req: Request, payload: Payload){ 
    const refreshToken = req.cookies['refresh_token'];
    const user: Users = await this.userService.validateRefreshTokenMatches(
      refreshToken,
      payload.userid
    );
    return user;
  }
}