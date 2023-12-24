import { Column, Double, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'detail_referal' })
export class DetailReferal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, default: true})
    active: boolean;

    @Column({type: 'double', nullable: false})
    principal_reward: number;

    @Column({type: 'double', nullable: false})
    secondary_reward: number;

    @Column({nullable: false})
    inital_date: Date;

    @Column({nullable: false})
    end_date: Date;
}