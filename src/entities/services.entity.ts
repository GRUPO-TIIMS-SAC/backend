import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Speciality } from "./specialities.entity";
import { SubSpeciality } from "./subspecialities.entity";
import { Unit } from "./units.entity";

@Entity({ name: 'services' })
export class Service {
 
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Speciality, speciality => speciality.id)
    @JoinColumn({name: 'speciality_id'})
    @Column({nullable: false})
    speciality_id: number;

    @OneToMany(() => SubSpeciality, subspeciality => subspeciality.id)
    @JoinColumn({name: 'subspeciality_id'})
    @Column({nullable: false})
    subspeciality_id: number;

    @ManyToOne(() => Unit, unit => unit.id)
    @JoinColumn({name: 'unit_id'})
    @Column({nullable: false})
    unit_id: number;

    @Column({type: 'double', nullable: false})
    amount: number;
}