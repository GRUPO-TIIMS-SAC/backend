import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Specialist } from "src/entities/specialists.entity";
import { Category } from "src/entities/categories.entity";
import { Unit } from "./units.entity";

@Entity({name: 'specialists_jobs'})
export class SpecialistJob{
     @PrimaryGeneratedColumn()
        id: number
    
    @ManyToOne(() => Specialist, {eager: true})
    @JoinColumn({name: 'id_specialist', referencedColumnName: 'id'})
    id_specialist: number

    @ManyToOne(() => Category, {eager: true})
    @JoinColumn({name: 'id_category', referencedColumnName: 'id'})
    id_category: number

    @ManyToOne(() => Unit, {eager: true})
    @Column({type: 'double', nullable: false})
    amount: number

    @JoinColumn({name: 'id_unit', referencedColumnName: 'id'})
    id_unit: number
}