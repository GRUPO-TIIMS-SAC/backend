import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Speciality } from "./specialities.entity";
import { SubSpeciality } from "./subspecialities.entity";
import { Unit } from "./units.entity";
import { User } from "./user.entity";
import { Profile } from "./profiles.entity";

@Entity({ name: 'services' })
export class Service {
 
    @PrimaryGeneratedColumn()
    id: number;

    /* @OneToMany(() => Speciality, speciality => speciality.id)
    @JoinColumn({name: 'speciality_id'})
    @Column({nullable: false})
    speciality_id: number; */
    
    @ManyToOne(() => User, user => user.id)
    @JoinColumn({name: 'user_id'})
    @Column({nullable: false})
    user_id: number;

    @ManyToOne(() => SubSpeciality, subspeciality => subspeciality.id)
    @JoinColumn({name: 'subspeciality_id'})
    @Column({nullable: false})
    subspeciality_id: number;

    @ManyToOne(() => Unit, unit => unit.id)
    @JoinColumn({name: 'unit_id'})
    @Column({nullable: false})
    unit_id: number;

    @Column({type: 'double', nullable: false})
    amount: number;

    @Column({type: 'int', nullable: false, default: 0})
    experience: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({name: 'user_id'})
    user: User;

    @ManyToOne(() => SubSpeciality, subspecility => subspecility.id)
    @JoinColumn({name: 'subspeciality_id'})
    subspeciality: SubSpeciality;

    @ManyToOne(() => Unit, unit => unit.id)
    @JoinColumn({name: 'unit_id'})
    unit: Unit;
}