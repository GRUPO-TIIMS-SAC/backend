import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'notifications' })
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 2048, nullable: false})
    image: string; 

    @Column({length: 50, nullable: false})
    title: string;

    @Column({length: 400, nullable: false})
    body: string;
}