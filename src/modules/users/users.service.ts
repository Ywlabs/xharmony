import { BadRequestException, HttpException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CustomUsersRepository } from './users.repository';
import { CreateUsersDto,UpdateTokenDto } from './dto/users.dto';
import { Users } from './entities/users.entity';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import * as argon2 from "argon2";

@Injectable()
export class UsersService {
    
    private readonly logger = new Logger(UsersService.name);

    constructor(
        private readonly dao: CustomUsersRepository,
        private readonly config: ConfigService
    ) {}
  
    async create(dto: CreateUsersDto) : Promise<Users> {

        if(await this.findOne(dto.userid)){
            throw new UnauthorizedException("이미존재하는 계정입니다.");  
        }
        const user = plainToInstance(Users, instanceToPlain(dto));
        return this.dao.save(user);
    }

    async findOne(userid: string) : Promise<any>{
        const user = await this.dao.findOne({where : {userid : userid}});
        return user;
    }
    
    async updateToken(dto:UpdateTokenDto) : Promise<Users>{
        const user = plainToInstance(Users, instanceToPlain(dto));
        const currentRefreshTokenDt = new Date(new Date().getTime() + parseInt(this.config.get<string>('JWT_REFRESH_MS')));

        await this.dao.update(dto.userid, {refresh_token : dto.refresh_token, refresh_token_dt:currentRefreshTokenDt})
        return user;
    }

        
    async removeToken(userId:string) : Promise<Object>{
        return await this.dao.update(userId, {refresh_token : null, refresh_token_dt:null})
    }

    async validateRefreshTokenMatches(refreshToken: string, userId: string): Promise<Users> {
        const user : Users= await this.findOne(userId);
        // user에 currentRefreshToken이 없다면 null을 반환 (즉, 토큰 값이 null일 경우)
        if (!user.refresh_token) {
          return null;
        }
        
        if (!argon2.verify(user.refresh_token, refreshToken)){
            throw new UnauthorizedException("패스워드가 일치하지 않습니다.");
        }
        return user;
    }
}
