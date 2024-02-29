import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Request } from "./requests.entity";
import { request } from "http";

@Entity({ name: 'payments' })
export class Payment {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({name: 'user_id'})
    @Column({nullable: false})
    user_id: number;

    @ManyToOne(() => Request, request => request.id)
    @JoinColumn({name: 'request_id'})
    @Column({nullable: false})
    request_id: number;

    @Column({type: 'double', nullable: false})
    amount: number;

    @Column({length: 250, nullable: false})
    token_payment: string;
}