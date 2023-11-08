import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Specialist } from "src/entities/specialists.entity";
import { Category } from "src/entities/categories.entity";
import { Unit } from "./units.entity";

@Entity({name: 'specialists_jobs'})
export class SpecialistJob{
     @PrimaryGeneratedColumn()
        id: number
    
    @JoinColumn({name: 'id_specialist', referencedColumnName: 'id'})
    id_specialist: Specialist

    @JoinColumn({name: 'id_category', referencedColumnName: 'id'})
    id_category: Category

    @Column({type: 'double', nullable: false})
    amount: number

    @JoinColumn({name: 'id_unit', referencedColumnName: 'id'})
    id_unit: Unit
}