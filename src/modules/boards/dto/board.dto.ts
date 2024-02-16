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
  @ApiProperty({ example: '1' })
  @IsNumber()
  seq : number;

  @ApiProperty({ example: '제목입니다.' })
  @IsString()
  title: string;

  @ApiProperty({ example: '내용입니다.' })
  @IsString()
  cont?: string;

  @ApiProperty({ example: '등록일자' })
  @IsString()
  create_date?: string

  @ApiProperty({ example: '업데이트일자' })
  @IsString()
  update_date?: string
}

export class CreateBoardDto extends PickType(RequestBaseDto, [
  'title',
  'cont',
] as const) {}

export class UpdateBoardDto extends PickType(RequestBaseDto, [
  'title',
  'cont',
] as const) {}