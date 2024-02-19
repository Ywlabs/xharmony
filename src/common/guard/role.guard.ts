import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Users } from '../../modules/users/entities/users.entity';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        //데코레이터에 정의된 Role 정보배열 값을 가져온다.
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        //정의된 롤이 없으면 통과 
        if (!roles) {
            return true;
        }
        //토큰 기반으로 Users 정보 가져온다. 
        const request = context.switchToHttp().getRequest();
        const user = request.user as Users;
        
        //선언된 값과 비교해서 최종 권한처리를 진행한다.
        return user && user.auths && user.auths.some(role => roles.includes(role.auth_name));
    }
}