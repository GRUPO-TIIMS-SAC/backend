import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'units' })
export class Unit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 25 ,nullable: false})
    unit: string;

    @Column({nullable: false})
    min_amount: number;

    @Column({nullable: false})
    max_amount: number;
}