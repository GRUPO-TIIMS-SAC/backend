import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'nacionalities' })
export class Nacionality {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 25 ,nullable: false})
    nacionality: string;
}