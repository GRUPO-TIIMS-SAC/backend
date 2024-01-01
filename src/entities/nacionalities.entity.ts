import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'nationalities' })
export class Nationality {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 25 ,nullable: false})
    nationality: string;
}