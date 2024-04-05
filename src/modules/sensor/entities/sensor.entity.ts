import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("sensor_data")
export class Sensor extends BaseEntity{
    @PrimaryGeneratedColumn()
    seq : number;
    
    @Column({nullable : false})
    deviceid : string;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data01 : number;

    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data02 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data03 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data04 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data05 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data06 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data07 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data08 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data09 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data10 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data11 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data12 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data13 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data14 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data15 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data16 : number;
    

    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data17 : number;
    

    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data18 : number;
    

    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data19 : number;
    
    @Column({nullable : true, type: "decimal", precision: 38, scale: 2})
    data20 : number;
    
    @UpdateDateColumn()
    create_date : Date;
    
    @UpdateDateColumn()
    update_date : Date;
}