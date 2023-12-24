import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'complaints_book' })
export class ComplaintsBook {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => User, user => user.id)
    @JoinColumn({name: 'user_id'})
    @Column({nullable: false})
    user_id: number;

    @Column({length: 50, nullable: false})
    reason: string;

    @Column({nullable: false})
    date: Date;

    @Column({length: 1200, nullable: false})
    description: string;

    @Column({nullable: false, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;
}