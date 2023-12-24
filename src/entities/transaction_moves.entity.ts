import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Payment } from "./payments.entity";

@Entity({ name: 'transaction_moves' })
export class TransactionMove {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => User, user => user.id)
    @JoinColumn({name: 'user_id'})
    @Column({nullable: false})
    user_id: number;
    
    @Column({type: 'char', length: 1, nullable: false, comment: '0=incomes, 1=expenses'})
    type_move: string;

    @Column({ type: 'char', length: 1, nullable: false, comment: '0=balance, 1=credit'})
    class_balance: string;

    @Column({type: 'double', nullable: false})
    amount: number;

    @OneToOne(() => Payment, payment => payment.id)
    @JoinColumn({name: 'payment_id'})
    @Column({nullable: false})
    payment_id: number;

    @Column({nullable: false, default: () => 'CURRENT_TIMESTAMP()'})
    created_at: Date;
}