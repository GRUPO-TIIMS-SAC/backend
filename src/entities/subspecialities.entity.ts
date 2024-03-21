import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Speciality } from "./specialities.entity";

@Entity({ name: 'subspecialities' })
export class SubSpeciality {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Speciality, speciality => speciality.id)
    @JoinColumn({name: 'speciality_id'})
    @Column({nullable: false})
    speciality_id: number;

    @Column({nullable: false})
    name: string;

    @ManyToOne(() => Speciality, speciality => speciality.id)
    @JoinColumn({name: 'speciality_id'})
    speciality: Speciality;

    @Column({type:'double', default: 0 ,nullable: false})
    base_price: number;
}