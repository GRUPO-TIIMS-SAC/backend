import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Speciality } from "./specialities.entity";

@Entity({ name: 'subspecialities' })
export class SubSpeciality {
    
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Speciality, speciality => speciality.id)
    @JoinColumn({name: 'speciality_id'})
    @Column({nullable: false})
    speciality_id: number;

    @Column({nullable: false})
    name: string;
}