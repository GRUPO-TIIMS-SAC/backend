import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "src/entities/categories.entity";

@Entity({name: 'units'})
export class Unit{
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn({name: 'id_category', referencedColumnName: 'id'})
    id_category: Category

    @Column({length: 50, nullable: false})
    unit: string
}