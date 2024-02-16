import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Users } from "./users.entity";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity('users_auth')
export class UsersAuth {
    @PrimaryColumn()
    id: number;

    @Column('string',{name: 'userid'})
    userid: string;

    @Column('varchar',{name: 'auth_name'})
    auth_name: string;

    @ManyToOne(type=>Users, users=>users.auths)
    @JoinColumn({name: 'userid'})
    users: Users;

    @ApiProperty({ example: '등록일자' })
    @IsString()
    create_date?: string
  
    @ApiProperty({ example: '업데이트일자' })
    @IsString()
    update_date?: string
}