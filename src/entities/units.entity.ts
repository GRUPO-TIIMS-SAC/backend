import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Category } from "src/entities/categories.entity";

@Entity({name: 'units'})
@Unique(['id_category', 'unit'])
export class Unit{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Category, {eager: true})
    @JoinColumn({name: 'id_category', referencedColumnName: 'id'})
    id_category: number

    @Column({length: 50, nullable: false})
    unit: string
}