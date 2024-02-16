import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, IsNull, OneToMany, PrimaryColumn } from "typeorm";
import * as argon2 from "argon2";
import { UsersAuth } from "./users.auth.entity";

@Entity("users")
export class Users extends BaseEntity{
    @PrimaryColumn()
    userid : string;
    
    @Column()
    username : string;
    
    @Column()
    password : string;
    
    @Column()
    email : string;

    @Column({unique: false,nullable: true})    
    refresh_token? : string;

    @Column({ type: 'timestamp', nullable: true })
    refresh_token_dt?: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        this.password = await argon2.hash(this.password);
    }
    //사용자 권한 관리 
    @OneToMany(()=>UsersAuth, usersAuth => usersAuth.users, {eager: true})
    auths?: any[];
}