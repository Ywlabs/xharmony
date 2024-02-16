import { ParseIntPipe } from '@nestjs/common';
import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsAlpha,
  IsAlphanumeric,
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

class RequestBaseDto {
  @ApiProperty({ example: '제목입니다.'})
  @IsString()
  userid: string;

  @ApiProperty({ example: '이름.' })
  @IsString()
  username: string;

  @ApiProperty({ example: '패스워드'})
  @IsString()
  password: string

  @ApiProperty({ example: '이메일' })
  @IsString()
  email: string

  @ApiProperty({ example: 'ACCESS토큰' })
  @IsString()
  access_token?: string

  @ApiProperty({ example: '리플래시토큰' })
  @IsString()
  refresh_token?: string

}

export class CreateUsersDto extends PickType(RequestBaseDto, [
  'userid','username','password','email'
] as const) {}


export class LoginUserDto extends PickType(RequestBaseDto, [
  'userid','password'
] as const) {}

export class UpdateTokenDto extends PickType(RequestBaseDto, [
  'userid','refresh_token'
] as const) {}


export class ReflashTokenDto extends PickType(RequestBaseDto, [
  'refresh_token'
] as const) {}