import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUsersDto, LoginUserDto, UpdateTokenDto, ReflashTokenDto} from 'src/modules/users/dto/users.dto';
import { UsersService } from 'src/modules/users/users.service';
import { Payload } from './interface/payload.interface';
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';
import * as argon2 from "argon2";
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Users } from '../users/entities/users.entity';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor(
      private readonly users: UsersService,
      private readonly jwt: JwtService,
      private readonly config: ConfigService
  ) {}
  
  async login(dto: LoginUserDto) : Promise<any> {

    //DB를 통해 객체 체크
    const user = await this.users.findOne(dto.userid);
    if(!user){
      throw new UnauthorizedException("일치하는 사용자가 없습니다.");  
    } 
    //패스워드 검증
    if (!await argon2.verify(user.password, dto.password)){
      throw new UnauthorizedException("패스워드가 일치하지 않습니다.");
    }

    //토큰을 생성하고
    const payload : Payload = {
      userid: user.userid,
      username: user.username,
      email: user.email,
      auths: []
    }
    //사용자 권한 테이블이랑 매핑하여 처리 
    this.convertInAuthorities(user);
    
    const access_token = await this.generateToken(payload);
    const refresh_token = await this.generateRefreshToken(payload);
    const req = {userid : user.userid, refresh_token : (await argon2.hash(refresh_token)).toString()};
    await this.users.updateToken(req);

    return {
      access_token, refresh_token
    };
  }

  //토큰 갱신
  async refresh(refreshTokenDto: ReflashTokenDto): Promise<any> {
    const { refresh_token } = refreshTokenDto;
    // Verify refresh token
    // JWT Refresh Token 검증 로직
    const decodedRefreshToken = this.jwt.verify(refresh_token, { secret: this.config.get('JWT_REFRESH_KEY') });
    // Check if user exists
    const userId = decodedRefreshToken.userid;
    const user = await this.users.validateRefreshTokenMatches(refresh_token, userId);
    if (!user) {
      throw new UnauthorizedException('토큰 정보가 존재하지 않습니다.');
    }
    // Generate new access token
    const payload: Payload = {
      userid: user.userid,
      username: user.username,
      email: user.email,
      auths: []
    }

    //사용자 권한 테이블이랑 매핑하여 처리 
    this.convertInAuthorities(user);
    
    const access_token = await this.generateToken(payload);
    return {access_token};
  }

  //토큰 제거 처리 
  async removeToken(userId: string): Promise<any> {
    return await this.users.removeToken(userId);
  }

  //인증토큰 생성
  async generateToken(payload:Payload): Promise<string> {
    return this.jwt.signAsync(payload,{
      secret: this.config.get('JWT_ACCESS_KEY'),
      expiresIn: this.config.get('JWT_ACCESS_MS'),
    });
  }

  //RefreshToken 생성
  async generateRefreshToken(payload:Payload): Promise<string> {
    return this.jwt.signAsync({userid: payload.userid}, {
      secret: this.config.get('JWT_REFRESH_KEY'),
      expiresIn: this.config.get('JWT_REFRESH_MS'),
    });
  }

  async verifty(payload: Payload): Promise<Users | undefined> {
    const user = this.users.findOne(payload.userid);
    this.flatAuthorities(user)
    return user;
  }

  private flatAuthorities(user: any): Users {
    if (user && user.auths) {
        const authorities: string[] = [];
        user.auths.forEach(obj => authorities.push(obj.auth_name));
        user.auths = authorities;
    }
    return user;
  }
  
  private convertInAuthorities(user: any): Users {
    if (user && user.authorities) {
        const authorities: any[] = [];
        user.auths.forEach(obj => authorities.push({ name: obj.auth_name }));
        user.auths = authorities;
    }
    return user;
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0'
    ];
  }

  /*private flatAuthorities(user: any): User {
    
    return user;
  }*/
}
