import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'payments' })
export class Payment {
    
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => User, user => user.id)
    @JoinColumn({name: 'user_id'})
    @Column({nullable: false})
    user_id: number;

    @Column({type: 'double', nullable: false})
    amount: number;

    @Column({length: 250, nullable: false})
    token_payment: string;
}