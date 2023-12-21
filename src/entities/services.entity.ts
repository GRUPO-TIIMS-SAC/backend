import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

Entity({ name: 'services' })
export class Service {
 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    speciality_id: number;

    @Column({nullable: false})
    subspeciality_id: number;

    @Column({nullable: false})
    unit_id: number;

    @Column({type: 'double', nullable: false})
    amount: number;
}