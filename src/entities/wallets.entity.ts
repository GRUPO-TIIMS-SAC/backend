import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'wallets' })
export class Wallet {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, user => user.id)
    @JoinColumn({name: 'user_id'})
    @Column({nullable: false})
    user_id: number;

    @Column({type: 'double', nullable: false})
    withdrawable_amount: number;

    @Column({type: 'double', nullable: false})
    available_amount: number;
}