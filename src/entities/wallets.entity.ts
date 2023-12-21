import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'wallets' })
export class Wallet {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    user_id: number;

    @Column({type: 'double', nullable: false})
    withdrawable_amount: number;

    @Column({type: 'double', nullable: false})
    available_amount: number;
}