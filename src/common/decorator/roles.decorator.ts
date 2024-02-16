import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../enum/roles.enum';

//롤처리 decorator 선언
export const Roles = (...roles: RoleType[]): any => SetMetadata('roles', roles);

