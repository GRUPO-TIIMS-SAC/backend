import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'genders'})
export class Gender{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({length: 25 ,nullable: false})
    gender:string;    
}