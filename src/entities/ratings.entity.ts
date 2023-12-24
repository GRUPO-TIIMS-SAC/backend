import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Specialist } from "./specialists.entity";
import { Request } from "./requests.entity";

@Entity({ name: 'ratings' })
export class Rating {
    
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => User, user => user.id)
    @JoinColumn({name: 'user_id'})
    @Column({nullable: false})
    user_id: number;

    @OneToMany(() => Specialist, specialist => specialist.id)
    @JoinColumn({name: 'specialist_id'})
    @Column({nullable: false})
    specialist_id: number;

    @OneToOne(() => Request, request => request.id)
    @JoinColumn({name: 'request_id'})
    @Column({nullable: false})
    request_id: number;

    @Column({type:'double', nullable: false})
    stars: number;

    @Column({length: 400, nullable: false})
    comments: string;

    @Column({type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;
}