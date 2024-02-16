import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "../../modules/auth/auth.service";
import { Payload } from "../../modules/auth/interface/payload.interface";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, "access"){
  constructor(
    private authService: AuthService,
    private readonly config: ConfigService
  ) {
    super({
      //AuthHeader의 엑세스토큰을 검증
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //만료시간을 무시할지 말지(ture: 만료되어도 검증 성공, false: 만료된다면 검증 실패)
      ignoreExpiration: true,
      //엑세스토큰 검증 비밀키
      secretOrKey: config.get('JWT_ACCESS_KEY'),
      passReqToCallback: false,
    });
  }
  
  async validate(payload: Payload, done: VerifiedCallback) : Promise<any> {
    const user = await this.authService.verifty(payload);
    if(!user) {
      return done(new UnauthorizedException({message: '존재하지 않는 사용자정보'}), false)
    }
    return done(null, user);
  }
  
}