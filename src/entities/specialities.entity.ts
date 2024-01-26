import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'specialities' })
export class Speciality {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false})
    img: string;

    @Column({nullable: false, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;
}