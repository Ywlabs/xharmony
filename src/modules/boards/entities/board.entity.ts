import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("board")
export class Board extends BaseEntity{
    @PrimaryGeneratedColumn()
    seq : number;
    
    @Column()
    title : string;
    
    @Column()
    cont : string;
    
    @UpdateDateColumn()
    create_date : Date;
    
    @UpdateDateColumn()
    update_date : Date;
}