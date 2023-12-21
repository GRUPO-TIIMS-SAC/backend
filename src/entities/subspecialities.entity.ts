import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'subspecialities' })
export class SubSpeciality {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    speciality_id: number;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false})
    unit_id: number;
}