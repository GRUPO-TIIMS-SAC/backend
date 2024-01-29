import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Speciality } from "./specialities.entity";

@Entity({ name: 'favorites_users' })
export class FavoritesUsers {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({name: 'user_id'})
    @Column({nullable: false})
    user_id: number;

    @ManyToOne(() => Speciality, speciality => speciality.id)
    @JoinColumn({name: 'speciality_id'})
    @Column({nullable: false})
    speciality_id: number;

    @Column({type: 'char', length: 1, nullable: false})
    type_platform: string;
}