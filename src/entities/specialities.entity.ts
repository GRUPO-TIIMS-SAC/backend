import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'specialities' })
export class Speciality {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false})
    img: string;

    @Column({nullable: false})
    created_at: Date;
}