import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { DetailReferal } from "./detail_referal.entity";

@Entity({ name: 'referal_codes' })
export class ReferalCode {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => User, user => user.id)
    @JoinColumn({name: 'user_id'})
    @Column({nullable: false})
    user_id: number;

    @Column({length:10, nullable: false})
    code: string;

    @ManyToOne(() => DetailReferal, detail_referal => detail_referal.id)
    @JoinColumn({name: 'detail_referal_id'})
    @Column({nullable: false})
    detail_referal_id: number;
}